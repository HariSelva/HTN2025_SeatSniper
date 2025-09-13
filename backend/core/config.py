from pydantic import BaseModel
from typing import List, Optional, Generic, TypeVar
from datetime import datetime

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    data: T
    message: Optional[str] = None
    success: bool = True

class Section(BaseModel):
    id: str
    course_id: str
    title: str
    instructor: str
    time_slot: str
    days: List[str]
    available_seats: int
    total_capacity: int
    location: str
    last_updated: str  # ISO 8601 datetime string

class WatchlistItem(BaseModel):
    user_id: str
    section_id: str
    added_at: datetime

class Hold(BaseModel):
    user_id: str
    section_id: str
    claimed_at: datetime
    expires_at: datetime

class StreamEvent(BaseModel):
    event_type: str  # seat_open, hold_taken, hold_expired
    section_id: str
    data: dict
    timestamp: datetime
