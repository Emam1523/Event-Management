import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShield,
  FiArrowRight,
  FiMusic,
  FiCoffee,
  FiCpu,
  FiAward,
  FiCalendar,
  FiMapPin,
  FiMessageSquare,
  FiUser,
} from "react-icons/fi";
import { MdLocationCity, MdRateReview } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { SiGooglegemini } from "react-icons/si";
import EventCard from "../components/EventCard";
import eventService from "../services/eventService";
import { statsAPI, API_ROOT, appReviewsAPI } from "../services/api";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200";

const resolveImage = (image) => {
  if (!image) return DEFAULT_IMAGE;
  if (image.startsWith("http")) return image;
  return `${API_ROOT}${image}`;
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [stats, setStats] = useState({
    ticketsSold: 0,
    totalUsers: 0,
    totalCities: 0,
    rating: 0,
    totalReviews: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [setAppReviews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();
  const eventTags = [
    "Concerts",
    "Festivals",
    "Theater",
    "Sports",
    "Conference",
    "Food",
  ];
  const marqueeTags = [...eventTags, ...eventTags];
  const numberFormatter = new Intl.NumberFormat("en-US");
  const placeholderOptions = [
    "Help me book tickets",
    "Concerts in Dhaka",
    "Food festivals this weekend",
    "Tech conferences in BD",
    "Theater near me",
  ];
  const tagToCategory = {
    Concerts: "Concert",
    Festivals: "Festival",
    Theater: "Theater",
    Sports: "Sports",
    Conference: "Conference",
    Food: "Food",
    Other: "Other",
  };

  const previewMessages = [
    {
      id: "p1",
      role: "assistant",
      text: "Hi! Looking for anything special this weekend?",
    },
    {
      id: "p2",
      role: "user",
      text: "Jazz shows this weekend",
    },
    {
      id: "p3",
      role: "assistant",
      text: "Found some great jazz events in Dhaka with early-bird tickets.",
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [featuredResponse, upcomingResponse, statsResponse] =
          await Promise.all([
            eventService.getFeaturedEvents(),
            eventService.getAllEvents({ limit: 3 }),
            statsAPI.getGlobalStats(),
          ]);

        if (!isMounted) return;

        const events = Array.isArray(featuredResponse)
          ? featuredResponse
          : featuredResponse?.events;

        setFeaturedEvents(events || []);

        const upcoming = Array.isArray(upcomingResponse?.events)
          ? upcomingResponse.events
          : upcomingResponse || [];

        setUpcomingEvents(upcoming.slice(0, 3));
        setIsLoading(false);

        const statsData = statsResponse?.data?.data;
        if (statsData) {
          setStats(statsData);
        }
        setStatsLoading(false);
      } catch {
        if (!isMounted) return;
        setFeaturedEvents([]);
        setUpcomingEvents([]);
        setIsLoading(false);
        setStatsLoading(false);
      }
    };

    // Load app reviews
    appReviewsAPI
      .getAll()
      .then((res) => {
        if (isMounted) setAppReviews(res.data || []);
      })
      .catch(() => {});

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, [setAppReviews]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderOptions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [placeholderOptions.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = searchQuery.trim()
      ? `?search=${encodeURIComponent(searchQuery.trim())}`
      : "";
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
    transition: { duration: 0.6 },
  };

  const heroStats = [
    {
      value: statsLoading
        ? "..."
        : numberFormatter.format(stats.totalUsers || 86),
      label: "Total Users",
      icon: <FiUser />,
    },
    {
      value: statsLoading
        ? "..."
        : numberFormatter.format(stats.totalCities || 64),
      label: "Major Cities",
      icon: <MdLocationCity />,
    },
    {
      value: statsLoading ? "..." : `${(stats.rating || 4.3).toFixed(1)}/5`,
      label: stats.totalReviews
        ? `User Rating (${numberFormatter.format(stats.totalReviews)} reviews)`
        : "User Rating",
      icon: <MdRateReview />,
    },
  ];

  const formatEventDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Date TBA";
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const activeUpcoming = upcomingEvents[upcomingIndex] || null;

  useEffect(() => {
    if (upcomingEvents.length <= 1) return undefined;
    const interval = setInterval(() => {
      setUpcomingIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [upcomingEvents.length]);

  return (
    <div className="bg-dark-bg min-h-screen text-zinc-200 relative overflow-hidden pt-10">
      <div className="absolute inset-0 bg-aurora opacity-70 pointer-events-none" />

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-200 h-200 bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-150 h-150 bg-indigo-500/10 rounded-full blur-30" />
          <div className="absolute inset-0 opacity-20" />
        </div>

        <div className="container-custom relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex-row gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <section>
                <Link
                  to="/assistant"
                  className="h-9 w-9 not-lg:float-right my-auto md:hidden rounded-xl bg-linear-to-br from-primary to-orange-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                  aria-label="Open assistant"
                >
                  <SiGooglegemini
                    className="text-base animate-spin"
                    size={24}
                  />
                </Link>
                <h1 className="text-7xl font-black tracking-tighter mb-6 text-glow text-white leading-[0.95] sm:leading-[0.9] lg:leading-[0.85]">
                  NEXT <br />
                  <span className="w-full pr-2 text-transparent bg-clip-text bg-linear-to-r from-violet-500 via-rose-500 to-amber-500 animate-gradient-x">
                    DHAKA
                  </span>
                </h1>
              </section>

              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-6 leading-tight font-medium tracking-tight">
                Where passion meets the moment. Discover elite experiences
                across Bangladesh.
              </p>

              <div className="w-auto">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-amber-400/40 via-rose-500/40 to-indigo-500/40 rounded-4xl blur-xl opacity-60 group-focus-within:opacity-90 transition duration-500" />
                  <div className="relative flex items-center gap-4 bg-[#0b0b11]/85 backdrop-blur-2xl rounded-4xl px-4 py-3 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.45)] neon-ring animate-glow">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-focus-within:text-white transition-colors">
                      <FiSearch className="text-xl" />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={placeholderOptions[placeholderIndex]}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-white text-base font-semibold placeholder:text-zinc-500/70"
                        aria-label="Search events"
                      />
                      <div className="mt-2 h-px w-full bg-linear-to-r from-white/5 via-white/20 to-white/5 opacity-70" />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-linear-to-r from-amber-400 via-rose-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider shadow-[0_12px_30px_rgba(244,63,94,0.35)] hover:-translate-y-px transition-all cursor-pointer active:scale-95"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Categories Marquee Carousel */}
                <div className="mt-10 overflow-hidden relative w-full">
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-dark-bg to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-dark-bg to-transparent z-10 pointer-events-none" />

                  <div className="flex flex-nowrap gap-4 marquee-track hover:[animation-play-state:paused] cursor-pointer">
                    {marqueeTags.map((tag, index) => (
                      <button
                        key={`${tag}-${index}`}
                        onClick={() => {
                          handleTagClick(tag);
                        }}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300 min-w-42 neon-ring"
                      >
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                          {tag === "Concerts" && (
                            <FiMusic className="text-base" />
                          )}
                          {tag === "Festivals" && (
                            <FiAward className="text-base" />
                          )}
                          {tag === "Theater" && (
                            <FiShield className="text-base" />
                          )}
                          {tag === "Sports" && (
                            <BsTicketPerforated className="text-base" />
                          )}
                          {tag === "Conference" && (
                            <FiCpu className="text-base" />
                          )}
                          {tag === "Food" && <FiCoffee className="text-base" />}
                          {!eventTags.includes(tag) && (
                            <FiSearch className="text-base" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-[9px] font-black uppercase tracking-wide text-zinc-500 group-hover:text-zinc-200">
                            Category
                          </div>
                          <div className="text-xs font-bold tracking-tight">
                            {tag}
                          </div>
                        </div>
                        <div className="ml-auto h-7 w-7 rounded-full bg-linear-to-br from-amber-400/20 via-rose-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                          <FiArrowRight className="text-xs" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Simulated Live Chat assistant */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative not-md:hidden"
            >
              <div className="absolute -inset-1 rounded-4xl bg-linear-to-br from-amber-400/25 via-rose-500/20 to-indigo-500/20 blur-2xl opacity-80" />
              <div className="relative rounded-4xl border border-white/5 bg-[#0c0c10]/70 backdrop-blur-xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-t-white/10">
                {/* Header of Assistant Panel */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white relative">
                      <FiMessageSquare className="text-lg text-primary" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0c0c10] rounded-full animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black text-white">
                        NEXTDHAKA AI
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Online &bull; Ready to help
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/assistant"
                    className="h-9 w-9 rounded-xl bg-linear-to-br from-primary to-orange-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                    aria-label="Open assistant"
                  >
                    <FiMessageSquare className="text-base" />
                  </Link>
                </div>

                {/* Messages Window */}
                <div className="h-70 overflow-y-auto rounded-2xl border border-white/5 bg-black/40 p-4 space-y-4 scrollbar-hide">
                  {previewMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3.5 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role !== "user" && (
                        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-[10px] shrink-0 self-end">
                          ✨
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-[1.25rem] px-4 py-3 text-xs font-semibold leading-relaxed ${
                          message.role === "user"
                            ? "bg-linear-to-r from-primary to-orange-500 text-white shadow-md shadow-primary/15 rounded-tr-none"
                            : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Bar mockup */}
                <div className="mt-4 flex gap-2 p-1.5 border border-white/5 bg-white/2 rounded-2xl">
                  <input
                    disabled
                    placeholder="Ask AI to find events near you..."
                    className="bg-transparent flex-1 text-xs px-3 outline-none text-zinc-500 cursor-not-allowed font-medium"
                  />
                  <div className="h-8 w-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs cursor-not-allowed">
                    <FiArrowRight />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 mb-6">
        <div className="container-custom">
          <div className="grid grid-cols-3 gap-6">
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ delay: i * 0.1 }}
                className="py-4 px-2 rounded-3xl bg-white/1 backdrop-blur-md border border-white/5 hover:border-primary/20 text-center group hover:bg-white/4 transition-all card-glow border-t-white/10"
              >
                <div className="text-3xl font-black text-white group-hover:text-brand-primary mb-2 tracking-tighter bg-linear-to-r from-white to-slate-300 bg-clip-text group-hover:from-primary group-hover:to-orange-500 transition-colors">
                  {stat.value}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-primary mx-auto w-fit mt-2">
                  {stat.icon}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Featured Upcoming Slide with Framer Motion transitions */}
          <div className="mt-6 relative overflow-hidden rounded-4xl border border-white/5 bg-[#09090d]/60 backdrop-blur-xl card-glow border-t-white/10">
            <div className="absolute inset-0 bg-linear-to-r from-amber-400/5 via-rose-500/5 to-indigo-500/5" />

            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-primary mb-3">
                    Upcoming Events
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                    Next 3 experiences you should not miss
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1.5 font-medium">
                    Hand-picked highlights from Bangladesh.
                  </p>
                </div>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 text-white text-[10px] font-black uppercase tracking-wider hover:bg-white/5 transition-all self-start md:self-auto"
                >
                  View All <FiArrowRight className="text-sm" />
                </Link>
              </div>

              {/* Animate slide transitions */}
              <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-black h-70">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={upcomingIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={resolveImage(activeUpcoming?.image)}
                      alt={activeUpcoming?.title || "Upcoming event"}
                      className="h-full w-full object-cover opacity-70"
                      onError={(e) => {
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-black/80" />

                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-100 text-[9px] font-black uppercase tracking-wide border border-rose-500/20">
                      Featured
                    </div>

                    <div className="absolute left-6 bottom-6 right-6 flex flex-col gap-2.5 text-left">
                      <h4 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                        {activeUpcoming?.title || "Curated event coming soon"}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-zinc-300 text-[11px] font-semibold">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-primary text-xs" />
                          <span>
                            {activeUpcoming
                              ? formatEventDate(activeUpcoming.date)
                              : "Date TBA"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-primary text-xs" />
                          <span>
                            {activeUpcoming?.location || "Bangladesh"}
                          </span>
                        </div>
                        <div className="text-white font-black text-sm bg-white/10 px-2.5 py-1 rounded-lg border border-white/5">
                          {activeUpcoming?.price
                            ? `৳${Number(
                                activeUpcoming.price,
                              ).toLocaleString()}`
                            : "Price TBA"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Arrow navigation on top of slide */}
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                  <button
                    type="button"
                    onClick={() =>
                      setUpcomingIndex(
                        (prev) =>
                          (prev - 1 + upcomingEvents.length) %
                          upcomingEvents.length,
                      )
                    }
                    className="h-10 w-10 rounded-full bg-slate-950/75 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all pointer-events-auto cursor-pointer"
                    aria-label="Previous event"
                    disabled={upcomingEvents.length === 0}
                  >
                    <FiArrowRight className="text-base rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUpcomingIndex(
                        (prev) => (prev + 1) % upcomingEvents.length,
                      )
                    }
                    className="h-10 w-10 rounded-full bg-slate-950/75 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all pointer-events-auto cursor-pointer"
                    aria-label="Next event"
                    disabled={upcomingEvents.length === 0}
                  >
                    <FiArrowRight className="text-base" />
                  </button>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="mt-4 flex items-center justify-center gap-3">
                {Array.from({ length: upcomingEvents.length || 3 }).map(
                  (_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUpcomingIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        idx === upcomingIndex ? "bg-primary w-6" : "bg-white/20"
                      }`}
                      aria-label={`Go to event ${idx + 1}`}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────────────────────────────── */}
      <section className="py-8 bg-slate-900/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-30" />
        <div className="absolute -top-24 right-[-10%] w-130 h-130 bg-rose-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-24 left-[-10%] w-130 h-130 bg-indigo-500/10 rounded-full blur-[140px]" />

        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-wider mb-6">
                Editor's Choice
              </div>
              <motion.h2
                {...fadeInUp}
                className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 uppercase"
              >
                FEATURED <span className="text-primary">PICKS.</span>
              </motion.h2>
              <motion.p
                {...fadeInUp}
                transition={{ delay: 0.1 }}
                className="text-zinc-400 font-medium text-base max-w-xl"
              >
                Hand-picked experiences selected by our curators for the
                ultimate weekend.
              </motion.p>

              <div className="mt-6 flex flex-wrap gap-3">
                {["Verified Hosts", "Instant Tickets", "Curated in BD"].map(
                  (item) => (
                    <div
                      key={item}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wide text-zinc-300"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Link
                to="/events"
                className="btn-secondary py-3.5 px-6 rounded-2xl group text-[10px] tracking-widest uppercase font-black"
              >
                Explore All{" "}
                <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-125 bg-white/5 rounded-4xl animate-pulse border border-white/5"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredEvents.slice(0, 6).map((event, i) => (
                <motion.div
                  key={event.id}
                  {...fadeInUp}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Organizer CTA ─────────────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-900/10 relative overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-linear-to-br from-slate-900 to-black rounded-[3rem] p-12 md:p-20 overflow-hidden text-center border border-white/5 card-glow"
          >
            <div className="absolute inset-0 bg-mesh opacity-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-30" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-30" />
            <div className="absolute inset-0 sweep-light" />
            <div className="absolute top-12 left-12 hidden md:block orbit-dot" />
            <div className="absolute bottom-16 right-16 hidden md:block orbit-dot" />

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-wider mb-6">
                Become a Member
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-[0.95] uppercase">
                READY FOR YOUR <br />
                <span className="text-primary">NEXT ADVENTURE?</span>
              </h2>
              <p className="text-zinc-400 text-base font-medium mb-10 max-w-2xl mx-auto">
                Join thousands of explorers and get exclusive access to the most
                premium events across Bangladesh.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
                >
                  Join NEXTDHAKA
                </Link>
                <Link
                  to="/events"
                  className="w-full sm:w-auto px-10 py-4 border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all"
                >
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
