from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from core.config import Hold
from datetime import datetime, timedelta

router = APIRouter()

# Mock data for demonstration
mock_holds: List[Hold] = []

class HoldRequest(BaseModel):
    user_id: str
    section_id: str

@router.get("/{user_id}", response_model=List[Hold])
async def get_holds(user_id: str):
    """Get user's active holds"""
    now = datetime.now()
    # Filter out expired holds
    active_holds = [
        hold for hold in mock_holds 
        if hold.user_id == user_id and hold.expires_at > now
    ]
    return active_holds

@router.post("/", response_model=Hold)
async def claim_hold(request: HoldRequest):
    """Claim a 2-minute hold on a section"""
    now = datetime.now()
    expires_at = now + timedelta(minutes=2)
    
    # Check if user already has a hold on this section
    existing_hold = next(
        (hold for hold in mock_holds 
         if hold.user_id == request.user_id and hold.section_id == request.section_id
         and hold.expires_at > now),
        None
    )
    
    if existing_hold:
        raise HTTPException(status_code=400, detail="User already has a hold on this section")
    
    new_hold = Hold(
        user_id=request.user_id,
        section_id=request.section_id,
        claimed_at=now,
        expires_at=expires_at
    )
    
    mock_holds.append(new_hold)
    return new_hold

@router.delete("/{user_id}/{section_id}")
async def release_hold(user_id: str, section_id: str):
    """Release a hold on a section"""
    global mock_holds
    mock_holds = [
        hold for hold in mock_holds 
        if not (hold.user_id == user_id and hold.section_id == section_id)
    ]
    return {"message": "Hold released"}
