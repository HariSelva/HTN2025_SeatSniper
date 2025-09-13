from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from core.config import WatchlistItem
from datetime import datetime

router = APIRouter()

# Mock data for demonstration
mock_watchlist: List[WatchlistItem] = []

class WatchlistRequest(BaseModel):
    user_id: str
    section_id: str

@router.get("/{user_id}", response_model=List[WatchlistItem])
async def get_watchlist(user_id: str):
    """Get user's watchlist"""
    return [item for item in mock_watchlist if item.user_id == user_id]

@router.post("/", response_model=WatchlistItem)
async def add_to_watchlist(request: WatchlistRequest):
    """Add section to watchlist"""
    # Check if already in watchlist
    existing = next(
        (item for item in mock_watchlist 
         if item.user_id == request.user_id and item.section_id == request.section_id),
        None
    )
    
    if existing:
        raise HTTPException(status_code=400, detail="Section already in watchlist")
    
    new_item = WatchlistItem(
        user_id=request.user_id,
        section_id=request.section_id,
        added_at=datetime.now()
    )
    
    mock_watchlist.append(new_item)
    return new_item

@router.delete("/{user_id}/{section_id}")
async def remove_from_watchlist(user_id: str, section_id: str):
    """Remove section from watchlist"""
    global mock_watchlist
    mock_watchlist = [
        item for item in mock_watchlist 
        if not (item.user_id == user_id and item.section_id == section_id)
    ]
    return {"message": "Section removed from watchlist"}
