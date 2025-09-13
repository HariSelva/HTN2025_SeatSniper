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
    
    # Auth settings
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Scraper settings
    scraper_interval: int = 60  # seconds
    
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
