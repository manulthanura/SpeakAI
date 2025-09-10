import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, User, Bot, Play, Pause, RotateCcw, Star, MessageCircle } from 'lucide-react';

const EnglishSpeakingSaaS = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);
  const [currentMode, setCurrentMode] = useState('freeform');
  const [scenario, setScenario] = useState(null);
  const [userRole, setUserRole] = useState('customer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [pronunciationFeedback, setPronunciationFeedback] = useState(null);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
          setTranscript(transcript);
          handleUserMessage(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scenarios = [
    {
      id: 'pizza-order',
      name: 'Pizza Order',
      description: 'Practice ordering pizza online',
      context: 'You are at Tony\'s Pizza. The menu includes Margherita ($12), Pepperoni ($14), Hawaiian ($15), and Supreme ($18).',
      customerStart: "Hi, I'd like to order a pizza for delivery.",
      assistantStart: "Hello! Welcome to Tony's Pizza. How can I help you today?"
    },
    {
      id: 'hotel-booking',
      name: 'Hotel Booking',
      description: 'Practice booking a hotel room',
      context: 'You are at Grand Hotel. Standard rooms are $120/night, Deluxe rooms are $180/night.',
      customerStart: "Hi, I need to book a room for next weekend.",
      assistantStart: "Good day! Welcome to Grand Hotel. I'd be happy to help you with your reservation."
    }
  ];

  const login = (email, password) => {
    // Simulate authentication
    setUser({ email, name: email.split('@')[0] });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setConversation([]);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      synthRef.current.speak(utterance);
    }
  };

  const handleUserMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      text: message,
      speaker: 'user',
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    
    // Simulate pronunciation analysis
    const pronunciationScore = Math.floor(Math.random() * 30) + 70; // 70-100
    setPronunciationFeedback({
      score: pronunciationScore,
      feedback: pronunciationScore > 85 ? "Excellent pronunciation!" : 
                pronunciationScore > 75 ? "Good pronunciation, minor improvements needed." :
                "Work on clarity and stress patterns."
    });

    // Generate AI response based on mode
    let aiResponse = '';
    if (currentMode === 'freeform') {
      aiResponse = generateFreeformResponse(message);
    } else if (currentMode === 'scenario' && scenario) {
      aiResponse = generateScenarioResponse(message, scenario, userRole);
    }

    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      speaker: 'ai',
      timestamp: new Date()
    };

    setTimeout(() => {
      setConversation(prev => [...prev, aiMessage]);
      speak(aiResponse);
    }, 1000);
  };

  const generateFreeformResponse = (message) => {
    const responses = [
      "That's interesting! Can you tell me more about that?",
      "I see what you mean. How do you feel about that situation?",
      "That sounds challenging. What do you think you'll do next?",
      "Great point! Have you experienced something similar before?",
      "That's a good observation. What made you think of that?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateScenarioResponse = (message, scenario, userRole) => {
    if (scenario.id === 'pizza-order') {
      if (userRole === 'customer') {
        // AI is assistant
        if (message.toLowerCase().includes('pizza')) {
          return "Great! What size would you like, and what toppings?";
        }
        return "Perfect! Can I get your delivery address and phone number?";
      } else {
        // AI is customer
        return "Hi, I'd like to order a large pepperoni pizza. How much would that be?";
      }
    }
    return "Let me help you with that.";
  };

  const startScenario = (scenarioData, role) => {
    setScenario(scenarioData);
    setUserRole(role);
    setCurrentMode('scenario');
    setConversation([]);
    
    const initialMessage = role === 'customer' ? scenarioData.assistantStart : scenarioData.customerStart;
    const aiMessage = {
      id: Date.now(),
      text: initialMessage,
      speaker: 'ai',
      timestamp: new Date()
    };
    
    setConversation([aiMessage]);
    speak(initialMessage);
  };

  const resetConversation = () => {
    setConversation([]);
    setCurrentMode('freeform');
    setScenario(null);
    setPronunciationFeedback(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">SpeakAI</h1>
            <p className="text-gray-600 mt-2">Your English Speaking Practice Partner</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => login('demo@example.com', 'password')}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Demo: Click Sign In to continue</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SpeakAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selection */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => { setCurrentMode('freeform'); resetConversation(); }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentMode === 'freeform' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Free Conversation
            </button>
            <button
              onClick={() => setCurrentMode('scenarios')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentMode === 'scenarios' || currentMode === 'scenario'
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Scenario Practice
            </button>
          </div>

          {currentMode === 'scenarios' && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {scenarios.map((scenarioData) => (
                <div key={scenarioData.id} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{scenarioData.name}</h3>
                  <p className="text-gray-600 mb-4">{scenarioData.description}</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => startScenario(scenarioData, 'customer')}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Play as Customer
                    </button>
                    <button
                      onClick={() => startScenario(scenarioData, 'assistant')}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Play as Assistant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(currentMode === 'freeform' || currentMode === 'scenario') && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Conversation Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-8 h-8 text-blue-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {currentMode === 'scenario' && scenario 
                          ? `${scenario.name} - You are the ${userRole}`
                          : 'Conversation Practice'
                        }
                      </h2>
                      {currentMode === 'scenario' && scenario && (
                        <p className="text-sm text-gray-500">{scenario.context}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={resetConversation}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {conversation.length === 0 && currentMode === 'freeform' && (
                    <div className="text-center text-gray-500 mt-20">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start speaking to begin your conversation practice!</p>
                    </div>
                  )}
                  
                  {conversation.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.speaker === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.speaker === 'ai' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.speaker === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.text}
                      </div>
                      {message.speaker === 'user' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Voice Controls */}
                <div className="p-6 border-t">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`flex items-center justify-center w-16 h-16 rounded-full transition-all transform hover:scale-105 ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                  </div>
                  {isListening && (
                    <p className="text-center text-gray-600 mt-2 text-sm">
                      Listening... Speak now
                    </p>
                  )}
                  {transcript && (
                    <p className="text-center text-gray-800 mt-2 text-sm bg-gray-100 p-2 rounded-lg">
                      "{transcript}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pronunciation Feedback */}
            <div className="space-y-6">
              {pronunciationFeedback && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Volume2 className="w-5 h-5 mr-2 text-purple-600" />
                    Pronunciation Score
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-purple-600">
                        {pronunciationFeedback.score}/100
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(pronunciationFeedback.score / 20)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pronunciationFeedback.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {pronunciationFeedback.feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Practice Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Speak clearly and at a moderate pace
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Focus on word stress and intonation
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Practice in a quiet environment
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Try different scenarios regularly
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishSpeakingSaaS;