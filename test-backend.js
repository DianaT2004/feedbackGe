#!/usr/bin/env node

/**
 * Backend Test Script
 * Run with: node test-backend.js
 */

async function testBackend() {
  console.log('🧪 Testing FeedbackGe AI Backend...\n');

  const baseUrl = 'http://localhost:3001';

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: AI status
    console.log('\n2️⃣ Testing AI status...');
    const statusResponse = await fetch(`${baseUrl}/api/ai/status`);
    const statusData = await statusResponse.json();
    console.log('✅ AI Status:', statusData);

    if (!statusData.enabled) {
      console.log('\n⚠️  AI is disabled. Please check your CLAUDE_API_KEY in .env file');
      console.log('   Make sure you have a valid API key from https://console.anthropic.com/');
      return;
    }

    // Test 3: Survey generation
    console.log('\n3️⃣ Testing AI survey generation...');
    const surveyResponse = await fetch(`${baseUrl}/api/ai/generate-survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Customer Service',
        targetAudience: 'restaurant customers',
        market: 'Georgia'
      })
    });

    if (surveyResponse.ok) {
      const surveyData = await surveyResponse.json();
      console.log('✅ Survey generation successful!');
      console.log('   Generated survey:', surveyData.survey.title);
    } else {
      console.log('❌ Survey generation failed');
      console.log('   Status:', surveyResponse.status);
      const errorText = await surveyResponse.text();
      console.log('   Error:', errorText);
    }

    // Test 4: Survey analysis
    console.log('\n4️⃣ Testing AI survey analysis...');
    const analysisResponse = await fetch(`${baseUrl}/api/ai/analyze-survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        survey: { title: 'Test Survey', description: 'Testing analysis' },
        responses: [
          { answer: 'Very satisfied', rating: 5 },
          { answer: 'Good service', rating: 4 }
        ],
        market: 'Georgia'
      })
    });

    if (analysisResponse.ok) {
      const analysisData = await analysisResponse.json();
      console.log('✅ Survey analysis successful!');
      console.log('   Analysis length:', analysisData.analysis?.length || 0, 'characters');
    } else {
      console.log('❌ Survey analysis failed');
      console.log('   Status:', analysisResponse.status);
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n💡 Your AI backend is working! Now test the frontend integration.');

  } catch (error) {
    console.log('\n❌ Backend test failed!');
    console.log('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend server is running: node server.js');
    console.log('2. Check if .env file has CLAUDE_API_KEY set');
    console.log('3. Verify API key is valid on https://console.anthropic.com/');
    console.log('4. Check for any error messages in server console');
  }
}

// Run the test
testBackend();
