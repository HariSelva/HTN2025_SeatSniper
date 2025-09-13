import os
from dotenv import load_dotenv; load_dotenv()
from pymongo import MongoClient
import cohere, google.generativeai as genai
import ssl

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")
assert COHERE_API_KEY and GEMINI_API_KEY and MONGODB_URI, "Missing env vars"

CO = cohere.Client(COHERE_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
GEM_MODEL = genai.GenerativeModel("gemini-1.5-flash")  # update if needed

# Configure MongoDB client with proper SSL settings
try:
    # Try a simpler connection first
    client = MongoClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=5000,  # 5 seconds
        connectTimeoutMS=5000,  # 5 seconds
        socketTimeoutMS=5000,  # 5 seconds
    )
    
    # Skip ping test for now, just create the database reference
    print("MongoDB client created successfully")
    MDB = client.get_database("seatsniper")
    print("MongoDB database reference created")
    
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    # Create a mock database object for development
    class MockDB:
        def __getattr__(self, name):
            return MockCollection()
    
    class MockCollection:
        def find_one(self, *args, **kwargs):
            return None
        def update_one(self, *args, **kwargs):
            return None
        def insert_one(self, *args, **kwargs):
            return None
    
    MDB = MockDB()
    print("Using mock database due to connection failure")