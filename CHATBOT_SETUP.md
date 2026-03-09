# Chatbot API Setup Guide

## Overview
A new AI-powered chatbot module has been created for your Event Management Server. It integrates with OpenAI's GPT-3.5-turbo model to provide customer support through conversational threads.

## Created Files
- `src/app/modules/chatbot/chatbot.interfaces.ts` - TypeScript interfaces
- `src/app/modules/chatbot/chatbot.model.ts` - Mongoose schema for conversations
- `src/app/modules/chatbot/chatbot.validation.ts` - Zod validation schemas
- `src/app/modules/chatbot/chatbot.services.ts` - Business logic & OpenAI integration
- `src/app/modules/chatbot/chatbot.controllers.ts` - Request handlers
- `src/app/modules/chatbot/chatbot.routes.ts` - Express routes
- `src/app/router/index.ts` - Updated with chatbot routes

## Installation Steps

### 1. Install Required Dependencies
Run in your project terminal:
```bash
npm install openai uuid
npm install --save-dev @types/uuid
```

### 2. Update Environment Variables
Add these to your `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from: https://platform.openai.com/account/api-keys

### 3. Verify Installation
Run `npm run dev` to start your server. The chatbot routes should now be available.

## API Endpoints

### 1. Send Message (Start or Continue Conversation)
- **POST** `/api/v1/chatbot/send`
- **Auth**: Required (user, host, admin)
- **Body**:
```json
{
  "message": "What events do you have?",
  "threadId": "optional-uuid-for-continuing-conversation",
  "title": "optional-conversation-title"
}
```
- **Response**: New message with threadId and AI reply

### 2. Get Specific Conversation
- **GET** `/api/v1/chatbot/threads/:threadId`
- **Auth**: Required
- **Response**: Full conversation with all messages

### 3. List All Conversations
- **GET** `/api/v1/chatbot?limit=10&skip=0`
- **Auth**: Required
- **Response**: Array of user's conversations with pagination

### 4. Delete Conversation
- **DELETE** `/api/v1/chatbot/threads/:threadId`
- **Auth**: Required
- **Response**: Success message

## Feature Details

### Multiple Conversation Threads
- Users can start new conversations or continue existing ones
- Each conversation has a unique `threadId`
- Full message history is maintained for context awareness

### AI Integration
- Uses OpenAI's GPT-3.5-turbo model
- System prompt configured for customer support focus
- Maintains conversation context for natural interactions
- Max 500 tokens per response for efficiency

### User Context
- Each conversation is isolated to the authenticated user
- Cannot access other users' conversations
- Works for user, host, and admin roles

## Example Usage (cURL)

```bash
# Start new conversation
curl -X POST http://localhost:3000/api/v1/chatbot/send \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your_jwt_token" \
  -d '{"message": "How do I book an event?"}'

# Continue conversation (use threadId from response)
curl -X POST http://localhost:3000/api/v1/chatbot/send \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your_jwt_token" \
  -d '{"message": "Tell me more", "threadId": "uuid-from-previous-response"}'

# List all conversations
curl -X GET http://localhost:3000/api/v1/chatbot \
  -H "Cookie: accessToken=your_jwt_token"
```

## Database Schema
Conversations are stored in MongoDB with this structure:
- `userId`: User's ID
- `threadId`: Unique conversation identifier
- `title`: Conversation title (auto-generated from first message)
- `messages`: Array of message objects
  - `role`: "user" or "assistant"
  - `content`: Message text
  - `timestamp`: Message timestamp
- `createdAt`/`updatedAt`: Automatic timestamps

## Customization Options

### Change AI Model
Edit `chatbot.services.ts`, line ~50:
```typescript
model: "gpt-4",  // or "gpt-3.5-turbo", "gpt-4-turbo", etc.
```

### Modify System Prompt
Edit the `SYSTEM_PROMPT` variable in `chatbot.services.ts` to change AI behavior:
```typescript
const SYSTEM_PROMPT = `Your custom instructions here...`;
```

### Adjust Response Parameters
In `chatbot.services.ts`, modify:
```typescript
temperature: 0.7,      // 0-1, higher = more creative
max_tokens: 500,       // Response length limit
```

## Error Handling
The chatbot follows your project's error handling pattern:
- Invalid API key → 500 Internal Server Error
- Missing thread → 404 Not Found
- Invalid message → 400 Bad Request
- Unauthorized access → 401 Unauthorized

## Next Steps
1. Install dependencies: `npm install openai uuid`
2. Add `OPENAI_API_KEY` to `.env`
3. Restart dev server: `npm run dev`
4. Test endpoints using the cURL examples or Postman
5. Customize the system prompt for your specific use case
