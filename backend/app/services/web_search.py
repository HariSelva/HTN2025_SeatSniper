import requests
import os
from typing import List, Dict, Any
import json
from datetime import datetime

class WebSearchService:
    def __init__(self):
        # Use Google Custom Search API or SerpAPI
        self.search_api_key = os.getenv("GOOGLE_SEARCH_API_KEY")
        self.search_engine_id = os.getenv("GOOGLE_SEARCH_ENGINE_ID")
        self.serpapi_key = os.getenv("SERPAPI_KEY")  # Alternative: SerpAPI
        
        # Search URL for Google Custom Search
        self.google_search_url = "https://www.googleapis.com/customsearch/v1"
        
    async def search_web(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search the web for course-related information
        Returns results with clear marking for web sources
        """
        results = []
        
        # Try Google Custom Search first, then SerpAPI as fallback
        try:
            if self.search_api_key and self.search_engine_id:
                results = await self._search_google(query, num_results)
            elif self.serpapi_key:
                results = await self._search_serpapi(query, num_results)
            else:
                # Fallback to a simple web search simulation
                results = await self._search_fallback(query, num_results)
                
        except Exception as e:
            print(f"Web search error: {e}")
            # Return empty results if search fails
            results = []
        
        # Mark all results as web sources
        for result in results:
            result['source_type'] = 'web'
            result['search_timestamp'] = datetime.now().isoformat()
        
        return results
    
    async def _search_google(self, query: str, num_results: int) -> List[Dict[str, Any]]:
        """Search using Google Custom Search API"""
        try:
            # Enhance query for educational content
            enhanced_query = self._enhance_query_for_education(query)
            
            params = {
                'key': self.search_api_key,
                'cx': self.search_engine_id,
                'q': enhanced_query,
                'num': min(num_results, 10),  # Google API limit
                'safe': 'medium',
                'fields': 'items(title,link,snippet,displayLink)'
            }
            
            response = requests.get(self.google_search_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            for item in data.get('items', []):
                results.append({
                    'title': item.get('title', ''),
                    'url': item.get('link', ''),
                    'snippet': item.get('snippet', ''),
                    'domain': item.get('displayLink', ''),
                    'search_query': query
                })
            
            return results
            
        except Exception as e:
            print(f"Google search error: {e}")
            return []
    
    async def _search_serpapi(self, query: str, num_results: int) -> List[Dict[str, Any]]:
        """Search using SerpAPI"""
        try:
            enhanced_query = self._enhance_query_for_education(query)
            
            params = {
                'api_key': self.serpapi_key,
                'engine': 'google',
                'q': enhanced_query,
                'num': min(num_results, 10),
                'safe': 'medium'
            }
            
            response = requests.get('https://serpapi.com/search', params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            for result in data.get('organic_results', [])[:num_results]:
                results.append({
                    'title': result.get('title', ''),
                    'url': result.get('link', ''),
                    'snippet': result.get('snippet', ''),
                    'domain': result.get('displayed_link', ''),
                    'search_query': query
                })
            
            return results
            
        except Exception as e:
            print(f"SerpAPI search error: {e}")
            return []
    
    async def _search_fallback(self, query: str, num_results: int) -> List[Dict[str, Any]]:
        """Fallback search method when APIs are not available"""
        # This is a mock implementation for development
        # In production, you might want to use other search APIs or scrapers
        
        enhanced_query = self._enhance_query_for_education(query)
        
        # Mock results for development
        mock_results = [
            {
                'title': f'Course Information: {enhanced_query}',
                'url': 'https://example-university.edu/courses',
                'snippet': f'Comprehensive information about {enhanced_query} including prerequisites, schedule, and course details.',
                'domain': 'example-university.edu',
                'search_query': query
            },
            {
                'title': f'Academic Planning Guide - {enhanced_query}',
                'url': 'https://academic-planner.edu/guide',
                'snippet': f'Academic planning resources and recommendations for {enhanced_query} course selection.',
                'domain': 'academic-planner.edu',
                'search_query': query
            }
        ]
        
        return mock_results[:num_results]
    
    def _enhance_query_for_education(self, query: str) -> str:
        """
        Enhance search query to focus on educational content
        """
        # Add educational context terms
        educational_terms = [
            'university course',
            'college course',
            'academic',
            'prerequisites',
            'syllabus',
            'curriculum'
        ]
        
        # Extract course-related keywords
        course_keywords = []
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['course', 'class', 'subject']):
            course_keywords.append('course information')
        
        if any(word in query_lower for word in ['recommend', 'suggest', 'choose']):
            course_keywords.append('course recommendations')
        
        if any(word in query_lower for word in ['prerequisite', 'requirement']):
            course_keywords.append('prerequisites')
        
        if any(word in query_lower for word in ['schedule', 'time', 'when']):
            course_keywords.append('course schedule')
        
        # Combine original query with enhanced terms
        enhanced_terms = course_keywords + educational_terms[:2]  # Limit to avoid query bloat
        enhanced_query = f"{query} {' '.join(enhanced_terms)}"
        
        return enhanced_query
    
    async def search_course_specific(self, course_code: str, university: str = "") -> List[Dict[str, Any]]:
        """
        Search for specific course information
        """
        query = f"{course_code} {university} course syllabus prerequisites"
        return await self.search_web(query, num_results=3)
    
    async def search_course_recommendations(self, subject: str, level: str = "") -> List[Dict[str, Any]]:
        """
        Search for course recommendation resources
        """
        query = f"{subject} {level} course recommendations best courses"
        return await self.search_web(query, num_results=5)
    
    async def search_academic_planning(self, major: str, year: str = "") -> List[Dict[str, Any]]:
        """
        Search for academic planning resources
        """
        query = f"{major} {year} academic planning course selection"
        return await self.search_web(query, num_results=4)
