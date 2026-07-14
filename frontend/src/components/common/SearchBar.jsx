import { FiSearch, FiSend } from "react-icons/fi";
import { useState, useEffect } from "react";

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  className = "",
  suggestions = [
    "Shows in Bangkok...",
    "Concerts in Dhaka...",
    "Exclusive Workshops...",
    "Tech Conferences...",
    "Art Exhibitions...",
  ],
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const currentFullText = suggestions[placeholderIndex % suggestions.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentFullText.substring(0, text.length + 1));
          if (text === currentFullText) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setText(currentFullText.substring(0, text.length - 1));
          if (text === "") {
            setIsDeleting(false);
            setPlaceholderIndex(placeholderIndex + 1);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, placeholderIndex, suggestions]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit(value);
      }}
      className={`relative group flex items-center gap-4 ${className}`}
    >
      <div className="relative flex-1 group">
        <div className="absolute -inset-0.5 bg-linear-to-r from-brand-orange to-red-600 rounded-3xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
        <div className="relative flex items-center">
          <FiSearch
            className="absolute left-7 text-zinc-500 group-focus-within:text-brand-orange transition-colors"
            size={24}
          />
          <input
            type="text"
            placeholder={text}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-16 pr-8 py-6 rounded-3xl bg-[#09090b] border border-zinc-800/50 text-white placeholder:text-zinc-300/60 focus:outline-none focus:border-zinc-700 transition-all text-xl font-bold tracking-tight shadow-2xl"
          />
        </div>
      </div>
      <button
        type="submit"
        className="p-6 rounded-3xl bg-brand-orange hover:bg-brand-orange/90 text-white transition-all shadow-[0_0_20px_rgba(255,90,53,0.3)] active:scale-95 flex items-center justify-center group/btn"
      >
        <FiSend
          size={24}
          className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
        />
      </button>
    </form>
  );
};

export default SearchBar;
