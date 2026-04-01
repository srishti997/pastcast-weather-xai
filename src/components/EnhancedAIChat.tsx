import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/messageClient';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface EnhancedAIChatProps {
  location?: string;
}

const EnhancedAIChat: React.FC<EnhancedAIChatProps> = ({
  location = 'Bengaluru, India',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm your AI assistant. I can help with weather, facts, summaries, translations, and general questions. What would you like to know?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --------------------------
  // MAIN SEND
  // --------------------------
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      console.log('Sending to backend:', query);
      const reply = await sendMessage(query);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'AI server error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // ENTER to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // --------------------------
  // UI
  // --------------------------
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl"></div>

      <div className="relative flex flex-col h-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                AI Assistant
              </h3>
              <p className="text-white/70 text-sm font-medium">{location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 rounded-full px-4 py-2 border border-white/10">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Online</span>
          </div>
        </div>

        {/* MESSAGE LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  m.isUser
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 backdrop-blur-sm text-white border border-white/10 shadow-lg'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>

                <div className="mt-2 text-xs text-white/60 text-right">
                  {formatTime(m.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  </div>
                  <span className="text-white/70 font-medium">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-6 border-t border-white/10">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-500/40 disabled:to-cyan-500/40 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIChat;
