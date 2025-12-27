# 🤖 FeedbackGe AI Backend Setup

This guide will help you set up the AI backend for Claude integration in your FeedbackGe platform.

## 📋 Prerequisites

- Node.js 16+ installed
- Claude API key from [Anthropic Console](https://console.anthropic.com/)
- Basic understanding of terminal commands

## 🚀 Quick Setup

### Step 1: Run Setup Script
```bash
node setup-ai-backend.js
```

This script will:
- Create `.env` file if it doesn't exist
- Install required dependencies
- Guide you through configuration

### Step 2: Configure API Key
1. Open the created `.env` file
2. Replace `your-claude-api-key-here` with your actual Claude API key
3. Save the file

```env
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
PORT=3001
```

### Step 3: Start the Server
```bash
node server.js
```

You should see:
```
🚀 FeedbackGe AI Backend Server running on port 3001
📊 AI Status: ENABLED
🔗 Health check: http://localhost:3001/health
🤖 AI Status: http://localhost:3001/api/ai/status
```

### Step 4: Test the Backend
```bash
node test-backend.js
```

## 🧪 Manual Testing

### Health Check
```bash
curl http://localhost:3001/health
# Expected: {"status":"OK","timestamp":"2024-...","ai_enabled":true}
```

### AI Status
```bash
curl http://localhost:3001/api/ai/status
# Expected: {"enabled":true,"model":"claude-3-sonnet-20240229"}
```

### Survey Generation
```bash
curl -X POST http://localhost:3001/api/ai/generate-survey \
  -H "Content-Type: application/json" \
  -d '{"topic":"Customer Service","targetAudience":"restaurant customers","market":"Georgia"}'
```

### Survey Analysis
```bash
curl -X POST http://localhost:3001/api/ai/analyze-survey \
  -H "Content-Type: application/json" \
  -d '{
    "survey": {"title":"Test Survey","description":"Testing"},
    "responses": [{"answer":"Good","rating":4}],
    "market": "Georgia"
  }'
```

## 🔧 API Endpoints

### GET `/health`
Health check endpoint
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "ai_enabled": true
}
```

### GET `/api/ai/status`
AI service status
```json
{
  "enabled": true,
  "model": "claude-3-sonnet-20240229",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST `/api/ai/generate-survey`
Generate AI-powered surveys
```json
// Request
{
  "topic": "Customer Service",
  "targetAudience": "restaurant customers",
  "market": "Georgia",
  "language": "Georgian"
}

// Response
{
  "survey": {
    "title": "Customer Service Survey",
    "description": "Help us improve our service",
    "questions": [
      {
        "id": 1,
        "type": "rating",
        "question": "How satisfied are you?",
        "options": ["1-5 scale"]
      }
    ]
  }
}
```

### POST `/api/ai/analyze-survey`
AI-powered survey analysis
```json
// Request
{
  "survey": {
    "title": "Customer Service Survey",
    "description": "Service quality assessment"
  },
  "responses": [
    {"answer": "Very satisfied", "rating": 5},
    {"answer": "Good service", "rating": 4}
  ],
  "market": "Georgia"
}

// Response
{
  "analysis": "Based on the survey responses, customers show high satisfaction levels..."
}
```

## 🔒 Security & Configuration

### Environment Variables
- `CLAUDE_API_KEY`: Your Anthropic API key (never commit this!)
- `PORT`: Server port (default: 3001)

### Security Best Practices
- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor API usage and costs

## 🐛 Troubleshooting

### "AI Status: DISABLED"
- Check if `CLAUDE_API_KEY` is set in `.env`
- Verify API key format: `sk-ant-api03-...`
- Check API key validity on Anthropic console

### "Connection refused"
- Ensure backend server is running: `node server.js`
- Check if port 3001 is available
- Verify firewall settings

### "Invalid API key"
- Double-check API key spelling
- Ensure no extra spaces or characters
- Verify API key is active on Anthropic console

### Claude API Errors
- Check your Anthropic account billing
- Verify API usage limits
- Try regenerating API key if issues persist

## 📊 Monitoring

### Server Logs
The server provides detailed console logging:
- Server startup status
- API key configuration
- Request/response logging
- Error details

### Health Monitoring
- Use `/health` endpoint for uptime monitoring
- Check `/api/ai/status` for AI service availability
- Monitor server console for issues

## 🚀 Production Deployment

### Environment Setup
```bash
# Production .env
CLAUDE_API_KEY=sk-ant-api03-your-production-key
PORT=3001
NODE_ENV=production
```

### Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name feedbackge-ai
pm2 save
pm2 startup
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

## 📞 Support

If you encounter issues:

1. Check server console logs
2. Run `node test-backend.js` for diagnostics
3. Verify API key configuration
4. Check Anthropic console for API status

## 🎯 Features Overview

### AI Survey Generation
- Intelligent question creation based on topic and audience
- Context-aware survey structure
- Multi-language support
- Fallback to basic surveys if AI unavailable

### AI Data Analysis
- Automated insights from survey responses
- Trend identification and pattern recognition
- Actionable recommendations
- Market-specific analysis for Georgia

### Robust Error Handling
- Graceful fallbacks when AI is unavailable
- Comprehensive error logging
- User-friendly error messages
- Automatic retry mechanisms

---

**🎉 Your AI backend is ready! Integrate it with your frontend and unlock powerful AI features for your users.**
