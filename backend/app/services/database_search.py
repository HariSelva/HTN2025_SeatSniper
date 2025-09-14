import re
from typing import List, Dict, Any
from app.services.clients import MDB

class DatabaseSearchService:
    def __init__(self):
        # MongoDB collections
        self.intel_collection = MDB.intel
        self.sources_collection = MDB.sources
        self.syllabi_collection = MDB.syllabi
        self.sections_collection = MDB.sections
    
    def search_course_data(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for course-related information in the database
        Returns relevant course intel, syllabi, and section data
        """
        results = []
        
        try:
            # Extract course codes from query (e.g., CS245, MATH101)
            course_codes = self._extract_course_codes(query)
            
            # Search course intel
            intel_results = self._search_course_intel(query, course_codes)
            results.extend(intel_results)
            
            # Search syllabi
            syllabi_results = self._search_syllabi(query, course_codes)
            results.extend(syllabi_results)
            
            # Search course sources/Reddit data
            sources_results = self._search_sources(query, course_codes)
            results.extend(sources_results)
            
            # Search sections data
            sections_results = self._search_sections(query, course_codes)
            results.extend(sections_results)
            
            # Remove duplicates and rank by relevance
            unique_results = self._deduplicate_and_rank(results, query)
            
            return unique_results[:10]  # Return top 10 results
            
        except Exception as e:
            print(f"Database search error: {e}")
            return []
    
    def _extract_course_codes(self, query: str) -> List[str]:
        """Extract potential course codes from the query"""
        # Pattern to match course codes like CS245, MATH101, etc.
        pattern = r'\b([A-Z]{2,4})\s*(\d{3,4})\b'
        matches = re.findall(pattern, query.upper())
        return [f"{subject}{number}" for subject, number in matches]
    
    def _search_course_intel(self, query: str, course_codes: List[str]) -> List[Dict]:
        """Search course intelligence data"""
        results = []
        
        try:
            # Search by course codes if found
            if course_codes:
                for course_code in course_codes:
                    intel_docs = self.intel_collection.find({
                        "course": {"$regex": course_code, "$options": "i"}
                    }).limit(3)
                    
                    for doc in intel_docs:
                        results.append({
                            "type": "course_intel",
                            "title": f"Course Intelligence - {doc.get('course', 'Unknown')}",
                            "content": self._format_intel_content(doc),
                            "course": doc.get('course'),
                            "term": doc.get('term'),
                            "updated_at": doc.get('updatedAt'),
                            "relevance_score": self._calculate_relevance(query, doc)
                        })
            
            # Full-text search if no specific course codes
            if not course_codes:
                # Search in course names and summaries
                search_terms = query.lower().split()
                
                for term in search_terms:
                    intel_docs = self.intel_collection.find({
                        "$or": [
                            {"course": {"$regex": term, "$options": "i"}},
                            {"summary": {"$regex": term, "$options": "i"}},
                            {"tips": {"$regex": term, "$options": "i"}},
                            {"pitfalls": {"$regex": term, "$options": "i"}}
                        ]
                    }).limit(5)
                    
                    for doc in intel_docs:
                        results.append({
                            "type": "course_intel",
                            "title": f"Course Intelligence - {doc.get('course', 'Unknown')}",
                            "content": self._format_intel_content(doc),
                            "course": doc.get('course'),
                            "term": doc.get('term'),
                            "relevance_score": self._calculate_relevance(query, doc)
                        })
        
        except Exception as e:
            print(f"Error searching course intel: {e}")
        
        return results
    
    def _search_syllabi(self, query: str, course_codes: List[str]) -> List[Dict]:
        """Search syllabus data"""
        results = []
        
        try:
            if course_codes:
                for course_code in course_codes:
                    syllabi_docs = self.syllabi_collection.find({
                        "course": {"$regex": course_code, "$options": "i"}
                    }).limit(2)
                    
                    for doc in syllabi_docs:
                        results.append({
                            "type": "syllabus",
                            "title": f"Syllabus - {doc.get('course', 'Unknown')}",
                            "content": self._format_syllabus_content(doc),
                            "course": doc.get('course'),
                            "term": doc.get('term'),
                            "relevance_score": self._calculate_relevance(query, doc)
                        })
        
        except Exception as e:
            print(f"Error searching syllabi: {e}")
        
        return results
    
    def _search_sources(self, query: str, course_codes: List[str]) -> List[Dict]:
        """Search Reddit sources and course discussions"""
        results = []
        
        try:
            if course_codes:
                for course_code in course_codes:
                    sources_docs = self.sources_collection.find({
                        "course": {"$regex": course_code, "$options": "i"}
                    }).limit(5)
                    
                    for doc in sources_docs:
                        results.append({
                            "type": "reddit_source",
                            "title": doc.get('title', 'Reddit Discussion'),
                            "content": doc.get('snippet', ''),
                            "url": doc.get('permalink', ''),
                            "score": doc.get('score', 0),
                            "course": doc.get('course'),
                            "relevance_score": self._calculate_relevance(query, doc)
                        })
        
        except Exception as e:
            print(f"Error searching sources: {e}")
        
        return results
    
    def _search_sections(self, query: str, course_codes: List[str]) -> List[Dict]:
        """Search course sections data"""
        results = []
        
        try:
            if course_codes:
                for course_code in course_codes:
                    # Assuming sections are stored with course_id field
                    sections_docs = self.sections_collection.find({
                        "course_id": {"$regex": course_code, "$options": "i"}
                    }).limit(3)
                    
                    for doc in sections_docs:
                        results.append({
                            "type": "section_info",
                            "title": f"Section Info - {doc.get('subject', '')} {doc.get('catalog_number', '')}",
                            "content": self._format_section_content(doc),
                            "course": f"{doc.get('subject', '')}{doc.get('catalog_number', '')}",
                            "relevance_score": self._calculate_relevance(query, doc)
                        })
        
        except Exception as e:
            print(f"Error searching sections: {e}")
        
        return results
    
    def _format_intel_content(self, doc: Dict) -> str:
        """Format course intelligence content for display"""
        content_parts = []
        
        if doc.get('summary'):
            content_parts.append(f"Summary: {doc['summary']}")
        
        if doc.get('workload'):
            workload = doc['workload']
            if isinstance(workload, dict):
                hours = workload.get('weekly_hours', 'Unknown')
                content_parts.append(f"Weekly workload: {hours} hours")
        
        if doc.get('difficulty'):
            content_parts.append(f"Difficulty: {doc['difficulty']}")
        
        if doc.get('tips'):
            tips = doc['tips']
            if isinstance(tips, list) and tips:
                content_parts.append(f"Tips: {', '.join(tips[:3])}")
        
        return ' | '.join(content_parts)
    
    def _format_syllabus_content(self, doc: Dict) -> str:
        """Format syllabus content for display"""
        content_parts = []
        
        if doc.get('assessments'):
            assessments = doc['assessments']
            if isinstance(assessments, list):
                content_parts.append(f"Assessments: {len(assessments)} items")
        
        if doc.get('schedule'):
            schedule = doc['schedule']
            if isinstance(schedule, list):
                content_parts.append(f"Schedule: {len(schedule)} sessions")
        
        if doc.get('policies'):
            policies = doc['policies']
            if isinstance(policies, list) and policies:
                content_parts.append(f"Policies: {', '.join(policies[:2])}")
        
        return ' | '.join(content_parts)
    
    def _format_section_content(self, doc: Dict) -> str:
        """Format section content for display"""
        content_parts = []
        
        if doc.get('title'):
            content_parts.append(f"Title: {doc['title']}")
        
        if doc.get('enrollment_capacity'):
            capacity = doc['enrollment_capacity']
            total = doc.get('enrollment_total', 0)
            available = doc.get('available_seats', 0)
            content_parts.append(f"Enrollment: {total}/{capacity} (Available: {available})")
        
        if doc.get('component_section'):
            content_parts.append(f"Section: {doc['component_section']}")
        
        return ' | '.join(content_parts)
    
    def _calculate_relevance(self, query: str, doc: Dict) -> float:
        """Calculate relevance score for search results"""
        query_lower = query.lower()
        doc_text = str(doc).lower()
        
        # Simple relevance scoring based on keyword matches
        query_words = set(query_lower.split())
        doc_words = set(doc_text.split())
        
        # Calculate Jaccard similarity
        intersection = len(query_words.intersection(doc_words))
        union = len(query_words.union(doc_words))
        
        return intersection / union if union > 0 else 0.0
    
    def _deduplicate_and_rank(self, results: List[Dict], query: str) -> List[Dict]:
        """Remove duplicates and rank results by relevance"""
        # Remove duplicates based on title and content
        seen = set()
        unique_results = []
        
        for result in results:
            key = (result.get('title', ''), result.get('content', ''))
            if key not in seen:
                seen.add(key)
                unique_results.append(result)
        
        # Sort by relevance score
        unique_results.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
        
        return unique_results