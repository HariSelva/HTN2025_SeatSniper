# Frontend Requirements for Backend Team

## Overview
This document outlines the complete API requirements for the HTN2025 frontend application. The frontend is a React/TypeScript application that provides course section monitoring, watchlist management, and hold claiming functionality.

## Core Requirements
- All API responses must be in English [[memory:7455817]]
- All endpoints must support CORS for localhost:3000 (frontend)
- All responses must follow the `ApiResponse<T>` wrapper format
- Authentication uses simple dev tokens (JWT not required for MVP)

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

### 1. Authentication (`/api/auth`)

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

### 2. Courses (`/api/courses`)

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

### 3. Sections (`/api/sections`)

#### GET `/api/sections/course/{courseId}`
**Purpose**: Get all sections for a specific course
**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "courseId": "string",
      "title": "string",
      "instructor": "string",
      "timeSlot": "string",
      "days": ["string"],
      "availableSeats": 0,
      "totalCapacity": 0,
      "location": "string",
      "lastUpdated": "string"
    }
  ],
  "success": true
}
```

#### GET `/api/sections/{sectionId}`
**Purpose**: Get specific section details
**Response**:
```json
{
  "data": {
    "id": "string",
    "courseId": "string",
    "title": "string",
    "instructor": "string",
    "timeSlot": "string",
    "days": ["string"],
    "availableSeats": 0,
    "totalCapacity": 0,
    "location": "string",
    "lastUpdated": "string"
  },
  "success": true
}
```

### 4. Watchlist (`/api/watchlist`)

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

### 5. Holds (`/api/holds`)

#### GET `/api/holds/{userId}`
**Purpose**: Get user's active holds
**Response**:
```json
{
  "data": [
    {
      "userId": "string",
      "sectionId": "string",
      "claimedAt": "string",
      "expiresAt": "string"
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
    "claimedAt": "string",
    "expiresAt": "string"
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

### 6. Server-Sent Events (`/api/stream`)

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

## Notes

- All datetime fields must be in ISO 8601 format
- All text content must be in English
- The frontend expects immediate responses (no long polling)
- SSE connection should be resilient to network issues
- Consider implementing connection retry logic on the frontend
