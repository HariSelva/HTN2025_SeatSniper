#!/usr/bin/env python3
"""
Verify that the course data in DynamoDB matches the expected structure
"""

import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def verify_course_data():
    """Verify the course data structure in DynamoDB"""
    dynamodb = boto3.resource(
        'dynamodb',
        region_name=os.getenv('DYNAMODB_REGION', 'us-east-1'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
    
    table = dynamodb.Table('course_sections')
    
    print("Verifying course data in DynamoDB...")
    print("=" * 50)
    
    # Get a sample of items
    response = table.scan(Limit=10)
    items = response['Items']
    
    if not items:
        print("No items found in the table!")
        return False
    
    print(f"Found {len(items)} sample items")
    print("\nSample course sections:")
    print("-" * 50)
    
    for i, item in enumerate(items, 1):
        print(f"{i}. {item['subject']}{item['catalog_number']} - {item['title']}")
        print(f"   Class: {item['class_number']} | Section: {item['component_section']}")
        print(f"   Capacity: {item['enrollment_capacity']} | Enrolled: {item['enrollment_total']} | Available: {item['available_seats']}")
        print(f"   Course ID: {item['course_id']}")
        print()
    
    # Check for courses with available seats
    available_courses = [item for item in items if item['available_seats'] > 0]
    print(f"Courses with available seats: {len(available_courses)}")
    
    # Check for full courses
    full_courses = [item for item in items if item['available_seats'] <= 0]
    print(f"Full courses: {len(full_courses)}")
    
    # Check data types and required fields
    required_fields = ['class_number', 'course_id', 'subject', 'catalog_number', 'title', 
                      'component_section', 'enrollment_capacity', 'enrollment_total', 'available_seats']
    
    print(f"\nData structure verification:")
    print("-" * 30)
    
    for field in required_fields:
        if field in items[0]:
            print(f"✓ {field}: {type(items[0][field]).__name__}")
        else:
            print(f"✗ Missing field: {field}")
    
    return True

if __name__ == "__main__":
    verify_course_data()
