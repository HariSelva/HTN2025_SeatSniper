from pymongo import MongoClient, ASCENDING, TEXT
from dotenv import load_dotenv; load_dotenv()
import os

c = MongoClient(os.environ["MONGODB_URI"])
db = c.get_database("seatsniper")

db.intel.create_index([("course", ASCENDING), ("term", ASCENDING)], unique=True, name="course_term")
db.intel.create_index("updatedAt")
db.intel.create_index("ttl", expireAfterSeconds=0)  # TTL triggers when 'ttl' datetime <= now

db.sources.create_index([("course", ASCENDING), ("term", ASCENDING)])
db.sources.create_index([("title", TEXT), ("snippet", TEXT)], name="text")

db.syllabi.create_index([("course", ASCENDING), ("term", ASCENDING)], unique=True)

print("Indexes created.")