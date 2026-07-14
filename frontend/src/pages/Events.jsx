import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiMapPin,
  FiChevronDown,
  FiX,
  FiZap,
  FiCompass,
  FiSliders,
} from "react-icons/fi";
import EventCard from "../components/EventCard";
import Pagination from "../components/common/Pagination";
import eventService from "../services/eventService";

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);

  // Dynamic filters from database
  const [categories, setCategories] = useState(["All"]);
  const [locations, setLocations] = useState(["All"]);

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [location, setLocation] = useState(
    searchParams.get("location") || "All",
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await eventService.getFilters();
        if (data && data.success) {
          if (data.categories && data.categories.length > 0) {
            setCategories(["All", ...data.categories]);
          }
          if (data.locations && data.locations.length > 0) {
            setLocations(["All", ...data.locations]);
          }
        }
      } catch (error) {
        console.error("Error fetching filters from DB:", error);
      }
    };
    fetchFilters();
  }, []);

  const fetchEvents = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    try {
      const params = {
        search: searchParams.get("search"),
        category:
          searchParams.get("category") !== "All"
            ? searchParams.get("category")
            : undefined,
        location:
          searchParams.get("location") !== "All"
            ? searchParams.get("location")
            : undefined,
        page: searchParams.get("page") || 1,
        limit: 9,
      };

      const data = await eventService.getAllEvents(params);
      setEvents(data.events || []);
      setTotalEvents(data.total || 0);
    } catch (error) {
      console.error("Error fetching events:", error);
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
      if (newParams[key] === "All" || !newParams[key]) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, newParams[key]);
      }
    });
    setSearchParams(updatedParams);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLocation("All");
    setPage(1);
    setSearchParams({});
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
    <div className="bg-aurora min-h-screen relative overflow-hidden pt-10 pb-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20" />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-8">
        {/* Header Section */}
        <div className="mb-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
          >
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-3 uppercase leading-[0.9]">
                FIND YOUR{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
                  NEXT
                </span>{" "}
                <br />
                MEMORABLE{" "}
                <span className="relative">
                  EVENT
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-3 text-primary/30"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 25 0 50 5 T 100 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-zinc-400 text-base font-medium max-w-lg leading-relaxed mt-3">
                Discover workshops, concerts, and conferences happening near you
                across Bangladesh.
              </p>
            </div>

            {/* Quick Search */}
            <div className="flex flex-col gap-4 w-full lg:max-w-lg">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary to-orange-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                <div className="relative flex items-center bg-[#0b0b11]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
                  <FiSearch className="ml-4 text-zinc-500 text-xl" />
                  <input
                    type="text"
                    placeholder="Search by name or keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-white font-semibold placeholder:text-zinc-600 text-sm"
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
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Trending:
                  </span>
                  <div className="flex gap-3">
                    {["Concerts", "Tech"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const cat =
                            tag === "Concerts" ? "Concert" : "Conference";
                          setCategory(cat);
                          updateParams({ category: cat, page: 1 });
                        }}
                        className="text-[10px] font-black text-zinc-400 hover:text-primary transition-colors cursor-pointer"
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

        <div className="bg-[#0b0b11]/40 border border-white/10 rounded-4xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Results Info Bar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2.5 rounded-xl">
                <FiZap className="text-primary text-sm" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                Showing{" "}
                <span className="text-white font-black">{totalEvents}</span>{" "}
                Results
              </h3>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category and Location filters inside the left block */}
            <aside className="hidden lg:flex flex-col w-60 shrink-0 text-left bg-white/5 border border-white/10 rounded-2xl p-5 h-fit lg:self-center">
              <div className="flex flex-col space-y-5">
                {/* Category Filter */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                  <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-2.5 flex items-center gap-2">
                    <FiCompass className="text-primary" /> Category
                  </h4>
                  <div className="relative group">
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        updateParams({ category: e.target.value, page: 1 }); // Reset to page 1 on filter change
                      }}
                      className="w-full bg-white/5 border border-white/10 text-white text-[10px] font-bold px-3 py-2 rounded-lg outline-none appearance-none focus:border-primary/50 cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900">
                          {cat === "All" ? "All Categories" : cat}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                  <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-2.5 flex items-center gap-2">
                    <FiMapPin className="text-primary" /> Location
                  </h4>
                  <div className="relative group">
                    <select
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        updateParams({ location: e.target.value, page: 1 }); // Reset to page 1 on filter change
                      }}
                      className="w-full bg-white/5 border border-white/10 text-white text-[10px] font-bold px-3 py-2 rounded-lg outline-none appearance-none focus:border-primary/50 cursor-pointer"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc} className="bg-slate-900">
                          {loc === "All" ? "Everywhere" : loc}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Reset All */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiX /> Reset Filters
                </button>
              </div>
            </aside>

            {/* Events Grid Area - Scrollable block */}
            <div
              id="events-grid-container"
              className="flex-1 lg:max-h-[68vh] lg:overflow-y-auto pr-2 custom-scrollbar"
            >
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
                        className="bg-[#0b0b11]/50 rounded-4xl h-[450px] animate-pulse border border-white/5"
                      />
                    ))}
                  </motion.div>
                ) : events.length > 0 ? (
                  <motion.div
                    key="grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8"
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
                    className="glass-card p-20 text-center bg-white/1 border border-white/5 rounded-[3.5rem] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                    {/* Glow Backdrop inside empty card */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-primary/10 rounded-full blur-[70px] pointer-events-none" />

                    <div className="bg-white/5 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 relative">
                      <FiSearch className="text-4xl text-zinc-500" />
                    </div>

                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">
                      No results found
                    </h3>
                    <p className="text-zinc-500 mb-10 font-medium max-w-sm mx-auto text-sm leading-relaxed">
                      We couldn't find any events matching your search filters.
                      Try clearing filters or using different keywords.
                    </p>

                    <button
                      onClick={clearFilters}
                      className="btn-primary py-4 px-10 rounded-xl group font-black tracking-widest text-xs cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        Clear All Filters{" "}
                        <FiX className="group-hover:rotate-90 transition-transform" />
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {!isLoading && totalEvents > 9 && (
                <div className="flex justify-center border-t border-white/5 pt-12 pb-4">
                  <Pagination
                    currentPage={page}
                    totalItems={totalEvents}
                    itemsPerPage={9}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                      updateParams({ page: newPage });
                      const container = document.getElementById(
                        "events-grid-container",
                      );
                      if (container) {
                        container.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  />
                </div>
              )}
            </div>
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
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
                    Category
                  </h4>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      updateParams({ category: e.target.value, page: 1 });
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white text-xs font-bold px-4 py-4 rounded-xl outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">
                        {cat === "All" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
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
                    {locations.map((loc) => (
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
