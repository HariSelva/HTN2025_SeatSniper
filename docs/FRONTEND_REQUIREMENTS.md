# Frontend Requirements for Backend Team

## Overview
This document outlines the complete API requirements for the HTN2025 frontend application. The frontend is a React/TypeScript application with a premium LinkedIn-style design that provides course section monitoring, AI-powered assistance, watchlist management, and hold claiming functionality.

## Design System
- **UI Framework**: LinkedIn-inspired premium design with professional aesthetics
- **Styling**: Tailwind CSS with custom component classes
- **Layout**: Tab-based navigation with responsive design
- **Theme**: Professional gray background (#F3F2EF) with LinkedIn blue accents (#0066CC)
- **Typography**: System fonts with proper hierarchy and spacing

## Core Requirements
- All API responses must be in English [[memory:7455817]]
- All endpoints must support CORS for localhost:3000 (frontend)
- All responses must follow the `ApiResponse<T>` wrapper format
- Authentication uses simple dev tokens (JWT not required for MVP)

## Frontend Application Structure

### Tab-Based Navigation
The application uses a LinkedIn-style tab navigation with four main sections:

1. **Chat with AI** - AI-powered course assistance and recommendations
2. **Discover** - Course discovery with advanced filtering and ratings
3. **Your Calendar** - Personal schedule management and course planning
4. **Your Profile** - User settings, academic information, and preferences

### Key Features
- **Premium UI Design**: Professional LinkedIn-inspired interface
- **AI Chat Integration**: GPT-4 powered course assistance
- **Course Discovery**: Rich course cards with professor ratings and enrollment info
- **Calendar Management**: Visual schedule planning and conflict detection
- **Profile Management**: Academic tracking and user preferences

## Data Models

### Core Entities

```typescript
// User entity
interface User {
  id: string;
  email?: string;
  name?: string;
}

// Course entity
interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
}

// Section entity (course section)
interface Section {
  id: string;
  courseId: string;
  title: string;
  instructor: string;
  timeSlot: string;
  days: string[];
  availableSeats: number;
  totalCapacity: number;
  location: string;
  lastUpdated: string; // ISO 8601 datetime
}

// Watchlist item
interface WatchlistItem {
  userId: string;
  sectionId: string;
  addedAt: string; // ISO 8601 datetime
}

// AI Chat message
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string; // ISO 8601 datetime
}

// Course with enhanced details for discovery
interface CourseDetails {
  id: string;
  name: string;
  code: string;
  description: string;
  professor: string;
  professorRating?: number;
  courseRating?: number;
  time: string;
  days: string[];
  location: string;
  credits: number;
  prerequisites?: string[];
  enrolled: number;
  capacity: number;
  tags: string[];
}

// User profile information
interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  school: string;
  year: string;
  major: string;
  minor?: string;
  gpa?: number;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
    language: string;
  };
}

// Hold (2-minute temporary hold)
interface Hold {
  userId: string;
  sectionId: string;
  claimedAt: string; // ISO 8601 datetime
  expiresAt: string; // ISO 8601 datetime
}

// Stream event for SSE
interface StreamEvent {
  eventType: 'seat_open' | 'hold_taken' | 'hold_expired' | 'heartbeat';
  sectionId: string;
  data: Record<string, any>;
  timestamp: string; // ISO 8601 datetime
}

// API response wrapper
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

## Required API Endpoints

### 1. AI Chat Integration (`/api/chat`)
**Note**: The frontend currently uses mock AI responses. For production, integrate with OpenAI API.

#### POST `/api/chat/messages`
**Purpose**: Send message to AI assistant for course recommendations
**Request**:
```json
{
  "message": "string",
  "userId": "string"
}
```
**Response**:
```json
{
  "data": {
    "id": "string",
    "content": "string",
    "sender": "ai",
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "success": true
}
```

### 2. Course Discovery (`/api/courses`)
**Status**: ❌ MISSING - Currently using mock data in frontend

#### GET `/api/courses/discover`
**Purpose**: Get courses with enhanced details for discovery page
**Query Parameters**:
- `search`: string (optional) - Search term
- `category`: string (optional) - Course category filter
- `page`: number (optional) - Page number (default: 1)
- `limit`: number (optional) - Items per page (default: 20)

**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "professor": "string",
      "professorRating": 4.8,
      "courseRating": 4.6,
      "time": "9:00 AM - 10:30 AM",
      "days": ["Mon", "Wed", "Fri"],
      "location": "MC 4020",
      "credits": 3,
      "prerequisites": ["CS101"],
      "enrolled": 85,
      "capacity": 120,
      "tags": ["Programming", "Beginner", "Popular"]
    }
  ],
  "success": true
}
```

#### GET `/api/courses/{id}/details`
**Purpose**: Get detailed course information
**Response**:
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "code": "string",
    "description": "string",
    "professor": "string",
    "professorRating": 4.8,
    "courseRating": 4.6,
    "time": "9:00 AM - 10:30 AM",
    "days": ["Mon", "Wed", "Fri"],
    "location": "MC 4020",
    "credits": 3,
    "prerequisites": ["CS101"],
    "enrolled": 85,
    "capacity": 120,
    "tags": ["Programming", "Beginner", "Popular"]
  },
  "success": true
}
```

### 3. User Profile Management (`/api/user`)
**Status**: ❌ MISSING - Currently using mock data in frontend

#### GET `/api/user/profile`
**Purpose**: Get user profile information
**Response**:
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "studentId": "string",
    "school": "string",
    "year": "string",
    "major": "string",
    "minor": "string",
    "gpa": 3.85,
    "preferences": {
      "notifications": true,
      "emailUpdates": true,
      "darkMode": false,
      "language": "English"
    }
  },
  "success": true
}
```

