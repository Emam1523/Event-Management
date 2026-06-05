import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShield, FiArrowRight, FiMusic, FiCoffee, FiCpu, FiAward, FiCalendar, FiMapPin, FiMessageSquare } from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import eventService from '../services/eventService';
import { statsAPI } from '../services/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [stats, setStats] = useState({
    ticketsSold: 0,
    totalUsers: 0,
    majorCities: [],
    rating: 0,
    totalReviews: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();
  const eventTags = ['Concerts', 'Festivals', 'Theater', 'Sports', 'Conference', 'Food'];
  const marqueeTags = [...eventTags, ...eventTags];
  const numberFormatter = new Intl.NumberFormat('en-US');
  const placeholderOptions = [
    'Help me book tickets',
    'Concerts in Dhaka',
    'Food festivals this weekend',
    'Tech conferences in BD',
    'Theater near me'
  ];
  const tagToCategory = {
    Concerts: 'Concert',
    Festivals: 'Festival',
    Theater: 'Theater',
    Sports: 'Sports',
    Conference: 'Conference',
    Food: 'Food'
  };

  const previewMessages = [
    {
      id: 'p1',
      role: 'assistant',
      text: 'Hi! Looking for anything special this weekend?'
    },
    {
      id: 'p2',
      role: 'user',
      text: 'Jazz shows this weekend'
    },
    {
      id: 'p3',
      role: 'assistant',
      text: 'Found some great jazz events in Dhaka with early-bird tickets.'
    }
  ];

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [featuredResponse, statsResponse] = await Promise.all([
          eventService.getFeaturedEvents(),
          statsAPI.getGlobalStats(),
        ]);

        if (!isMounted) return;

        const events = Array.isArray(featuredResponse) ? featuredResponse : featuredResponse?.events;
        const bangladeshEvents = (events || []).filter((event) =>
          (event.location || '').toLowerCase().includes('bangladesh')
        );

        setFeaturedEvents(bangladeshEvents.length > 0 ? bangladeshEvents : []);
        setIsLoading(false);

        const statsData = statsResponse?.data?.data;
        if (statsData) {
          setStats(statsData);
        }
        setStatsLoading(false);
      } catch {
        if (!isMounted) return;
        setFeaturedEvents([]);
        setIsLoading(false);
        setStatsLoading(false);
      }
    };

    loadHomeData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderOptions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [placeholderOptions.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : '';
    navigate(`/events${params}`);
  };


  const handleTagClick = (tag) => {
    const category = tagToCategory[tag] || tag;
    setSearchQuery(tag);
    navigate(`/events?category=${encodeURIComponent(category)}`);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const heroStats = [
    {
      value: statsLoading ? '...' : numberFormatter.format(stats.ticketsSold || 0),
      label: 'Tickets Sold'
    },
    {
      value: statsLoading ? '...' : numberFormatter.format(stats.totalUsers || 0),
      label: 'Total Users'
    },
    {
      value: statsLoading ? '...' : numberFormatter.format(stats.majorCities?.length || 0),
      label: 'Major Cities (BD)'
    },
    {
      value: statsLoading ? '...' : `${(stats.rating || 0).toFixed(1)}/5`,
      label: stats.totalReviews ? `User Rating (${numberFormatter.format(stats.totalReviews)} reviews)` : 'User Rating'
    },
  ];

  const formatEventDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Date TBA';
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const upcomingEvents = [...featuredEvents]
    .filter((event) => event?.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const activeUpcoming = upcomingEvents[upcomingIndex] || null;

  useEffect(() => {
    if (upcomingEvents.length <= 1) return undefined;
    const interval = setInterval(() => {
      setUpcomingIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [upcomingEvents.length]);

  return (
    <div className="bg-dark-bg min-h-screen text-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora animate-aurora opacity-70 pointer-events-none" />
      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center pt-24 pb-12 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-mesh opacity-20" />
        </div>


        <div className="container-custom relative">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Experience Transformed
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-[7.5rem] font-black text-white leading-[0.85] tracking-tighter mb-6 text-glow">
                AURA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500 animate-gradient-x">PASS.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-6 leading-tight font-medium tracking-tight">
                Where passion meets the moment. Discover elite experiences across Bangladesh.
              </p>
              <div className="h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 mb-6" />
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] mb-10">
                Bangladesh Only
              </div>

              <div className="max-w-2xl">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/40 via-rose-500/40 to-indigo-500/40 rounded-[2.25rem] blur-xl opacity-60 group-focus-within:opacity-90 transition duration-500" />
                  <div className="relative flex items-center gap-4 bg-[#0b0b11]/85 backdrop-blur-2xl rounded-[2.25rem] px-4 py-3 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.45)] neon-ring animate-glow">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-focus-within:text-white transition-colors">
                      <FiSearch className="text-xl" />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={placeholderOptions[placeholderIndex]}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-white text-base font-semibold placeholder:text-slate-500/70"
                        aria-label="Search events"
                      />
                      <div className="mt-2 h-px w-full bg-gradient-to-r from-white/5 via-white/20 to-white/5 opacity-70" />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_12px_30px_rgba(244,63,94,0.35)] hover:translate-y-[-1px] transition-transform"
                    >
                      Search
                    </button>
                  </div>
                </form>
                
                <div className="mt-10 overflow-hidden">
                  <div className="flex flex-nowrap gap-4 marquee-track">
                    {marqueeTags.map((tag, index) => (
                      <button 
                        key={`${tag}-${index}`}
                        onClick={() => { handleTagClick(tag); }}
                        className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300 min-w-[150px] neon-ring"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                          {tag === 'Concerts' && <FiMusic className="text-base" />}
                          {tag === 'Festivals' && <FiAward className="text-base" />}
                          {tag === 'Theater' && <FiShield className="text-base" />}
                          {tag === 'Sports' && <BsTicketPerforated className="text-base" />}
                          {tag === 'Conference' && <FiCpu className="text-base" />}
                          {tag === 'Food' && <FiCoffee className="text-base" />}
                          {!eventTags.includes(tag) && <FiSearch className="text-base" />}
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-200">Category</div>
                          <div className="text-xs font-bold tracking-tight">{tag}</div>
                        </div>
                        <div className="ml-auto h-7 w-7 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                          <FiArrowRight className="text-[11px]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-amber-400/30 via-rose-500/30 to-indigo-500/30 blur-xl opacity-80" />
              <div className="relative rounded-[2.5rem] border border-white/10 bg-[#0c0c10]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <FiMessageSquare className="text-lg" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">AuraPass Assistant</div>
                      <div className="text-[11px] text-slate-400">Events, suggestions, registration</div>
                    </div>
                  </div>
                  <Link
                    to="/assistant"
                    className="h-9 w-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-500/90 transition-colors"
                    aria-label="Open assistant"
                  >
                    <FiMessageSquare className="text-base" />
                  </Link>
                </div>

                <div className="h-[300px] md:h-[360px] overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4 space-y-4">
                  {previewMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium ${
                          message.role === 'user'
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/5 text-slate-200'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-slate-500 text-center">
                  Tap the icon to chat live
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────────────────────────────── */}
      <section className="py-20 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {heroStats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                {...fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-slate-950/60 border border-white/10 text-center group hover:bg-white/10 transition-all card-glow"
              >
                <div className="text-3xl font-black text-white mb-2 tracking-tighter group-hover:text-primary transition-colors">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/70 card-glow">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-rose-500/10 to-indigo-500/10" />
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-3">Upcoming Events</div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Next 3 experiences you should not miss
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">Hand-picked highlights from Bangladesh.</p>
                </div>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                >
                  View All <FiArrowRight className="text-sm" />
                </Link>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black">
                <img
                  src={activeUpcoming?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200'}
                  alt={activeUpcoming?.title || 'Upcoming event'}
                  className="h-[240px] md:h-[280px] w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70" />

                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <button
                    type="button"
                    onClick={() => setUpcomingIndex((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length)}
                    className="h-10 w-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="Previous event"
                    disabled={upcomingEvents.length === 0}
                  >
                    <FiArrowRight className="text-base rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpcomingIndex((prev) => (prev + 1) % upcomingEvents.length)}
                    className="h-10 w-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="Next event"
                    disabled={upcomingEvents.length === 0}
                  >
                    <FiArrowRight className="text-base" />
                  </button>
                </div>

                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-rose-500/30 text-rose-100 text-[9px] font-black uppercase tracking-[0.2em]">
                  Featured
                </div>

                <div className="absolute left-5 bottom-5 right-5 flex flex-col gap-2">
                  <h4 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {activeUpcoming?.title || 'Curated event coming soon'}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-slate-300 text-xs">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-xs" />
                      <span>{activeUpcoming ? formatEventDate(activeUpcoming.date) : 'Date TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-xs" />
                      <span>{activeUpcoming?.location || 'Bangladesh'}</span>
                    </div>
                    <div className="text-white font-bold text-sm">
                      {activeUpcoming?.price ? `৳${Number(activeUpcoming.price).toLocaleString()}` : 'Price TBA'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                {Array.from({ length: upcomingEvents.length || 3 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUpcomingIndex(idx)}
                    className={`h-2 w-2 rounded-full transition-all ${idx === upcomingIndex ? 'bg-rose-500 w-6' : 'bg-white/20'}`}
                    aria-label={`Go to event ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30" />
        <div className="absolute -top-24 right-[-10%] w-[520px] h-[520px] bg-rose-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-24 left-[-10%] w-[520px] h-[520px] bg-indigo-500/10 rounded-full blur-[140px]" />
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                Editor's Choice
              </div>
              <motion.h2 
                {...fadeInUp}
                className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6"
              >
                FEATURED <span className="text-primary">PICKS.</span>
              </motion.h2>
              <motion.p 
                {...fadeInUp}
                transition={{ delay: 0.1 }}
                className="text-slate-400 font-medium text-base max-w-xl"
              >
                Hand-picked experiences selected by our curators for the ultimate weekend.
              </motion.p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Verified Hosts', 'Instant Tickets', 'Curated in BD'].map((item) => (
                  <div
                    key={item}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Link to="/events" className="btn-secondary py-3 px-6 rounded-2xl group text-[10px] tracking-widest uppercase font-black">
                Explore All <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[500px] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event, i) => (
                <motion.div 
                  key={event.id}
                  {...fadeInUp}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="p-[2px] rounded-[2.25rem] bg-gradient-to-br from-amber-400/40 via-rose-500/40 to-indigo-500/40">
                    <div className="rounded-[2.15rem] bg-slate-950/60 border border-white/10 card-glow">
                      <EventCard event={event} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Organizer CTA ─────────────────────────────────────────────────────── */}
      <section className="py-16 pb-24 relative overflow-hidden">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-slate-900 to-black rounded-[3rem] p-12 md:p-20 overflow-hidden text-center border border-white/5 card-glow"
          >
            <div className="absolute inset-0 bg-mesh opacity-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 sweep-light" />
            <div className="absolute top-12 left-12 hidden md:block orbit-dot" />
            <div className="absolute bottom-16 right-16 hidden md:block orbit-dot" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] mb-6">
                Become a Regular
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-[0.95]">
                READY FOR YOUR <br />
                <span className="text-primary">NEXT ADVENTURE?</span>
              </h2>
              <p className="text-slate-400 text-base font-medium mb-10 max-w-2xl mx-auto">
                Join thousands of explorers and get exclusive access to the most premium events worldwide.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
                  Join AuraPass
                </Link>
                <Link to="/events" className="w-full sm:w-auto px-10 py-4 border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all">
                  Browse Events
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
