from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from app.services.reddit_scraper import scrape_course_reddit_data
from app.services.intel import rerank_docs, summarize_to_json, upsert_intel
from app.services.clients import MDB

router = APIRouter()

class ScrapeRequest(BaseModel):
    course_id: Optional[str] = None
    term: Optional[str] = "F2025"

def run_scraper(course_id: Optional[str] = None, term: str = "F2025"):
    """Background task to scrape course data and generate intel"""
    print(f"Running scraper for course: {course_id or 'all courses'}")
    
    if course_id:
        try:
            # Scrape Reddit data for the course
            print(f"Scraping Reddit data for {course_id}")
            reddit_snippets = scrape_course_reddit_data(course_id, term)
            
            if reddit_snippets:
                # Generate course intel using the scraped data
                print(f"Generating course intel for {course_id} with {len(reddit_snippets)} snippets")
                
                # Rerank the snippets
                docs = [f'{s.get("title","")}\n{s.get("snippet","")}' for s in reddit_snippets]
                ranked_texts = rerank_docs(f"{course_id} {term} workload difficulty tips", docs)
                
                # Match ranked texts back to original snippets
                ranked_meta = []
                for s in reddit_snippets:
                    if any(s.get("title","") and s["title"] in t for t in ranked_texts):
                        ranked_meta.append(s)
                
                # Generate intel
                intel = summarize_to_json(course_id, term, f"Course information for {course_id}", ranked_meta)
                upsert_intel(intel)
                
                # Store sources
                for s in ranked_meta:
                    MDB.sources.update_one(
                        {"course": course_id, "term": term, "url": s.get("url")},
                        {"$set": {**s, "course": course_id, "term": term}}, 
                        upsert=True
                    )
                
                print(f"Successfully generated and stored intel for {course_id}")
            else:
                print(f"No Reddit data found for {course_id}")
                
        except Exception as e:
            print(f"Error scraping data for {course_id}: {e}")
    else:
        print("No specific course provided, skipping scraping")

@router.post("/scrape")
async def trigger_scrape(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """Manually trigger a scrape of course data"""
    background_tasks.add_task(run_scraper, request.course_id, request.term)
    return {
        "message": "Scrape task started", 
        "course_id": request.course_id,
        "term": request.term
    }

@router.post("/scrape-reddit")
async def trigger_reddit_scrape(course_id: str, term: str = "F2025", background_tasks: BackgroundTasks = None):
    """Directly trigger Reddit scraping for a specific course"""
    try:
        # Scrape Reddit data
        reddit_snippets = scrape_course_reddit_data(course_id, term)
        
        return {
            "message": "Reddit scraping completed",
            "course_id": course_id,
            "term": term,
            "snippets_found": len(reddit_snippets),
            "snippets": reddit_snippets[:5]  # Return first 5 for preview
        }
    except Exception as e:
        return {
            "message": "Reddit scraping failed",
            "error": str(e),
            "course_id": course_id
        }
