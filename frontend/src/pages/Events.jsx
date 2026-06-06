import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiMapPin,
  FiChevronDown,
  FiX,
  FiZap,
  FiCompass,
  FiSliders,
  FiMusic,
  FiAward,
  FiCpu,
  FiShield,
  FiCoffee,
} from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import EventCard from '../components/EventCard';
import Pagination from '../components/common/Pagination';
import eventService from '../services/eventService';

const CATEGORIES = [
  'All',
  'Concert',
  'Festival',
  'Workshop',
  'Conference',
  'Sports',
  'Theater',
  'Comedy Show',
  'Networking Event',
  'Art Show',
  'Food & Drink',
];

const LOCATIONS = [
  'All',
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Khulna',
  'Rajshahi',
  'Barishal',
];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [location, setLocation] = useState(
    searchParams.get('location') || 'All'
  );
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  const fetchEvents = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    try {
      const params = {
        search: searchParams.get('search'),
        category:
          searchParams.get('category') !== 'All'
            ? searchParams.get('category')
            : undefined,
        location:
          searchParams.get('location') !== 'All'
            ? searchParams.get('location')
            : undefined,
        page: searchParams.get('page') || 1,
        limit: 9,
      };

      const data = await eventService.getAllEvents(params);
      setEvents(data.events || []);
      setTotalEvents(data.total || 0);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchEvents]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search, page: 1 });
  };

  const updateParams = (newParams) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] === 'All' || !newParams[key]) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, newParams[key]);
      }
    });
    setSearchParams(updatedParams);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setPage(1);
    setSearchParams({});
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'All':
        return <FiCompass size={14} />;
      case 'Concert':
        return <FiMusic size={14} />;
      case 'Festival':
        return <FiAward size={14} />;
      case 'Workshop':
        return <FiSliders size={14} />;
      case 'Conference':
        return <FiCpu size={14} />;
      case 'Sports':
        return <BsTicketPerforated size={14} />;
      case 'Theater':
        return <FiShield size={14} />;
      case 'Comedy Show':
        return <FiSliders size={14} />;
      case 'Food & Drink':
        return <FiCoffee size={14} />;
      default:
        return <FiCompass size={14} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <div className="bg-dark-bg min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-aurora opacity-20 animate-aurora" />
      </div>

      <div className="container-custom relative z-10 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
        {/* Header Section */}
        <div className="mb-14 text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-[2px] bg-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                  Curated Experiences
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase leading-[0.9]">
                FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">NEXT</span> <br />
                MEMORABLE <span className="relative">
                  EVENT
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 25 0 50 5 T 100 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-slate-400 text-base font-medium max-w-lg leading-relaxed mt-4">
                Discover workshops, concerts, and conferences happening near you
                across Bangladesh.
              </p>
            </div>

            {/* Quick Search */}
            <div className="flex flex-col gap-4 w-full max-w-md">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                <div className="relative flex items-center bg-[#0b0b11]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
                  <FiSearch className="ml-4 text-slate-500 text-xl" />
                  <input
                    type="text"
                    placeholder="Search by name or keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-white font-semibold placeholder:text-slate-600 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Trending:
                  </span>
                  <div className="flex gap-3">
                    {['Concerts', 'Tech'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const cat =
                            tag === 'Concerts' ? 'Concert' : 'Conference';
                          setCategory(cat);
                          updateParams({ category: cat, page: 1 });
                        }}
                        className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors cursor-pointer"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:hidden">
                  <button
                    onClick={() => setIsFilterSidebarOpen(true)}
                    className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 cursor-pointer"
                  >
                    <FiSliders /> Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0 text-left">
            <div className="sticky top-28 space-y-10">
              {/* Category Filter */}
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                  <FiCompass className="text-primary" /> Categories
                </h4>
                
                <div className="flex flex-col gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        updateParams({ category: cat, page: 1 });
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                        category === cat
                          ? 'bg-primary/10 text-primary border-primary/30 shadow-sm'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className={category === cat ? 'text-primary' : 'text-slate-500'}>
                        {getCategoryIcon(cat)}
                      </span>
                      <span>{cat}</span>
                      {category === cat && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                  <FiMapPin className="text-primary" /> Location
                </h4>
                <div className="relative group">
                  <select
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      updateParams({ location: e.target.value, page: 1 });
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white text-[11px] font-bold px-4 py-4 rounded-xl outline-none appearance-none focus:border-primary/50 cursor-pointer"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-slate-900">
                        {loc === 'All' ? 'Everywhere' : loc}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-white transition-colors" />
                </div>
              </div>

              {/* Reset All */}
              <button
                onClick={clearFilters}
                className="w-full py-4 rounded-xl border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiX /> Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Results Info Bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <FiZap className="text-primary text-sm" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                  Showing <span className="text-white font-black">{totalEvents}</span> Results
                </h3>
              </div>
            </div>

            {/* Events Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#0b0b11]/50 rounded-[2.25rem] h-[450px] animate-pulse border border-white/5"
                    />
                  ))}
                </motion.div>
              ) : events.length > 0 ? (
                <motion.div
                  key="grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
                >
                  {events.map((event) => (
                    <motion.div key={event.id} variants={itemVariants}>
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-20 text-center bg-white/[0.01] border border-white/5 rounded-[3.5rem] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  
                  {/* Glow Backdrop inside empty card */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-primary/10 rounded-full blur-[70px] pointer-events-none" />

                  <div className="bg-white/5 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 relative">
                    <FiSearch className="text-4xl text-slate-500" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">
                    No results found
                  </h3>
                  <p className="text-slate-500 mb-10 font-medium max-w-sm mx-auto text-sm leading-relaxed">
                    We couldn't find any events matching your search filters. Try clearing filters or using different keywords.
                  </p>
                  
                  <button
                    onClick={clearFilters}
                    className="btn-primary py-4 px-10 rounded-xl group font-black tracking-widest text-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      Clear All Filters{' '}
                      <FiX className="group-hover:rotate-90 transition-transform" />
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!isLoading && totalEvents > 9 && (
              <div className="flex justify-center border-t border-white/5 pt-12">
                <Pagination
                  currentPage={page}
                  totalItems={totalEvents}
                  itemsPerPage={9}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    updateParams({ page: newPage });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar Drawer */}
      <AnimatePresence>
        {isFilterSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-md bg-slate-900 border-l border-white/10 z-[101] p-8 overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black text-white uppercase tracking-widest">
                  Filters
                </h2>
                <button
                  onClick={() => setIsFilterSidebarOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white cursor-pointer"
                >
                  <FiX />
                </button>
              </div>

              <div className="space-y-12">
                <div>
                  <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                    Categories
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          updateParams({ category: cat, page: 1 });
                        }}
                        className={`px-4 py-3 rounded-xl text-[10px] font-bold transition-all border flex items-center gap-2 justify-center cursor-pointer ${
                          category === cat
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {getCategoryIcon(cat)}
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                    Location
                  </h4>
                  <select
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      updateParams({ location: e.target.value, page: 1 });
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white text-xs font-bold px-4 py-4 rounded-xl outline-none"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-slate-900">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setIsFilterSidebarOpen(false);
                  }}
                  className="w-full py-5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/30 active:scale-95 transition-transform cursor-pointer"
                >
                  Apply & Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
