from .clients import CO, MDB
from datetime import datetime, timedelta, timezone
import json

SUMMARIZE_SYS = """You are creating a course brief for students.
Return STRICT JSON with keys:
course, summary, workload:{weekly_hours,assessment_mix[]}, difficulty,
tips[], pitfalls[], prof_notes[{name,take}], sources[{title,subreddit,permalink,score,age_days}].
Nothing outside JSON.
"""

def rerank_docs(query: str, docs: list[str], top_k: int = 12, snippets: list[dict] = None):
    if not docs:
        return []
    # Skip Cohere rerank for speed - prioritize real Reddit data over mock data
    print("Using fast rerank (no AI)")
    
    if snippets:
        # Separate real and mock data based on snippet URLs
        real_docs = []
        mock_docs = []
        
        for i, doc in enumerate(docs):
            if i < len(snippets) and "mock_" in snippets[i].get("url", "").lower():
                mock_docs.append(doc)
            else:
                real_docs.append(doc)
        
        # Prioritize real data first, then mock data
        sorted_docs = real_docs + mock_docs
        return sorted_docs[:top_k]
    else:
        # Fallback to length-based sorting if no snippets provided
        sorted_docs = sorted(docs, key=len, reverse=True)
        return sorted_docs[:top_k]

def summarize_to_json(course: str, term: str, official_desc: str, ranked_snippets: list[dict]):
    # Only use real Reddit data - no mock data generation
    print("Using real data only (no mock data)")
    
    if not ranked_snippets:
        # Return minimal data structure when no real data is available
        return {
            "course": course, 
            "term": term, 
            "summary": f"No recent student discussions found for {course}. Course information may be limited.",
            "workload": {"weekly_hours": "Unknown", "assessment_mix": []},
            "difficulty": "Unknown",
            "tips": [],
            "pitfalls": [],
            "prof_notes": [{"name": "Note", "take": "No recent student feedback available"}],
            "sources": []
        }
    
    # Extract insights from real Reddit snippets only
    tips = []
    pitfalls = []
    workload_hints = []
    
    for snippet in ranked_snippets[:3]:  # Use top 3 snippets
        text = snippet.get("snippet", "").lower()
        title = snippet.get("title", "").lower()
        
        # Extract tips
        if any(word in text for word in ["tip", "advice", "recommend", "suggest"]):
            tips.append(f"From Reddit: {snippet.get('snippet', '')[:100]}...")
        
        # Extract pitfalls
        if any(word in text for word in ["avoid", "don't", "difficult", "hard", "challenging"]):
            pitfalls.append(f"From Reddit: {snippet.get('snippet', '')[:100]}...")
        
        # Extract workload info
        if any(word in text for word in ["workload", "hours", "time", "assignment"]):
            workload_hints.append(snippet.get('snippet', '')[:80])
    
    # Generate summary based only on real Reddit data
    summary = f"Based on student discussions, {course} is discussed in the community. "
    if workload_hints:
        summary += f"Students mention: {workload_hints[0]}... "
    summary += "The course appears to be part of the curriculum based on student discussions."
    
    return {
        "course": course, "term": term, 
        "summary": summary,
        "workload": {
            "weekly_hours": "Unknown - based on limited data", 
            "assessment_mix": []
        },
        "difficulty": "Unknown - based on limited data", 
        "tips": tips[:3] if tips else [],
        "pitfalls": pitfalls[:3] if pitfalls else [],
        "prof_notes": [{"name": "Student Feedback", "take": "Based on Reddit discussions, limited information available"}],
        "sources": ranked_snippets[:5]  # Include actual Reddit sources
    }

def upsert_intel(doc: dict):
    now = datetime.now(timezone.utc)
    doc["updatedAt"] = now
    doc["ttl"] = now + timedelta(days=7)
    try:
        MDB.intel.update_one({"course": doc.get("course"), "term": doc.get("term", "")},
                             {"$set": doc}, upsert=True)
        print("Successfully saved intel to MongoDB")
    except Exception as e:
        print(f"MongoDB save failed (continuing anyway): {e}")
        # Continue without saving to MongoDB for now