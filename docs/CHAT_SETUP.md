# GPT-5 Integration Setup Guide

This guide explains how to set up and use the new GPT-5 powered chat functionality in the HTN2025 application.

## Features

The new chat system provides:

1. **Database-First Search**: AI searches the internal database for course information first
2. **Web Search Fallback**: If database results are insufficient, searches the web and marks sources
3. **Course Recommendations**: AI provides personalized course suggestions based on goals and time constraints
4. **Source Tracking**: All web sources are clearly marked with links and timestamps
5. **Conversation Memory**: Maintains conversation history across sessions

## API Keys Required

Add these environment variables to your `.env` file:

```bash
# Required for GPT-5 integration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: For web search functionality
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_google_search_engine_id_here
SERPAPI_KEY=your_serpapi_key_here
```

## Backend Setup

### 1. Install Dependencies

The following dependencies have been added to `requirements.txt`:
- `openai==1.3.0` - For GPT-5 integration

### 2. New API Endpoints

The chat router provides these endpoints:

- `POST /api/chat/chat` - Send a message to the AI
- `GET /api/chat/conversation/{conversation_id}` - Get conversation history
- `DELETE /api/chat/conversation/{conversation_id}` - Clear conversation
- `POST /api/chat/recommend-courses` - Get detailed course recommendations

### 3. Services Architecture

The backend includes these new services:

- **ChatService**: Manages GPT-5 integration and conversation memory
- **DatabaseSearchService**: Searches internal course data, intel, and syllabi
- **WebSearchService**: Performs web searches with source tracking
- **CourseRecommendationService**: Generates personalized course recommendations

## Frontend Integration

### 1. Updated Components

The `ChatWithAIPage` component now:
- Uses real GPT-5 API instead of mock responses
- Displays web sources with clickable links
- Shows course recommendations with match scores
- Maintains conversation state
- Provides clear conversation functionality

### 2. New Message Types

Messages now support:
- **Web Sources**: Links to external resources with snippets
- **Course Recommendations**: Structured course suggestions with rationale
- **Search Information**: Metadata about database vs web search results

## Usage Examples

### Basic Chat
```typescript
// User asks a question
const response = await chatApi.sendMessage("What are the prerequisites for CS201?");
```

### Course Recommendations
```typescript
// Get personalized recommendations
const recommendations = await chatApi.recommendCourses(
  ["Learn web development", "Build portfolio projects"],
  { semester: "fall", schedulePreference: "morning" },
  "undergraduate",
  ["computer science", "web development"]
);
```

## AI Capabilities

The AI assistant can:

1. **Search Database First**: 
   - Course intelligence data
   - Syllabus information
   - Reddit discussions about courses
   - Section availability

2. **Web Search When Needed**:
   - General course information
   - University policies
   - Academic planning resources
   - Career guidance

3. **Provide Recommendations**:
   - Based on academic goals
   - Considering time constraints
   - Matching interests and level
   - Suggesting optimal scheduling

## Source Attribution

All web sources are clearly marked with:
- 🔗 Clickable links
- 📝 Source snippets
- 🌐 Domain information
- ⏰ Search timestamps

## Conversation Management

- Each conversation has a unique ID
- History is stored in MongoDB
- Users can clear conversations
- Context is maintained across messages

## Error Handling

The system gracefully handles:
- API failures with fallback responses
- Missing API keys with mock data
- Network timeouts
- Invalid responses

## Testing

To test the integration:

1. Start the backend server
2. Navigate to the Chat page
3. Try these sample queries:
   - "Recommend courses for computer science"
   - "What are the prerequisites for MATH101?"
   - "Help me plan my fall schedule"
   - "Find courses that fit morning schedule"

## Security Considerations

- API keys are stored as environment variables
- User conversations are isolated by user ID
- Web search results are sanitized
- No sensitive data is logged

## Performance

- Database search is prioritized for speed
- Web search only triggers when needed
- Conversation history is limited to recent messages
- Responses are cached when appropriate

## Future Enhancements

Potential improvements:
- Integration with calendar systems
- Real-time course availability
- Professor ratings integration
- Academic pathway planning
- Graduation requirement tracking
