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
    model: 'claude-3-haiku-20240307',
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
      model: 'claude-3-haiku-20240307',
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
      analysis: 'AI analysis is currently unavailable. Basic analytics are still available in the Analytics tab.',
      insights: [],
      recommendations: []
    });
  }

  try {
    const { survey, responses, market } = req.body;

    console.log('Calling Claude API for survey analysis...');
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Analyze this survey data and provide comprehensive insights with actionable recommendations.
Survey Title: ${survey.title}
Survey Description: ${survey.description}
Number of Responses: ${responses.length}
Market: ${market || 'Georgia'}

Sample responses: ${JSON.stringify(responses.slice(0, 5))}

Provide a detailed analysis including:
1. Key findings and trends
2. Sentiment analysis (positive/neutral/negative breakdown)
3. Demographic insights if available
4. Regional patterns for Georgia market
5. Specific recommendations for improvement
6. Potential business actions

Format as structured JSON with these keys: analysis, insights[], recommendations[], alerts[]`
      }]
    });

    console.log('Claude API analysis response received');
    const responseText = message.content[0].text;

    try {
      const parsedResponse = JSON.parse(responseText);
      res.json(parsedResponse);
    } catch (parseError) {
      // Fallback to text response
      res.json({
        analysis: responseText,
        insights: [],
        recommendations: [],
        alerts: []
      });
    }
  } catch (error) {
    console.error('AI Analysis failed:', error);
    res.status(500).json({
      error: 'AI analysis error',
      analysis: 'AI analysis is currently unavailable. Basic analytics are still available in the Analytics tab.',
      insights: [],
      recommendations: [],
      alerts: []
    });
  }
});

// AI Insights endpoint
app.post('/api/ai/insights', async (req, res) => {
  console.log('AI Insights requested');

  if (!anthropic) {
    return res.json({
      insights: [],
      alerts: []
    });
  }

  try {
    const { surveyData, timeRange, market } = req.body;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Generate AI insights and alerts for this survey data.
Market: ${market || 'Georgia'}
Time Range: ${timeRange || 'Last 30 days'}

Survey Performance Data: ${JSON.stringify(surveyData)}

Generate insights about:
1. Performance trends
2. Regional differences
3. Sentiment changes
4. Key issues or opportunities

Also generate alerts for:
- Significant rating drops
- Negative feedback spikes
- Regional performance issues

Format as JSON with insights[] and alerts[] arrays.`
      }]
    });

    const responseText = message.content[0].text;
    try {
      const parsedResponse = JSON.parse(responseText);
      res.json(parsedResponse);
    } catch (parseError) {
      res.json({
        insights: [],
        alerts: []
      });
    }
  } catch (error) {
    console.error('AI Insights failed:', error);
    res.status(500).json({
      insights: [],
      alerts: []
    });
  }
});

// Import Questions endpoint
app.post('/api/ai/import-questions', async (req, res) => {
  console.log('AI Import Questions requested');

  if (!anthropic) {
    return res.json({
      questions: [],
      message: 'AI features are currently unavailable'
    });
  }

  try {
    const { fileContent, fileType, surveyTopic } = req.body;

    console.log('Processing file content for survey questions...');
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Analyze this document and extract/create survey questions for a survey about "${surveyTopic || 'general topic'}".
Document content: ${fileContent.substring(0, 2000)}

Please create 5-8 relevant survey questions based on the content. Format as JSON array with objects containing:
- question: the question text
- type: "multiple_choice", "rating", "text", or "yes_no"
- options: array of options (for multiple choice) or ["1-5 scale"] for rating

Focus on the key themes and information from the document.`
      }]
    });

    const responseText = message.content[0].text;
    try {
      const questions = JSON.parse(responseText);
      res.json({
        questions: Array.isArray(questions) ? questions : [],
        message: 'Questions generated successfully from document'
      });
    } catch (parseError) {
      res.json({
        questions: [],
        message: 'Could not parse AI response, but processing completed'
      });
    }
  } catch (error) {
    console.error('AI Import Questions failed:', error);
    res.status(500).json({
      questions: [],
      message: 'Failed to process document'
    });
  }
});

// AI Recommendations endpoint
app.post('/api/ai/recommendations', async (req, res) => {
  console.log('AI Recommendations requested');

  if (!anthropic) {
    return res.json({
      recommendations: []
    });
  }

  try {
    const { survey, responses, market, previousData } = req.body;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: `Generate actionable business recommendations based on this survey data.

Survey: ${JSON.stringify(survey)}
Responses: ${JSON.stringify(responses.slice(0, 10))}
Market: ${market || 'Georgia'}
Previous Data: ${JSON.stringify(previousData || {})}

Provide specific, actionable recommendations such as:
1. Service improvements
2. Pricing adjustments
3. Marketing strategies
4. Operational changes
5. Customer experience enhancements

Focus on Georgia market context and make recommendations measurable and time-bound.

Format as JSON array of recommendation objects with: title, description, priority, timeframe, expectedImpact`
      }]
    });

    const responseText = message.content[0].text;
    try {
      const recommendations = JSON.parse(responseText);
      res.json({ recommendations });
    } catch (parseError) {
      res.json({
        recommendations: []
      });
    }
  } catch (error) {
    console.error('AI Recommendations failed:', error);
    res.status(500).json({
      recommendations: []
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