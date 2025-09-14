import openai
import os
from typing import List, Dict, Any, Optional
from app.services.clients import MDB
from app.services.database_search import DatabaseSearchService
import json

class CourseRecommendationService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4"
        self.db_search = DatabaseSearchService()
        
        # MongoDB collections
        self.courses_collection = MDB.courses  # Assuming courses are stored
        self.sections_collection = MDB.sections
    
    def generate_recommendations(self, query: str, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Generate course recommendations based on user query
        """
        try:
            # Extract user goals and constraints from query
            goals_and_constraints = self._extract_goals_and_constraints(query)
            
            # Search for relevant courses in database
            available_courses = self._get_available_courses()
            
            # Use AI to generate personalized recommendations
            recommendations = self._generate_ai_recommendations(
                query, 
                goals_and_constraints, 
                available_courses
            )
            
            return recommendations
            
        except Exception as e:
            print(f"Error generating recommendations: {e}")
            return []
    
    async def generate_detailed_recommendations(
        self, 
        goals: List[str], 
        time_constraints: Dict[str, Any],
        academic_level: str,
        interests: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Generate detailed course recommendations based on structured input
        """
        try:
            # Get available courses
            available_courses = self._get_available_courses()
            
            # Create structured prompt for AI
            prompt = self._create_recommendation_prompt(
                goals, time_constraints, academic_level, interests, available_courses
            )
            
            # Get AI recommendations
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_recommendation_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            # Parse AI response
            recommendations = self._parse_ai_recommendations(response.choices[0].message.content)
            
            # Enhance with database information
            enhanced_recommendations = self._enhance_recommendations_with_db(recommendations)
            
            return enhanced_recommendations
            
        except Exception as e:
            print(f"Error generating detailed recommendations: {e}")
            return []
    
    def _extract_goals_and_constraints(self, query: str) -> Dict[str, Any]:
        """Extract goals and constraints from user query using AI"""
        try:
            prompt = f"""
            Analyze this user query about course selection and extract:
            1. Academic goals (what they want to achieve)
            2. Time constraints (when they want to take courses, schedule preferences)
            3. Academic level (undergraduate, graduate, etc.)
            4. Subject interests
            5. Specific requirements (prerequisites, difficulty level, etc.)
            
            Query: "{query}"
            
            Return a JSON object with these fields:
            {{
                "goals": ["goal1", "goal2"],
                "time_constraints": {{"semester": "fall", "schedule_preference": "morning"}},
                "academic_level": "undergraduate",
                "interests": ["subject1", "subject2"],
                "requirements": {{"difficulty": "beginner", "prerequisites": []}}
            }}
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert academic advisor. Extract structured information from student queries."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            # Parse JSON response
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"Error extracting goals and constraints: {e}")
            return {
                "goals": [],
                "time_constraints": {},
                "academic_level": "undergraduate",
                "interests": [],
                "requirements": {}
            }
    
    def _get_available_courses(self) -> List[Dict[str, Any]]:
        """Get available courses from database"""
        try:
            # This would typically query your course database
            # For now, return a sample of courses
            courses = [
                {
                    "code": "CS101",
                    "name": "Introduction to Computer Science",
                    "description": "Fundamental concepts in computer science",
                    "prerequisites": [],
                    "difficulty": "beginner",
                    "credits": 3,
                    "subject": "Computer Science"
                },
                {
                    "code": "CS201", 
                    "name": "Data Structures and Algorithms",
                    "description": "Core data structures and algorithmic thinking",
                    "prerequisites": ["CS101"],
                    "difficulty": "intermediate",
                    "credits": 3,
                    "subject": "Computer Science"
                },
                {
                    "code": "MATH101",
                    "name": "Calculus I",
                    "description": "Differential and integral calculus",
                    "prerequisites": [],
                    "difficulty": "intermediate",
                    "credits": 4,
                    "subject": "Mathematics"
                },
                {
                    "code": "ENG101",
                    "name": "Academic Writing",
                    "description": "Fundamentals of academic writing and research",
                    "prerequisites": [],
                    "difficulty": "beginner",
                    "credits": 3,
                    "subject": "English"
                }
            ]
            
            return courses
            
        except Exception as e:
            print(f"Error getting available courses: {e}")
            return []
    
    def _generate_ai_recommendations(
        self, 
        query: str, 
        goals_and_constraints: Dict[str, Any],
        available_courses: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate AI-powered course recommendations"""
        try:
            prompt = f"""
            Based on the user's query and goals, recommend 3-5 courses from the available options.
            
            User Query: "{query}"
            Goals and Constraints: {json.dumps(goals_and_constraints, indent=2)}
            Available Courses: {json.dumps(available_courses, indent=2)}
            
            For each recommendation, provide:
            1. Course code and name
            2. Why it matches their goals
            3. Difficulty level and prerequisites
            4. Estimated workload
            5. Best time to take it
            
            Return as a JSON array of recommendations.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_recommendation_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Parse recommendations
            recommendations = json.loads(response.choices[0].message.content)
            return recommendations
            
        except Exception as e:
            print(f"Error generating AI recommendations: {e}")
            return []
    
    def _create_recommendation_prompt(
        self, 
        goals: List[str], 
        time_constraints: Dict[str, Any],
        academic_level: str,
        interests: List[str],
        available_courses: List[Dict[str, Any]]
    ) -> str:
        """Create structured prompt for detailed recommendations"""
        return f"""
        Generate personalized course recommendations based on:
        
        Academic Goals: {', '.join(goals)}
        Time Constraints: {json.dumps(time_constraints, indent=2)}
        Academic Level: {academic_level}
        Interests: {', '.join(interests)}
        
        Available Courses: {json.dumps(available_courses, indent=2)}
        
        Provide 3-5 specific course recommendations with:
        1. Course match score (1-10)
        2. Rationale for recommendation
        3. Prerequisites and preparation needed
        4. Estimated time commitment
        5. Best semester to take
        6. Potential challenges
        7. Career/academic benefits
        
        Format as JSON array.
        """
    
    def _get_recommendation_system_prompt(self) -> str:
        """Get system prompt for course recommendation AI"""
        return """You are an expert academic advisor with deep knowledge of university course offerings. 

Your role is to:
1. Analyze student goals, constraints, and interests
2. Match them with appropriate courses
3. Consider prerequisites, workload, and timing
4. Provide practical, actionable advice
5. Consider academic progression and career goals

Always provide specific course codes, realistic expectations, and clear reasoning for your recommendations. Consider the student's academic level and background when making suggestions."""
    
    def _parse_ai_recommendations(self, ai_response: str) -> List[Dict[str, Any]]:
        """Parse AI response into structured recommendations"""
        try:
            # Try to parse as JSON first
            recommendations = json.loads(ai_response)
            return recommendations if isinstance(recommendations, list) else [recommendations]
        except json.JSONDecodeError:
            # If not valid JSON, create a basic recommendation structure
            return [{
                "course_code": "AI_RECOMMENDATION",
                "title": "AI Generated Recommendation",
                "description": ai_response,
                "match_score": 7,
                "rationale": "AI-generated recommendation based on your query"
            }]
    
    def _enhance_recommendations_with_db(self, recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Enhance recommendations with database information"""
        enhanced = []
        
        for rec in recommendations:
            course_code = rec.get('course_code', '')
            
            # Search for additional information about this course
            db_info = self.db_search.search_course_data(course_code)
            
            # Add database information to recommendation
            enhanced_rec = rec.copy()
            enhanced_rec['database_info'] = db_info[:3]  # Top 3 DB results
            enhanced_rec['has_detailed_info'] = len(db_info) > 0
            
            enhanced.append(enhanced_rec)
        
        return enhanced
