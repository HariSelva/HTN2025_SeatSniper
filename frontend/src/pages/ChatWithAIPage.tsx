import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const ChatWithAIPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your course planning assistant. I can help you choose courses, understand prerequisites, check course schedules, and provide academic advice. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual OpenAI API call)
      const aiResponse = await simulateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
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

  const simulateAIResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses based on common course-related queries
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('course') && lowerMessage.includes('recommend')) {
      return "Based on your academic interests, I'd recommend looking at our CS courses. CS101 (Introduction to Computer Science) is perfect for beginners, while CS201 (Data Structures and Algorithms) builds on foundational concepts. What's your current academic level and area of interest?";
    }
    
    if (lowerMessage.includes('prerequisite') || lowerMessage.includes('requirement')) {
      return "I can help you check prerequisites! Most CS courses have specific requirements. For example, CS201 requires CS101 or equivalent programming experience. What specific course are you interested in?";
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('time')) {
      return "I can help you plan your schedule! Our courses are offered at various times throughout the week. Would you like me to show you available time slots for specific courses, or help you avoid scheduling conflicts?";
    }
    
    if (lowerMessage.includes('professor') || lowerMessage.includes('prof')) {
      return "Great question about professors! I can provide information about instructor ratings and teaching styles. Which course or professor are you curious about?";
    }
    
    return "That's a great question! I'm here to help with course selection, scheduling, prerequisites, and academic planning. Could you be more specific about what you'd like to know? For example, you could ask about course recommendations, scheduling conflicts, or prerequisite requirements.";
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
    "What courses have the best professors?"
  ];

  return (
    <div className="container-linkedin py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-linkedin mb-4">Chat with AI Assistant</h1>
          <p className="subheading-linkedin">
            Get personalized course recommendations and academic guidance
          </p>
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
