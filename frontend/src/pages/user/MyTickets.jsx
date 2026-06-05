import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiX, FiMapPin, FiClock, FiShare2, FiStar } from 'react-icons/fi';
import { BsQrCode, BsTicketPerforated } from 'react-icons/bs';
import { QRCodeSVG } from 'qrcode.react';
import { format, isValid } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import bookingService from '../../services/bookingService';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTickets = async () => {
      try {
        const bookings = await bookingService.getMyBookings();
        const normalizedTickets = (bookings || []).map((booking) => {
          const ticketCode = booking.id?.slice(-8)?.toUpperCase() || 'UNKNOWN';
          const bookingId = `BK-${ticketCode}`;

          return {
            id: booking.id,
            bookingId,
            event: {
              id: booking.event?.id || '',
              title: booking.event?.title || 'Untitled Event',
              date: booking.event?.date || '',
              time: booking.event?.time || 'TBA',
              location: booking.event?.location || 'Venue TBA',
              image: booking.event?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
            },
            ticketType: booking.ticketType || 'GENERAL',
            quantity: Number(booking.quantity) || 0,
            totalPrice: Number(booking.totalPrice) || 0,
            status: booking.status || 'confirmed',
            qrData: `TICKET::${bookingId}::${booking.event?.id || ''}::${booking.ticketType || 'GENERAL'}::${booking.quantity || 0}`,
          };
        });

        if (isMounted) {
          setTickets(normalizedTickets);
        }
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        if (isMounted) {
          setTickets([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  const now = new Date();
  const upcomingTickets = tickets.filter((t) => new Date(t.event.date) >= now);
  const pastTickets = tickets.filter((t) => new Date(t.event.date) < now);
  const displayed = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

  const statusStyles = {
    confirmed: 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    used: 'bg-zinc-800 text-zinc-500 border-white/5',
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-zinc-900 border-t-brand-orange rounded-full animate-spin shadow-2xl shadow-brand-orange/20" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div 
            variants={itemVariants}
            className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-brand-orange text-xl shadow-inner"
          >
            <BsTicketPerforated />
          </motion.div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">My Passes</h1>
            <p className="text-zinc-500 text-lg font-medium">Your collection of world-class experiences.</p>
          </div>
        </div>

        {/* Improved Tabs */}
        <motion.div variants={itemVariants} className="bg-zinc-950 p-1.5 rounded-[2rem] border border-white/5 flex gap-2 w-fit backdrop-blur-3xl">
          {[
            { key: 'upcoming', label: 'Upcoming', count: upcomingTickets.length },
            { key: 'past', label: 'Past Events', count: pastTickets.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 ${
                activeTab === tab.key ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="active-ticket-tab"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span className={`relative z-10 px-2.5 py-1 rounded-lg text-[9px] font-bold ${
                activeTab === tab.key ? 'bg-brand-orange text-white' : 'bg-white/5 text-zinc-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          {displayed.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="glass-card py-32 text-center border-dashed border-zinc-800 rounded-[3rem]"
            >
              <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-4xl text-zinc-800 shadow-inner">
                <BsQrCode />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">No Access Found</h2>
              <p className="text-zinc-500 mb-12 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                {activeTab === 'upcoming'
                  ? "You haven't secured access to any upcoming events yet. Experience awaits."
                  : "You haven't attended any events on our platform yet."}
              </p>
              <Link to="/events" className="btn-primary px-12 py-5 rounded-[2rem]">Explore Collection</Link>
            </motion.div>
          ) : (
            displayed.map((ticket) => {
              const d = new Date(ticket.event.date);
              return (
                <motion.div 
                  key={ticket.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="glass-card overflow-hidden group hover:border-brand-orange/30 transition-all duration-700 rounded-[3rem]"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Premium Image Side */}
                    <div className="lg:w-[400px] h-64 lg:h-auto relative flex-shrink-0 overflow-hidden">
                      <img
                        src={ticket.event.image}
                        alt={ticket.event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent lg:bg-gradient-to-t" />
                      
                      {/* Date Badge */}
                      <div className="absolute top-8 left-8 p-4 rounded-[2rem] bg-black/60 backdrop-blur-2xl border border-white/10 text-center min-w-[80px] group-hover:bg-brand-orange transition-colors group-hover:border-brand-orange/50">
                        <p className="text-[10px] font-black uppercase text-brand-orange group-hover:text-white leading-none mb-1">{isValid(d) ? format(d, 'MMM') : '???'}</p>
                        <p className="text-3xl font-black text-white leading-none">{isValid(d) ? format(d, 'dd') : '?'}</p>
                      </div>

                      {/* Floating Indicator */}
                      {activeTab === 'upcoming' && (
                        <div className="absolute bottom-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">
                           <span className="w-1.5 h-1.5 bg-white rounded-full" /> Live Status
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${statusStyles[ticket.status]}`}>
                            {ticket.status}
                          </span>
                          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">REF: {ticket.bookingId}</span>
                        </div>

                        <h2 className="text-5xl font-black text-white mb-8 tracking-tighter group-hover:text-brand-orange transition-colors leading-[0.95]">{ticket.event.title}</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                          {[
                            { label: 'Time', val: ticket.event.time, icon: <FiClock /> },
                            { label: 'Venue', val: ticket.event.location.split(',')[0], icon: <FiMapPin /> },
                            { label: 'Category', val: ticket.ticketType, icon: <FiStar /> },
                            { label: 'Access', val: `${ticket.quantity} Passes`, icon: <BsTicketPerforated /> },
                          ].map((item) => (
                            <div key={item.label} className="space-y-1">
                               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</p>
                               <span className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
                                  <span className="text-brand-orange">{item.icon}</span> {item.val}
                               </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 mt-12 pt-8 border-t border-white/5">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-brand-orange hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
                          >
                            <BsQrCode className="text-xl" /> Access Pass
                          </button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:bg-zinc-800 shadow-inner"
                          >
                            <FiDownload className="text-xl" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:bg-zinc-800 shadow-inner"
                          >
                            <FiShare2 className="text-xl" />
                          </motion.button>
                        </div>
                        
                        <div className="text-right">
                           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">TOTAL ASSET</p>
                           <p className="text-2xl font-black text-white leading-none tracking-tighter">৳{ticket.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modern Ticket Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#111] border border-zinc-800 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Ticket Top */}
              <div className="bg-brand-orange p-8 text-black relative">
                <div className="absolute top-4 right-4 text-black/40 hover:text-black cursor-pointer" onClick={() => setSelectedTicket(null)}>
                  <FiX size={24} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Entry Pass</h3>
                <h2 className="text-2xl font-black leading-tight mb-4">{selectedTicket.event.title}</h2>
                <div className="flex justify-between items-end border-t border-black/10 pt-4">
                   <div>
                     <p className="text-[10px] font-black uppercase opacity-60">Venue</p>
                     <p className="text-sm font-bold truncate max-w-[180px]">{selectedTicket.event.location}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-black uppercase opacity-60">Time</p>
                     <p className="text-sm font-bold">{selectedTicket.event.time}</p>
                   </div>
                </div>
              </div>

              {/* Ticket Cutout Line */}
              <div className="relative h-6 bg-transparent flex items-center px-4">
                 <div className="absolute -left-3 w-6 h-6 rounded-full bg-black border-r border-zinc-800" />
                 <div className="w-full h-px border-t border-dashed border-zinc-700" />
                 <div className="absolute -right-3 w-6 h-6 rounded-full bg-black border-l border-zinc-800" />
              </div>

              {/* Ticket Bottom / QR */}
              <div className="p-8 pb-10 flex flex-col items-center">
                <div className="p-4 bg-white rounded-3xl mb-6 shadow-2xl shadow-brand-orange/5">
                  <QRCodeSVG
                    value={selectedTicket.qrData}
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                
                <p className="text-xl font-mono font-bold text-white tracking-[0.3em] mb-2">{selectedTicket.bookingId}</p>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-8">Scan this code at entry</p>
                
                <div className="grid grid-cols-3 gap-6 w-full mb-8 text-center border-y border-zinc-800/50 py-4">
                   <div>
                     <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Section</p>
                     <p className="text-sm font-black text-white">{selectedTicket.ticketType.split(' ')[0]}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Row</p>
                     <p className="text-sm font-black text-white">B-12</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Seats</p>
                     <p className="text-sm font-black text-white">{selectedTicket.quantity}</p>
                   </div>
                </div>

                <button className="w-full py-4 bg-zinc-800 hover:bg-white hover:text-black text-white rounded-2xl font-black uppercase tracking-widest transition-all text-xs flex items-center justify-center gap-2">
                  <FiDownload size={16} /> Save to Wallet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyTickets;
