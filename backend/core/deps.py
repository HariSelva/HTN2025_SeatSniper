from functools import lru_cache
from pydantic_settings import BaseSettings
import boto3
from typing import Optional

class Settings(BaseSettings):
    # Database settings
    dynamodb_region: str = "us-east-1"
    dynamodb_table_prefix: str = "htn2025"

    # Stream settings
    kinesis_stream_name: str = "htn2025-stream"
    sections_stream_arn: str = ""
    
    # AWS settings
    aws_region: str = "us-east-1"
    
    # DynamoDB table names
    ddb_table_sections: str = "htn2025_sections"
    ddb_table_watchlist: str = "htn2025_watchlist"
    ddb_table_holds: str = "htn2025_holds"
    
    # Scraper settings
    scraper_interval: int = 60  # seconds
    scrape_interval_seconds: int = 90
    hold_seconds: int = 120
    
    # Auth settings
    access_key: Optional[str] = None
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Course Intel APIs
    cohere_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    mongodb_uri: Optional[str] = None
    
    # Reddit API (for course intelligence scraping)
    reddit_client_id: Optional[str] = None
    reddit_client_secret: Optional[str] = None
    reddit_user_agent: Optional[str] = "SeatSniper/1.0"
    
    # Additional settings
    email: str = ""
    password: str = ""
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

@lru_cache()
def get_dynamodb_client():
    settings = get_settings()
    return boto3.client('dynamodb', region_name=settings.dynamodb_region)

@lru_cache()
def get_kinesis_client():
    settings = get_settings()
    return boto3.client('kinesis', region_name=settings.dynamodb_region)