#### PUT `/api/user/profile`
**Purpose**: Update user profile information
**Request**:
```json
{
  "name": "string",
  "email": "string",
  "school": "string",
  "year": "string",
  "major": "string",
  "minor": "string"
}
```
**Response**:
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "studentId": "string",
    "school": "string",
    "year": "string",
    "major": "string",
    "minor": "string",
    "gpa": 3.85,
    "preferences": {
      "notifications": true,
      "emailUpdates": true,
      "darkMode": false,
      "language": "English"
    }
  },
  "success": true
}
```

#### PUT `/api/user/preferences`
**Purpose**: Update user preferences
**Request**:
```json
{
  "preferences": {
    "notifications": true,
    "emailUpdates": true,
    "darkMode": false,
    "language": "English"
  }
}
```
**Response**:
```json
{
  "data": {
    "preferences": {
      "notifications": true,
      "emailUpdates": true,
      "darkMode": false,
      "language": "English"
    }
  },
  "success": true
}
```

### 4. Calendar Management (`/api/calendar`)
**Status**: ❌ MISSING - Currently using mock data in frontend

#### GET `/api/user/schedule`
**Purpose**: Get user's enrolled courses and schedule
**Response**:
```json
{
  "data": {
    "courses": [
      {
        "id": "string",
        "name": "string",
        "code": "string",
        "professor": "string",
        "color": "bg-blue-500",
        "schedule": [
          {
            "day": 1,
            "startTime": "09:00",
            "endTime": "10:30",
            "type": "lecture",
            "location": "MC 4020"
          }
        ]
      }
    ],
    "schedule": [
      {
        "id": "string",
        "title": "string",
        "course": "string",
        "type": "lecture",
        "startTime": "09:00",
        "endTime": "10:30",
        "location": "string",
        "professor": "string",
        "color": "bg-blue-500"
      }
    ]
  },
  "success": true
}
```

#### POST `/api/user/schedule/enroll`
**Purpose**: Enroll in a course
**Request**:
```json
{
  "courseId": "string",
  "sectionId": "string"
}
```
**Response**:
```json
{
  "data": {
    "success": true,
    "message": "Successfully enrolled in course"
  },
  "success": true
}
```

### 5. Authentication (`/api/auth`)
**Status**: ✅ IMPLEMENTED - Backend has login/logout endpoints

#### POST `/api/auth/login`
**Purpose**: Development login to obtain user session
**Request**:
```json
{
  "userId": "string"
}
```
**Response**:
```json
{
  "data": {
    "userId": "string",
    "token": "string",
    "message": "Login successful"
  },
  "success": true
}
```

#### POST `/api/auth/logout`
**Purpose**: Clear user session
**Response**:
```json
{
  "data": {
    "message": "Logout successful"
  },
  "success": true
}
```

### 6. Courses (`/api/courses`)
**Status**: ❌ MISSING - Currently using mock data in frontend

#### GET `/api/courses`
**Purpose**: Get all available courses for browsing
**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string"
    }
  ],
  "success": true
}
```

