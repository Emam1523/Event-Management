import { useState } from 'react';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import { chatAPI } from '../../services/api';

const Assistant = () => {
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi! I am your AuraPass AI Assistant. You can ask me anything about events in Bangladesh, or any general question you have!'
    }
  ]);

  const suggestedPrompts = [
    'Concerts in Dhaka',
    'How to book a ticket?',
    'What is AuraPass?',
    'Tell me a joke'
  ];

  const formatEventDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Date TBA';
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleChatSend = async (messageText) => {
    const trimmed = messageText.trim();
    if (!trimmed || chatLoading) return;

    const userMessage = { id: `${Date.now()}-user`, role: 'user', text: trimmed };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await chatAPI.sendMessage(trimmed);
      const reply = response?.data?.data?.reply || 'I am sorry, I could not process that.';
      const events = response?.data?.data?.events || [];
      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: reply,
        events
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage = {
        id: `${Date.now()}-assistant-error`,
        role: 'assistant',
        text: 'Sorry, I could not reach the assistant. Please try again.'
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="bg-dark-bg min-h-screen text-slate-200 pt-24 pb-16">
      <div className="container-custom">
        <div className="relative rounded-[2.5rem] border border-white/10 bg-[#0c0c10]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <FiMessageSquare className="text-lg" />
              </div>
              <div>
                <div className="text-sm font-black text-white">AuraPass AI Assistant</div>
                <div className="text-[11px] text-slate-400">Ask me anything</div>
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">Live</div>
          </div>

          <div className="h-[460px] overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4 space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium ${
                      message.role === 'user' ? 'bg-rose-500 text-white' : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>

                {message.role === 'assistant' && message.events?.length > 0 && (
                  <div className="grid grid-cols-1 gap-3">
                    {message.events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3"
                      >
                        <img
                          src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'}
                          alt={event.title}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-white line-clamp-1">{event.title}</div>
                          <div className="text-xs text-slate-400">
                            {formatEventDate(event.date)} · {event.location}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-white">
                          {event.price ? `৳${Number(event.price).toLocaleString()}` : 'Free'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-white/5 text-slate-300">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setChatInput(prompt)}
                className="px-3 py-2 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white hover:border-white/20 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="mt-4 flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleChatSend(chatInput);
            }}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500/70 outline-none focus:border-primary/40"
            />
            <button
              type="submit"
              className="h-12 w-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-500/90 transition-colors"
              aria-label="Send message"
            >
              <FiSend className="text-lg" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
