import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiArrowRight, FiClock, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { format, isValid } from 'date-fns';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const formattedDate = () => {
    const d = new Date(event.date);
    return isValid(d) ? format(d, 'EEE, MMM d, yyyy') : 'Date TBA';
  };

  const displayPrice = () => {
    if (!event.price || event.price === 0) return 'Free';
    return `৳${Number(event.price).toLocaleString()}`;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card overflow-hidden group cursor-pointer flex flex-col h-[520px] border border-white/5 hover:border-primary/40 transition-all duration-700 bg-slate-900/40 relative shadow-2xl"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <motion.img
          src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800';
          }}
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-40" />

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
          <div className="bg-slate-900/80 backdrop-blur-xl px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white border border-white/10 shadow-2xl">
            {event.category}
          </div>
          
          <div className="flex gap-2">
            {event.isFeatured && (
              <div className="w-9 h-9 rounded-2xl bg-amber-500/90 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                <FiStar fill="currentColor" size={16} />
              </div>
            )}
            <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-xl">
              <HiSparkles className="text-lg" />
            </div>
          </div>
        </div>

        {/* Date Over Image */}
        <div className="absolute bottom-5 left-6 right-6">
          <div className="flex items-center gap-2 text-white/90">
            <FiCalendar className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{formattedDate()}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-7 flex flex-col flex-1 relative">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-3 leading-[1.1] group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter">
            {event.title}
          </h3>
          <div className="flex items-center text-slate-500 gap-2 mb-4 group/loc">
            <FiMapPin className="text-slate-500 group-hover/loc:text-primary transition-colors flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest truncate">{event.location}</span>
          </div>
          <p className="text-slate-400 text-xs line-clamp-2 font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
            {event.description}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Passes From</span>
            <span className="text-2xl font-black text-white tracking-tighter group-hover:text-primary transition-all duration-500">
              {displayPrice()}
            </span>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-primary px-6 py-3.5 rounded-[1.25rem] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 border border-primary/50 group/btn"
          >
            Details <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;

