'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { copilotChatFlow } from '@/ai/flows/copilotChatFlow';
import { getProfile } from '@/lib/storage';

export function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string, time: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const getSuggestedPrompts = () => {
    if (pathname.includes('/dashboard')) return ["Why is my score low?", "What should I do this week?", "Show my best opportunity"];
    if (pathname.includes('/skills')) return ["What skill should I add?", "Which skills are dying?", "Compare me to market"];
    if (pathname.includes('/career-routes')) return ["Which path is best for me?", "How long to become a PM?", "What's missing from my profile?"];
    return ["What can you help me with?", "Analyze my profile", "Find me a job"];
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const newMsg = { role: 'user' as const, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const profile = getProfile() || {};
      const response = await copilotChatFlow({ message: text, pageContext: pathname, userProfile: profile });
      setMessages(prev => [...prev, { role: 'ai', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to Ollama locally right now.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[80vh] bg-background border shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <Sparkles className="w-5 h-5" />
                 <h3 className="font-bold">SkillMapper Copilot</h3>
               </div>
               <button onClick={() => setIsOpen(false)} className="hover:bg-purple-700 p-1 rounded transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
               {messages.length === 0 && (
                 <div className="text-center text-muted-foreground p-6 space-y-2">
                   <p className="text-sm">Hi! I'm your AI career assistant. Ask me anything about your skills or market trends.</p>
                 </div>
               )}
               {messages.map((m, i) => (
                 <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-900 border rounded-bl-none shadow-sm'}`}>
                      {m.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</span>
                 </div>
               ))}
               {isLoading && (
                 <div className="flex items-start">
                   <div className="bg-white dark:bg-slate-900 border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                   </div>
                 </div>
               )}
               <div ref={endOfMessagesRef} />
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 border-t space-y-3">
               <div className="flex gap-2 text-xs overflow-x-auto pb-1 scrollbar-hide">
                 {getSuggestedPrompts().map(p => (
                   <button key={p} onClick={() => handleSend(p)} className="flex-none whitespace-nowrap px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 transition-colors font-medium border border-purple-200 dark:border-purple-800">
                     {p}
                   </button>
                 ))}
               </div>
               <div className="flex gap-2">
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                    placeholder="Ask Copilot..." 
                    className="flex-1 bg-muted px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 ring-purple-500/50"
                  />
                  <button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()} className="bg-purple-600 text-white p-2 rounded-xl disabled:opacity-50 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-xl shadow-purple-500/30 hover:scale-105 transition-transform z-50 flex items-center justify-center group"
      >
         <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
         {!isOpen && messages.length === 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />}
      </button>
    </>
  );
}
