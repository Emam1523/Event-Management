import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiSend,
  FiCalendar,
  FiMapPin,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { chatAPI } from "../../services/api";
import { useNotifications } from "../../context/NotificationContext";

const SUGGESTIONS = [
  { text: "Concerts in Dhaka this month", icon: "🎵" },
  { text: "Are there any food festivals?", icon: "🍔" },
  { text: "How do I download my tickets?", icon: "🎟️" },
  { text: "Show all upcoming events", icon: "✨" },
];
const AI_CAPABILITIES = [
  {
    title: "Find by Mood & Genre",
    desc: "Ask for 'live music nearby', 'rooftop parties', or 'family-friendly festivals'.",
    icon: "🎵",
  },
  {
    title: "Smart Filtering",
    desc: "Tell the AI to filter events by custom dates, locations, or budget ranges.",
    icon: "📍",
  },
  {
    title: "Ticket Support",
    desc: "Get instant guidance on how to download, view, or check booking issues.",
    icon: "🎟️",
  },
];

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I am NEXTDHAKA AI. I can recommend premium events, answer ticket booking queries, or help with general questions. What are you looking for today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  const { showNotification } = useNotifications();
  const location = useLocation();
  const queryProcessedRef = useRef(false);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(
    async (textToSend) => {
      const query = textToSend.trim();
      if (!query || isLoading) return;

      // Add user message
      const userMsgId = `user-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          role: "user",
          text: query,
          timestamp: new Date().toISOString(),
        },
      ]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await chatAPI.sendMessage(query);

        if (response.data?.success) {
          const { reply, events } = response.data.data;

          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              text: reply,
              events: events || [],
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          showNotification(
            response.data?.message || "Failed to get a reply.",
            "error",
          );
        }
      } catch (error) {
        console.error("Chat error:", error);
        showNotification(
          "Unable to connect to NEXTDHAKA AI. Try again.",
          "error",
        );

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text: "I apologize, but I am having trouble connecting to my brain right now. Please verify your connection and try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, showNotification],
  );

  useEffect(() => {
    if (queryProcessedRef.current) return;
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get("q") || params.get("query");
    if (initialQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSendMessage(initialQuery);
      queryProcessedRef.current = true;
    }
  }, [location.search, handleSendMessage]);

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-UK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-dark-bg h-screen text-zinc-200 relative overflow-hidden flex flex-col pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-6">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-100 h-100 bg-[#ff2d55]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container-custom relative z-10 flex flex-col flex-1 min-h-0 mt-10">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-6 mx-6 mb-6 border-b border-white/5">
          <div className="flex items-center gap-4 text-left">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl font-black text-white uppercase tracking-tight">
                  NEXTDHAKA AI
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            <FiZap className="text-primary animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-zinc-300 uppercase">
              Assistant Active
            </span>
          </div>
        </div>

        {/* Main Grid: suggestions sidebar + chat */}
        <div className="flex-1 flex gap-8 min-h-0">
          {/* Sidebar - Suggestions */}
          <aside className="hidden lg:block w-80 shrink-0 text-left">
            <div className="space-y-6 bg-white/1 border border-white/5 p-6 rounded-4xl h-full flex flex-col justify-start">
              <div>
                <h3 className="text-white text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-primary">💡</span> Tips
                </h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  Click on one of the common queries below to quickly ask the
                  AI:
                </p>
              </div>

              {/* Dynamic Feature list loop */}
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {AI_CAPABILITIES.map((capability, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{capability.icon}</span>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {capability.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-medium leading-normal pl-7">
                      {capability.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 text-[10px] text-zinc-600 font-bold uppercase tracking-wider text-center">
                NEXTDHAKA Intelligence
              </div>
            </div>
          </aside>

          {/* Chat Pane */}
          <div className="grow flex flex-col overflow-hidden border border-white/5 rounded-4xl">
            {/* Scrollable messages area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs shrink-0 self-end">
                      ✨
                    </div>
                  )}

                  <div className="max-w-[80%] md:max-w-[70%] space-y-3 text-left">
                    {/* Text Bubble */}
                    <div
                      className={`px-5 py-4 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-lg ${
                        msg.role === "user"
                          ? "bg-linear-to-r from-brand-primary to-brand-secondary text-white shadow-brand-primary/10 rounded-tr-none"
                          : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none"
                      }`}
                    >
                      {/* Process text line breaks */}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Meta Timestamp */}
                    <div
                      className={`text-[9px] text-zinc-600 font-bold uppercase tracking-widest px-2 ${
                        msg.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>

                    {/* Inline Event Recommendations (if any exist) */}
                    {msg.events && msg.events.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {msg.events.map((event) => (
                          <div
                            key={event.id}
                            className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-colors flex flex-col h-full"
                          >
                            <img
                              src={
                                event.image ||
                                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"
                              }
                              className="h-32 w-full object-cover"
                              alt={event.title}
                            />
                            <div className="p-4 flex flex-col flex-1">
                              <h4 className="font-extrabold text-sm text-white line-clamp-1 uppercase">
                                {event.title}
                              </h4>

                              <div className="mt-2 flex flex-col gap-1 text-[10px] text-zinc-400 font-semibold">
                                <div className="flex items-center gap-1.5">
                                  <FiCalendar className="text-primary" />
                                  <span>
                                    {new Date(event.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                      },
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <FiMapPin className="text-primary" />
                                  <span className="truncate">
                                    {event.location}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
                                <span className="text-xs font-black text-white">
                                  {event.price && event.price > 0
                                    ? `৳${Number(event.price).toLocaleString()}`
                                    : "Free"}
                                </span>
                                <Link
                                  to={`/events/${event.id}`}
                                  className="px-3 py-1.5 bg-primary rounded-lg text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-primary/10 hover:bg-orange-600 transition-colors"
                                >
                                  Book <FiArrowRight />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-8 grid grid-cols-2 gap-4 max-w-xl mx-auto"
                >
                  {SUGGESTIONS.map((sug) => (
                    <button
                      key={sug.text}
                      type="button"
                      onClick={() => handleSendMessage(sug.text)}
                      disabled={isLoading}
                      className="p-5 rounded-2xl bg-white/2 border border-white/5 hover:border-brand-primary/35 text-left hover:bg-white/4 hover:scale-[1.01] active:scale-98 transition-all duration-300 text-xs font-semibold text-zinc-300 hover:text-white flex flex-col gap-2.5 cursor-pointer disabled:opacity-50"
                    >
                      <span className="text-2xl">{sug.icon}</span>
                      <span className="leading-relaxed">{sug.text}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs shrink-0 self-end">
                    ✨
                  </div>
                  <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-[1.5rem] rounded-tl-none flex items-center gap-1.5 self-start shadow-lg">
                    <span
                      className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="p-4 bg-dark-card/20 border-t border-white/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex gap-3 bg-white/2 border border-white/10 rounded-2xl p-1.5 focus-within:border-brand-primary/50 transition-colors"
              >
                <input
                  type="text"
                  placeholder="Ask NEXTDHAKA AI anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="grow bg-transparent border-none outline-none text-white text-sm px-4 py-2 placeholder:text-zinc-600 font-semibold"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-xl bg-linear-to-r from-brand-primary to-brand-secondary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 disabled:hover:brightness-100 cursor-pointer"
                  aria-label="Send message"
                >
                  <FiSend />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
