from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ScrapeRequest(BaseModel):
    course_id: Optional[str] = None

def run_scraper(course_id: Optional[str] = None):
    """Background task to scrape course data"""
    print(f"Running scraper for course: {course_id or 'all courses'}")

@router.post("/scrape")
async def trigger_scrape(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """Manually trigger a scrape of course data"""
    background_tasks.add_task(run_scraper, request.course_id)
    return {"message": "Scrape task started", "course_id": request.course_id}