#### GET `/api/courses/{courseId}`
**Purpose**: Get specific course details
**Response**:
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "code": "string",
    "description": "string"
  },
  "success": true
}
```

#### GET `/api/courses/search?q={query}`
**Purpose**: Search courses by name or code
**Query Parameters**:
- `q`: Search query string
**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string"
    }
  ],
  "success": true
}
```

### 7. Sections (`/api/sections`)
**Status**: ✅ PARTIALLY IMPLEMENTED - Backend has basic endpoints, needs data model updates

#### GET `/api/sections/{courseId}`
**Purpose**: Get all sections for a specific course
**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "course_id": "string",
      "title": "string",
      "instructor": "string",
      "time_slot": "string",
      "days": ["string"],
      "available_seats": 0,
      "total_capacity": 0,
      "location": "string",
      "last_updated": "string"
    }
  ],
  "success": true
}
```

#### GET `/api/sections/`
**Purpose**: Get all sections
**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "course_id": "string",
      "title": "string",
      "instructor": "string",
      "time_slot": "string",
      "days": ["string"],
      "available_seats": 0,
      "total_capacity": 0,
      "location": "string",
      "last_updated": "string"
    }
  ],
  "success": true
}
```

### 8. Watchlist (`/api/watchlist`)
**Status**: ✅ IMPLEMENTED - Backend has all watchlist endpoints

#### GET `/api/watchlist/{userId}`
**Purpose**: Get user's watchlist
**Response**:
```json
{
  "data": [
    {
      "userId": "string",
      "sectionId": "string",
      "addedAt": "string"
    }
  ],
  "success": true
}
```

#### POST `/api/watchlist`
**Purpose**: Add section to watchlist
**Request**:
```json
{
  "userId": "string",
  "sectionId": "string"
}
```
**Response**:
```json
{
  "data": {
    "userId": "string",
    "sectionId": "string",
    "addedAt": "string"
  },
  "success": true
}
```

#### DELETE `/api/watchlist/{userId}/{sectionId}`
**Purpose**: Remove section from watchlist
**Response**:
```json
{
  "data": {
    "message": "Section removed from watchlist"
  },
  "success": true
}
```

### 9. Holds (`/api/holds`)
**Status**: ✅ IMPLEMENTED - Backend has all holds endpoints

#### GET `/api/holds/{userId}`
**Purpose**: Get user's active holds
**Response**:
```json
{
  "data": [
    {
      "user_id": "string",
      "section_id": "string",
      "claimed_at": "string",
      "expires_at": "string"
    }
  ],
  "success": true
}
```

#### POST `/api/holds`
**Purpose**: Claim a 2-minute hold on a section
**Request**:
```json
{
  "user_id": "string",
  "section_id": "string"
}
```
**Response**:
```json
{
  "data": {
    "user_id": "string",
    "section_id": "string",
    "claimed_at": "string",
    "expires_at": "string"
  },
  "success": true
}
```

#### DELETE `/api/holds/{userId}/{sectionId}`
**Purpose**: Release a hold on a section
**Response**:
```json
{
  "data": {
    "message": "Hold released"
  },
  "success": true
}
```

### 10. Server-Sent Events (`/api/stream`)
**Status**: ✅ IMPLEMENTED - Backend has basic SSE endpoint

#### GET `/api/stream`
**Purpose**: Real-time event stream for seat availability and hold updates
**Headers**:
- `Accept: text/event-stream`
- `Cache-Control: no-cache`

**Event Format**:
```
data: {"eventType": "seat_open", "sectionId": "123", "data": {"availableSeats": 1}, "timestamp": "2024-01-01T12:00:00Z"}

data: {"eventType": "hold_taken", "sectionId": "123", "data": {"userId": "user1"}, "timestamp": "2024-01-01T12:00:00Z"}

data: {"eventType": "hold_expired", "sectionId": "123", "data": {"userId": "user1"}, "timestamp": "2024-01-01T12:00:00Z"}

data: {"eventType": "heartbeat", "sectionId": "", "data": {"message": "Connection alive"}, "timestamp": "2024-01-01T12:00:00Z"}
```

