import openai
import os
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.services.clients import MDB

class ChatService:
    def __init__(self):
        # Initialize OpenAI client
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4"  # Using GPT-4 for reliability
        
        # Conversation storage in MongoDB
        self.conversations_collection = MDB.conversations
    
    def generate_response(
        self, 
        message: str, 
        conversation_id: Optional[str] = None,
        database_context: List[Dict] = None,
        web_context: List[Dict] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate AI response using ChatGPT with database and web context
        """
        
        # Create or retrieve conversation
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
        
        conversation = self._get_or_create_conversation(conversation_id, user_id)
        
        # Build context-aware prompt
        system_prompt = self._build_system_prompt()
        context_prompt = self._build_context_prompt(database_context, web_context)
        
        # Prepare messages for OpenAI API
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": context_prompt}
        ]
        
        # Add conversation history
        if conversation.get('messages'):
            messages.extend(conversation['messages'][-10:])  # Last 10 messages for context
        
        # Add current user message
        messages.append({"role": "user", "content": message})
        
        try:
            # Check if OpenAI API key is set
            if not os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") == "your_openai_api_key_here":
                raise Exception("OpenAI API key not configured")
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            ai_response = response.choices[0].message.content
            
            # Save conversation
            self._save_conversation(
                conversation_id, 
                message, 
                ai_response, 
                user_id,
                database_context,
                web_context
            )
            
            return {
                'content': ai_response,
                'conversation_id': conversation_id
            }
            
        except Exception as e:
            # Return a fallback response if API fails
            fallback_response = self._get_fallback_response(message)
            
            # Still save the conversation
            self._save_conversation(
                conversation_id, 
                message, 
                fallback_response, 
                user_id,
                database_context,
                web_context
            )
            
            return {
                'content': fallback_response,
                'conversation_id': conversation_id
            }
    
    def _get_fallback_response(self, message: str) -> str:
        """Provide a fallback response when AI is unavailable"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['recommend', 'suggest', 'course']):
            return "I'd be happy to help you with course recommendations! While I'm setting up my AI capabilities, here are some general tips: Consider your major requirements, check prerequisites, and think about your career goals. You can also explore our course discovery page for more options."
        
        elif any(word in message_lower for word in ['prerequisite', 'requirement']):
            return "For course prerequisites, I recommend checking the official course catalog or contacting your academic advisor. Each course typically lists its specific requirements in the course description."
        
        elif any(word in message_lower for word in ['schedule', 'time', 'when']):
            return "Course schedules are usually available in the course catalog or student portal. Look for the specific semester you're interested in and check the time slots that work with your schedule."
        
        elif any(word in message_lower for word in ['professor', 'instructor', 'teacher']):
            return "Professor information is typically available in the course catalog or through student reviews. You can also check with other students who have taken the course for their experiences."
        
        else:
            return "I'm here to help with your academic planning! I can assist with course recommendations, prerequisites, scheduling, and more. What specific information are you looking for?"
    
    def _build_system_prompt(self) -> str:
        """Build the system prompt for the AI assistant"""
        return """You are an intelligent course planning assistant for university students. Your role is to help students with:

1. Course recommendations based on their goals and time constraints
2. Academic planning and scheduling
3. Understanding course prerequisites and requirements
4. Finding relevant course information and resources

IMPORTANT GUIDELINES:
- Always search the database first for course-specific information
- If database information is insufficient, use web search results and clearly mark them with [WEB SOURCE] tags
- Provide specific course codes and names when making recommendations
- Consider academic level, prerequisites, and workload when suggesting courses
- Be encouraging and supportive in your responses
- If you don't have enough information, ask clarifying questions
- Always provide sources for information, especially web sources with links

When providing web search results, format them like this:
[WEB SOURCE: Title of the source](URL) - Brief description

Be helpful, accurate, and always prioritize the student's academic success."""
    
    def _build_context_prompt(self, db_context: List[Dict], web_context: List[Dict]) -> str:
        """Build context prompt from database and web search results"""
        context_parts = []
        
        if db_context:
            context_parts.append("DATABASE SEARCH RESULTS:")
            for item in db_context:
                context_parts.append(f"- {item.get('title', 'Course Information')}: {item.get('content', '')}")
        
        if web_context:
            context_parts.append("\nWEB SEARCH RESULTS (Mark these sources in your response):")
            for item in web_context:
                title = item.get('title', 'Web Source')
                url = item.get('url', '#')
                snippet = item.get('snippet', '')
                context_parts.append(f"- [WEB SOURCE: {title}]({url}): {snippet}")
        
        return "\n".join(context_parts) if context_parts else ""
    
    def _get_or_create_conversation(self, conversation_id: str, user_id: Optional[str]) -> Dict:
        """Get existing conversation or create new one"""
        conversation = self.conversations_collection.find_one({"_id": conversation_id})
        
        if not conversation:
            conversation = {
                "_id": conversation_id,
                "user_id": user_id,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "messages": []
            }
            self.conversations_collection.insert_one(conversation)
        
        return conversation
    
    def _save_conversation(
        self, 
        conversation_id: str, 
        user_message: str, 
        ai_response: str,
        user_id: Optional[str],
        db_context: List[Dict],
        web_context: List[Dict]
    ):
        """Save the conversation with context information"""
        
        # Prepare message objects
        user_msg = {
            "role": "user",
            "content": user_message,
            "timestamp": datetime.now(timezone.utc)
        }
        
        ai_msg = {
            "role": "assistant", 
            "content": ai_response,
            "timestamp": datetime.now(timezone.utc),
            "sources": {
                "database": db_context,
                "web": web_context
            }
        }
        
        # Update conversation in MongoDB
        self.conversations_collection.update_one(
            {"_id": conversation_id},
            {
                "$push": {"messages": {"$each": [user_msg, ai_msg]}},
                "$set": {
                    "updated_at": datetime.now(timezone.utc),
                    "user_id": user_id
                }
            }
        )
    
    def get_conversation_history(self, conversation_id: str) -> List[Dict]:
        """Retrieve conversation history"""
        conversation = self.conversations_collection.find_one({"_id": conversation_id})
        return conversation.get('messages', []) if conversation else []
    
    def clear_conversation(self, conversation_id: str):
        """Clear conversation history"""
        self.conversations_collection.update_one(
            {"_id": conversation_id},
            {
                "$set": {
                    "messages": [],
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )