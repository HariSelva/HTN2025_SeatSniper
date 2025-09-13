from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COURSES = [
    {"id": "ECE222-001", "courseId": "ECE222", "section": "001", "capacity": 100, "availableSeats": 20},
    {"id": "ECE222-002", "courseId": "ECE222", "section": "002", "capacity": 80, "availableSeats": 0},
    {"id": "CS348-001", "courseId": "CS348", "section": "001", "capacity": 120, "availableSeats": 50},
]

@app.get("/api/sections/{course_id}")
def get_sections(course_id: str):
    return {"sections": [s for s in COURSES if s["courseId"] == course_id]}