## Event Types and Triggers

### `seat_open`
**Triggered when**: A seat becomes available in a section
**Data**:
```json
{
  "availableSeats": 1,
  "totalCapacity": 30
}
```

### `hold_taken`
**Triggered when**: Another user claims a hold on a section
**Data**:
```json
{
  "userId": "string",
  "expiresAt": "string"
}
```

### `hold_expired`
**Triggered when**: A hold expires (after 2 minutes)
**Data**:
```json
{
  "userId": "string",
  "sectionId": "string"
}
```

### `heartbeat`
**Triggered when**: Connection health check (every 30 seconds)
**Data**:
```json
{
  "message": "Connection alive"
}
```

## Error Handling

All endpoints must return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "data": null,
  "message": "Validation error message",
  "success": false
}
```

### 401 Unauthorized
```json
{
  "data": null,
  "message": "Authentication required",
  "success": false
}
```

### 404 Not Found
```json
{
  "data": null,
  "message": "Resource not found",
  "success": false
}
```

### 409 Conflict
```json
{
  "data": null,
  "message": "Resource already exists",
  "success": false
}
```

### 500 Internal Server Error
```json
{
  "data": null,
  "message": "Internal server error",
  "success": false
}
```

## Business Logic Requirements

### Hold System
- Holds last exactly 2 minutes from claim time
- Only one hold per user per section at a time
- Holds can only be claimed when `availableSeats > 0`
- Expired holds should be automatically cleaned up
- Hold expiration should trigger `hold_expired` SSE event

### Watchlist System
- Users can watch unlimited sections
- Duplicate watchlist entries should be prevented
- Watchlist should persist across sessions

### Seat Availability
- `availableSeats` should be updated in real-time
- Seat changes should trigger `seat_open` SSE events
- Seat availability should be checked before allowing hold claims

## CORS Configuration

The backend must allow CORS requests from:
- `http://localhost:3000` (development frontend)
- `https://yourdomain.com` (production frontend)

Required headers:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Authentication

For the MVP, use simple token-based authentication:
- Tokens are returned from `/api/auth/login`
- Include token in `Authorization: Bearer {token}` header
- No token refresh required for MVP
- Tokens can be simple strings (no JWT validation needed)

## Rate Limiting

Consider implementing basic rate limiting:
- Hold claims: 1 per minute per user
- Watchlist operations: 10 per minute per user
- General API calls: 100 per minute per user

## Mock Data Requirements

For development and testing, provide realistic mock data:
- At least 5 different courses
- 3-5 sections per course
- Varied seat availability (some full, some available)
- Realistic course names and codes
- Proper datetime formatting

## Testing Endpoints

Provide these endpoints for frontend testing:
- `GET /api/test/seed` - Populate with test data
- `GET /api/test/clear` - Clear all data
- `POST /api/test/trigger-event` - Manually trigger SSE events

## Frontend Technology Stack

### Core Technologies
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling with custom component classes
- **React Router** for client-side routing

### Design System
- **LinkedIn-inspired UI** with professional aesthetics
- **Custom CSS Components** for consistent styling
- **Responsive Design** with mobile-first approach
- **Accessibility** following WCAG 2.1 AA guidelines

### Environment Variables
The frontend requires these environment variables:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# OpenAI Configuration for AI Chat Feature
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4
VITE_OPENAI_MAX_TOKENS=1000
VITE_OPENAI_TEMPERATURE=0.7

# Development Settings
VITE_DEV_MODE=true
```

### Development Setup
1. Install dependencies: `npm install`
2. Copy environment file: `cp env.example .env`
3. Configure environment variables
4. Start development server: `npm run dev`
5. Access application at `http://localhost:3000`

## Priority Implementation for Mock Data Replacement

### High Priority (Required to replace frontend mock data)

