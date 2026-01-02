
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage, Product } from '../types';
import Button from './Button';

interface ChatBotProps {
  products: Product[];
}

const ChatBot: React.FC<ChatBotProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to Ak Shop! How can I assist your premium shopping experience today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getChatResponse([...messages, newUserMessage], products);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-[32px] shadow-2xl border border-orange-100 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-orange-600 p-6 flex justify-between items-center text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                <i className="fa-solid fa-headset text-lg"></i>
              </div>
              <div>
                <span className="font-black text-sm tracking-tight block">Ak Assistant</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-orange-200">Online Support</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 w-8 h-8 flex items-center justify-center rounded-full transition-colors">
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[20px] px-4 py-3 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-orange-600 text-white font-medium rounded-tr-none' 
                    : 'bg-white text-slate-700 font-medium border border-gray-100 rounded-tl-none'
                }`}>
                  <p className="text-[12px] leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-[20px] rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How can I help you?"
              className="flex-1 px-4 py-3 bg-slate-50 border border-transparent focus:border-orange-200 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold placeholder:text-slate-400"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center hover:bg-orange-700 disabled:opacity-50 shadow-lg shadow-orange-100 active:scale-90 transition-all"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-orange-600 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:bg-orange-700 transition-all hover:scale-110 active:scale-95 group relative"
      >
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        {isOpen ? (
          <i className="fa-solid fa-minus text-xl"></i>
        ) : (
          <i className="fa-solid fa-comment-dots text-xl group-hover:rotate-12 transition-transform"></i>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
