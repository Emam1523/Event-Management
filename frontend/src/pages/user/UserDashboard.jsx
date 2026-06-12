import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiArrowRight, FiActivity, FiStar, FiZap, FiBell, FiChevronRight } from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { format, isValid, isAfter } from 'date-fns';
import { motion } from 'framer-motion';
import { bookingsAPI } from '../../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [stats, setStats] = useState({ totalTickets: 0, upcomingEvents: 0, pastEvents: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await bookingsAPI.getMyBookings();
      const bookings = res.data;
      
      const now = new Date();
      const upcoming = bookings.filter(b => isAfter(new Date(b.event.date), now) && b.status === 'confirmed');
      const past = bookings.filter(b => !isAfter(new Date(b.event.date), now) || b.status === 'cancelled');

      setUpcomingBookings(upcoming.slice(0, 3));
      setStats({ 
        totalTickets: bookings.length, 
        upcomingEvents: upcoming.length, 
        pastEvents: past.length 
      });
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserData();
  }, [fetchUserData]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-zinc-800 border-t-brand-orange rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium animate-pulse">Personalizing your experience...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Tickets', value: stats.totalTickets, icon: <BsTicketPerforated />, color: 'from-orange-500/20 to-amber-500/20', iconColor: 'text-brand-orange' },
    { label: 'Upcoming', value: stats.upcomingEvents, icon: <FiCalendar />, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
    { label: 'Past Events', value: stats.pastEvents, icon: <FiClock />, color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const hoverEffect = {
    y: -8,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto"
    >
      {/* Hero Header - Enhanced with Mesh and Interactions */}
      <section className="relative overflow-hidden rounded-[3rem] bg-zinc-950 border border-white/5 p-8 sm:p-16 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full -mr-40 -mt-40 blur-[120px] group-hover:bg-brand-orange/20 transition-all duration-1000 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full -ml-40 -mb-40 blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="flex-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange"></span>
              </span>
              <span className="text-brand-orange text-[11px] font-black uppercase tracking-[0.3em]">AuraPass Live</span>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.95]">
                Welcome Back, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-secondary to-brand-orange bg-[length:200%_auto] animate-gradient-x">
                  {user?.name?.split(' ')[0]}
                </span>
              </h1>
              <p className="text-zinc-500 text-xl max-w-xl leading-relaxed font-medium">
                Your premium access hub. You currently have <span className="text-white font-bold">{stats.upcomingEvents} exclusive events</span> lined up.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
               <Link to="/events" className="px-10 py-5 bg-brand-orange text-white rounded-3xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-orange/20 flex items-center gap-3">
                  Discover Events <FiArrowRight />
               </Link>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="hidden lg:block relative"
          >
             <div className="w-56 h-56 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center relative group/icon overflow-hidden">
                <div className="absolute inset-0 bg-brand-orange/10 blur-3xl rounded-full scale-150 animate-pulse-slow" />
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 0.95, 1]
                   }}
                   transition={{ repeat: Infinity, duration: 4 }}
                >
                  <FiZap className="text-8xl text-brand-orange relative z-10 filter drop-shadow-[0_0_20px_rgba(255,90,53,0.5)]" />
                </motion.div>
             </div>
             
             {/* Floating Mini Cards */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ repeat: Infinity, duration: 3 }}
               className="absolute -top-6 -right-6 glass-card p-4 flex items-center gap-3 shadow-2xl shadow-black/50 border-brand-orange/20"
             >
                <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                   <FiStar />
                </div>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">VIP PLUS</span>
             </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards - Animated Reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {statCards.map((card) => (
          <motion.div 
            key={card.label}
            variants={itemVariants}
            whileHover={hoverEffect}
            className="glass-card p-10 flex flex-col gap-8 group cursor-default relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className={`w-16 h-16 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-3xl ${card.iconColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-inner`}>
              {card.icon}
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2 group-hover:text-zinc-400 transition-colors">{card.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black text-white leading-none tracking-tight">{card.value}</p>
                <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                   <FiActivity className="animate-pulse" /> +12%
                </span>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 h-1 w-12 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="h-full w-full bg-brand-orange/20" 
               />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Upcoming Events - Premium List */}
        <div className="xl:col-span-2 space-y-10">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white tracking-tight">Active Bookings</h2>
              <p className="text-zinc-500 text-sm font-medium">Events you are attending this month</p>
            </div>
            <Link to="/my-tickets" className="flex items-center gap-3 text-[11px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] group transition-all bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
              Schedule <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid gap-8">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => {
                const d = new Date(booking.event.date);
                return (
                  <motion.div
                    key={booking.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-2 rounded-[2.5rem] group hover:border-brand-orange/30 transition-all duration-500"
                  >
                    <div className="flex flex-col md:flex-row gap-8 p-4">
                      <div className="relative w-full md:w-72 h-48 rounded-[2rem] overflow-hidden flex-shrink-0">
                        <img
                          src={booking.event.image}
                          alt={booking.event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 flex items-center gap-2">
                           <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.2em]">
                              {booking.ticketType}
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-4 pr-4">
                        <div className="space-y-6">
                          <h3 className="text-3xl font-black text-white group-hover:text-brand-orange transition-colors line-clamp-1 tracking-tighter">{booking.event.title}</h3>
                          <div className="flex flex-wrap gap-8">
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Date</p>
                               <span className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                                  <FiCalendar className="text-brand-orange" /> {isValid(d) ? format(d, 'MMM d, yyyy') : 'TBA'}
                               </span>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Time</p>
                               <span className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                                  <FiClock className="text-brand-orange" /> {booking.event.time}
                               </span>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Location</p>
                               <span className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
                                  <FiMapPin className="text-brand-orange flex-shrink-0" /> {booking.event.location}
                               </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-black text-brand-orange shadow-inner">
                               {booking.quantity}
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Digital Passes</p>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Ready for scan</p>
                             </div>
                          </div>
                          <Link 
                            to={`/my-tickets/${booking.id}`}
                            className="px-8 py-3.5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-orange hover:text-white transition-all shadow-xl shadow-black/20"
                          >
                            Access Pass
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                variants={itemVariants}
                className="glass-card py-24 text-center border-dashed border-zinc-800 rounded-[3rem]"
              >
                <div className="w-32 h-32 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-5xl text-zinc-800 shadow-inner">
                   <BsTicketPerforated />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">No Access Passes Found</h3>
                <p className="text-zinc-500 mb-12 max-w-sm mx-auto font-medium text-lg leading-relaxed">Your portal to the world's most exclusive events awaits. Start your journey today.</p>
                <Link to="/events" className="inline-flex items-center gap-4 px-12 py-5 bg-brand-orange text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-orange/40">
                   Explore Collection <FiArrowRight className="animate-bounce-x" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar Space - Refined Widgets */}
        <div className="space-y-12">
          {/* Quick Access - Futuristic Design */}
          <motion.section variants={itemVariants} className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
              <span className="w-3 h-3 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(255,90,53,0.8)]" />
              Pulse Actions
            </h3>
            
            <div className="space-y-5">
              {[
                { to: '/events', label: 'VIP Events', icon: <FiStar className="text-amber-500" />, desc: 'Exclusive access list' },
                { to: '/my-tickets', label: 'Digital Hub', icon: <BsTicketPerforated className="text-brand-orange" />, desc: 'Manage your passes' },
                { to: '/notifications', label: 'Live Alerts', icon: <FiBell className="text-blue-500" />, desc: 'Real-time updates' },
              ].map((action) => (
                <Link 
                  key={action.to} 
                  to={action.to}
                  className="flex items-center gap-6 p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/80 hover:border-brand-orange/20 transition-all group/btn relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center text-2xl group-hover/btn:scale-110 transition-transform shadow-inner border border-white/5">
                    {action.icon}
                  </div>
                  <div>
                    <span className="block text-[11px] font-black text-zinc-500 group-hover/btn:text-white uppercase tracking-widest transition-colors mb-0.5">{action.label}</span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter group-hover/btn:text-zinc-500">{action.desc}</span>
                  </div>
                  <FiChevronRight className="ml-auto text-zinc-800 group-hover/btn:text-brand-orange group-hover/btn:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Membership Card - Super Premium */}
          <motion.section 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-black border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group/card shadow-2xl"
          >
             {/* Animating Mesh Gradient */}
             <div className="absolute inset-0 opacity-20 pointer-events-none group-hover/card:opacity-30 transition-opacity">
                <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-brand-orange/20 rounded-full blur-[80px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-brand-secondary/20 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
             </div>
             
             <div className="relative z-10 space-y-12">
               <div className="flex justify-between items-start">
                 <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-brand-orange text-4xl shadow-inner border border-white/10 group-hover/card:rotate-12 transition-transform">
                    <FiStar />
                 </div>
                 <div className="text-right">
                    <span className="px-5 py-2 rounded-full bg-brand-orange text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-brand-orange/40">
                       Aura Elite
                    </span>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] pl-1">Access Identity</p>
                 <p className="text-3xl font-mono text-white tracking-[0.2em] group-hover/card:text-brand-orange transition-colors">#AUR-8829-X2</p>
               </div>
               
               <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Status</p>
                    <p className="text-sm font-black text-green-400 uppercase tracking-tighter flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Verified
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Tier</p>
                    <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 uppercase italic tracking-widest">Diamond</p>
                  </div>
               </div>
             </div>
             
             {/* Holographic Line Effect */}
             <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-brand-orange/10 to-transparent translate-y-full group-hover/card:translate-y-0 transition-transform duration-700" />
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
