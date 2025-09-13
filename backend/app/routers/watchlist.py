from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from core.config import WatchlistItem, ApiResponse
from datetime import datetime

router = APIRouter()

# Mock data for demonstration
mock_watchlist: List[WatchlistItem] = []

class WatchlistRequest(BaseModel):
    user_id: str
    section_id: str

@router.get("/{user_id}", response_model=ApiResponse[List[WatchlistItem]])
async def get_watchlist(user_id: str):
    """Get user's watchlist"""
    items = [item for item in mock_watchlist if item.user_id == user_id]
    return ApiResponse(data=items, success=True)

@router.post("/", response_model=ApiResponse[WatchlistItem])
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
    return ApiResponse(data=new_item, success=True, message="Section added to watchlist")

@router.delete("/{user_id}/{section_id}", response_model=ApiResponse[dict])
async def remove_from_watchlist(user_id: str, section_id: str):
    """Remove section from watchlist"""
    global mock_watchlist
    initial_count = len(mock_watchlist)
    mock_watchlist = [
        item for item in mock_watchlist 
        if not (item.user_id == user_id and item.section_id == section_id)
    ]
    
    if len(mock_watchlist) < initial_count:
        return ApiResponse(data={"message": "Section removed from watchlist"}, success=True)
    else:
        raise HTTPException(status_code=404, detail="Section not found in watchlist")
