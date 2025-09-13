import os
import praw
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

# Reddit API credentials
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT", "SeatSniper/1.0")

# Initialize Reddit client
reddit = None
if REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET:
    try:
        reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT
        )
        print("Reddit client initialized successfully")
    except Exception as e:
        print(f"Failed to initialize Reddit client: {e}")
        reddit = None

# University subreddits to search
UNIVERSITY_SUBREDDITS = [
    "uwaterloo", "mcgill", "uoft", "ubc", "queens", "western", "carleton", "york",
    "ryerson", "concordia", "dalhousie", "sfu", "alberta", "calgary", "ottawa",
    "laurier", "guelph", "mcmaster", "brock", "trent", "windsor", "lakehead",
    "nipissing", "laurentian", "ocad", "ocadu", "seneca", "georgebrown", "humber"
]

def calculate_age_days(created_utc: float) -> int:
    """Calculate age of a Reddit post in days"""
    post_date = datetime.fromtimestamp(created_utc)
    now = datetime.now()
    return (now - post_date).days

def extract_snippet(text: str, max_length: int = 200) -> str:
    """Extract a snippet from Reddit post/comment text"""
    if not text:
        return ""
    
    # Clean up the text
    text = text.replace('\n', ' ').replace('\r', ' ')
    text = ' '.join(text.split())  # Remove extra whitespace
    
    if len(text) <= max_length:
        return text
    
    # Find a good break point
    snippet = text[:max_length]
    last_space = snippet.rfind(' ')
    if last_space > max_length * 0.8:  # If we can break at a reasonable point
        snippet = snippet[:last_space]
    
    return snippet + "..."

def search_reddit_for_course(course_code: str, limit: int = 20) -> List[Dict]:
    """
    Search Reddit for discussions about a specific course - FAST VERSION
    
    Args:
        course_code: Course code (e.g., "CS101", "MATH235")
        limit: Maximum number of posts to return
    
    Returns:
        List of dictionaries containing Reddit post data
    """
    if not reddit:
        print("Reddit client not available, returning empty data")
        return []
    
    print(f"Fast Reddit search for {course_code}")
    snippets = []
    
    try:
        # Only search the most relevant subreddit (uwaterloo) for speed
        subreddit_name = "uwaterloo"
        subreddit = reddit.subreddit(subreddit_name)
        
        # Single search term for speed
        search_term = f"{course_code}"
        
        # Search posts only (no comments for speed)
        for submission in subreddit.search(search_term, limit=5, sort='relevance'):
            if submission.score > 3:  # Lower threshold for more results
                snippet = {
                    "title": submission.title,
                    "snippet": extract_snippet(submission.selftext or ""),
                    "subreddit": subreddit_name,
                    "score": submission.score,
                    "url": f"https://reddit.com{submission.permalink}",
                    "age_days": calculate_age_days(submission.created_utc),
                    "permalink": submission.permalink
                }
                snippets.append(snippet)
        
        # Only return real data, no mock data fallback
        print(f"Found {len(snippets)} real Reddit snippets for {course_code}")
        
        # Sort by score and limit
        snippets.sort(key=lambda x: x["score"], reverse=True)
        return snippets[:limit]
        
    except Exception as e:
        print(f"Error in Reddit search: {e}")
        return []

def get_mock_reddit_data(course_code: str) -> List[Dict]:
    """Return mock Reddit data when Reddit API is not available"""
    return [
        {
            "title": f"{course_code} Course Review - Workload and Difficulty",
            "snippet": f"Just finished {course_code} and wanted to share my experience. The workload is manageable with weekly assignments and a midterm/final structure. Professor is helpful during office hours.",
            "subreddit": "uwaterloo",
            "score": 45,
            "url": f"https://reddit.com/r/uwaterloo/comments/mock_{course_code.lower()}_review",
            "age_days": 15,
            "permalink": f"/r/uwaterloo/comments/mock_{course_code.lower()}_review"
        },
        {
            "title": f"{course_code} Tips for Success",
            "snippet": f"Here are some tips for {course_code}: Start assignments early, attend all lectures, and don't be afraid to ask questions. The material builds on itself.",
            "subreddit": "uwaterloo",
            "score": 32,
            "url": f"https://reddit.com/r/uwaterloo/comments/mock_{course_code.lower()}_tips",
            "age_days": 8,
            "permalink": f"/r/uwaterloo/comments/mock_{course_code.lower()}_tips"
        },
        {
            "title": f"{course_code} Professor Recommendation",
            "snippet": f"Professor Smith for {course_code} is excellent. Clear lectures, fair grading, and very approachable. Would definitely recommend taking this course with them.",
            "subreddit": "uwaterloo",
            "score": 28,
            "url": f"https://reddit.com/r/uwaterloo/comments/mock_{course_code.lower()}_prof",
            "age_days": 22,
            "permalink": f"/r/uwaterloo/comments/mock_{course_code.lower()}_prof"
        },
        {
            "title": f"{course_code} Assignment Help",
            "snippet": f"Struggling with the {course_code} assignments? Join the study group on Discord. We meet weekly and help each other with problem sets.",
            "subreddit": "uwaterloo",
            "score": 19,
            "url": f"https://reddit.com/r/uwaterloo/comments/mock_{course_code.lower()}_help",
            "age_days": 5,
            "permalink": f"/r/uwaterloo/comments/mock_{course_code.lower()}_help"
        },
        {
            "title": f"{course_code} Final Exam Experience",
            "snippet": f"The {course_code} final was fair but challenging. Make sure to review all the practice problems and understand the key concepts. Time management is crucial.",
            "subreddit": "uwaterloo",
            "score": 15,
            "url": f"https://reddit.com/r/uwaterloo/comments/mock_{course_code.lower()}_final",
            "age_days": 12,
            "permalink": f"/r/uwaterloo/comments/mock_{course_code.lower()}_final"
        }
    ]

def scrape_course_reddit_data(course_code: str, term: str = "") -> List[Dict]:
    """
    Main function to scrape Reddit data for a course
    
    Args:
        course_code: Course code (e.g., "CS101")
        term: Term (e.g., "F2025") - not used in Reddit search but kept for consistency
    
    Returns:
        List of Reddit snippets formatted for Course Intel
    """
    print(f"Scraping Reddit data for {course_code} {term}")
    
    # Try real Reddit API first
    if reddit:
        try:
            snippets = search_reddit_for_course(course_code)
            if snippets:
                print(f"Found {len(snippets)} Reddit snippets for {course_code} (real data)")
                return snippets
            else:
                print(f"No real Reddit data found for {course_code}")
                return []
        except Exception as e:
            print(f"Error with real Reddit API for {course_code}: {e}")
            return []
    
    # No fallback to mock data - return empty if no Reddit client
    print(f"No Reddit client available for {course_code}")
    return []

# Test function
if __name__ == "__main__":
    # Test the scraper
    test_snippets = scrape_course_reddit_data("CS101", "F2025")
    print(f"Test results: {len(test_snippets)} snippets found")
    for snippet in test_snippets[:2]:  # Show first 2
        print(f"- {snippet['title']} (r/{snippet['subreddit']}, {snippet['score']} points)")
