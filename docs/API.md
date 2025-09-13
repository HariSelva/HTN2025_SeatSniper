# HTN2025 API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
The API uses simple development authentication. Include the user ID in requests where needed.

## Endpoints

### Authentication
- `POST /api/auth/login` - Development login
- `POST /api/auth/logout` - Logout

### Sections
- `GET /api/sections` - Get all sections
- `GET /api/sections/{course_id}` - Get sections for a specific course

### Watchlist
- `GET /api/watchlist/{user_id}` - Get user's watchlist
- `POST /api/watchlist` - Add section to watchlist
- `DELETE /api/watchlist/{user_id}/{section_id}` - Remove section from watchlist

### Holds
- `GET /api/holds/{user_id}` - Get user's active holds
- `POST /api/holds` - Claim a 2-minute hold
- `DELETE /api/holds/{user_id}/{section_id}` - Release a hold

### Real-time Updates
- `GET /api/stream` - Server-Sent Events stream

### Tasks
- `POST /tasks/scrape` - Trigger manual data scrape

## Data Models

### Section
```json
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
  "last_updated": "datetime"
}
```

### WatchlistItem
```json
{
  "user_id": "string",
  "section_id": "string",
  "added_at": "datetime"
}
```

### Hold
```json
{
  "user_id": "string",
  "section_id": "string",
  "claimed_at": "datetime",
  "expires_at": "datetime"
}
```
