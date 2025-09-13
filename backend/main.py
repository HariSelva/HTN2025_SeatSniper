from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, sections, watchlist, holds, stream, tasks
from app.routes import course_intel
from core.deps import get_settings

app = FastAPI(title="HTN2025 API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(sections.router, prefix="/api/sections", tags=["sections"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
app.include_router(holds.router, prefix="/api/holds", tags=["holds"])
app.include_router(stream.router, prefix="/api/stream", tags=["stream"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(course_intel.router)

@app.get("/")
async def root():
    return {"message": "HTN2025 API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/mock/sections/{course_id}")
async def mock_sections(course_id: str):
    """Returns dummy course sections so frontend can start."""
    dummy_sections = [
        {"id": f"{course_id}-001", "courseId": course_id, "section": "001", "capacity": 100, "availableSeats": 20},
        {"id": f"{course_id}-002", "courseId": course_id, "section": "002", "capacity": 80, "availableSeats": 0},
        {"id": f"{course_id}-003", "courseId": course_id, "section": "003", "capacity": 120, "availableSeats": 50},
    ]
    return {"sections": dummy_sections}

if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run(app, host="0.0.0.0", port=8000)
