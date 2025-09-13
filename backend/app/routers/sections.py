from fastapi import APIRouter, HTTPException
from typing import List
from core.config import Section
from datetime import datetime

router = APIRouter()

# Mock data for demonstration
mock_sections = [
    Section(
        id="1",
        course_id="1",
        title="CS101 - Section A",
        instructor="Dr. Smith",
        time_slot="9:00 AM - 10:30 AM",
        days=["Monday", "Wednesday", "Friday"],
        available_seats=5,
        total_capacity=30,
        location="Room 101",
        last_updated=datetime.now()
    ),
    Section(
        id="2",
        course_id="1",
        title="CS101 - Section B",
        instructor="Dr. Johnson",
        time_slot="2:00 PM - 3:30 PM",
        days=["Tuesday", "Thursday"],
        available_seats=0,
        total_capacity=25,
        location="Room 102",
        last_updated=datetime.now()
    ),
]

@router.get("/{course_id}", response_model=List[Section])
async def get_sections(course_id: str):
    """Get all sections for a specific course"""
    sections = [s for s in mock_sections if s.course_id == course_id]
    if not sections:
        raise HTTPException(status_code=404, detail="No sections found for this course")
    return sections

@router.get("/", response_model=List[Section])
async def get_all_sections():
    """Get all sections"""
    return mock_sections
