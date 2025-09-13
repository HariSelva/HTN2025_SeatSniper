from fastapi import APIRouter, UploadFile, File
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.clients import MDB
from app.services.syllabus import ingest_syllabus
from app.services.intel import rerank_docs, summarize_to_json, upsert_intel
from app.services.reddit_scraper import scrape_course_reddit_data

class RefreshRequest(BaseModel):
    course: str
    term: str = ""
    official_desc: str = ""
    snippets: List[Dict[str, Any]] = []

router = APIRouter()

@router.get("/api/course-intel")
def get_intel(course: str, term: str = ""):
    try:
        doc = MDB.intel.find_one({"course": course, "term": term})
        if not doc:
            return {"status": "miss", "stale": False, "intel": None}
        
        # Check if stale
        now = datetime.now(timezone.utc)
        ttl = doc.get("ttl")
        stale = False
        if ttl:
            if isinstance(ttl, datetime):
                # Ensure both datetimes are timezone-aware
                if ttl.tzinfo is None:
                    ttl = ttl.replace(tzinfo=timezone.utc)
                stale = ttl <= now
            else:
                # Handle string datetime
                try:
                    ttl_dt = datetime.fromisoformat(ttl.replace('Z', '+00:00'))
                    stale = ttl_dt <= now
                except:
                    stale = False
        
        # Convert ObjectId to string and handle datetime serialization
        if "_id" in doc:
            doc["_id"] = str(doc["_id"])
        # Convert datetime objects to ISO strings
        if "updatedAt" in doc and hasattr(doc["updatedAt"], 'isoformat'):
            doc["updatedAt"] = doc["updatedAt"].isoformat()
        if "ttl" in doc and hasattr(doc["ttl"], 'isoformat'):
            doc["ttl"] = doc["ttl"].isoformat()
            
        return {"status": "ok", "stale": stale, "intel": doc}
    except Exception as e:
        return {"status": "error", "message": str(e), "intel": None}

@router.post("/api/course-intel/refresh")
def refresh(request: RefreshRequest):
    # If no snippets provided, scrape Reddit data automatically
    snippets = request.snippets
    if not snippets:
        print(f"No snippets provided, scraping Reddit data for {request.course}")
        try:
            reddit_snippets = scrape_course_reddit_data(request.course, request.term)
            snippets = reddit_snippets
            print(f"Scraped {len(reddit_snippets)} Reddit snippets for {request.course}")
        except Exception as e:
            print(f"Error scraping Reddit data: {e}")
            snippets = []
    
    # Expect snippets = [{title,snippet,subreddit,score,url,age_days,permalink?}, ...]
    docs = [f'{s.get("title","")}\n{s.get("snippet","")}' for s in snippets]
    ranked_texts = rerank_docs(f"{request.course} {request.term} workload difficulty tips", docs, snippets=snippets)
    
    # Create a mapping from doc text to original snippet
    doc_to_snippet = {}
    for i, doc in enumerate(docs):
        doc_to_snippet[doc] = snippets[i]
    
    # Reconstruct ranked_meta in the same order as ranked_texts
    ranked_meta = []
    for ranked_text in ranked_texts:
        if ranked_text in doc_to_snippet:
            ranked_meta.append(doc_to_snippet[ranked_text])
    intel = summarize_to_json(request.course, request.term, request.official_desc, ranked_meta)
    upsert_intel(intel)
    for s in ranked_meta:
        try:
            MDB.sources.update_one({"course": request.course, "term": request.term, "url": s.get("url")},
                                   {"$set": {**s, "course": request.course, "term": request.term}}, upsert=True)
        except Exception as e:
            print(f"MongoDB sources save failed (continuing anyway): {e}")
    return {"ok": True, "intel": intel, "snippets_used": len(ranked_meta)}

@router.post("/api/course-intel/scrape-reddit")
def scrape_reddit_for_course(course: str, term: str = "F2025"):
    """Scrape Reddit data for a specific course"""
    try:
        reddit_snippets = scrape_course_reddit_data(course, term)
        return {
            "ok": True,
            "course": course,
            "term": term,
            "snippets_found": len(reddit_snippets),
            "snippets": reddit_snippets
        }
    except Exception as e:
        return {
            "ok": False,
            "error": str(e),
            "course": course,
            "term": term
        }

@router.post("/api/syllabus/ingest")
async def syllabus_ingest(course: str, term: str, file: UploadFile = File(...)):
    b = await file.read()
    mime = file.content_type or "application/pdf"
    data = ingest_syllabus(course, term, b, mime=mime)
    return {"ok": True, "syllabus": data}
