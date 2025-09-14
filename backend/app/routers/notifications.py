from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from datetime import datetime
import boto3
from core.config import ApiResponse
import os
from dotenv import load_dotenv

load_dotenv()

# DynamoDB setup
dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

notifications_table = dynamodb.Table("user_notifications")

class NotificationRequest(BaseModel):
    user_id: str
    section_id: str
    user_email: str

class NotificationResponse(BaseModel):
    user_id: str
    section_id: str
    added_at: str

router = APIRouter()

@router.get("/{user_id}", response_model=ApiResponse[List[NotificationResponse]])
async def get_user_notifications(user_id: str):
    """Get all notifications for a user"""
    try:
        response = notifications_table.query(
            KeyConditionExpression="user_id = :uid",
            ExpressionAttributeValues={":uid": user_id}
        )
        items = response.get("Items", [])
        notifications = [
            NotificationResponse(
                user_id=item["user_id"],
                section_id=item["section_id"],
                added_at=item["added_at"]
            )
            for item in items
        ]
        return ApiResponse(data=notifications, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ApiResponse[NotificationResponse])
async def add_notification(request: NotificationRequest):
    """Add a notification subscription for a user"""
    try:
        now = datetime.utcnow().isoformat()
        item = {
            "user_id": request.user_id,
            "section_id": request.section_id,
            "user_email": request.user_email,
            "added_at": now
        }
        
        # Check if notification already exists
        existing = notifications_table.get_item(
            Key={
                "user_id": request.user_id,
                "section_id": request.section_id
            }
        )
        
        if "Item" in existing:
            raise HTTPException(status_code=400, detail="Notification already exists")
        
        notifications_table.put_item(Item=item)
        
        response = NotificationResponse(
            user_id=request.user_id,
            section_id=request.section_id,
            added_at=now
        )
        return ApiResponse(data=response, success=True, message="Notification added successfully")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_id}/{section_id}")
async def remove_notification(user_id: str, section_id: str):
    """Remove a notification subscription for a user"""
    try:
        notifications_table.delete_item(
            Key={
                "user_id": user_id,
                "section_id": section_id
            }
        )
        return ApiResponse(data=None, success=True, message="Notification removed successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/section/{section_id}", response_model=ApiResponse[List[NotificationResponse]])
async def get_section_notifications(section_id: str):
    """Get all users subscribed to notifications for a specific section"""
    try:
        # Note: This is a scan operation which can be expensive for large tables
        # In production, consider using a GSI (Global Secondary Index) on section_id
        response = notifications_table.scan(
            FilterExpression="section_id = :sid",
            ExpressionAttributeValues={":sid": section_id}
        )
        items = response.get("Items", [])
        notifications = [
            NotificationResponse(
                user_id=item["user_id"],
                section_id=item["section_id"],
                added_at=item["added_at"]
            )
            for item in items
        ]
        return ApiResponse(data=notifications, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test/{section_id}")
async def test_notification(section_id: str):
    """Test endpoint to manually trigger a notification for a section"""
    try:
        # Import the email function from sections
        from app.routers.sections import send_email_async
        
        response = notifications_table.scan(
            FilterExpression="section_id = :sid",
            ExpressionAttributeValues={":sid": section_id}
        )
        subscribed_users = response.get("Items", [])
        
        if not subscribed_users:
            return ApiResponse(data={"message": "No users subscribed to this section"}, success=False)
        
        subject = f"Test Notification for Section {section_id}"
        body = f"This is a test notification for section {section_id}. If you receive this, the notification system is working!"
        
        sent_count = 0
        for user in subscribed_users:
            user_email = user.get("user_email")
            if user_email:
                await send_email_async(user_email, subject, body)
                sent_count += 1
        
        return ApiResponse(
            data={"message": f"Test notifications sent to {sent_count} users"}, 
            success=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
