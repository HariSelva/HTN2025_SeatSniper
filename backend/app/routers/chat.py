from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import openai
import os
from datetime import datetime, timezone
import json
from app.services.chat_service import ChatService
from app.services.database_search import DatabaseSearchService
from app.services.web_search import WebSearchService
from app.services.course_recommendation import CourseRecommendationService
from core.config import ApiResponse

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = datetime.now(timezone.utc)

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    sources: List[Dict[str, Any]] = []
    recommendations: List[Dict[str, Any]] = []
    search_info: Dict[str, Any] = {}

class CourseRecommendationRequest(BaseModel):
    goals: List[str]
    time_constraints: Dict[str, Any]
    academic_level: str
    interests: List[str]

# Initialize services
chat_service = ChatService()
db_search = DatabaseSearchService()
web_search = WebSearchService()
course_rec = CourseRecommendationService()

@router.post("/chat", response_model=ApiResponse[ChatResponse])
async def chat_with_ai(request: ChatRequest):
    """
    Main chat endpoint that integrates GPT-5 with database and web search
    """
    try:
        # Step 1: Search database first
        db_results = db_search.search_course_data(request.message)
        
        # Step 2: If insufficient database results, search web
        web_results = []
        if not db_results or len(db_results) < 3:
            web_results = await web_search.search_web(request.message)
        
        # Step 3: Generate response using ChatGPT-5 with context
        response = await chat_service.generate_response(
            message=request.message,
            conversation_id=request.conversation_id,
            database_context=db_results,
            web_context=web_results,
            user_id=request.user_id
        )
        
        # Step 4: Check if course recommendations are needed
        recommendations = []
        if any(keyword in request.message.lower() for keyword in ['recommend', 'suggest', 'choose', 'plan']):
            recommendations = course_rec.generate_recommendations(
                request.message, 
                request.user_id
            )
        
        return ApiResponse(
            data=ChatResponse(
                message=response['content'],
                conversation_id=response['conversation_id'],
                sources=web_results,  # Web sources are marked with links
                recommendations=recommendations,
                search_info={
                    'database_results': len(db_results),
                    'web_results': len(web_results),
                    'has_recommendations': len(recommendations) > 0
                }
            ),
            success=True
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")

@router.post("/recommend-courses", response_model=ApiResponse[List[Dict[str, Any]]])
async def recommend_courses(request: CourseRecommendationRequest):
    """
    Generate course recommendations based on user goals and constraints
    """
    try:
        recommendations = await course_rec.generate_detailed_recommendations(
            goals=request.goals,
            time_constraints=request.time_constraints,
            academic_level=request.academic_level,
            interests=request.interests
        )
        
        return ApiResponse(
            data=recommendations,
            success=True
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation service error: {str(e)}")

@router.get("/conversation/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """
    Retrieve conversation history for a given conversation ID
    """
    try:
        history = await chat_service.get_conversation_history(conversation_id)
        return ApiResponse(data=history, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve conversation: {str(e)}")

@router.delete("/conversation/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """
    Clear conversation history for a given conversation ID
    """
    try:
        await chat_service.clear_conversation(conversation_id)
        return ApiResponse(data={"message": "Conversation cleared"}, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear conversation: {str(e)}")
