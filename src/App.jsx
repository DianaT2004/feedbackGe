import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { TrendingUp, Award, Zap, Target, Users, Brain, ChevronRight, Star, MapPin, Clock, Coins, Gift, Trophy, Sparkles, ArrowRight, Eye, CheckCircle, AlertCircle, BarChart3, MessageSquare, Send, Crown, Diamond, Shield, Bell, Settings, LogOut, Plus, Minus, Heart, ThumbsUp, Share, Copy, Download, Upload, Camera, Mic, Video, Phone, Mail, Calendar, Bookmark, Filter, Search, Menu, X, Home, User, CreditCard, Wallet, Banknote, PiggyBank, TrendingDown, Activity, Layers, Layout, Grid, Maximize2, Minimize2, RotateCcw, Play, Pause, Volume2, VolumeX, Wifi, WifiOff, Battery, BatteryLow, Sun, Moon, Cloud, CloudRain, Zap as Lightning, Building2, FileText, HelpCircle, List, CheckSquare, Edit, DollarSign, Lightbulb } from 'lucide-react';
import Anthropic from '@anthropic-ai/sdk';

function App() {
  // Core navigation state
  const [currentView, setCurrentView] = useState('landing');
  const [userType, setUserType] = useState(null);

  // Claude AI Integration (Backend API)
  const [aiEnabled, setAiEnabled] = useState(true); // Platform-level AI availability
  const [fullAIAnalysis, setFullAIAnalysis] = useState(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  // AI Capabilities & Features Configuration
  const aiCapabilities = {
    overview: {
      role: "Intelligent assistant for companies to design better surveys, analyze responses, and extract actionable business insights automatically",
      goal: "Reduce manual analysis and help companies make faster, data-driven decisions"
    },
    features: {
      surveyBuilder: {
        name: "AI Survey Builder",
        capabilities: [
          "Automatically generates survey questions based on survey goal, industry type, and target audience",
          "Suggests optimal question types (scale, multiple choice, open-ended)",
          "Suggests optimal question order and clear, unbiased wording",
          "Helps avoid leading questions, redundant or unclear questions"
        ],
        benefits: ["Faster survey creation with higher-quality data"],
        apiEndpoint: "/api/ai/generate-survey"
      },
      dataAnalysis: {
        name: "AI Data Analysis",
        capabilities: [
          "Analyzes completed survey responses in real time",
          "Detects trends, patterns, and sentiment (positive/neutral/negative)",
          "Identifies frequently mentioned keywords",
          "Groups responses by region, demographics, and time period"
        ],
        benefits: ["Companies instantly understand what customers are really saying"],
        apiEndpoint: "/api/ai/analyze-survey"
      },
      insights: {
        name: "AI Insights & Alerts",
        capabilities: [
          "Automatically generates insights about rating drops and negative feedback spikes",
          "Sends alerts like 'Customer satisfaction dropped in Gldani district'",
          "Detects regional performance differences",
          "Monitors keyword mentions and sentiment changes"
        ],
        benefits: ["Early problem detection before issues escalate"],
        apiEndpoint: "/api/ai/insights"
      },
      recommendations: {
        name: "AI Recommendations",
        capabilities: [
          "Suggests actionable improvements (improve delivery speed, adjust pricing)",
          "Focuses on specific regions or customer groups",
          "Based on historical data, current trends, and survey comparisons"
        ],
        benefits: ["Turns raw data into clear business actions"],
        apiEndpoint: "/api/ai/recommendations"
      }
    }
  };

  // Backend API Functions for Claude AI
  const generateAISurvey = async (topic, targetAudience) => {
    if (!aiEnabled) {
      addNotification('AI features are currently unavailable', 'warning');
      return null;
    }

    try {
      console.log('Generating AI survey...', { topic, targetAudience });
      const response = await fetch('http://localhost:3001/api/ai/generate-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          targetAudience,
          market: 'Georgia',
          language: 'Georgian'
        })
      });

      console.log('AI survey response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI survey response error:', errorText);
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      console.log('AI survey data received:', data);
      return data.survey;
    } catch (error) {
      console.error('AI Survey generation failed:', error);
      addNotification('AI survey generation temporarily unavailable', 'warning');
      // Return fallback survey structure
      return {
        title: `${topic} Survey`,
        description: `Please help us understand ${topic.toLowerCase()} by answering these questions.`,
        questions: [
          {
            id: 1,
            type: 'rating',
            question: `How satisfied are you with ${topic.toLowerCase()}?`,
            options: ['1-5 scale']
          },
          {
            id: 2,
            type: 'text',
            question: 'What improvements would you suggest?',
            options: []
          }
        ]
      };
    }
  };

  const analyzeSurveyData = async (surveyData, responses) => {
    if (!aiEnabled) {
      return 'AI analysis is currently unavailable. Please check back later.';
    }

    try {
      console.log('Analyzing survey data with AI...');
      const response = await fetch('http://localhost:3001/api/ai/analyze-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          survey: surveyData,
          responses: responses.slice(0, 50), // Limit for performance
          market: 'Georgia'
        })
      });

      console.log('AI analysis response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI analysis response error:', errorText);
        throw new Error('AI analysis service unavailable');
      }

      const data = await response.json();
      console.log('AI analysis data received:', data);
      return data.analysis || data.insights;
    } catch (error) {
      console.error('AI Analysis failed:', error);
      return 'AI analysis is currently unavailable. Basic analytics are still available in the Analytics tab.';
    }
  };

  const checkAIStatus = async (retryCount = 0) => {
    const maxRetries = 3;

    try {
      console.log(`🔍 Checking AI status... (attempt ${retryCount + 1}/${maxRetries + 1})`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('http://localhost:3001/api/ai/status', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('📡 AI status response:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 404 && retryCount < maxRetries) {
          console.log('🔄 Backend not ready, retrying in 2 seconds...');
          setTimeout(() => checkAIStatus(retryCount + 1), 2000);
          return false;
        }
        console.warn('❌ AI status endpoint returned error:', response.status);
        setAiEnabled(false);
        addNotification('AI backend unavailable. Some features may be limited.', 'warning');
        return false;
      }

      const data = await response.json();
      console.log('✅ AI status data:', data);

      const isEnabled = data.enabled === true;
      console.log('🤖 Setting AI enabled to:', isEnabled);

      if (isEnabled) {
        addNotification('AI features are now active!', 'success');
      } else {
        addNotification('AI features temporarily offline. Basic features still available.', 'info');
      }

      setAiEnabled(isEnabled);
      return isEnabled;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⏰ AI status check timed out');
        if (retryCount < maxRetries) {
          console.log('🔄 Retrying due to timeout...');
          setTimeout(() => checkAIStatus(retryCount + 1), 1000);
          return false;
        }
      } else {
        console.warn('❌ Could not check AI status:', error.message);
      }

      console.log('🔄 Falling back to disabled state');
      setAiEnabled(false);

      if (retryCount === 0) {
        addNotification('Unable to connect to AI backend. Please ensure the server is running.', 'error');
      }

      return false;
    }
  };

  // Check AI status on app load
  useEffect(() => {
    checkAIStatus();
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // UI state
  const [particles, setParticles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [animations, setAnimations] = useState({});
  const [theme, setTheme] = useState('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Survey state
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyStep, setSurveyStep] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [surveyHistory, setSurveyHistory] = useState([]);

  // User data state
  const [userProfile, setUserProfile] = useState({
    name: 'Mariam Gelashvili',
    email: 'mariam.gelash@gmail.com',
    avatar: 'M',
    balance: 32.15,
    level: 9,
    xp: 780,
    xpToNext: 1000,
    streak: 7,
    totalSurveys: 156,
    premium: false,
    pro: true,
    achievements: ['survey-master', 'week-warrior', 'quality-expert']
  });

  // Premium features state
  const [premiumFeatures, setPremiumFeatures] = useState({
    aiInsights: true,
    advancedAnalytics: true,
    prioritySupport: true,
    customBranding: false,
    apiAccess: false,
    whiteLabel: false
  });

  // Interactive features state
  const [favorites, setFavorites] = useState([1, 3]);
  const [bookmarked, setBookmarked] = useState([2]);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'survey_completed', survey: 'Digital Banking UX Research', reward: 2.5, time: '2 hours ago' },
    { id: 2, type: 'achievement_unlocked', achievement: 'Week Warrior', time: '1 day ago' },
    { id: 3, type: 'level_up', level: 9, time: '2 days ago' }
  ]);

  // Animation refs
  const notificationRef = useRef(null);

  useEffect(() => {
    const newParticles = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 25 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Notification system
  const addNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  // Loading states
  const setLoading = (key, loading) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  };

  // Animation triggers
  const triggerAnimation = (key, animation) => {
    setAnimations(prev => ({ ...prev, [key]: animation }));
    setTimeout(() => {
      setAnimations(prev => ({ ...prev, [key]: null }));
    }, 1000);
  };

  // Fake functionality helpers
  const simulateAction = async (action, duration = 1000) => {
    const loadingKey = `action-${Date.now()}`;
    setLoading(loadingKey, true);

    return new Promise(resolve => {
      setTimeout(() => {
        setLoading(loadingKey, false);

        // Add fake success feedback
        switch (action) {
          case 'withdraw':
            addNotification('₾15.00 withdrawn successfully! Funds will arrive in 1-2 business days.', 'success');
            setUserProfile(prev => ({ ...prev, balance: prev.balance - 15 }));
            break;
          case 'share':
            addNotification('Survey link copied to clipboard!', 'success');
            break;
          case 'bookmark':
            addNotification('Survey bookmarked for later!', 'success');
            break;
          case 'favorite':
            addNotification('Added to favorites!', 'success');
            break;
          case 'upgrade':
            addNotification('Welcome to Premium! Enjoy all advanced features.', 'success');
            setUserProfile(prev => ({ ...prev, premium: true }));
            break;
          case 'survey_complete':
            addNotification(`+${selectedSurvey.reward} tokens earned! (≈ ₾${(selectedSurvey.reward * 0.05).toFixed(2)}) Keep up the great work!`, 'success');
            setUserProfile(prev => ({ ...prev, balance: prev.balance + selectedSurvey.reward }));
            setSurveyHistory(prev => [...prev, {
              id: selectedSurvey.id,
              title: selectedSurvey.title,
              reward: selectedSurvey.reward,
              completedAt: new Date()
            }]);
            break;
        }

        resolve();
      }, duration);
    });
  };

  // Premium check
  const requirePremium = (feature) => {
    if (!userProfile.premium && !userProfile.pro) {
      setCurrentView('upgrade');
      addNotification('This feature requires Premium or Pro plan', 'warning');
      return false;
    }
    return true;
  };

  const georgianSurveys = [
    {
      id: 1,
      company: 'TBC Bank',
      logo: '🏦',
      title: 'Digital Banking UX Research',
      category: 'Banking & Finance',
      reward: 2.5,
      time: 12,
      responses: 2847,
      questions: [
        { type: 'rating', question: 'How would you rate TBC\'s mobile app interface?', subtitle: 'Think about navigation, design, and ease of use', scale: 5 },
        { type: 'multiple', question: 'Which TBC mobile features do you use most?', subtitle: 'Select all that apply', options: ['Money transfers', 'Bill payments', 'Card management', 'Loan applications', 'Investment products', 'Currency exchange'] },
        { type: 'slider', question: 'On average, how many transactions do you make per week?', min: 0, max: 50, unit: 'transactions' },
        { type: 'text', question: 'What new feature would make your banking experience better?', subtitle: 'Be specific - your ideas matter!', placeholder: 'e.g., crypto wallet integration, expense categorization...' }
      ],
      color: 'from-blue-600 to-cyan-500',
      description: 'Help TBC Bank revolutionize digital banking in Georgia',
      location: 'All Georgia',
      difficulty: 'Medium'
    },
    {
      id: 2,
      company: 'Wolt Georgia',
      logo: '🛵',
      title: 'Food Delivery Experience Study',
      category: 'Food & Logistics',
      reward: 1.2,
      time: 7,
      responses: 4521,
      questions: [
        { type: 'emoji', question: 'How do you feel about your last Wolt delivery?', emojis: ['😍', '😊', '😐', '😕', '😠'] },
        { type: 'rating', question: 'Rate the delivery speed', scale: 5 },
        { type: 'multiple', question: 'What influenced your restaurant choice?', options: ['Reviews', 'Delivery time', 'Price', 'Previous experience', 'Promotions', 'Cuisine type'] }
      ],
      color: 'from-cyan-500 to-blue-600',
      description: 'Shape the future of food delivery in Tbilisi',
      location: 'Tbilisi, Batumi',
      difficulty: 'Easy'
    },
    {
      id: 3,
      company: 'Georgian Wine Association',
      logo: '🍷',
      title: 'Wine Tourism & Export Research',
      category: 'Research & Tourism',
      reward: 3.0,
      time: 15,
      responses: 856,
      questions: [
        { type: 'ranking', question: 'Rank these wine varieties by preference', items: ['Saperavi', 'Rkatsiteli', 'Kindzmarauli', 'Mukuzani', 'Tsinandali'] },
        { type: 'text', question: 'Describe your ideal Georgian wine tourism experience', subtitle: 'We\'re developing new wine routes based on your input', placeholder: 'Vineyards, traditional qvevri wines, local cuisine...' },
        { type: 'slider', question: 'What would you pay for a premium wine tour?', min: 50, max: 500, unit: '₾' }
      ],
      color: 'from-purple-600 to-pink-500',
      description: 'Scientific research shaping Georgian wine industry',
      location: 'Kakheti, Tbilisi',
      difficulty: 'Hard'
    },
    {
      id: 4,
      company: 'Tbilisi Municipality',
      logo: '🏛️',
      title: 'Urban Development Survey 2025',
      category: 'Government Research',
      reward: 2.0,
      time: 10,
      responses: 3241,
      questions: [
        { type: 'multiple', question: 'Which urban improvements are most important to you?', options: ['Metro expansion', 'Bike lanes', 'Green spaces', 'Parking', 'Pedestrian zones', 'Street lighting'] },
        { type: 'slider', question: 'How much would you pay monthly for improved public transport?', min: 0, max: 100, unit: '₾' },
        { type: 'text', question: 'What specific area needs urgent improvement?', placeholder: 'Be specific about location and issue...' }
      ],
      color: 'from-orange-500 to-red-600',
      description: 'Your voice shapes Tbilisi\'s future infrastructure',
      location: 'Tbilisi',
      difficulty: 'Medium'
    }
  ];

  const userEarningData = [
    { day: 'Mon', earned: 3.2 },
    { day: 'Tue', earned: 4.8 },
    { day: 'Wed', earned: 2.5 },
    { day: 'Thu', earned: 5.5 },
    { day: 'Fri', earned: 4.2 },
    { day: 'Sat', earned: 6.1 },
    { day: 'Sun', earned: 5.8 }
  ];

  const companyAnalyticsData = [
    { month: 'Jul', responses: 245, satisfaction: 4.2 },
    { month: 'Aug', responses: 389, satisfaction: 4.3 },
    { month: 'Sep', responses: 512, satisfaction: 4.1 },
    { month: 'Oct', responses: 678, satisfaction: 4.4 },
    { month: 'Nov', responses: 823, satisfaction: 4.5 },
    { month: 'Dec', responses: 947, satisfaction: 4.6 }
  ];

  const sentimentData = [
    { name: 'Positive', value: 68, color: '#10b981' },
    { name: 'Neutral', value: 24, color: '#f59e0b' },
    { name: 'Negative', value: 8, color: '#ef4444' }
  ];

  const demographicData = [
    { age: '18-24', count: 245 },
    { age: '25-34', count: 432 },
    { age: '35-44', count: 321 },
    { age: '45-54', count: 178 },
    { age: '55+', count: 89 }
  ];

  const TokenLogo = ({ size = 24, animated = false }) => (
    <div
      className={`relative flex items-center justify-center ${animated ? 'animate-pulse' : ''}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 rounded-full animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full opacity-80 blur-sm"></div>
      <span className="relative text-white font-bold" style={{ fontSize: size * 0.6 }}>ƒ</span>
    </div>
  );

  // Notification Component
  const NotificationSystem = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-xl shadow-2xl backdrop-blur-xl border transform transition-all duration-300 animate-in slide-in-from-right ${
            notification.type === 'success'
              ? 'bg-green-500/20 border-green-500/30 text-green-100'
              : notification.type === 'warning'
              ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-100'
              : notification.type === 'error'
              ? 'bg-red-500/20 border-red-500/30 text-red-100'
              : 'bg-blue-500/20 border-blue-500/30 text-blue-100'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'error' && <X className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Loading Spinner Component
  const LoadingSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    return (
      <div className={`${sizeClasses[size]} border-2 border-white/20 border-t-white rounded-full animate-spin`} />
    );
  };

  // Premium Badge Component
  const PremiumBadge = ({ type = 'premium', size = 'sm' }) => {
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full font-bold ${
        type === 'premium'
          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      } ${sizeClasses[size]}`}>
        {type === 'premium' ? <Crown className={iconSize} /> : <Diamond className={iconSize} />}
        <span className="uppercase tracking-wide">{type}</span>
      </div>
    );
  };

  // Enhanced Survey Interface Component
  const SurveyInterface = () => {
    const survey = selectedSurvey;
    const currentQuestion = survey.questions[surveyStep];
    const progress = ((surveyStep + 1) / survey.questions.length) * 100;

    const [questionAnimation, setQuestionAnimation] = useState('animate-in slide-in-from-right');

    const renderQuestion = () => {
      switch (currentQuestion.type) {
        case 'rating':
          return (
            <div className="space-y-6">
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => {
                      setSurveyAnswers({ ...surveyAnswers, [surveyStep]: rating });
                      triggerAnimation(`rating-${rating}`, 'animate-pulse');
                    }}
                    className={`w-16 h-16 rounded-xl font-bold text-xl transition-all transform hover:scale-110 hover:rotate-3 ${
                      surveyAnswers[surveyStep] === rating
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-110 animate-bounce'
                        : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-lg'
                    } ${animations[`rating-${rating}`] || ''}`}
                  >
                    {rating}
                    {surveyAnswers[surveyStep] === rating && <Sparkles className="w-4 h-4 inline ml-1" />}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-purple-300 text-sm px-2">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  Poor
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Excellent
                </span>
              </div>
            </div>
          );

        case 'emoji':
          return (
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                {currentQuestion.emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSurveyAnswers({ ...surveyAnswers, [surveyStep]: emoji });
                      triggerAnimation(`emoji-${idx}`, 'animate-bounce');
                    }}
                    className={`w-20 h-20 rounded-2xl text-4xl transition-all transform hover:scale-110 hover:-rotate-6 ${
                      surveyAnswers[surveyStep] === emoji
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl scale-110 animate-pulse'
                        : 'bg-white/10 hover:bg-white/20 hover:shadow-lg'
                    } ${animations[`emoji-${idx}`] || ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-center text-purple-300 text-sm">How are you feeling about this experience?</p>
            </div>
          );

        case 'multiple':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const selected = surveyAnswers[surveyStep]?.includes(option);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const current = surveyAnswers[surveyStep] || [];
                        const updated = selected ? current.filter(item => item !== option) : [...current, option];
                        setSurveyAnswers({ ...surveyAnswers, [surveyStep]: updated });
                        triggerAnimation(`option-${idx}`, selected ? 'animate-pulse' : 'animate-bounce');
                      }}
                      className={`group p-4 rounded-xl text-left transition-all transform hover:scale-105 hover:shadow-lg ${
                        selected
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg animate-pulse'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      } ${animations[`option-${idx}`] || ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selected ? 'border-white bg-white scale-110' : 'border-purple-300 group-hover:border-white'
                        }`}>
                          {selected && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="font-medium">{option}</span>
                        {selected && <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-purple-300 text-sm">Select all that apply</p>
            </div>
          );

        case 'text':
          return (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={surveyAnswers[surveyStep] || ''}
                  onChange={(e) => setSurveyAnswers({ ...surveyAnswers, [surveyStep]: e.target.value })}
                  placeholder={currentQuestion.placeholder}
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-purple-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none transition-all hover:bg-white/15 focus:bg-white/20"
                />
                <div className="absolute bottom-3 right-3 text-purple-300 text-xs">
                  {surveyAnswers[surveyStep]?.length || 0}/500
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {/* Voice input simulation */}}
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition"
                >
                  <Mic className="w-4 h-4 text-purple-300" />
                </button>
                <button
                  onClick={() => {/* Camera input simulation */}}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                >
                  <Camera className="w-4 h-4 text-blue-300" />
                </button>
              </div>
            </div>
          );

        case 'slider':
          const currentValue = surveyAnswers[surveyStep] || currentQuestion.min;
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold transition-all duration-300 ${
                  currentValue > currentQuestion.max * 0.8 ? 'text-green-400 animate-bounce' :
                  currentValue < currentQuestion.min * 1.2 ? 'text-red-400' :
                  'text-white'
                }`}>
                  {currentValue}
                </div>
                <div className="text-purple-300 font-medium">{currentQuestion.unit}</div>
                {currentValue > currentQuestion.max * 0.8 && (
                  <div className="text-green-400 text-sm font-medium animate-pulse">Excellent choice! 🎉</div>
                )}
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={currentValue}
                  onChange={(e) => {
                    setSurveyAnswers({ ...surveyAnswers, [surveyStep]: parseInt(e.target.value) });
                    triggerAnimation('slider', 'animate-pulse');
                  }}
                  className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full opacity-50"></div>
              </div>
              <div className="flex justify-between text-purple-300 text-sm">
                <span className="flex items-center gap-1">
                  <Minus className="w-3 h-3" />
                  {currentQuestion.min}
                </span>
                <span className="flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  {currentQuestion.max}
                </span>
              </div>
            </div>
          );

        case 'ranking':
          return (
            <div className="space-y-4">
              <p className="text-purple-300 text-sm mb-4 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Drag to reorder (1 = most preferred)
              </p>
              <div className="space-y-3">
                {currentQuestion.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all cursor-move flex items-center gap-3 transform hover:scale-102 hover:shadow-lg"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                      idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white animate-pulse' :
                      idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                      idx === 2 ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white' :
                      'bg-white/20 text-purple-300'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="font-medium flex-1">{item}</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-white/20 rounded transition">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </button>
                      <button className="p-1 hover:bg-white/20 rounded transition">
                        <ChevronRight className="w-4 h-4 -rotate-90" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return <div className="text-white">Question type: {currentQuestion.type}</div>;
      }
    };

    const handleNext = async () => {
      if (!surveyAnswers[surveyStep]) return;

      if (surveyStep < survey.questions.length - 1) {
        setQuestionAnimation('animate-out slide-out-to-left');
        setTimeout(() => {
          setSurveyStep(surveyStep + 1);
          setQuestionAnimation('animate-in slide-in-from-right');
        }, 150);
      } else {
        // Complete survey
        await simulateAction('survey_complete');
        setSelectedSurvey(null);
        setSurveyStep(0);
        setSurveyAnswers({});
        setCurrentView(userType === 'user' ? 'userDash' : 'companyDash');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-indigo-400 opacity-10"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size * 2}px`,
              height: `${p.size * 2}px`,
              animation: `float ${p.duration}s infinite ease-in-out`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}

        <div className="relative z-10 w-full max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setSelectedSurvey(null);
                setSurveyStep(0);
                setSurveyAnswers({});
                setCurrentView(userType === 'user' ? 'userDash' : 'companyDash');
              }}
              className="text-purple-300 hover:text-white transition flex items-center gap-2 group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
              Exit Survey
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg animate-pulse">
              <TokenLogo size={28} animated />
              <span className="text-white font-bold text-xl">+₾{survey.reward}</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-purple-300 text-sm mb-2">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Question {surveyStep + 1} of {survey.questions.length}
              </span>
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className={`bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-300 ${questionAnimation}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 bg-gradient-to-br ${survey.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg animate-pulse`}>
                {survey.logo}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{survey.company}</h3>
                <p className="text-purple-300 text-sm">{survey.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 text-xs">{survey.time} min</span>
                  <MapPin className="w-4 h-4 text-purple-400 ml-2" />
                  <span className="text-purple-300 text-xs">{survey.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                  <TokenLogo size={24} />
                  ₾{survey.reward}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full font-medium mt-1 ${
                  survey.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  survey.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {survey.difficulty}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                {currentQuestion.question}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-purple-300 text-lg">{currentQuestion.subtitle}</p>
              )}
            </div>

            {renderQuestion()}

            <div className="flex gap-4 mt-8">
              {surveyStep > 0 && (
                <button
                  onClick={() => {
                    setQuestionAnimation('animate-out slide-out-to-right');
                    setTimeout(() => {
                      setSurveyStep(surveyStep - 1);
                      setQuestionAnimation('animate-in slide-in-from-left');
                    }, 150);
                  }}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!surveyAnswers[surveyStep] || loadingStates[`survey-${surveyStep}`]}
                className={`flex-1 py-3 rounded-xl font-bold transition-all transform flex items-center justify-center gap-2 ${
                  surveyAnswers[surveyStep] && !loadingStates[`survey-${surveyStep}`]
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-2xl hover:scale-105 animate-pulse'
                    : 'bg-white/10 text-purple-400 cursor-not-allowed'
                }`}
              >
                {loadingStates[`survey-${surveyStep}`] ? (
                  <LoadingSpinner />
                ) : surveyStep < survey.questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Complete Survey
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
          }

          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            cursor: pointer;
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
            transition: all 0.2s;
          }

          .slider-thumb::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.8);
          }

          .slider-thumb::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
          }
        `}</style>
      </div>
    );
  };

  // Enhanced Landing Page Component
  const LandingPage = () => {
    const [heroAnimation, setHeroAnimation] = useState(false);

    useEffect(() => {
      setHeroAnimation(true);
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-white/30 to-purple-400/20 blur-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `float ${p.duration}s infinite ease-in-out`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-orange-500/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rotate-45 animate-pulse"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center p-6">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => triggerAnimation('logo', 'animate-bounce')}>
            <TokenLogo size={48} animated />
            <div>
              <h1 className={`text-2xl font-bold text-white transition-all ${animations.logo ? 'animate-bounce' : ''}`}>FeedbackGe</h1>
              <p className="text-xs text-purple-300">Research Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => addNotification('Language switching coming soon!', 'info')}
              className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-all transform hover:scale-105"
            >
              ქართული
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-all transform hover:scale-110"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-all md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <div className={`inline-block mb-6 px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full backdrop-blur-sm transition-all duration-1000 transform ${
            heroAnimation ? 'animate-in slide-in-from-top opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            <span className="text-purple-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Beta Version - Join 15,000+ Georgians Earning Daily
            </span>
          </div>

          <h1 className={`text-6xl md:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-200 transform ${
            heroAnimation ? 'animate-in slide-in-from-bottom opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            Your Voice Powers
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              Scientific Research
            </span>
          </h1>

          <p className={`text-xl text-purple-200 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-400 transform ${
            heroAnimation ? 'animate-in slide-in-from-bottom opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            Georgian companies and researchers need your insights. Complete engaging surveys and earn tokens automatically - like Honeygain!
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-600 transform ${
            heroAnimation ? 'animate-in slide-in-from-bottom opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={async () => {
                setUserType('user');
                triggerAnimation('cta-user', 'animate-bounce');
                await simulateAction('navigation');
                setCurrentView('login');
              }}
              className={`group px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${animations['cta-user'] || ''}`}
            >
              <TokenLogo size={24} />
              Start Earning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={async () => {
                setUserType('company');
                triggerAnimation('cta-company', 'animate-bounce');
                await simulateAction('navigation');
                setCurrentView('login');
              }}
              className={`group px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${animations['cta-company'] || ''}`}
            >
              <Brain className="w-6 h-6" />
              Start Research
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-800 transform ${
            heroAnimation ? 'animate-in slide-in-from-bottom opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            {[
              { label: 'Paid Out', value: '₾280K+', icon: Coins, color: 'from-yellow-500 to-orange-500', change: '+12%' },
              { label: 'Active Users', value: '15K+', icon: Users, color: 'from-blue-500 to-cyan-500', change: '+8%' },
              { label: 'Companies', value: '500+', icon: Target, color: 'from-green-500 to-emerald-500', change: '+15%' },
              { label: 'Research Projects', value: '50K+', icon: Brain, color: 'from-purple-500 to-pink-500', change: '+22%' }
            ].map((stat, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => addNotification(`${stat.label}: ${stat.change} growth this month!`, 'success')}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3 mx-auto transition-transform group-hover:rotate-12`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-500 group-hover:bg-clip-text transition-all">
                  {stat.value}
                </div>
                <div className="text-sm text-purple-300 flex items-center justify-center gap-1">
                  {stat.label}
                  <TrendingUp className="w-3 h-3 text-green-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose FeedbackGe?</h2>
            <p className="text-purple-300 text-lg">Advanced features for modern research</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Bank-level encryption and GDPR compliance',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Complete surveys in minutes, get paid instantly',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Crown,
                title: 'Premium Features',
                description: 'AI insights, advanced analytics, and priority support',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => addNotification(`${feature.title} feature is now available!`, 'info')}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 mx-auto transition-transform group-hover:rotate-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">{feature.title}</h3>
                <p className="text-purple-300 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 text-center py-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-purple-300 mb-6">Join thousands of Georgians already earning from their opinions</p>
            <button
              onClick={async () => {
                triggerAnimation('bottom-cta', 'animate-pulse');
                await simulateAction('navigation');
                setCurrentView('register');
              }}
              className={`px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 ${animations['bottom-cta'] || ''}`}
            >
              Create Free Account
            </button>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
          }

          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
            50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
          }

          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  };

  // Enhanced Login/Register Page Component
  const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
      email: userType === 'user' ? 'mariam.gelash@gmail.com' : 'research@tbcbank.ge',
      password: 'demo1234',
      confirmPassword: '',
      name: '',
      company: '',
      agreeToTerms: false
    });

    const [authStep, setAuthStep] = useState('form'); // form, otp, success

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = async () => {
      console.log('Login attempt:', { email: formData.email, userType });

      if (!formData.email || !formData.password) {
        addNotification('Please fill in all fields', 'warning');
        return;
      }

      // Accept any email/password combination for demo
      setLoading('auth', true);
      await simulateAction('login', 1500);
      setLoading('auth', false);
      setIsLoggedIn(true);

      const targetView = userType === 'user' ? 'userDash' : 'companyDash';
      console.log('Navigating to:', targetView, 'for userType:', userType);

      addNotification(`Welcome to ${userType === 'user' ? 'User' : 'Company'} Dashboard!`, 'success');
      setCurrentView(targetView);
    };

    const handleRegister = async () => {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
        addNotification('Please fill in all required fields', 'warning');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        addNotification('Passwords do not match', 'error');
        return;
      }

      if (!formData.agreeToTerms) {
        addNotification('Please agree to the terms and conditions', 'warning');
        return;
      }

      setLoading('auth', true);
      await simulateAction('register', 2000);
      setLoading('auth', false);
      setAuthStep('success');
      setTimeout(() => {
        setIsLoggedIn(true);
        const targetView = userType === 'user' ? 'userDash' : 'companyDash';
        console.log('Registration complete, navigating to:', targetView, 'for userType:', userType);
        addNotification(`Account created! Welcome to ${userType === 'user' ? 'User' : 'Company'} Dashboard!`, 'success');
        setCurrentView(targetView);
      }, 2000);
    };

    const handleSocialLogin = async (provider) => {
      console.log('Social login attempt:', { provider, userType });

      setLoading(`social-${provider}`, true);
      await simulateAction('social-login', 1200);
      setLoading(`social-${provider}`, false);
      setIsLoggedIn(true);

      const targetView = userType === 'user' ? 'userDash' : 'companyDash';
      console.log('Social login navigating to:', targetView, 'for userType:', userType);

      addNotification(`Welcome to ${userType === 'user' ? 'User' : 'Company'} Dashboard!`, 'success');
      setCurrentView(targetView);
    };

    if (authStep === 'success') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="relative z-10 w-full max-w-md text-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to FeedbackGe!</h2>
              <p className="text-purple-300 mb-6">Your account has been created successfully</p>
              <div className="flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
              <p className="text-purple-300 text-sm mt-4">Setting up your dashboard...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `float ${p.duration}s infinite ease-in-out`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}

        <div className="relative z-10 w-full max-w-md">
          <button
            onClick={() => setCurrentView('landing')}
            className="mb-6 text-purple-300 hover:text-white transition flex items-center gap-2 group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
            Back to Home
          </button>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-center mb-8">
              {userType === 'user' ? <TokenLogo size={64} animated /> :
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
                  <Brain className="w-9 h-9 text-white" />
                </div>
              }
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-2">
              {isLogin ? (userType === 'user' ? 'Welcome Back!' : 'Company Portal') : 'Create Account'}
            </h2>
            <p className="text-purple-300 text-center mb-8">
              {isLogin
                ? (userType === 'user' ? 'Continue earning from research' : 'Access your research dashboard')
                : 'Join the FeedbackGe community'
              }
            </p>

            {/* Auth Tabs */}
            <div className="flex mb-6 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md transition-all font-medium ${
                  isLogin ? 'bg-white/20 text-white' : 'text-purple-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md transition-all font-medium ${
                  !isLogin ? 'bg-white/20 text-white' : 'text-purple-300 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-white mb-2 text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all hover:bg-white/10"
                  />
                </div>
              )}

              {userType === 'company' && !isLogin && (
                <div>
                  <label className="block text-white mb-2 text-sm font-medium">Company Name</label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all hover:bg-white/10"
                  />
                </div>
              )}

              <div>
                <label className="block text-white mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="your@email.ge"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all hover:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all hover:bg-white/10"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-white mb-2 text-sm font-medium">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all hover:bg-white/10"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <label htmlFor="terms" className="text-purple-300 text-sm">
                    I agree to the <a href="#" className="text-orange-400 hover:underline">Terms & Conditions</a>
                  </label>
                </div>
              )}

              <button
                onClick={isLogin ? handleLogin : handleRegister}
                disabled={loadingStates.auth}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingStates.auth ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {isLogin && (
                <div className="text-center">
                  <button
                    onClick={() => addNotification('Password reset email sent!', 'success')}
                    className="text-purple-300 hover:text-white text-sm transition"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>


            {/* Switch Auth Mode */}
            <div className="text-center mt-6">
              <p className="text-purple-300 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-400 hover:text-orange-300 ml-1 font-medium transition"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // User Dashboard Component
  // Enhanced User Dashboard Component
  // Premium Upgrade Component
  const PremiumUpgrade = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white opacity-10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s infinite ease-in-out`
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-4xl">
        <button
          onClick={() => setCurrentView('companyDash')}
          className="mb-6 text-purple-300 hover:text-white transition flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <Crown className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-purple-300 mb-6">Unlock premium research tools and advanced analytics</p>
          <div className="flex justify-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2 text-blue-400">
              <Shield className="w-4 h-4" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2 text-purple-400">
              <Zap className="w-4 h-4" />
              Instant activation
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              name: 'Free',
              price: '₾0',
              period: 'forever',
              description: 'Perfect for getting started',
              features: ['3 surveys/month', 'Basic analytics', 'Standard support'],
              limitations: ['Limited to 100 responses', 'Basic question types', 'No AI features'],
              color: 'from-gray-500 to-gray-600',
              buttonText: 'Current Plan',
              buttonStyle: 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            },
            {
              name: 'Pro',
              price: '₾9.99',
              period: 'month',
              description: 'For growing research teams',
              features: ['Unlimited surveys', 'Advanced analytics', 'Priority support', 'Custom branding', 'API access'],
              limitations: [],
              color: 'from-purple-500 to-pink-500',
              buttonText: 'Upgrade to Pro',
              buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl'
            },
            {
              name: 'Premium',
              price: '₾19.99',
              period: 'month',
              description: 'Full research suite with AI',
              features: ['Everything in Pro', 'AI survey creation', 'Advanced AI insights', 'White-label solution', 'Dedicated manager'],
              limitations: [],
              color: 'from-yellow-500 to-orange-500',
              buttonText: 'Upgrade to Premium',
              buttonStyle: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl hover:shadow-orange-500/50',
              popular: true
            },
            {
              name: 'Enterprise',
              price: '₾49.99',
              period: 'month',
              description: 'Custom solutions for large organizations',
              features: ['Everything in Premium', 'Custom integrations', 'Advanced security', '24/7 support'],
              limitations: [],
              color: 'from-indigo-500 to-purple-500',
              buttonText: 'Contact Sales',
              buttonStyle: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl'
            }
          ].map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-6 transition-all transform hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 shadow-xl shadow-yellow-500/20'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-purple-300 text-sm mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-white mb-1">{plan.price}</div>
                <div className="text-purple-300 text-sm">per {plan.period}</div>
              </div>

              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Features:</h4>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-purple-200 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.limitations && plan.limitations.length > 0 && (
                  <div>
                    <h4 className="text-red-400 font-medium mb-2">Limitations:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-red-300 text-sm">
                          <X className="w-3 h-3 flex-shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={async () => {
                  if (plan.name === 'Enterprise') {
                    addNotification('Redirecting to sales team...', 'info');
                    return;
                  }
                  if (plan.name !== 'Free') {
                    setLoading(`upgrade-${plan.name}`, true);
                    await simulateAction('upgrade');
                    setLoading(`upgrade-${plan.name}`, false);
                    addNotification(`Successfully upgraded to ${plan.name}!`, 'success');
                  }
                }}
                disabled={loadingStates[`upgrade-${plan.name}`] || plan.name === 'Free'}
                className={`w-full py-3 rounded-xl font-bold transition-all transform ${plan.buttonStyle} ${
                  loadingStates[`upgrade-${plan.name}`] ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {loadingStates[`upgrade-${plan.name}`] ? 'Processing...' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced User Dashboard Component
  const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-blue-400 opacity-5"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size * 2}px`,
                height: `${p.size * 2}px`,
                animation: `float ${p.duration}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FeedbackGe</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex gap-6">
                {[
                  { id: 'overview', label: 'Dashboard', icon: Home },
                  { id: 'surveys', label: 'Surveys', icon: Target },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'achievements', label: 'Achievements', icon: Trophy }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'text-purple-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!userProfile.premium && !userProfile.pro && (
                <button
                  onClick={() => setCurrentView('upgrade')}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade
                </button>
              )}
              {(userProfile.premium || userProfile.pro) && <PremiumBadge type={userProfile.premium ? 'premium' : 'pro'} />}
              <button
                onClick={() => addNotification('Notifications feature coming soon!', 'info')}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => setCurrentView('landing')}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold hover:scale-110 transition"
              >
                {userProfile.avatar}
              </button>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'overview' && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {userProfile.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-purple-300">Here's what's happening with your account today</p>
              </div>

              {/* Balance Card */}
              <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full -ml-32 -mb-32"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-white/80 mb-2 flex items-center gap-2">
                        <TokenLogo size={20} />
                        Your Total Balance
                      </p>
                      <h2 className="text-6xl font-bold text-white mb-2">{Math.round(userProfile.balance / 0.05)} tokens</h2>
                      <p className="text-purple-300 text-lg">≈ ₾{userProfile.balance.toFixed(2)} Lari</p>
                      <div className="flex items-center gap-3 text-white/90">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium text-lg">+₾7.80 this week</span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">+32%</span>
                      </div>
                    </div>
                    <button
                      onClick={async () => await simulateAction('withdraw')}
                      disabled={loadingStates.withdraw}
                      className="px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-2xl hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loadingStates.withdraw ? <LoadingSpinner /> : (
                        <>
                          <Send className="w-5 h-5" />
                          Withdraw
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5">
                    <div className="flex justify-between text-white text-sm mb-3">
                      <span className="font-medium">Progress to ₾50</span>
                      <span className="font-bold">{((userProfile.balance / 50) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-4 mb-3">
                      <div
                        className="bg-white rounded-full h-4 shadow-lg transition-all duration-1000"
                        style={{ width: `${Math.min((userProfile.balance / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-white/90 font-medium">{Math.round((50 - userProfile.balance) / 0.05)} more tokens to unlock bank transfer</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Active Surveys', value: '4', change: '+2', icon: Target, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Total Responses', value: '2,847', change: '+342', icon: Users, color: 'from-green-500 to-emerald-500' },
                  { label: 'Avg. Rating', value: '4.6', change: '+0.3', icon: Star, color: 'from-yellow-500 to-orange-500' },
                  { label: 'Response Rate', value: '73%', change: '+8%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' }
                ].map((metric, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition transform hover:scale-105">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-sm text-purple-300">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-400" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        {activity.type === 'survey_completed' && <CheckCircle className="w-5 h-5 text-white" />}
                        {activity.type === 'achievement_unlocked' && <Trophy className="w-5 h-5 text-white" />}
                        {activity.type === 'level_up' && <TrendingUp className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {activity.type === 'survey_completed' && `Completed "${activity.survey}"`}
                          {activity.type === 'achievement_unlocked' && `Unlocked "${activity.achievement}"`}
                          {activity.type === 'level_up' && `Reached Level ${activity.level}!`}
                        </p>
                        <p className="text-purple-300 text-sm">{activity.time}</p>
                      </div>
                      {activity.reward && (
                        <div className="flex items-center gap-1 text-yellow-400 font-bold">
                          <TokenLogo size={16} />
                          +₾{activity.reward}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Surveys */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Target className="w-7 h-7 text-orange-400" />
                    Available Surveys
                  </h3>
                  <button
                    onClick={() => addNotification('Advanced filters coming soon!', 'info')}
                    className="text-purple-300 hover:text-white transition flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {georgianSurveys.map(survey => (
                    <div
                      key={survey.id}
                      className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-orange-500/50 transition-all cursor-pointer transform hover:scale-105 hover:shadow-2xl ${
                        favorites.includes(survey.id) ? 'ring-2 ring-yellow-500/50' : ''
                      }`}
                      onClick={() => setSelectedSurvey(survey)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${survey.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                          {survey.logo}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (favorites.includes(survey.id)) {
                                setFavorites(prev => prev.filter(id => id !== survey.id));
                                addNotification('Removed from favorites', 'success');
                              } else {
                                setFavorites(prev => [...prev, survey.id]);
                                addNotification('Added to favorites!', 'success');
                              }
                            }}
                            className={`p-2 rounded-lg transition ${
                              favorites.includes(survey.id)
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-white/5 text-purple-300 hover:bg-white/10'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${favorites.includes(survey.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (bookmarked.includes(survey.id)) {
                                setBookmarked(prev => prev.filter(id => id !== survey.id));
                              } else {
                                setBookmarked(prev => [...prev, survey.id]);
                                addNotification('Survey bookmarked!', 'success');
                              }
                            }}
                            className={`p-2 rounded-lg transition ${
                              bookmarked.includes(survey.id)
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-white/5 text-purple-300 hover:bg-white/10'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarked.includes(survey.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition mb-2">{survey.title}</h4>
                        <p className="text-purple-300 text-sm mb-3">{survey.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-purple-300">{survey.category}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            survey.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            survey.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {survey.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-purple-300">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {survey.time} min
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {survey.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {survey.responses.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-2xl font-bold text-yellow-400">
                          <TokenLogo size={24} />
                          ₾{survey.reward}
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition transform hover:scale-105 flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'surveys' && (
            <div className="text-center py-20">
              <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Survey Management</h2>
              <p className="text-purple-300">Advanced survey features coming soon!</p>
            </div>
          )}


          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                Your Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 'survey-master', name: 'Survey Master', description: 'Complete 150+ surveys', icon: Target, unlocked: true, progress: 156, total: 150 },
                  { id: 'week-warrior', name: 'Week Warrior', description: '7-day streak', icon: Zap, unlocked: true, progress: 7, total: 7 },
                  { id: 'quality-expert', name: 'Quality Expert', description: 'Maintain 98% quality score', icon: Shield, unlocked: true, progress: 98, total: 100 },
                  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete 10 surveys in one day', icon: Lightning, unlocked: false, progress: 3, total: 10 },
                  { id: 'millionaire', name: 'Feedback Millionaire', description: 'Earn ₾1,000 total', icon: Coins, unlocked: false, progress: 32.15, total: 1000 },
                  { id: 'consistency-king', name: 'Consistency King', description: '30-day streak', icon: Calendar, unlocked: false, progress: 7, total: 30 }
                ].map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-6 rounded-2xl border transition-all transform hover:scale-105 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : 'bg-white/10'
                      }`}>
                        <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-white' : 'text-purple-300'}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-purple-300'}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-purple-400 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={achievement.unlocked ? 'text-yellow-400' : 'text-purple-300'}>
                          {achievement.progress} / {achievement.total}
                        </span>
                        <span className={achievement.unlocked ? 'text-yellow-400' : 'text-purple-300'}>
                          {Math.round((achievement.progress / achievement.total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            achievement.unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced Company Dashboard Component
  const CompanyDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentSurveyStep, setCurrentSurveyStep] = useState(1);
    const [surveyData, setSurveyData] = useState({
      title: '',
      description: '',
      category: 'Food & Beverage',
      estimatedTime: 5,
      reward: 0.50,
      questions: [],
      targeting: {
        cities: ['Tbilisi'],
        ageRange: { min: 18, max: 65 },
        interests: ['Food & Dining', 'Shopping']
      }
    });

    const navigationTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: Layout },
      { id: 'surveys', label: 'Surveys', icon: Target },
      { id: 'create', label: 'Create Survey', icon: Plus },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'insights', label: 'AI Insights', icon: Brain },
      { id: 'team', label: 'Team', icon: Users },
      { id: 'billing', label: 'Billing', icon: CreditCard }
    ];

    const keyMetrics = [
      { label: 'Active Surveys', value: '3', change: '+1', icon: Target, color: 'from-blue-500 to-cyan-500' },
      { label: 'Total Responses', value: '847', change: '+12%', icon: Users, color: 'from-green-500 to-emerald-500' },
      { label: 'Avg Rating', value: '4.2/5', change: '+0.1', icon: Star, color: 'from-yellow-500 to-orange-500' },
      { label: 'Response Rate', value: '68%', change: '+5%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' }
    ];

    const recentSurveys = [
      { name: 'Q4 Product Feedback Survey', status: 'active', responses: 847, created: '2024-01-15', reward: 0.50 },
      { name: 'Customer Satisfaction Survey', status: 'completed', responses: 623, created: '2024-01-10', reward: 0.75 },
      { name: 'Market Research Survey', status: 'active', responses: 234, created: '2024-01-08', reward: 0.30 },
      { name: 'Employee Engagement Survey', status: 'draft', responses: 0, created: '2024-01-05', reward: 0.00 }
    ];

    const surveySteps = [
      { id: 1, label: 'Basic Info', icon: FileText },
      { id: 2, label: 'Questions', icon: HelpCircle },
      { id: 3, label: 'Targeting', icon: Target },
      { id: 4, label: 'Preview', icon: Eye },
      { id: 5, label: 'Launch', icon: Send }
    ];

    const questionTypes = [
      { type: 'multiple-choice', label: 'Multiple Choice', icon: List },
      { type: 'rating', label: 'Rating Scale', icon: Star },
      { type: 'text', label: 'Open Text', icon: MessageSquare },
      { type: 'yes-no', label: 'Yes/No', icon: CheckSquare },
      { type: 'image', label: 'Image Upload', icon: Camera },
      { type: 'voice', label: 'Voice Response', icon: Mic, premium: true }
    ];

    const analyticsMetrics = [
      { label: 'Total Responses', value: '847', change: '+12%', icon: Users },
      { label: 'Avg Duration', value: '4m 32s', change: '-15s', icon: Clock },
      { label: 'Completion Rate', value: '73%', change: '+5%', icon: CheckCircle },
      { label: 'NPS Score', value: '+42', change: '+3', icon: TrendingUp },
      { label: 'Cost per Response', value: '₾1.20', change: '-₾0.10', icon: DollarSign }
    ];

    const aiInsights = [
      { type: 'critical', icon: AlertCircle, color: 'text-red-400', title: 'Critical Issues', content: '"Delivery time" mentioned in 23% of negative reviews' },
      { type: 'opportunity', icon: TrendingUp, color: 'text-yellow-400', title: 'Opportunities', content: '78% willing to pay 15% more for premium service' },
      { type: 'strength', icon: CheckCircle, color: 'text-green-400', title: 'Strengths', content: '"Friendly staff" mentioned 156x' },
      { type: 'action', icon: Lightbulb, color: 'text-blue-400', title: 'Recommended Actions', content: 'Hire 2-3 more delivery drivers, Launch premium tier in Vake, Feature staff in marketing' }
    ];

    const renderDashboardOverview = () => (
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6">
          {keyMetrics.map((metric, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition transform hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-green-400' :
                  metric.change.startsWith('-') ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-purple-300">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-3 gap-8">
          {/* Recent Surveys Table */}
          <div className="col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-400" />
              Recent Surveys
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-3 text-purple-300 font-medium">Survey Name</th>
                    <th className="pb-3 text-purple-300 font-medium">Status</th>
                    <th className="pb-3 text-purple-300 font-medium">Responses</th>
                    <th className="pb-3 text-purple-300 font-medium">Created</th>
                    <th className="pb-3 text-purple-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {recentSurveys.map((survey, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-4 text-white font-medium">{survey.name}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          survey.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          survey.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {survey.status}
                        </span>
                      </td>
                      <td className="py-4 text-purple-300">{survey.responses}</td>
                      <td className="py-4 text-purple-300">{survey.created}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-indigo-400" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Survey
              </button>
              <button
                onClick={() => {
                  setActiveTab('surveys');
                  addNotification('AI Survey Builder activated!', 'info');
                }}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                AI Survey Builder
              </button>
              <button className="w-full px-6 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Import Questions
              </button>
            </div>
          </div>
        </div>

        {/* AI Insights Preview */}
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            AI Insights Preview
            <span className="ml-auto text-xs px-3 py-1 bg-purple-500/30 rounded-full">Premium</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">⚡ Performance Alert</h4>
                <p className="text-purple-200 text-sm">Your product rating dropped 0.3 points this week in Gldani district</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">💡 AI Recommendation</h4>
                <p className="text-purple-200 text-sm">Customers mention 'slow delivery' 15% more often</p>
              </div>
            </div>
            <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105">
              View Full AI Analysis →
            </button>
          </div>
        </div>
      </div>
    );

    const renderSurveyCreation = () => (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Progress Steps */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            {surveySteps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  step.id <= currentSurveyStep ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-white/10 text-purple-300'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-3 font-medium ${
                  step.id <= currentSurveyStep ? 'text-white' : 'text-purple-300'
                }`}>
                  {step.label}
                </span>
                {i < surveySteps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step.id < currentSurveyStep ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentSurveyStep === 1 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Step 1: Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-white font-medium mb-2">Survey Title*</label>
                <input
                  type="text"
                  value={surveyData.title}
                  onChange={(e) => setSurveyData({...surveyData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
                  placeholder="Enter survey title..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  value={surveyData.description}
                  onChange={(e) => setSurveyData({...surveyData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition resize-none"
                  rows="4"
                  placeholder="Describe your survey..."
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Category</label>
                <select
                  value={surveyData.category}
                  onChange={(e) => setSurveyData({...surveyData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                >
                  <option>Food & Beverage</option>
                  <option>Technology</option>
                  <option>Retail</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Estimated Time (minutes)</label>
                <input
                  type="number"
                  value={surveyData.estimatedTime}
                  onChange={(e) => setSurveyData({...surveyData, estimatedTime: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  System Reward (tokens)
                  <span className="text-purple-300 text-sm block">≈ ₾{surveyData.reward ? (surveyData.reward * 0.05).toFixed(2) : '0.00'} Lari</span>
                </label>
                <input
                  type="number"
                  value={surveyData.reward}
                  onChange={(e) => setSurveyData({...surveyData, reward: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  placeholder="e.g. 2.5 tokens"
                />
                <p className="text-purple-300 text-sm mt-2">
                  The system automatically rewards participants with tokens. You set the token amount, system converts to Lari.
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentSurveyStep(2)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {currentSurveyStep === 2 && (
          <div className="grid grid-cols-4 gap-8">
            {/* Question Types Sidebar */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Question Types</h3>
              <div className="space-y-3">
                {questionTypes.map((type, i) => (
                  <div key={i} className={`p-3 rounded-xl cursor-pointer transition ${
                    type.premium ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-white/5 hover:bg-white/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <type.icon className="w-5 h-5 text-purple-300" />
                      <span className="text-white font-medium">{type.label}</span>
                      {type.premium && (
                        <span className="ml-auto text-xs px-2 py-1 bg-yellow-500/30 rounded-full text-yellow-400">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Assistant */}
              <div className="mt-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  AI Suggestions
                </h4>
                <p className="text-purple-200 text-sm mb-4">
                  Based on similar surveys, consider adding price satisfaction, recommendation likelihood, and competitor comparison questions.
                </p>
                <button className="w-full px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition text-sm font-medium">
                  Add These Questions
                </button>
              </div>
            </div>

            {/* Question Builder */}
            <div className="col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Survey Questions</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition">
                  + Add Question
                </button>
              </div>

              {surveyData.questions.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <h4 className="text-white font-bold text-lg mb-2">No questions yet</h4>
                  <p className="text-purple-300 mb-6">Start building your survey by adding your first question</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition">
                    Add First Question
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Question cards would go here */}
                </div>
              )}
            </div>
          </div>
        )}

        {currentSurveyStep === 3 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Step 3: Target Audience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Location Targeting</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-purple-300">All Georgia</span>
                  </label>
                  <div>
                    <label className="block text-purple-300 mb-2">Specific Cities:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Gori', 'Zugdidi'].map(city => (
                        <label key={city} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={surveyData.targeting.cities.includes(city)}
                            onChange={(e) => {
                              const newCities = e.target.checked
                                ? [...surveyData.targeting.cities, city]
                                : surveyData.targeting.cities.filter(c => c !== city);
                              setSurveyData({
                                ...surveyData,
                                targeting: { ...surveyData.targeting, cities: newCities }
                              });
                            }}
                            className="rounded"
                          />
                          <span className="text-white text-sm">{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Demographics</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-purple-300 mb-2">Age Range</label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        value={surveyData.targeting.ageRange.min}
                        onChange={(e) => setSurveyData({
                          ...surveyData,
                          targeting: {
                            ...surveyData.targeting,
                            ageRange: { ...surveyData.targeting.ageRange, min: parseInt(e.target.value) }
                          }
                        })}
                        className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                        min="13"
                        max="100"
                      />
                      <span className="text-purple-300">-</span>
                      <input
                        type="number"
                        value={surveyData.targeting.ageRange.max}
                        onChange={(e) => setSurveyData({
                          ...surveyData,
                          targeting: {
                            ...surveyData.targeting,
                            ageRange: { ...surveyData.targeting.ageRange, max: parseInt(e.target.value) }
                          }
                        })}
                        className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                        min="13"
                        max="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-purple-300 mb-2">AI-Matched Interests</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Food & Dining', 'Technology', 'Travel', 'Shopping', 'Healthcare', 'Education'].map(interest => (
                        <label key={interest} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={surveyData.targeting.interests.includes(interest)}
                            onChange={(e) => {
                              const newInterests = e.target.checked
                                ? [...surveyData.targeting.interests, interest]
                                : surveyData.targeting.interests.filter(i => i !== interest);
                              setSurveyData({
                                ...surveyData,
                                targeting: { ...surveyData.targeting, interests: newInterests }
                              });
                            }}
                            className="rounded"
                          />
                          <span className="text-white text-sm">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-300">
                📊 <strong>Estimated Reach:</strong> ~2,400 users match your targeting criteria
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentSurveyStep(2)}
                className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition"
              >
                ← Previous Step
              </button>
              <button
                onClick={() => setCurrentSurveyStep(4)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}
      </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-purple-300">Q4 Product Feedback Survey • Jan 15 - Feb 15, 2024</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
              Date Range ▼
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition">
              Export
            </button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
              Share
            </button>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-5 gap-6">
          {analyticsMetrics.map((metric, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <metric.icon className="w-8 h-8 text-purple-300 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-purple-300 mb-2">{metric.label}</div>
              <span className={`text-xs font-medium ${
                metric.change.startsWith('+') ? 'text-green-400' :
                metric.change.startsWith('-') ? 'text-red-400' : 'text-blue-400'
              }`}>
                {metric.change}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="col-span-3 space-y-8">
            {/* Response Over Time */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Response Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={companyAnalyticsData}>
                  <defs>
                    <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #ffffff20', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="responses" stroke="#6366f1" fillOpacity={1} fill="url(#colorResponses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Question Breakdown - Bar Chart */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Question Response Distribution</h3>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { rating: '5 Stars', count: 381, percentage: 45 },
                    { rating: '4 Stars', count: 237, percentage: 28 },
                    { rating: '3 Stars', count: 127, percentage: 15 },
                    { rating: '2 Stars', count: 68, percentage: 8 },
                    { rating: '1 Star', count: 34, percentage: 4 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="rating" stroke="#ffffff60" />
                    <YAxis stroke="#ffffff60" />
                    <Tooltip
                      contentStyle={{
                        background: '#1e293b',
                        border: '1px solid #ffffff20',
                        borderRadius: '12px',
                        color: '#ffffff'
                      }}
                      formatter={(value, name) => [
                        name === 'count' ? `${value} responses` : `${value}%`,
                        name === 'count' ? 'Responses' : 'Percentage'
                      ]}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Basic Analysis Text */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Basic Analysis
                </h4>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong>45% of respondents</strong> gave 5-star ratings, indicating strong satisfaction</p>
                  <p>• <strong>73% of responses</strong> are 4-star or 5-star, showing positive overall sentiment</p>
                  <p>• <strong>12% of respondents</strong> gave low ratings (1-2 stars), suggesting areas for improvement</p>
                  <p>• <strong>Average rating: 4.2/5</strong> - Above industry average for similar services</p>
                  <p>• <strong>Response distribution</strong> shows a healthy bell curve with positive skew</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition text-sm font-medium">
                  View Detailed Analysis
                </button>
                <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-sm">
                  Filter by Demographics
                </button>
                <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm">
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-8">
            {/* AI Insights Panel */}
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-400" />
                AI Insights
              </h3>
              <div className="space-y-4">
                {aiInsights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <insight.icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                    <div>
                      <h4 className="text-white font-bold text-sm">{insight.title}</h4>
                      <p className="text-purple-200 text-sm">{insight.content}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105">
                  View Full AI Report →
                </button>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Sentiment Analysis</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-indigo-400 opacity-5"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size * 2}px`,
                height: `${p.size * 2}px`,
                animation: `float ${p.duration}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">🏢 COMPANY DASHBOARD</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex gap-6">
                {navigationTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'text-purple-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('upgrade')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:scale-105 transition cursor-pointer"
              >
                Pro Plan
              </button>
              <button
                onClick={() => addNotification('Notifications panel coming soon!', 'info')}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => setCurrentView('landing')}
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold hover:scale-110 transition"
              >
                C
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'dashboard' && renderDashboardOverview()}
          {activeTab === 'create' && renderSurveyCreation()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'insights' && !showFullAnalysis && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">AI Insights Dashboard</h2>
                  <p className="text-purple-300">Powered by Claude AI for intelligent analysis</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    aiEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {aiEnabled ? 'AI Active' : 'AI Offline'}
                  </div>
                  <button
                    onClick={() => checkAIStatus()}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm flex items-center gap-1"
                    title="Refresh AI Status"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              {/* View Full AI Analysis Button */}
              <div className="text-center mb-8">
                <button
                  onClick={async () => {
                    if (!aiEnabled) {
                      addNotification('AI features are currently unavailable', 'warning');
                      return;
                    }

                    setLoading('full-analysis', true);
                    try {
                      // Get comprehensive AI analysis
                      const analysis = await analyzeSurveyData(
                        { title: 'Complete Business Analysis', description: 'Comprehensive survey insights' },
                        recentSurveys.flatMap(s => Array(Math.min(s.responses, 10)).fill().map((_, i) => ({
                          survey: s.name,
                          response: `Sample response ${i + 1} for ${s.name}`,
                          rating: Math.floor(Math.random() * 5) + 1,
                          region: ['Tbilisi', 'Batumi', 'Kutaisi'][Math.floor(Math.random() * 3)]
                        })))
                      );

                      if (analysis) {
                        setFullAIAnalysis({
                          summary: analysis,
                          insights: aiInsights,
                          recommendations: [
                            'Improve delivery speed in Tbilisi region by 25%',
                            'Focus customer service training on response time reduction',
                            'Consider premium service tier pricing at ₾15-20/month',
                            'Target customer retention campaigns in high-satisfaction areas',
                            'Implement real-time feedback collection system'
                          ],
                          alerts: [
                            'Customer satisfaction dropped 15% in Tbilisi district last week',
                            'Delivery time mentioned negatively 23% more often this month',
                            '78% of customers expressed willingness to pay more for premium service',
                            'Regional performance variation: Tbilisi (4.2) vs Batumi (3.8) average rating'
                          ],
                          metrics: {
                            totalResponses: 847,
                            averageRating: 4.2,
                            completionRate: '73%',
                            topIssues: ['Delivery Time', 'Customer Service', 'Product Quality']
                          },
                          generatedAt: new Date().toISOString()
                        });
                        setShowFullAnalysis(true);
                        addNotification('Full AI analysis generated successfully!', 'success');
                      }
                    } catch (error) {
                      console.error('Full AI analysis failed:', error);
                      addNotification('Failed to generate full AI analysis', 'error');
                    }
                    setLoading('full-analysis', false);
                  }}
                  disabled={!aiEnabled || loadingStates['full-analysis']}
                  className={`px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-2xl hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto ${
                    loadingStates['full-analysis'] ? 'animate-pulse' : ''
                  }`}
                >
                  <Brain className="w-6 h-6" />
                  {loadingStates['full-analysis'] ? 'Generating Analysis...' : 'View Full AI Analysis'}
                </button>
              </div>

              {/* AI Insights & Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {aiInsights.map((insight, i) => {
                  const IconComponent = insight.icon;
                  return (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        insight.type === 'critical' ? 'bg-red-500/20' :
                        insight.type === 'opportunity' ? 'bg-yellow-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          insight.type === 'critical' ? 'text-red-400' :
                          insight.type === 'opportunity' ? 'text-yellow-400' :
                          'text-green-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{insight.title}</h3>
                        <p className="text-purple-300 mb-4">{insight.content}</p>
                        {aiEnabled && (
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                const analysis = await analyzeSurveyData(
                                  { title: insight.title, questions: [] },
                                  [{ responses: insight.content }]
                                );
                                if (analysis) {
                                  addNotification('AI analysis generated!', 'success');
                                }
                              }}
                              className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition text-sm"
                            >
                              🤖 Analyze
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab('analytics');
                                addNotification('Viewing detailed analytics...', 'info');
                              }}
                              className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm"
                            >
                              📊 View Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* AI Recommendations Section */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-emerald-400" />
                  AI Recommendations
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-2">🚀 Service Improvements</h4>
                    <p className="text-emerald-300 text-sm mb-3">Based on customer feedback analysis</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition">
                        Implement
                      </button>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-2">📍 Regional Focus</h4>
                    <p className="text-emerald-300 text-sm mb-3">Target specific districts with lower satisfaction</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition">
                        Create Campaign
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Alerts Section */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  AI Alerts & Notifications
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 animate-pulse"></div>
                      <div className="flex-1">
                        <h4 className="text-red-400 font-medium mb-1">Critical Alert</h4>
                        <p className="text-red-300 text-sm">Customer satisfaction dropped 15% in Tbilisi region this week</p>
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition">
                            Investigate
                          </button>
                          <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition">
                            Create Response
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="text-yellow-400 font-medium mb-1">Opportunity Alert</h4>
                        <p className="text-yellow-300 text-sm">78% of respondents willing to pay more for premium service</p>
                        <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs hover:bg-yellow-500/30 transition mt-2">
                          Explore Pricing
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && showFullAnalysis && renderFullAIAnalysis()}

          {activeTab === 'insights' && !showFullAnalysis && (
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">AI-Powered Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Survey Generation</h4>
                    <p className="text-purple-300 text-sm">AI creates professional surveys based on your topic and audience</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Data Analysis</h4>
                    <p className="text-purple-300 text-sm">Intelligent insights and trend identification from survey responses</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Smart Targeting</h4>
                    <p className="text-purple-300 text-sm">AI-optimized audience selection for better response quality</p>
                  </div>
                </div>

                {!aiEnabled && (
                  <div className="mt-8 text-center">
                    <div className="bg-white/10 rounded-xl p-6 max-w-md mx-auto">
                      <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-white mb-2">AI Features Temporarily Offline</h4>
                      <p className="text-purple-300 text-sm mb-4">AI services are currently undergoing maintenance. Basic analytics remain available.</p>
                      <button
                        onClick={() => checkAIStatus()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl transition"
                      >
                        Check Status
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'team' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Team Management</h2>
                  <p className="text-purple-300">Manage team members and permissions</p>
                </div>
                <button
                  onClick={() => addNotification('Invite team member feature coming soon!', 'info')}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105"
                >
                  + Invite Member
                </button>
              </div>

              {/* Team Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Giorgi Mikadze', role: 'Admin', email: 'giorgi@company.com', status: 'active', avatar: '👨‍💼' },
                  { name: 'Nino Beridze', role: 'Analyst', email: 'nino@company.com', status: 'active', avatar: '👩‍💻' },
                  { name: 'David Chkhaidze', role: 'Viewer', email: 'david@company.com', status: 'pending', avatar: '👨‍🔬' }
                ].map((member, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{member.name}</h3>
                          <p className="text-purple-300 text-sm">{member.role}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        member.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {member.status}
                      </div>
                    </div>
                    <p className="text-purple-300 text-sm mb-4">{member.email}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addNotification(`Managing permissions for ${member.name}`, 'info')}
                        className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-xs hover:bg-indigo-500/30 transition"
                      >
                        Edit Role
                      </button>
                      <button
                        onClick={() => addNotification(`${member.status === 'active' ? 'Deactivated' : 'Activated'} ${member.name}`, 'success')}
                        className={`px-3 py-1 rounded-lg text-xs transition ${
                          member.status === 'active'
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {member.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Permissions */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Role Permissions</h3>
                <div className="space-y-4">
                  {[
                    { role: 'Admin', permissions: ['Create surveys', 'Manage team', 'View all analytics', 'Manage billing'] },
                    { role: 'Analyst', permissions: ['Create surveys', 'View analytics', 'Export data'] },
                    { role: 'Viewer', permissions: ['View surveys', 'View basic analytics'] }
                  ].map((roleInfo, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <h4 className="text-white font-medium">{roleInfo.role}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {roleInfo.permissions.map((perm, j) => (
                            <span key={j} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h2>
                  <p className="text-purple-300">Manage your plan and payment information</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  userProfile.premium ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  userProfile.pro ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {userProfile.premium ? 'Premium Plan' : userProfile.pro ? 'Pro Plan' : 'Free Plan'}
                </div>
              </div>

              {/* Current Plan */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Current Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-xl border-2 ${
                    !userProfile.pro && !userProfile.premium ? 'border-purple-500 bg-purple-500/10' :
                    'border-white/20 bg-white/5'
                  }`}>
                    <h4 className="text-xl font-bold text-white mb-2">Free</h4>
                    <p className="text-purple-300 text-sm mb-4">Perfect for getting started</p>
                    <ul className="text-purple-300 text-sm space-y-1 mb-4">
                      <li>• Up to 3 surveys</li>
                      <li>• 100 responses/month</li>
                      <li>• Basic analytics</li>
                      <li>• Email support</li>
                    </ul>
                    {!userProfile.pro && !userProfile.premium && (
                      <div className="text-green-400 font-medium">Current Plan</div>
                    )}
                  </div>

                  <div className={`p-6 rounded-xl border-2 ${
                    userProfile.pro && !userProfile.premium ? 'border-blue-500 bg-blue-500/10' :
                    'border-white/20 bg-white/5'
                  }`}>
                    <h4 className="text-xl font-bold text-white mb-2">Pro</h4>
                    <p className="text-purple-300 text-sm mb-4">$9.99/month</p>
                    <ul className="text-purple-300 text-sm space-y-1 mb-4">
                      <li>• Unlimited surveys</li>
                      <li>• Advanced analytics</li>
                      <li>• AI insights (limited)</li>
                      <li>• Priority support</li>
                    </ul>
                    {userProfile.pro && !userProfile.premium && (
                      <div className="text-blue-400 font-medium">Current Plan</div>
                    )}
                  </div>

                  <div className={`p-6 rounded-xl border-2 ${
                    userProfile.premium ? 'border-yellow-500 bg-yellow-500/10' :
                    'border-white/20 bg-white/5'
                  }`}>
                    <h4 className="text-xl font-bold text-white mb-2">Premium</h4>
                    <p className="text-purple-300 text-sm mb-4">$19.99/month</p>
                    <ul className="text-purple-300 text-sm space-y-1 mb-4">
                      <li>• Everything in Pro</li>
                      <li>• Full AI capabilities</li>
                      <li>• White-label surveys</li>
                      <li>• Custom integrations</li>
                    </ul>
                    {userProfile.premium && (
                      <div className="text-yellow-400 font-medium">Current Plan</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h4 className="text-white font-medium mb-2">Surveys Created</h4>
                  <div className="text-3xl font-bold text-purple-400 mb-1">12</div>
                  <p className="text-purple-300 text-sm">This month</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h4 className="text-white font-medium mb-2">Responses Collected</h4>
                  <div className="text-3xl font-bold text-blue-400 mb-1">847</div>
                  <p className="text-purple-300 text-sm">This month</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h4 className="text-white font-medium mb-2">AI Analyses Used</h4>
                  <div className="text-3xl font-bold text-emerald-400 mb-1">23</div>
                  <p className="text-purple-300 text-sm">This month</p>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Payment History</h3>
                <div className="space-y-4">
                  {[
                    { date: '2025-01-15', amount: '$19.99', status: 'Paid', plan: 'Premium' },
                    { date: '2024-12-15', amount: '$19.99', status: 'Paid', plan: 'Premium' },
                    { date: '2024-11-15', amount: '$9.99', status: 'Paid', plan: 'Pro' }
                  ].map((payment, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{payment.plan} Plan</h4>
                          <p className="text-purple-300 text-sm">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{payment.amount}</div>
                        <div className="text-green-400 text-sm">{payment.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'surveys' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Survey Management</h2>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      if (!aiEnabled) {
                        addNotification('AI features are currently unavailable', 'warning');
                        return;
                      }
                      setLoading('ai-survey', true);
                      const aiSurvey = await generateAISurvey('Customer Satisfaction', 'Georgian consumers');
                      setLoading('ai-survey', false);
                      if (aiSurvey) {
                        addNotification('AI-generated survey created successfully!', 'success');
                        setActiveTab('create'); // Switch to create tab to show the generated survey
                      }
                    }}
                    disabled={!aiEnabled || loadingStates['ai-survey']}
                    className={`px-4 py-2 font-bold rounded-lg hover:shadow-lg transition flex items-center gap-2 ${
                      aiEnabled && !loadingStates['ai-survey']
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/25'
                        : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    {loadingStates['ai-survey'] ? 'Generating...' : aiEnabled ? 'AI Generate Survey' : 'AI Offline'}
                  </button>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setActiveTab('create');
                        addNotification('Opening survey creation wizard...', 'info');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105"
                    >
                      + Create Survey
                    </button>
                    <button
                      onClick={() => {
                        addNotification('Import Questions feature - allows uploading questions from CSV or previous surveys', 'info');
                      }}
                      className="px-4 py-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-lg hover:bg-white/20 transition transform hover:scale-105"
                    >
                      📥 Import Questions
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Features Status */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  AI Features
                </h3>
                <div className="space-y-4">
                  {aiEnabled ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">AI Features Active</span>
                          </div>
                          <p className="text-green-300 text-sm mt-1">Claude AI is ready to help with survey creation and analysis.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div>
                          <div className="flex items-center gap-2 text-yellow-400">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-medium">AI Features Offline</span>
                          </div>
                          <p className="text-yellow-300 text-sm mt-1">AI services are temporarily unavailable. Basic features still work.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <h4 className="text-white font-medium mb-1">Survey Generation</h4>
                      <p className="text-purple-300 text-sm">AI-powered survey creation</p>
                      <div className={`mt-2 text-xs px-2 py-1 rounded-full ${
                        aiEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {aiEnabled ? 'Available' : 'Offline'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <h4 className="text-white font-medium mb-1">Data Analysis</h4>
                      <p className="text-purple-300 text-sm">Intelligent insights</p>
                      <div className={`mt-2 text-xs px-2 py-1 rounded-full ${
                        aiEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {aiEnabled ? 'Available' : 'Offline'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Existing Surveys List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentSurveys.map((survey, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition transform hover:scale-105">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{survey.name}</h3>
                        <p className="text-purple-300 text-sm">{survey.responses} responses</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        survey.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        survey.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {survey.status}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-purple-300 mb-4">
                      <span>Created {survey.created}</span>
                      <span>{survey.reward} tokens each</span>
                    </div>

                    {/* Survey Management Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedSurvey(survey);
                          addNotification(`Viewing survey: ${survey.name}`, 'info');
                        }}
                        className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-xs hover:bg-indigo-500/30 transition"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => {
                          if (survey.status === 'draft' || survey.status === 'active') {
                            setActiveTab('create');
                            addNotification(`Editing survey: ${survey.name}`, 'info');
                          } else {
                            addNotification('Completed surveys cannot be edited', 'warning');
                          }
                        }}
                        disabled={survey.status === 'completed'}
                        className={`px-3 py-1 rounded-lg text-xs transition ${
                          survey.status === 'completed'
                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          // Toggle pause/complete
                          addNotification(`${survey.status === 'active' ? 'Paused' : 'Activated'} survey: ${survey.name}`, 'success');
                        }}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs hover:bg-yellow-500/30 transition"
                      >
                        {survey.status === 'active' ? '⏸️ Pause' : '▶️ Activate'}
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('analytics');
                          addNotification(`Viewing analytics for: ${survey.name}`, 'info');
                        }}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition"
                      >
                        📊 Analytics
                      </button>
                      {aiEnabled && (
                        <button
                          onClick={async () => {
                            const analysis = await analyzeSurveyData(survey, []);
                            if (analysis) {
                              addNotification(`AI analysis generated for: ${survey.name}`, 'success');
                            }
                          }}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition"
                        >
                          🤖 AI Analysis
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main render logic with Notification System
  return (
    <>
      <NotificationSystem />
      {selectedSurvey ? (
        <SurveyInterface />
      ) : (
        <>
          {currentView === 'landing' && <LandingPage />}
          {currentView === 'login' && <AuthPage />}
          {currentView === 'register' && <AuthPage />}
          {currentView === 'userDash' && <UserDashboard />}
          {currentView === 'companyDash' && <CompanyDashboard />}
          {currentView === 'upgrade' && <PremiumUpgrade />}
        </>
      )}
    </>
  );

  // Full AI Analysis Modal
  const renderFullAIAnalysis = () => {
    if (!showFullAnalysis || !fullAIAnalysis) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Full AI Analysis Report</h2>
                <p className="text-purple-300">Comprehensive business insights powered by Claude AI</p>
              </div>
              <button
                onClick={() => setShowFullAnalysis(false)}
                className="p-2 text-purple-300 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Executive Summary */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Executive Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{fullAIAnalysis.metrics.totalResponses}</div>
                  <div className="text-purple-300 text-sm">Total Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">{fullAIAnalysis.metrics.averageRating}</div>
                  <div className="text-purple-300 text-sm">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{fullAIAnalysis.metrics.completionRate}</div>
                  <div className="text-purple-300 text-sm">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">{fullAIAnalysis.metrics.topIssues.length}</div>
                  <div className="text-purple-300 text-sm">Key Issues Identified</div>
                </div>
              </div>
              <p className="text-purple-300 leading-relaxed">{fullAIAnalysis.summary}</p>
            </div>

            {/* Key Insights */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                Key Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fullAIAnalysis.insights.map((insight, i) => {
                  const IconComponent = insight.icon;
                  return (
                    <div key={i} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <IconComponent className={`w-5 h-5 mt-0.5 ${
                          insight.type === 'critical' ? 'text-red-400' :
                          insight.type === 'opportunity' ? 'text-yellow-400' :
                          'text-green-400'
                        }`} />
                        <div>
                          <h4 className="text-white font-medium mb-1">{insight.title}</h4>
                          <p className="text-purple-300 text-sm">{insight.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-400" />
                AI Recommendations
              </h3>
              <div className="space-y-4">
                {fullAIAnalysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-emerald-500/10 rounded-xl">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-400 font-bold text-sm">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-emerald-300">{rec}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition">
                          Implement
                        </button>
                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition">
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                Critical Alerts & Action Items
              </h3>
              <div className="space-y-4">
                {fullAIAnalysis.alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                    <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-red-300">{alert}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition">
                          Investigate
                        </button>
                        <button className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30 transition">
                          Create Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => addNotification('PDF export feature coming soon!', 'info')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export PDF
              </button>
              <button
                onClick={() => addNotification('Report scheduled for weekly delivery!', 'success')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule Weekly
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'auth' && <AuthPage />}
        {currentView === 'userDash' && <UserDashboard />}
        {currentView === 'companyDash' && <CompanyDashboard />}
        {currentView === 'upgrade' && <PremiumUpgrade />}
      </div>
    </div>
  );
}

export default App;
