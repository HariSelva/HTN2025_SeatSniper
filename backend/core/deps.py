from functools import lru_cache
from pydantic_settings import BaseSettings
import boto3
from typing import Optional

class Settings(BaseSettings):
    # Database settings
    dynamodb_region: str
    dynamodb_table_prefix: str

    # Stream settings
    kinesis_stream_name: str

    # Auth settings
    access_key: Optional[str] = None
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    # Scraper settings
    scraper_interval: int

    # Course Intelligence APIs
    cohere_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    mongodb_uri: Optional[str] = None

    # Reddit API
    reddit_client_id: Optional[str] = None
    reddit_client_secret: Optional[str] = None
    reddit_user_agent: Optional[str] = None

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
