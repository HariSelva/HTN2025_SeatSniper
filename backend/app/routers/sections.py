from fastapi import APIRouter, HTTPException
from typing import List
from core.config import Section, ApiResponse
from datetime import datetime

router = APIRouter()

# Mock data for demonstration
mock_sections = {
    "CS101": [
        Section(
            id="CS101-001",
            course_id="CS101",
            title="CS101 - Section 001",
            instructor="Dr. Smith",
            time_slot="9:00 AM - 10:30 AM",
            days=["Monday", "Wednesday", "Friday"],
            available_seats=5,
            total_capacity=30,
            location="Room 101",
            last_updated=datetime.now().isoformat()
        ),
        Section(
            id="CS101-002",
            course_id="CS101",
            title="CS101 - Section 002",
            instructor="Dr. Johnson",
            time_slot="2:00 PM - 3:30 PM",
            days=["Tuesday", "Thursday"],
            available_seats=0,
            total_capacity=25,
            location="Room 102",
            last_updated=datetime.now().isoformat()
        ),
        Section(
            id="CS101-003",
            course_id="CS101",
            title="CS101 - Section 003",
            instructor="Prof. Williams",
            time_slot="11:00 AM - 12:30 PM",
            days=["Monday", "Wednesday", "Friday"],
            available_seats=12,
            total_capacity=35,
            location="Room 103",
            last_updated=datetime.now().isoformat()
        )
    ],
    "CS201": [
        Section(
            id="CS201-001",
            course_id="CS201",
            title="CS201 - Section 001",
            instructor="Prof. Chen",
            time_slot="10:00 AM - 11:30 AM",
            days=["Monday", "Wednesday", "Friday"],
            available_seats=8,
            total_capacity=40,
            location="Room 201",
            last_updated=datetime.now().isoformat()
        ),
        Section(
            id="CS201-002",
            course_id="CS201",
            title="CS201 - Section 002",
            instructor="Dr. Rodriguez",
            time_slot="1:00 PM - 2:30 PM",
            days=["Tuesday", "Thursday"],
            available_seats=0,
            total_capacity=35,
            location="Room 202",
            last_updated=datetime.now().isoformat()
        )
    ]
}

@router.get("/{course_id}", response_model=ApiResponse[List[Section]])
async def get_sections(course_id: str):
    """Fetch sections for a course"""
    sections = mock_sections.get(course_id, [])
    if not sections:
        return ApiResponse(data=[], message="No sections found for this course", success=True)
    
    return ApiResponse(data=sections, success=True)

@router.get("/", response_model=ApiResponse[List[Section]])
async def get_all_sections():
    """Fetch all sections"""
    all_sections = []
    for course_sections in mock_sections.values():
        all_sections.extend(course_sections)
    
    return ApiResponse(data=all_sections, success=True)
