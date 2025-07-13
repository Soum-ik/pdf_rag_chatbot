'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, FileText } from 'lucide-react';
import * as React from 'react';

interface Doc {
  pageContent?: string;
  metadata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}
interface IMessage {
  role: 'assistant' | 'user';
  content?: string;
  documents?: Doc[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>('');
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  // Add state to track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = React.useState(false);

  // Use useEffect to mark component as mounted after hydration
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (isMounted) {
      scrollToBottom();
    }
  }, [messages, isMounted]);

  const handleSendChatMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch(
        `http://localhost:8000/chat?message=${encodeURIComponent(userMessage)}`
      );
      const data = await res.json();
      console.log('Chat response data:', data);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.message,
          documents: data?.docs,
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  // Only render the actual UI content after client-side hydration is complete
  if (!isMounted) {
    return <div className="flex flex-col h-[calc(100vh-80px)] p-6"></div>; // Simple placeholder during SSR
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-6">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Welcome to PDF Chat</p>
              <p className="text-sm">
                Upload a PDF document and start asking questions!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              } message-enter`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[80%] lg:max-w-[70%] ${
                  msg.role === 'user'
                    ? 'glass rounded-2xl rounded-br-md p-4 text-white border-sky-500/20'
                    : 'glass rounded-2xl rounded-bl-md p-4 text-white border-slate-600/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      msg.role === 'user'
                        ? 'bg-sky-500/20 border border-sky-500/30'
                        : 'bg-slate-600/20 border border-slate-500/30'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-sky-300" />
                    ) : (
                      <Bot className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400 mb-1 font-medium">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>

                    {msg.documents && msg.documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <FileText className="w-3 h-3" />
                          Source References:
                        </div>
                        {(Array.isArray(msg.documents) ? msg.documents : []).slice(0, 2).map((doc, docIndex) => (
                          <div
                            key={docIndex}
                            className="glass rounded-lg p-3 text-xs text-slate-300 border border-slate-600/30"
                          >
                            <div className="font-medium mb-1 text-sky-300">
                              Page {doc.metadata?.loc?.pageNumber || 'Unknown'}
                            </div>
                            <div className="line-clamp-3 text-slate-400">
                              {doc.pageContent?.substring(0, 150)}...
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start message-enter">
            <div className="glass rounded-2xl rounded-bl-md p-4 text-white border border-slate-600/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-slate-600/20 border border-slate-500/30">
                  <Bot className="w-4 h-4 text-slate-300" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass rounded-2xl p-4 mt-4 border border-slate-600/30">
        <div className="flex gap-3 items-end">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your uploaded PDF..."
            className="flex-1 bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder-slate-400 rounded-xl focus:border-sky-400/50 focus:ring-sky-400/20"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendChatMessage}
            disabled={!message.trim() || isLoading}
            className="gradient-primary hover:shadow-lg hover:shadow-sky-500/25 rounded-xl px-4 py-2 text-white border-0 transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