#### 1. Course Discovery API (`/api/courses`)
**Current Status**: ❌ Missing - Frontend uses `mockCourses` array
**Required Endpoints**:
- `GET /api/courses/discover` - Get courses with enhanced details for discovery page
- `GET /api/courses/{id}/details` - Get detailed course information
- `GET /api/courses` - Get all available courses
- `GET /api/courses/search?q={query}` - Search courses

**Data Model Updates Needed**:
```typescript
interface CourseDetails {
  id: string;
  name: string;
  code: string;
  description: string;
  professor: string;
  professorRating?: number;
  courseRating?: number;
  time: string;
  days: string[];
  location: string;
  credits: number;
  prerequisites?: string[];
  enrolled: number;
  capacity: number;
  tags: string[];
}
```

#### 2. User Profile API (`/api/user`)
**Current Status**: ❌ Missing - Frontend uses `mockUserProfile` object
**Required Endpoints**:
- `GET /api/user/profile` - Get user profile information
- `PUT /api/user/profile` - Update user profile information
- `PUT /api/user/preferences` - Update user preferences

**Data Model Updates Needed**:
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  school: string;
  year: string;
  major: string;
  minor?: string;
  gpa?: number;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
    language: string;
  };
}
```

#### 3. Calendar/Schedule API (`/api/calendar`)
**Current Status**: ❌ Missing - Frontend uses `mockEnrolledCourses` array
**Required Endpoints**:
- `GET /api/user/schedule` - Get user's enrolled courses and schedule
- `POST /api/user/schedule/enroll` - Enroll in a course

**Data Model Updates Needed**:
```typescript
interface EnrolledCourse {
  id: string;
  name: string;
  code: string;
  professor: string;
  color: string;
  schedule: {
    day: number;
    startTime: string;
    endTime: string;
    type: 'lecture' | 'tutorial' | 'lab';
    location: string;
  }[];
}
```

### Medium Priority (Enhance existing functionality)

#### 4. Sections API Updates
**Current Status**: ✅ Partially implemented - Backend has basic endpoints
**Required Updates**:
- Update response format to match frontend expectations
- Add proper error handling and validation
- Ensure snake_case to camelCase transformation

#### 5. AI Chat Integration
**Current Status**: ❌ Missing - Frontend uses mock AI responses
**Required Endpoints**:
- `POST /api/chat/messages` - Send message to AI assistant

### Low Priority (Nice to have)

#### 6. Testing Endpoints
**Required Endpoints**:
- `GET /api/test/seed` - Populate with test data
- `GET /api/test/clear` - Clear all data
- `POST /api/test/trigger-event` - Manually trigger SSE events

## Data Model Consistency Issues

### Backend vs Frontend Naming Convention
**Issue**: Backend uses snake_case, frontend expects camelCase
**Solution**: Either update backend to use camelCase or add transformation layer

**Backend (snake_case)**:
```python
class Section(BaseModel):
    course_id: str
    time_slot: str
    available_seats: int
    total_capacity: int
    last_updated: datetime
```

**Frontend (camelCase)**:
```typescript
interface Section {
  courseId: string;
  timeSlot: string;
  availableSeats: number;
  totalCapacity: number;
  lastUpdated: string;
}
```

### Recommended Approach
1. **Keep backend snake_case** (Python convention)
2. **Add transformation layer** in frontend API service
3. **Update shared types** to include both formats
4. **Add transformation functions** for data conversion

## Implementation Timeline

### Phase 1: Core Data APIs (Week 1)
- [ ] Course Discovery API (`/api/courses`)
- [ ] User Profile API (`/api/user`)
- [ ] Calendar/Schedule API (`/api/calendar`)

### Phase 2: Data Integration (Week 2)
- [ ] Update frontend to use real APIs
- [ ] Add data transformation layer
- [ ] Implement error handling and loading states

### Phase 3: Enhancement (Week 3)
- [ ] AI Chat integration
- [ ] Testing endpoints
- [ ] Performance optimization

## Notes

- All datetime fields must be in ISO 8601 format
- All text content must be in English
- The frontend expects immediate responses (no long polling)
- SSE connection should be resilient to network issues
- Consider implementing connection retry logic on the frontend
- AI Chat feature currently uses mock responses (integrate OpenAI API for production)
- Frontend uses LinkedIn-style premium design with professional aesthetics
