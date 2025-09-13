import os
from dotenv import load_dotenv; load_dotenv()
from pymongo import MongoClient
import cohere, google.generativeai as genai

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")
assert COHERE_API_KEY and GEMINI_API_KEY and MONGODB_URI, "Missing env vars"

CO = cohere.Client(COHERE_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
GEM_MODEL = genai.GenerativeModel("gemini-1.5-flash")  # update if needed

MDB = MongoClient(MONGODB_URI).get_database("seatsniper")