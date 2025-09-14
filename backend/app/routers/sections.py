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
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, [to_email], msg.as_string())
        

async def send_email_async(*args, **kwargs):
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, send_email, *args, **kwargs)

cached_sections: dict[str, dict] = {}

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
                
                if prev_available <= 0 and available > 0:
                    print(item)
                    subject = f"Seat Opened in {item['subject']} {item['catalog_number']}"
                    body = (
                        f"Course {item['subject']} {item['catalog_number']} "
                        f"({item['class_number']}) now has {available} seats available!"
                    )
                    await send_email_async(EMAIL_USER, subject, body)
                    print(f"Notification sent: {subject}")

                previous_sections[section_id] = available

        except Exception as e:
            print(f"Polling error: {e}")

        await asyncio.sleep(interval)
        
def start_polling():
    asyncio.create_task(poll_dynamodb())

router = APIRouter()
last_checked = datetime.min
previous_sections: dict[str, int] = {}

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
        if not cached_sections:
            response = table.scan()
            items = response.get("Items", [])
            for item in items:
                section_id = item["class_number"]
                cached_sections[section_id] = item

        sections = [parse_section(item) for item in cached_sections.values()]
        return sections
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sections: {e}")
