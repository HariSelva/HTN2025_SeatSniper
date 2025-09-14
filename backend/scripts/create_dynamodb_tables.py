#!/usr/bin/env python3
"""
DynamoDB Table Creation Script for HTN2025 Course Sections
Creates the course_sections table based on the data structure from sections.py
"""

import boto3
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_dynamodb_client():
    """Create DynamoDB client with AWS credentials"""
    return boto3.client(
        'dynamodb',
        region_name=os.getenv('DYNAMODB_REGION', 'us-east-1'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )

def create_course_sections_table():
    """Create the course_sections DynamoDB table"""
    dynamodb = create_dynamodb_client()
    
    table_name = "course_sections"
    
    # Table schema based on Section model from core/config.py
    table_schema = {
        'TableName': table_name,
        'KeySchema': [
            {
                'AttributeName': 'class_number',
                'KeyType': 'HASH'  # Partition key
            },
            {
                'AttributeName': 'course_id',
                'KeyType': 'RANGE'  # Sort key
            }
        ],
        'AttributeDefinitions': [
            {
                'AttributeName': 'class_number',
                'AttributeType': 'S'  # String
            },
            {
                'AttributeName': 'course_id',
                'AttributeType': 'S'  # String
            },
            {
                'AttributeName': 'subject',
                'AttributeType': 'S'  # String
            },
            {
                'AttributeName': 'catalog_number',
                'AttributeType': 'S'  # String
            },
            {
                'AttributeName': 'available_seats',
                'AttributeType': 'N'  # Number
            }
        ],
        'BillingMode': 'PAY_PER_REQUEST',  # On-demand billing
        'GlobalSecondaryIndexes': [
            {
                'IndexName': 'subject-catalog-index',
                'KeySchema': [
                    {
                        'AttributeName': 'subject',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'catalog_number',
                        'KeyType': 'RANGE'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                }
            },
            {
                'IndexName': 'available-seats-index',
                'KeySchema': [
                    {
                        'AttributeName': 'available_seats',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'class_number',
                        'KeyType': 'RANGE'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                }
            }
        ],
        'StreamSpecification': {
            'StreamEnabled': True,
            'StreamViewType': 'NEW_AND_OLD_IMAGES'  # For real-time updates
        }
    }
    
    try:
        # Check if table already exists
        try:
            response = dynamodb.describe_table(TableName=table_name)
            print(f"Table {table_name} already exists.")
            print(f"Table status: {response['Table']['TableStatus']}")
            return True
        except ClientError as e:
            if e.response['Error']['Code'] != 'ResourceNotFoundException':
                raise
        
        # Create the table
        print(f"Creating table {table_name}...")
        response = dynamodb.create_table(**table_schema)
        
        print(f"Table {table_name} created successfully!")
        print(f"Table ARN: {response['TableDescription']['TableArn']}")
        
        # Wait for table to be active
        print("Waiting for table to become active...")
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=table_name)
        
        print(f"Table {table_name} is now active!")
        return True
        
    except ClientError as e:
        print(f"Error creating table {table_name}: {e}")
        return False

def create_user_notifications_table():
    """Create the user_notifications DynamoDB table"""
    dynamodb = create_dynamodb_client()
    
    table_name = "user_notifications"
    
    table_schema = {
        'TableName': table_name,
        'KeySchema': [
            {
                'AttributeName': 'user_id',
                'KeyType': 'HASH'  # Partition key
            },
            {
                'AttributeName': 'section_id',
                'KeyType': 'RANGE'  # Sort key
            }
        ],
        'AttributeDefinitions': [
            {
                'AttributeName': 'user_id',
                'AttributeType': 'S'  # String
            },
            {
                'AttributeName': 'section_id',
                'AttributeType': 'S'  # String
            }
        ],
        'BillingMode': 'PAY_PER_REQUEST',
        'StreamSpecification': {
            'StreamEnabled': True,
            'StreamViewType': 'NEW_AND_OLD_IMAGES'
        }
    }
    
    try:
        # Check if table already exists
        try:
            response = dynamodb.describe_table(TableName=table_name)
            print(f"Table {table_name} already exists.")
            return True
        except ClientError as e:
            if e.response['Error']['Code'] != 'ResourceNotFoundException':
                raise
        
        # Create the table
        print(f"Creating table {table_name}...")
        response = dynamodb.create_table(**table_schema)
        
        print(f"Table {table_name} created successfully!")
        
        # Wait for table to be active
        print("Waiting for table to become active...")
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=table_name)
        
        print(f"Table {table_name} is now active!")
        return True
        
    except ClientError as e:
        print(f"Error creating table {table_name}: {e}")
        return False

def load_course_data_from_csv():
    """Load course section data from the scraper's CSV file"""
    import csv
    import os
    
    # Path to the CSV file in the scraper folder
    csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'scraper', 'CourseData.csv')
    
    if not os.path.exists(csv_path):
        print(f"CSV file not found at {csv_path}")
        return []
    
    sections = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Convert the CSV data to match our DynamoDB schema
                section = {
                    'class_number': row['class_number'],
                    'course_id': f"{row['subject']}{row['catalog_number']}",  # Create course_id from subject + catalog_number
                    'subject': row['subject'],
                    'catalog_number': row['catalog_number'],
                    'title': row['title'],
                    'component_section': row['component_section'],
                    'enrollment_capacity': int(row['enrollment_capacity']),
                    'enrollment_total': int(row['enrollment_total']),
                    'available_seats': int(row['availableSeats'])
                }
                sections.append(section)
        
        print(f"Loaded {len(sections)} course sections from CSV file")
        return sections
        
    except Exception as e:
        print(f"Error loading CSV data: {e}")
        return []

def add_course_data():
    """Add real course section data from CSV to the table"""
    dynamodb = create_dynamodb_client()
    table_name = "course_sections"
    
    # Load data from CSV
    sections = load_course_data_from_csv()
    
    if not sections:
        print("No course data to add.")
        return False
    
    try:
        # Use DynamoDB resource for easier item operations
        dynamodb_resource = boto3.resource(
            'dynamodb',
            region_name=os.getenv('DYNAMODB_REGION', 'us-east-1'),
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
        )
        
        table = dynamodb_resource.Table(table_name)
        
        print(f"Adding course data from CSV to {table_name}...")
        
        # Add sections in batches for better performance
        batch_size = 25  # DynamoDB batch write limit
        for i in range(0, len(sections), batch_size):
            batch = sections[i:i + batch_size]
            
            with table.batch_writer() as batch_writer:
                for section in batch:
                    batch_writer.put_item(Item=section)
            
            print(f"Added batch {i//batch_size + 1}: {len(batch)} sections")
        
        print(f"Successfully added {len(sections)} course sections from CSV!")
        return True
        
    except ClientError as e:
        print(f"Error adding course data: {e}")
        return False

def main():
    """Main function to create all tables"""
    print("Creating DynamoDB tables for HTN2025 Course Sections...")
    print("=" * 60)
    
    # Create course_sections table
    success1 = create_course_sections_table()
    print()
    
    # Create user_notifications table
    success2 = create_user_notifications_table()
    print()
    
    # Add course data from CSV if course_sections table was created successfully
    if success1:
        add_course_data()
    
    print("=" * 60)
    if success1 and success2:
        print("All tables created successfully!")
    else:
        print("Some tables failed to create. Check the errors above.")

if __name__ == "__main__":
    main()
