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

def extract_department_and_number(course_code: str) -> tuple:
    """Extract department and course number from course code"""
    import re
    match = re.match(r'^([A-Z]+)(\d+[A-Z]*)$', course_code.upper())
    if match:
        return match.group(1), match.group(2)
    return course_code, ""

def get_search_terms(course_code: str) -> List[str]:
    """Generate multiple search terms for better coverage"""
    dept, num = extract_department_and_number(course_code)
    
    # Create various search term combinations
    search_terms = [
        course_code,  # Original course code
        f"{dept} {num}",  # Department and number with space
        f"{dept}{num}",  # Department and number without space
        dept,  # Just department
        f"{dept} course",  # Department + course
        f"{dept} class",  # Department + class
    ]
    
    # Add department-specific variations for common departments
    dept_variations = {
        "CS": ["computer science", "programming", "software"],
        "MATH": ["mathematics", "math", "calculus", "algebra"],
        "ENG": ["engineering", "engineer"],
        "PHYS": ["physics", "physical"],
        "CHEM": ["chemistry", "chemical"],
        "BIOL": ["biology", "biological"],
        "ECON": ["economics", "economic"],
        "PSYC": ["psychology", "psych"],
        "STAT": ["statistics", "stats"],
    }
    
    if dept in dept_variations:
        search_terms.extend([f"{var} {num}" for var in dept_variations[dept][:2]])
        search_terms.extend(dept_variations[dept][:2])
    
    return search_terms

def search_reddit_for_course(course_code: str, limit: int = 20) -> List[Dict]:
    """
    Search Reddit for discussions about a specific course - COMPREHENSIVE VERSION
    
    Args:
        course_code: Course code (e.g., "CS101", "MATH235")
        limit: Maximum number of posts to return
    
    Returns:
        List of dictionaries containing Reddit post data
    """
    if not reddit:
        print("Reddit client not available, returning empty data")
        return []
    
    print(f"Comprehensive Reddit search for {course_code}")
    snippets = []
    seen_urls = set()  # Avoid duplicates
    
    try:
        # Search across multiple university subreddits
        search_subreddits = ["uwaterloo", "mcgill", "uoft", "ubc", "queens", "western", "carleton"]
        search_terms = get_search_terms(course_code)
        
        for subreddit_name in search_subreddits:
            try:
                subreddit = reddit.subreddit(subreddit_name)
                
                # Try multiple search terms for better coverage
                for search_term in search_terms[:4]:  # Limit to first 4 terms to avoid rate limits
                    print(f"Searching r/{subreddit_name} for '{search_term}'")
                    
                    # Search posts
                    for submission in subreddit.search(search_term, limit=3, sort='relevance'):
                        if submission.permalink in seen_urls:
                            continue
                        seen_urls.add(submission.permalink)
                        
                        # Much lower threshold to get more results
                        if submission.score > 1 and calculate_age_days(submission.created_utc) < 365:
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
                    
                    # Also search comments in recent posts
                    for submission in subreddit.search(search_term, limit=2, sort='relevance'):
                        if submission.num_comments > 0:
                            submission.comments.replace_more(limit=0)  # Don't load more comments
                            for comment in submission.comments.list()[:5]:  # Top 5 comments
                                if hasattr(comment, 'body') and comment.body and len(comment.body) > 50:
                                    if comment.permalink in seen_urls:
                                        continue
                                    seen_urls.add(comment.permalink)
                                    
                                    if comment.score > 1 and calculate_age_days(comment.created_utc) < 365:
                                        snippet = {
                                            "title": f"Comment on: {submission.title}",
                                            "snippet": extract_snippet(comment.body),
                                            "subreddit": subreddit_name,
                                            "score": comment.score,
                                            "url": f"https://reddit.com{comment.permalink}",
                                            "age_days": calculate_age_days(comment.created_utc),
                                            "permalink": comment.permalink
                                        }
                                        snippets.append(snippet)
                        
            except Exception as e:
                print(f"Error searching r/{subreddit_name}: {e}")
                continue
        
        print(f"Found {len(snippets)} real Reddit snippets for {course_code}")
        
        # Sort by score and recency, then limit
        snippets.sort(key=lambda x: (x["score"], -x["age_days"]), reverse=True)
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

def search_broad_course_discussions(course_code: str, limit: int = 10) -> List[Dict]:
    """
    Search for broader course discussions that might not mention the specific course code
    but are related to the subject area
    """
    if not reddit:
        return []
    
    dept, num = extract_department_and_number(course_code)
    snippets = []
    seen_urls = set()
    
    # Broad search terms for general course discussions
    broad_terms = [
        f"{dept} first year",
        f"{dept} beginner",
        f"{dept} intro",
        f"{dept} 100 level",
        f"{dept} courses",
        "course selection",
        "elective recommendations"
    ]
    
    try:
        for subreddit_name in ["uwaterloo", "mcgill", "uoft", "ubc"]:
            try:
                subreddit = reddit.subreddit(subreddit_name)
                
                for term in broad_terms:
                    for submission in subreddit.search(term, limit=2, sort='relevance'):
                        if submission.permalink in seen_urls:
                            continue
                        seen_urls.add(submission.permalink)
                        
                        if submission.score > 2 and calculate_age_days(submission.created_utc) < 180:
                            snippet = {
                                "title": f"[Related] {submission.title}",
                                "snippet": extract_snippet(submission.selftext or ""),
                                "subreddit": subreddit_name,
                                "score": submission.score,
                                "url": f"https://reddit.com{submission.permalink}",
                                "age_days": calculate_age_days(submission.created_utc),
                                "permalink": submission.permalink
                            }
                            snippets.append(snippet)
                            
            except Exception as e:
                print(f"Error in broad search for r/{subreddit_name}: {e}")
                continue
                
    except Exception as e:
        print(f"Error in broad course search: {e}")
    
    return snippets[:limit]

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
            # Get specific course results
            snippets = search_reddit_for_course(course_code)
            
            # If we don't have many results, try broader searches
            if len(snippets) < 5:
                print(f"Few specific results for {course_code}, trying broader search...")
                broad_snippets = search_broad_course_discussions(course_code)
                snippets.extend(broad_snippets)
            
            # Remove duplicates based on URL
            seen_urls = set()
            unique_snippets = []
            for snippet in snippets:
                if snippet["url"] not in seen_urls:
                    seen_urls.add(snippet["url"])
                    unique_snippets.append(snippet)
            
            if unique_snippets:
                print(f"Found {len(unique_snippets)} Reddit snippets for {course_code} (real data)")
                return unique_snippets
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
