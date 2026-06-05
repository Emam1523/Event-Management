import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiStar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import api, { API_ROOT } from '../services/api';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [event, setEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200';
    if (url.startsWith('http')) return url;
    return `${API_ROOT}${url}`;
  };

  const fetchEventDetails = useCallback(async () => {
    try {
       setIsLoading(true);
       const { data } = await api.get(`/events/${id}`);
       setEvent(data);
       if (data.tickets && data.tickets.length > 0) {
         setSelectedTicket(data.tickets[0]);
       }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await api.get(`/reviews/event/${id}`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to empty reviews if fetch fails
      setReviews([]);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
    fetchReviews();
  }, [fetchEventDetails, fetchReviews]);

  const handleAddToCart = () => {
    if (!selectedTicket) return;
    addToCart(event, selectedTicket, quantity);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Event Not Found</h2>
          <button onClick={() => navigate('/events')} className="btn-primary">Back to Explore</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <img
          src={getImageUrl(event.image)}
          alt={event.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-primary text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                {event.category}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-slate-300 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                #EXCLUSIVEEVENT
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter uppercase">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-slate-400">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-all">
                  <FiStar className="text-primary fill-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Experience</p>
                  <p className="text-sm font-bold text-white">4.8 <span className="text-slate-500">(Verified)</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all">
                  <FiUsers className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Entry</p>
                  <p className="text-sm font-bold text-white">Live Session</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-12">
            {/* Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 bg-white/5 border-white/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <FiCalendar className="text-2xl" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Date & Time</h3>
                </div>
                <p className="text-xl font-bold text-white mb-1">
                  {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-slate-400 font-medium">{event.time} {event.endTime ? `– ${event.endTime}` : ''}</p>
              </div>

              <div className="glass-card p-8 bg-white/5 border-white/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <FiMapPin className="text-2xl" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Location</h3>
                </div>
                <p className="text-xl font-bold text-white mb-1">{event.location}</p>
                {event.googleMapUrl && (
                  <div className="mt-6 h-48 rounded-2xl overflow-hidden border border-white/10 group relative">
                    <iframe
                      src={event.googleMapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    ></iframe>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark-bg/40 to-transparent" />
                  </div>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="glass-card p-10 bg-white/5 border-white/5">
              <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-4">
                <div className="w-2 h-8 bg-primary rounded-full" />
                About This Experience
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-line font-medium">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="glass-card p-10 bg-white/5 border-white/5">
              <h2 className="text-2xl font-black text-white mb-10 uppercase tracking-tight">Vibe Check <span className="text-primary">.</span></h2>
              
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                      {review.user?.name?.charAt(0) || <FiUser />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-white text-sm uppercase tracking-wider">{review.user.name}</h4>
                        <span className="text-[10px] font-black text-slate-500 uppercase">
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`text-xs ${i < review.rating ? 'text-primary fill-primary' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                      <p className="text-slate-400 font-medium leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4">
            <div className="glass-card p-10 bg-slate-900 border-white/10 sticky top-28 shadow-3xl shadow-black/40">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 text-center">SELECT YOUR PASS</h3>
              
              {/* Ticket Types */}
              <div className="space-y-4 mb-10">
                {(event.tickets || []).map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`relative p-6 rounded-[2rem] cursor-pointer transition-all duration-500 border-2 ${
                      selectedTicket?.id === ticket.id
                        ? 'border-primary bg-primary/5'
                        : 'border-white/5 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className={`font-black text-sm uppercase tracking-tighter transition-colors ${selectedTicket?.id === ticket.id ? 'text-primary' : 'text-white'}`}>
                          {ticket.name}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500 mt-1">{ticket.description}</p>
                      </div>
                      <p className="text-xl font-black text-white tracking-tighter">৳{ticket.price}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${ticket.capacity < 20 ? 'text-rose-500' : 'text-slate-600'}`}>
                        {ticket.capacity} Spots Left
                      </span>
                      {selectedTicket?.id === ticket.id && (
                        <motion.div layoutId="check" className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</label>
                  <div className="flex items-center bg-white/5 rounded-2xl border border-white/5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-colors font-black text-xl"
                    >
                      –
                    </button>
                    <span className="w-8 text-center font-black text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedTicket?.capacity || 1, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-colors font-black text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Grand Total</span>
                  <span className="text-4xl font-black text-white tracking-tighter">
                    ৳{selectedTicket ? selectedTicket.price * quantity : 0}
                  </span>
                </div>
                <button 
                  onClick={handleAddToCart} 
                  className="w-full btn-primary py-5 rounded-[2rem] text-[11px] shadow-2xl shadow-primary/30 group"
                >
                  Confirm & Secure Pass
                </button>
                <button className="w-full btn-secondary py-5 rounded-[2rem] text-[11px]">
                  Share Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
