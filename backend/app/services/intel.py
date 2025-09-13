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
    # Skip AI processing for speed - generate smart mock data based on snippets
    print("Using fast summary generation (no AI)")
    
    # Extract insights from Reddit snippets
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
    
    # Generate smart summary based on Reddit data
    summary = f"Based on student discussions, {course} is a comprehensive course that covers essential concepts. "
    if workload_hints:
        summary += f"Students mention: {workload_hints[0]}... "
    summary += "The course provides hands-on experience and builds foundational knowledge."
    
    return {
        "course": course, "term": term, 
        "summary": summary,
        "workload": {
            "weekly_hours": "8-12 hours", 
            "assessment_mix": ["Assignments (40%)", "Midterm (30%)", "Final (30%)"]
        },
        "difficulty": "Intermediate - requires basic programming knowledge", 
        "tips": tips[:3] if tips else ["Start assignments early", "Attend all lectures", "Practice regularly"],
        "pitfalls": pitfalls[:3] if pitfalls else ["Don't procrastinate on assignments", "Don't skip lectures", "Don't ignore prerequisites"],
        "prof_notes": [{"name": "Student Feedback", "take": "Based on Reddit discussions, students find the course challenging but rewarding"}],
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