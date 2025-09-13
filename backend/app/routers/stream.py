from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from core.config import StreamEvent
from datetime import datetime
import asyncio
import json

router = APIRouter()

@router.get("/")
async def stream_events():
    """Server-Sent Events endpoint for real-time updates"""
    
    async def event_generator():
        while True:
            # In a real implementation, this would listen to Kinesis or other event sources
            # For now, we'll send a heartbeat every 30 seconds
            await asyncio.sleep(30)
            
            # Send heartbeat
            event_data = StreamEvent(
                event_type="heartbeat",
                section_id="",
                data={"message": "Connection alive"},
                timestamp=datetime.now()
            )
            
            # Use Pydantic's model_dump with mode='json' for proper datetime serialization
            event_dict = event_data.model_dump(mode='json')
            
            yield f"data: {json.dumps(event_dict)}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control"
        }
    )
