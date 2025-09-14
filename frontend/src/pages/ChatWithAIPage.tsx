import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '@/utils/api';
import { ChatMessage, WebSource, CourseRecommendation, SearchInfo } from '@/types';

// Use the ChatMessage interface from types

export const ChatWithAIPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your course planning assistant. I can help you choose courses, understand prerequisites, check course schedules, and provide academic advice. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the real GPT-5 API
      const response = await chatApi.sendMessage(inputMessage, conversationId || undefined);
      
      // Update conversation ID if this is a new conversation
      if (!conversationId) {
        setConversationId(response.data.conversationId);
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.data.message,
        sender: 'ai',
        timestamp: new Date(),
        sources: response.data.sources,
        recommendations: response.data.recommendations,
        searchInfo: response.data.searchInfo
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Component to render web sources
  const WebSources = ({ sources }: { sources: WebSource[] }) => {
    if (!sources || sources.length === 0) return null;
    
    return (
      <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <h4 className="font-semibold text-blue-800 mb-2">📚 Web Sources</h4>
        <div className="space-y-2">
          {sources.map((source, index) => (
            <div key={index} className="text-sm">
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {source.title}
              </a>
              <p className="text-gray-600 mt-1">{source.snippet}</p>
              <span className="text-xs text-gray-500">{source.domain}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Component to render course recommendations
  const CourseRecommendations = ({ recommendations }: { recommendations: CourseRecommendation[] }) => {
    try {
      if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) return null;
      
      return (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h4 className="font-semibold text-green-800 mb-2">🎯 Course Recommendations</h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => {
              // Safely extract values with fallbacks
              const courseCode = rec?.courseCode || rec?.course_code || 'N/A';
              const title = rec?.title || 'N/A';
              const description = rec?.description || 'No description available';
              const rationale = rec?.rationale || 'No rationale provided';
              const matchScore = rec?.matchScore || rec?.match_score || 0;
              const prerequisites = rec?.prerequisites;
              
              return (
                <div key={index} className="border border-green-200 rounded p-3 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-green-800">{courseCode} - {title}</h5>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      Match: {matchScore}/10
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{description}</p>
                  <p className="text-sm text-green-700 mb-2"><strong>Why:</strong> {rationale}</p>
                  {prerequisites && Array.isArray(prerequisites) && prerequisites.length > 0 && (
                    <p className="text-xs text-gray-600">
                      <strong>Prerequisites:</strong> {prerequisites.join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering course recommendations:', error);
      return (
        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <p className="text-yellow-800">Unable to display course recommendations at this time.</p>
        </div>
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    "Recommend courses for computer science major",
    "Check prerequisites for CS201", 
    "Help me plan my fall schedule",
    "What courses have the best professors?",
    "Suggest courses based on my career goals",
    "Find courses that fit my morning schedule"
  ];

  const clearConversation = async () => {
    if (conversationId) {
      try {
        await chatApi.clearConversation(conversationId);
        setMessages([{
          id: '1',
          content: "Hi! I'm your course planning assistant. I can help you choose courses, understand prerequisites, check course schedules, and provide academic advice. How can I help you today?",
          sender: 'ai',
          timestamp: new Date()
        }]);
        setConversationId(null);
      } catch (error) {
        console.error('Error clearing conversation:', error);
      }
    }
  };

  return (
    <div className="container-linkedin py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-linkedin mb-4">Chat with AI Assistant</h1>
          <p className="subheading-linkedin">
            Get personalized course recommendations and academic guidance
          </p>
          {conversationId && (
            <button
              onClick={clearConversation}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear Conversation
            </button>
          )}
        </div>

        {/* Chat Container */}
        <div className="chat-container h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`${
                    message.sender === 'user'
                      ? 'chat-message-user'
                      : 'chat-message-ai'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Render web sources for AI messages */}
                  {message.sender === 'ai' && message.sources && (
                    <WebSources sources={message.sources} />
                  )}
                  
                  {/* Render course recommendations for AI messages */}
                  {message.sender === 'ai' && message.recommendations && (
                    <CourseRecommendations recommendations={message.recommendations} />
                  )}
                  
                  <p className={`text-xs mt-1 opacity-70`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="chat-message-ai">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-container">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about courses, schedules, prerequisites..."
                className="flex-1 input-linkedin resize-none"
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="btn-primary-linkedin"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action)}
                className="quick-action"
              >
                <p className="text-sm text-gray-700">{action}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
