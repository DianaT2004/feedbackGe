import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Award, Zap, Target, Users, Brain, ChevronRight, Star, MapPin, Clock, Coins, Gift, Trophy, Sparkles, ArrowRight, Eye, CheckCircle, AlertCircle, BarChart3, MessageSquare, Send, Crown, Diamond, Shield, Bell, Settings, LogOut, Plus, Minus, Heart, ThumbsUp, Share, Copy, Download, Upload, Camera, Mic, Video, Phone, Mail, Calendar, Bookmark, Filter, Search, Menu, X, Home, User, CreditCard, Wallet, Banknote, PiggyBank, TrendingDown, Activity, Layers, Layout, Grid, Maximize2, Minimize2, RotateCcw, Play, Pause, Volume2, VolumeX, Wifi, WifiOff, Battery, BatteryLow, Sun, Moon, Cloud, CloudRain, Zap as Lightning } from 'lucide-react';

function App() {
  // Core navigation state
  const [currentView, setCurrentView] = useState('landing');
  const [userType, setUserType] = useState(null);
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
            addNotification(`+₾${selectedSurvey.reward} earned! Keep up the great work!`, 'success');
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
            Georgian companies and researchers need your insights. Complete engaging surveys, earn tokens, withdraw via BOG or TBC.
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

            {/* Social Login */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <p className="text-purple-300 text-sm mb-4 text-center">
                {isLogin ? 'Or continue with' : 'Sign up faster with'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin('tbc')}
                  disabled={loadingStates['social-tbc']}
                  className="py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingStates['social-tbc'] ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <span className="text-xl">🔵</span> TBC ID
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSocialLogin('bog')}
                  disabled={loadingStates['social-bog']}
                  className="py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingStates['social-bog'] ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <span className="text-xl">🟠</span> BOG ID
                    </>
                  )}
                </button>
              </div>
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
          onClick={() => setCurrentView('userDash')}
          className="mb-6 text-purple-300 hover:text-white transition flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-white mb-4">Upgrade to Premium</h1>
          <p className="text-purple-300 text-lg">Unlock advanced features and earn more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Pro',
              price: '₾9.99',
              period: 'month',
              features: ['Advanced Analytics', 'Priority Support', 'Custom Branding', 'API Access'],
              color: 'from-purple-500 to-pink-500',
              popular: false
            },
            {
              name: 'Premium',
              price: '₾19.99',
              period: 'month',
              features: ['All Pro Features', 'AI Insights', 'White-label Solution', 'Dedicated Manager'],
              color: 'from-yellow-500 to-orange-500',
              popular: true
            },
            {
              name: 'Enterprise',
              price: '₾49.99',
              period: 'month',
              features: ['All Premium Features', 'Custom Integrations', 'Advanced Security', '24/7 Support'],
              color: 'from-indigo-500 to-purple-500',
              popular: false
            }
          ].map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-6 transition-all transform hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <PremiumBadge type="premium" size="sm" />
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-1">{plan.price}</div>
                <div className="text-purple-300">per {plan.period}</div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-purple-200">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={async () => {
                  setLoading(`upgrade-${plan.name}`, true);
                  await simulateAction('upgrade');
                  setLoading(`upgrade-${plan.name}`, false);
                }}
                disabled={loadingStates[`upgrade-${plan.name}`]}
                className={`w-full py-3 rounded-xl font-bold transition-all transform ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl hover:shadow-orange-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } ${loadingStates[`upgrade-${plan.name}`] ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                {loadingStates[`upgrade-${plan.name}`] ? (
                  <LoadingSpinner />
                ) : (
                  `Upgrade to ${plan.name}`
                )}
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
                      <h2 className="text-6xl font-bold text-white mb-4">₾{userProfile.balance.toFixed(2)}</h2>
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
                    <p className="text-white/90 font-medium">₾{(50 - userProfile.balance).toFixed(2)} more to unlock bank transfer</p>
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

          {activeTab === 'analytics' && requirePremium('analytics') && (
            <div className="text-center py-20">
              <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
              <p className="text-purple-300 mb-6">Get detailed insights into your survey performance</p>
              <button
                onClick={() => setCurrentView('upgrade')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
              >
                Upgrade to Premium
              </button>
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
    const [activeTab, setActiveTab] = useState('overview');

    console.log('CompanyDashboard rendering, activeTab:', activeTab);

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
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FeedbackGe</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex gap-6">
                {[
                  { id: 'overview', label: 'Dashboard', icon: Layout },
                  { id: 'surveys', label: 'My Surveys', icon: Target },
                  { id: 'create', label: 'Create Survey', icon: Plus },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'reports', label: 'Reports', icon: FileText }
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
              <PremiumBadge type="premium" />
              <button
                onClick={() => addNotification('Settings panel coming soon!', 'info')}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition"
              >
                <Settings className="w-5 h-5" />
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

        {/* Dashboard Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {/* Debug info */}
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              🔬 <strong>Company Dashboard Loaded</strong> | Active Tab: <strong>{activeTab}</strong> | User Type: <strong>company</strong>
            </p>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome to your Research Dashboard! 🔬
                </h1>
                <p className="text-purple-300">Monitor your survey performance and gather valuable insights</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Active Surveys', value: '12', change: '+3', icon: Target, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Total Responses', value: '8,542', change: '+1,247', icon: Users, color: 'from-green-500 to-emerald-500' },
                  { label: 'Avg. Satisfaction', value: '4.3', change: '+0.2', icon: Star, color: 'from-yellow-500 to-orange-500' },
                  { label: 'Completion Rate', value: '87%', change: '+5%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' }
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

              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-indigo-400" />
                    Response Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
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

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-400" />
                    Demographic Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={demographicData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="age" stroke="#ffffff60" />
                      <YAxis stroke="#ffffff60" />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-indigo-400" />
                  AI-Powered Insights
                  <span className="ml-auto text-xs px-3 py-1 bg-purple-500/30 rounded-full">Premium</span>
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Critical Issue</h4>
                        <p className="text-purple-200 text-xs">23% mentioned slow delivery</p>
                      </div>
                    </div>
                    <button className="text-red-400 text-sm font-medium hover:text-red-300 transition">
                      View analysis →
                    </button>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Growth Opportunity</h4>
                        <p className="text-purple-200 text-xs">78% willing to pay premium</p>
                      </div>
                    </div>
                    <button className="text-yellow-400 text-sm font-medium hover:text-yellow-300 transition">
                      Explore strategy →
                    </button>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Key Strength</h4>
                        <p className="text-purple-200 text-xs">156 positive staff mentions</p>
                      </div>
                    </div>
                    <button className="text-green-400 text-sm font-medium hover:text-green-300 transition">
                      Get recommendations →
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Plus, label: 'New Survey', color: 'from-blue-500 to-cyan-500', action: () => setActiveTab('create') },
                  { icon: Download, label: 'Export Data', color: 'from-green-500 to-emerald-500', action: () => addNotification('Data export started!', 'success') },
                  { icon: Share, label: 'Share Results', color: 'from-purple-500 to-pink-500', action: () => simulateAction('share') },
                  { icon: Settings, label: 'Settings', color: 'from-orange-500 to-red-500', action: () => addNotification('Settings panel coming soon!', 'info') }
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      action.action();
                      triggerAnimation(`action-${i}`, 'animate-bounce');
                    }}
                    className={`p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-all transform hover:scale-105 group ${animations[`action-${i}`] || ''}`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 mx-auto transition-transform group-hover:rotate-12`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white font-medium text-center">{action.label}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === 'surveys' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Your Surveys</h2>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New Survey
                </button>
              </div>

              <div className="space-y-4">
                {georgianSurveys.map(survey => (
                  <div key={survey.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${survey.color} rounded-xl flex items-center justify-center text-2xl`}>
                          {survey.logo}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{survey.title}</h3>
                          <p className="text-purple-300">{survey.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-purple-300">
                            <span>₾{survey.reward} reward</span>
                            <span>{survey.responses.toLocaleString()} responses</span>
                            <span>{survey.time} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => addNotification('Edit survey feature coming soon!', 'info')}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition transform hover:scale-105"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => addNotification('Viewing detailed survey results...', 'info')}
                          className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition transform hover:scale-105"
                        >
                          View Results
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`Check out this survey: ${survey.title}`);
                            addNotification('Survey link copied to clipboard!', 'success');
                          }}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition transform hover:scale-105 flex items-center gap-1"
                        >
                          <Share className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Create New Survey</h2>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-white mb-2 text-sm font-medium">Survey Title</label>
                    <input
                      type="text"
                      placeholder="Enter survey title..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 text-sm font-medium">Description</label>
                    <textarea
                      placeholder="Describe your survey..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 text-sm font-medium">Reward (₾)</label>
                      <input
                        type="number"
                        placeholder="2.50"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2 text-sm font-medium">Estimated Time (min)</label>
                      <input
                        type="number"
                        placeholder="10"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition">
                      Save Draft
                    </button>
                    <button
                      onClick={() => {
                        addNotification('Survey created successfully! 🎉', 'success');
                        setActiveTab('surveys');
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Create Survey
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-20">
              <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
              <p className="text-purple-300 mb-6">Detailed insights and performance metrics</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { title: 'Response Quality', value: '98%', color: 'from-green-500 to-emerald-500' },
                  { title: 'Survey Completion', value: '87%', color: 'from-blue-500 to-cyan-500' },
                  { title: 'User Satisfaction', value: '4.3/5', color: 'from-yellow-500 to-orange-500' },
                  { title: 'Data Accuracy', value: '95%', color: 'from-purple-500 to-pink-500' }
                ].map((metric, i) => (
                  <div key={i} className={`p-6 bg-gradient-to-br ${metric.color} rounded-2xl text-white`}>
                    <div className="text-3xl font-bold mb-2">{metric.value}</div>
                    <div className="text-white/80 text-sm">{metric.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-2">Research Reports</h2>
              <p className="text-purple-300 mb-6">Generate comprehensive reports and insights</p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => addNotification('Generating response analysis report...', 'info')}
                    className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all"
                  >
                    <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-white font-medium">Response Analysis</div>
                    <div className="text-blue-300 text-sm">Detailed metrics</div>
                  </button>

                  <button
                    onClick={() => addNotification('Generating demographic insights report...', 'info')}
                    className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all"
                  >
                    <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-medium">Demographic Insights</div>
                    <div className="text-green-300 text-sm">Audience analysis</div>
                  </button>

                  <button
                    onClick={() => addNotification('Generating satisfaction report...', 'info')}
                    className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-all"
                  >
                    <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-white font-medium">Satisfaction Report</div>
                    <div className="text-purple-300 text-sm">Customer feedback</div>
                  </button>
                </div>

                <button
                  onClick={() => addNotification('Full comprehensive report generated! 📊', 'success')}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Generate Comprehensive Report
                </button>
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
}

export default App;