import React from 'react';
import { useStore } from '../store/useStore';
import { MessageSquare, Send, Trash2, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIChat() {
  const { currentResume, chatHistory, chatLoading, sendChatMessage, clearChat } = useStore();
  const [message, setMessage] = React.useState('');
  const chatBottomRef = React.useRef(null);

  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || chatLoading) return;
    const msg = message;
    setMessage('');
    await sendChatMessage(currentResume.id, msg);
  };

  if (!currentResume) return null;

  return (
    <div className="flex-1 p-6 flex flex-col h-[calc(100vh-70px)] overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-borderSubtle pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-accentPrimary" />
            <span>AI Career Coach Chat</span>
          </h2>
          <p className="text-xs text-textSecondary">Consult AI on improvements, skills packaging, or job targeting</p>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-textSecondary hover:text-brandDanger px-3 py-1.5 rounded-lg border border-borderSubtle hover:bg-brandDanger/5 transition-all"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-2">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-xl bg-bgSurface border border-borderSubtle flex items-center justify-center text-accentViolet shadow-lg">
              <MessageSquare size={22} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-textPrimary">Initiate Consultation</p>
              <p className="text-xs text-textSecondary leading-relaxed">
                Ask specific questions like "How can I better emphasize my Python experience?" or "Draft a summary based on my projects."
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed border ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-accentPrimary/20 to-accentViolet/20 border-accentPrimary/40 text-textPrimary'
                      : 'bg-bgSurface border-borderSubtle text-textSecondary'
                  }`}
                >
                  <span className="font-bold text-[10px] block mb-1 text-textPrimary tracking-wider uppercase font-mono">
                    {msg.role === 'user' ? 'You' : 'AI Career Coach'}
                  </span>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-bgSurface border border-borderSubtle rounded-2xl p-4 flex items-center gap-2 text-xs text-textSecondary font-medium">
                  <Loader2 className="animate-spin text-accentPrimary" size={14} />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

      {/* Input panel */}
      <form onSubmit={handleSend} className="pt-4 border-t border-borderSubtle flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask something about your resume layout or project descriptions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={chatLoading}
          className="flex-1 bg-bgSurface border border-borderSubtle focus:border-accentPrimary rounded-xl py-3 px-4 text-xs text-textPrimary outline-none transition-all placeholder:text-textSecondary/40"
        />
        <button
          type="submit"
          disabled={chatLoading || !message.trim()}
          className="p-3 bg-gradient-to-r from-accentPrimary to-accentViolet text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md shadow-accentPrimary/25 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
