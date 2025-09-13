from fastapi import APIRouter, HTTPException
from typing import List
from core.config import Section
from datetime import datetime
import boto3

dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id="AKIA4NNNXZMDJZMGNZXX",
    aws_secret_access_key="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"
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

router = APIRouter()

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
    """Fetch all sections from DynamoDB"""
    try:
        response = table.scan()
        items = response.get("Items", [])
        sections = [parse_section(item) for item in items]
        return sections
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sections: {e}")
