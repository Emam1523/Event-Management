import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsAPI, API_ROOT } from '../../services/api';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await eventsAPI.getAll();
      // Ensure backend returns direct array or structure it properly
      const eventData = Array.isArray(res.data) ? res.data : (res.data.events || []);
      setEvents(eventData);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await eventsAPI.delete(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesTab = activeTab === 'all' || e.status === activeTab;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-white/5 border-t-brand-orange rounded-full animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Assembling Your Events...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Manage Events</h1>
          <p className="text-gray-400 font-medium">Create, edit, and keep track of your masterpiece gatherings.</p>
        </div>
        <Link 
          to="/admin/create-event" 
          className="group relative px-6 py-3 bg-brand-orange text-white rounded-2xl font-bold flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-brand-orange/20 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <FiPlus className="relative z-10" />
          <span className="relative z-10 uppercase tracking-widest text-xs">New Event</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
        <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {['all', 'active', 'draft', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-orange transition-colors" />
          <input
            type="text"
            placeholder="Search event, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all"
          />
        </div>
      </div>

      {/* Event List/Table */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Event Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Sales Progress</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Revenue</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <motion.tr 
                    key={event.id}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-800">
                          <img 
                            src={event.image ? (event.image.startsWith('http') ? event.image : `${API_ROOT}${event.image}`) : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-white group-hover:text-brand-orange transition-colors truncate">{event.title}</p>
                          <p className="text-xs text-gray-500 font-medium">{new Date(event.date).toLocaleDateString()} • {event.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2 max-w-[120px]">
                        <div className="flex justify-between text-[10px] font-black">
                          <span className="text-gray-500">{event._count?.bookings || 0} SOLD</span>
                          <span className="text-white">{event.capacity > 0 ? Math.round(((event._count?.bookings || 0) / event.capacity) * 100) : 0}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${event.capacity > 0 ? ((event._count?.bookings || 0) / event.capacity) * 100 : 0}%` }}
                            className="h-full bg-gradient-to-r from-brand-orange to-orange-400 rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-white">৳{((event._count?.bookings || 0) * event.price).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Estimated Gross</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        event.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-white/5 text-gray-500 border-white/10'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/edit-event/${event.id}`)}
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-orange transition-all border border-white/5"
                          title="Edit Event"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button 
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition-all border border-white/5"
                          title="View Live"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                          title="Delete Event"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiFilter className="text-3xl text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white">No events match your criteria</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageEvents;
