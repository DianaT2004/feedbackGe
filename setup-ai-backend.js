#!/usr/bin/env node

/**
 * FeedbackGe AI Backend Setup Script
 * Run with: node setup-ai-backend.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up FeedbackGe AI Backend...\n');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
const hasEnv = fs.existsSync(envPath);

if (!hasEnv) {
  console.log('📝 Creating .env file...');
  const envTemplate = `# Claude AI API Key
# Get your key from: https://console.anthropic.com/
CLAUDE_API_KEY=your-claude-api-key-here

# Server Configuration
PORT=3001
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file - Please add your Claude API key!');
  console.log('🔑 Get your API key from: https://console.anthropic.com/\n');
}

// Check if package.json has backend dependencies
const packagePath = path.join(process.cwd(), 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (error) {
  console.log('❌ Could not read package.json');
  process.exit(1);
}

// Check for required dependencies
const requiredDeps = ['@anthropic-ai/sdk', 'cors', 'dotenv', 'express'];
const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);

if (missingDeps.length > 0) {
  console.log('📦 Installing missing dependencies...');
  try {
    execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed!\n');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    console.log('Try running: npm install @anthropic-ai/sdk cors dotenv express');
    process.exit(1);
  }
} else {
  console.log('✅ All dependencies are installed\n');
}

// Check .env configuration
console.log('🔍 Checking configuration...');
const envContent = fs.readFileSync(envPath, 'utf8');
const hasApiKey = envContent.includes('CLAUDE_API_KEY=') &&
                 !envContent.includes('CLAUDE_API_KEY=your-claude-api-key-here');

if (hasApiKey) {
  console.log('✅ Claude API key is configured');
} else {
  console.log('⚠️  Claude API key not configured yet');
  console.log('   Please edit .env file and add your real API key\n');
}

// Final instructions
console.log('🎯 Setup Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Add your Claude API key to .env file');
console.log('2. Run: node server.js');
console.log('3. Test: curl http://localhost:3001/api/ai/status');
console.log('4. Open frontend: http://localhost:5185/');
console.log('\n🔗 Useful URLs:');
console.log('- Frontend: http://localhost:5185/');
console.log('- Backend: http://localhost:3001/');
console.log('- AI Status: http://localhost:3001/api/ai/status');
console.log('- Claude Console: https://console.anthropic.com/');
console.log('\n🚀 Happy coding!');
