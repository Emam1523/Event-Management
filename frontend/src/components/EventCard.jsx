import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_ROOT } from "../services/api";
import { FiArrowRight, FiCalendar, FiMapPin } from "react-icons/fi";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800";

const resolveImage = (image) => {
  if (!image) return DEFAULT_IMAGE;
  if (image.startsWith("http")) return image;
  return `${API_ROOT}${image}`;
};

const formatEventDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Date TBA";
  return date
    .toLocaleString("en-UK", {
      day: "numeric",
      month: "short",
      minute: "2-digit",
      hour: "2-digit",
      hour12: true,
      weekday: "short",
    })
    .toUpperCase();
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "linear" }}
      className="glass-card overflow-hidden group cursor-pointer flex flex-col min-h-100 pb-4 border border-white/5 hover:border-primary/40 transition-all duration-400 bg-dark-card/50 relative shadow-2xl"
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Section */}
      <div className="relative min-h-64 overflow-hidden shrink-0 bg-zinc-950">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src={resolveImage(event.image)}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }}
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col relative justify-center">
        <h3 className="text-2xl font-black text-white mb-3 leading-[1.1] group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter">
          {event.title}
        </h3>
        <p className="text-zinc-400 text-xs line-clamp-3 font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity truncate">
          {event.description}
        </p>
      </div>
      <div className="flex w-auto px-4 justify-between items-center gap-4 text-zinc-300 text-[10px]">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-primary text-xs" />
          <span>{event ? formatEventDate(event.date) : "Date TBA"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin className="text-primary text-xs" />
          <span>{event?.location || "Bangladesh"}</span>
        </div>
      </div>

      <button
        className="flex bg-transparent hover:text-brand-primary w-fit btn-primary float-end self-end mt-4"
        type="button"
        onClick={() => navigate(`/events/${event.id}`)}
      >
        <a>Details</a>
        <FiArrowRight className="scale-x-125 ml-2" size={14} />
      </button>
    </motion.div>
  );
};

export default EventCard;
