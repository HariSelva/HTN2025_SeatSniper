from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Section(BaseModel):
    subject: str
    catalog_number: str
    title: str
    class_number: str
    component_section: str
    enrollment_capacity: int
    enrollment_total: int
    available_seats: int

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
