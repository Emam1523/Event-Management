import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_ROOT } from "../services/api";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800";

const resolveImage = (image) => {
  if (!image) return DEFAULT_IMAGE;
  if (image.startsWith("http")) return image;
  return `${API_ROOT}${image}`;
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card overflow-hidden group cursor-pointer flex flex-col h-[420px] border border-white/5 hover:border-primary/40 transition-all duration-700 bg-slate-900/40 relative shadow-2xl"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden shrink-0 bg-zinc-950">
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
      <div className="p-7 flex flex-col flex-1 relative justify-center">
        <h3 className="text-2xl font-black text-white mb-3 leading-[1.1] group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter">
          {event.title}
        </h3>
        <p className="text-zinc-400 text-xs line-clamp-3 font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
          {event.description}
        </p>
      </div>
    </motion.div>
  );
};

export default EventCard;
