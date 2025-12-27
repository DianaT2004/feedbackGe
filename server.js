// FeedbackGe AI Backend Server
// Run with: node server.js

import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Check if Claude API key is available
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
console.log('Claude API Key configured:', CLAUDE_API_KEY ? 'Yes' : 'No');

// Initialize Claude client
let anthropic = null;
if (CLAUDE_API_KEY) {
  try {
    anthropic = new Anthropic({
      apiKey: CLAUDE_API_KEY,
    });
    console.log('Claude AI client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Claude client:', error);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    ai_enabled: !!anthropic
  });
});

// AI Status endpoint
app.get('/api/ai/status', (req, res) => {
  console.log('AI Status check requested');
  res.json({
    enabled: !!anthropic,
    model: 'claude-3-sonnet-20240229',
    timestamp: new Date().toISOString()
  });
});

// Survey generation endpoint
app.post('/api/ai/generate-survey', async (req, res) => {
  console.log('AI Survey generation requested:', req.body);

  if (!anthropic) {
    console.log('Claude not available, returning fallback');
    return res.json({
      survey: {
        title: `${req.body.topic || 'Customer'} Survey`,
        description: `Please help us understand ${req.body.topic?.toLowerCase() || 'your experience'} by answering these questions.`,
        questions: [
          {
            id: 1,
            type: 'rating',
            question: `How satisfied are you with ${req.body.topic?.toLowerCase() || 'our service'}?`,
            options: ['1-5 scale']
          },
          {
            id: 2,
            type: 'text',
            question: 'What improvements would you suggest?',
            options: []
          }
        ]
      }
    });
  }

  try {
    const { topic, targetAudience, market, language } = req.body;

    console.log('Calling Claude API for survey generation...');
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Generate a professional survey about "${topic}" for ${targetAudience} in ${market || 'Georgia'}.
Include 5-7 relevant questions with appropriate question types (multiple choice, rating scale, open-ended).
Format as JSON with title, description, and questions array.
Each question should have: id, type, question, options.

Example format:
{
  "title": "Customer Satisfaction Survey",
  "description": "Help us improve our services",
  "questions": [
    {
      "id": 1,
      "type": "rating",
      "question": "How satisfied are you?",
      "options": ["1-5 scale"]
    }
  ]
}`
      }]
    });

    console.log('Claude API response received');
    const responseText = message.content[0].text;
    console.log('Raw response:', responseText);

    try {
      const survey = JSON.parse(responseText);
      console.log('Parsed survey successfully');
      res.json({ survey });
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const survey = JSON.parse(jsonMatch[0]);
          console.log('Extracted and parsed JSON successfully');
          res.json({ survey });
        } catch (extractError) {
          console.error('Failed to extract JSON:', extractError);
          throw new Error('Invalid JSON response from Claude');
        }
      } else {
        throw new Error('No JSON found in Claude response');
      }
    }
  } catch (error) {
    console.error('AI Survey generation failed:', error);
    res.status(500).json({
      error: 'AI service error',
      survey: {
        title: `${req.body.topic || 'Customer'} Survey`,
        description: `Please help us understand ${req.body.topic?.toLowerCase() || 'your experience'} by answering these questions.`,
        questions: [
          {
            id: 1,
            type: 'rating',
            question: `How satisfied are you with ${req.body.topic?.toLowerCase() || 'our service'}?`,
            options: ['1-5 scale']
          },
          {
            id: 2,
            type: 'text',
            question: 'What improvements would you suggest?',
            options: []
          }
        ]
      }
    });
  }
});

// Survey analysis endpoint
app.post('/api/ai/analyze-survey', async (req, res) => {
  console.log('AI Survey analysis requested');

  if (!anthropic) {
    console.log('Claude not available, returning basic analysis');
    return res.json({
      analysis: 'AI analysis is currently unavailable. Basic analytics are still available in the Analytics tab.'
    });
  }

  try {
    const { survey, responses, market } = req.body;

    console.log('Calling Claude API for survey analysis...');
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Analyze this survey data and provide 3 key insights with actionable recommendations.
Survey Title: ${survey.title}
Survey Description: ${survey.description}
Number of Responses: ${responses.length}
Market: ${market || 'Georgia'}

Sample responses: ${JSON.stringify(responses.slice(0, 5))}

Provide insights in a clear, actionable format. Focus on:
1. Key findings
2. Trends or patterns
3. Recommendations for improvement
4. Market-specific insights

Format as clear, readable text.`
      }]
    });

    console.log('Claude API analysis response received');
    res.json({
      analysis: message.content[0].text
    });
  } catch (error) {
    console.error('AI Analysis failed:', error);
    res.status(500).json({
      error: 'AI analysis error',
      analysis: 'AI analysis is currently unavailable. Basic analytics are still available in the Analytics tab.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FeedbackGe AI Backend Server running on port ${PORT}`);
  console.log(`📊 AI Status: ${anthropic ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Status: http://localhost:${PORT}/api/ai/status`);
});