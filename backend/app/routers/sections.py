from fastapi import APIRouter, HTTPException
from typing import List
from core.config import Section
from datetime import datetime
import boto3
from dotenv import load_dotenv
import os
import asyncio
import smtplib
from email.mime.text import MIMEText

EMAIL_USER = "seatsniper521@gmail.com"
EMAIL_PASS = "ndrbkibkzewjvjya"
load_dotenv()

dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

table_name = f"course_sections"
table = dynamodb.Table(table_name)
notifications_table = dynamodb.Table("user_notifications")

def parse_section(item: dict) -> Section:
    """Convert DynamoDB item to Section model"""
    return Section(
        subject=item.get("subject", ""),
        catalog_number=item.get("catalog_number", ""),
        title=item.get("title", ""),
        class_number=item.get("class_number", ""),
        component_section=item.get("component_section", ""),
        enrollment_capacity=int(item.get("enrollment_capacity", 0)),
        enrollment_total=int(item.get("enrollment_total", 0)),
        available_seats=int(item.get("available_seats", 0))
    )
    
def send_email(to_email: str, subject: str, body: str):
    """Send an email notification (basic SMTP example)"""
    print(f"Attempting to send email to: {to_email}")
    print(f"Subject: {subject}")
    print(f"Body: {body}")
    
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [to_email], msg.as_string())
            print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        raise
        

async def send_email_async(*args, **kwargs):
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, send_email, *args, **kwargs)

cached_sections: dict[str, dict] = {}
previous_sections: dict[str, int] = {}

async def poll_dynamodb(interval: int = 1):
    global previous_sections
    global cached_sections
    
    if not previous_sections:
        response = table.scan()
        items = response.get("Items", [])
        for item in items:
            section_id = item["class_number"]
            available = int(item.get("available_seats", 0))
            previous_sections[section_id] = available
        print("Initialized previous_sections with current table state.")
        
    while True:
        try:
            response = table.scan()
            items = response.get("Items", [])

            for item in items:
                
                section_id = item["class_number"]
                cached_sections[section_id] = item
                available = int(item.get("available_seats", 0))

                prev_available = previous_sections.get(section_id, 0)
                
                # Send notifications when seats go from <=0 to >0 (seats become available)
                if prev_available <= 0 and available > 0:
                    print(f"Seat availability changed for section {section_id}: {prev_available} -> {available} seats available")
                    # Send notification to default email regardless of user subscription
                    try:
                        subject = f"Seat Available in {item['subject']} {item['catalog_number']}"
                        body = (
                            f"Good news! Course {item['subject']} {item['catalog_number']} "
                            f"({item['class_number']}) now has {available} seat{'s' if available > 1 else ''} available!\n\n"
                            f"Enroll now to secure your spot."
                        )
                        
                        # Send notification to default email
                        await send_email_async(EMAIL_USER, subject, body)
                        print(f"Notification sent to {EMAIL_USER}: {subject}")
                    except Exception as e:
                        print(f"Error sending notifications for section {section_id}: {e}")

                previous_sections[section_id] = available

        except Exception as e:
            print(f"Polling error: {e}")

        await asyncio.sleep(interval)
        
def start_polling():
    asyncio.create_task(poll_dynamodb())

router = APIRouter()
last_checked = datetime.min

@router.get("/{course_id}")
async def get_sections(course_id: str):
    """Fetch sections for a course from DynamoDB"""
    try:
        response = table.query(
            KeyConditionExpression="course_id = :c",
            ExpressionAttributeValues={":c": course_id}
        )
        items = response.get("Items", [])
        if not items:
            raise HTTPException(status_code=404, detail="No sections found for this course")
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Section])
async def get_all_sections():
    try:
        # Always try to get fresh data from DynamoDB if cache is empty
        if not cached_sections:
            print("Cache is empty, fetching fresh data from DynamoDB...")
            response = table.scan()
            items = response.get("Items", [])
            for item in items:
                section_id = item["class_number"]
                cached_sections[section_id] = item
            print(f"Loaded {len(cached_sections)} sections into cache")

        sections = [parse_section(item) for item in cached_sections.values()]
        return sections
    except Exception as e:
        print(f"Error fetching sections: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch sections: {e}")

@router.post("/refresh")
async def refresh_sections_cache():
    """Manually refresh the sections cache from DynamoDB"""
    try:
        global cached_sections
        print("Manually refreshing sections cache...")
        response = table.scan()
        items = response.get("Items", [])
        
        # Clear existing cache
        cached_sections.clear()
        
        # Populate with fresh data
        for item in items:
            section_id = item["class_number"]
            cached_sections[section_id] = item
            
        print(f"Refreshed cache with {len(cached_sections)} sections")
        return {"message": f"Successfully refreshed cache with {len(cached_sections)} sections"}
    except Exception as e:
        print(f"Error refreshing cache: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to refresh cache: {e}")
