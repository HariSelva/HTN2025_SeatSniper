from .clients import GEM_MODEL, MDB
from datetime import datetime, timezone
import json

PROMPT = """
Extract STRICT JSON with keys:
- schedule: [{day, start, end}]
- assessments: [{name, weight}]
- policies: [string]
Return ONLY JSON.
"""

def ingest_syllabus(course: str, term: str, file_bytes: bytes, mime: str = "application/pdf"):
    res = GEM_MODEL.generate_content([PROMPT, {"mime_type": mime, "data": file_bytes}])
    try:
        data = json.loads(res.text)
    except Exception:
        data = {"schedule": [], "assessments": [], "policies": []}
    data.update({"course": course, "term": term, "extractedAt": datetime.now(timezone.utc)})
    MDB.syllabi.update_one({"course": course, "term": term}, {"$set": data}, upsert=True)
    return data