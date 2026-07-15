import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiX,
  FiMapPin,
  FiClock,
  FiSearch,
  FiArrowRight,
  FiTag,
  FiUsers,
  FiArrowLeft,
} from "react-icons/fi";
import { BsQrCode, BsTicketPerforated } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import { QRCodeSVG } from "qrcode.react";
import { format, isValid } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import bookingService from "../../services/bookingService";
import { API_ROOT } from "../../services/api";

const resolveImage = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${API_ROOT}${image}`;
};

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800";

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    dot: "bg-amber-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/15 text-red-400 border-red-500/25",
    dot: "bg-red-400",
  },
  used: {
    label: "Used",
    className: "bg-white/5 text-zinc-500 border-white/8",
    dot: "bg-slate-500",
  },
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    bookingService
      .getMyBookings()
      .then((bookings) => {
        const normalized = (bookings || []).map((b) => {
          const code = b.id?.slice(-8)?.toUpperCase() || "UNKNOWN";
          return {
            id: b.id,
            bookingId: `BK-${code}`,
            event: {
              id: b.event?.id || "",
              title: b.event?.title || "Untitled Event",
              date: b.event?.date || "",
              time: b.event?.time || "TBA",
              location: b.event?.location || "Venue TBA",
              image: b.event?.image || null,
              category: b.event?.category || "",
            },
            ticketType: b.ticketType || "GENERAL",
            quantity: Number(b.quantity) || 0,
            totalPrice: Number(b.totalPrice) || 0,
            status: b.status || "confirmed",
            qrData: `TICKET::BK-${code}::${b.event?.id || ""}::${b.ticketType || "GENERAL"}::${b.quantity || 0}`,
          };
        });
        if (isMounted) setTickets(normalized);
      })
      .catch(() => {
        if (isMounted) setTickets([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const now = new Date();
  const upcoming = tickets.filter((t) => new Date(t.event.date) >= now);
  const past = tickets.filter((t) => new Date(t.event.date) < now);
  const displayed = (activeTab === "upcoming" ? upcoming : past).filter(
    (t) =>
      !search || t.event.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05050a]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-2 border-white/10 border-t-brand-orange rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 text-sm font-medium animate-pulse">
            Loading your passes…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050a] pt-28 pb-24 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-orange/6 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 -left-40 w-100 h-100 bg-violet-600/6 rounded-full blur-30" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
            Back to Profile
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
              <BsTicketPerforated />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[9px] font-black uppercase tracking-widest text-zinc-400">
              <HiSparkles className="text-brand-orange" /> Pass Archive
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
            My Passes
          </h1>
          <p className="text-zinc-500 font-medium">
            Your collection of world-class experiences
          </p>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            {
              label: "Total Passes",
              value: tickets.length,
              color: "from-brand-orange to-rose-500",
            },
            {
              label: "Upcoming",
              value: upcoming.length,
              color: "from-violet-500 to-purple-600",
            },
            {
              label: "Past Events",
              value: past.length,
              color: "from-emerald-500 to-teal-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white/3 border border-white/8 p-5"
            >
              <div
                className={`text-2xl font-black bg-linear-to-r ${s.color} bg-clip-text text-transparent`}
              >
                {s.value}
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Tabs + Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          {/* Tabs */}
          <div className="flex gap-1 p-1.5 rounded-2xl bg-zinc-950 border border-white/8">
            {[
              { key: "upcoming", label: "Upcoming", count: upcoming.length },
              { key: "past", label: "Past", count: past.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.key
                    ? "text-white"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="ticket-tab"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 px-2 py-0.5 rounded-lg text-[9px] font-black ${activeTab === tab.key ? "bg-brand-orange text-white" : "bg-white/5 text-zinc-600"}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm ml-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets…"
              className="w-full bg-white/3 border border-white/8 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-brand-orange/40 font-medium transition-all"
            />
          </div>
        </motion.div>

        {/* ── Ticket List ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-5"
          >
            {displayed.length === 0 ? (
              <div className="py-24 text-center rounded-4xl border border-dashed border-white/8">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-3xl text-zinc-700">
                  <BsQrCode />
                </div>
                <h2 className="text-2xl font-black text-white mb-3 tracking-tight">
                  No Passes Found
                </h2>
                <p className="text-zinc-500 text-sm mb-8 max-w-xs mx-auto font-medium">
                  {search
                    ? "No tickets match your search."
                    : activeTab === "upcoming"
                      ? "You haven't secured any upcoming event passes yet."
                      : "You haven't attended any events yet."}
                </p>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg shadow-brand-orange/25"
                >
                  Explore Events <FiArrowRight />
                </Link>
              </div>
            ) : (
              displayed.map((ticket, i) => {
                const d = new Date(ticket.event.date);
                const imgSrc = resolveImage(ticket.event.image) || DEFAULT_IMG;
                const sc =
                  statusConfig[ticket.status] || statusConfig.confirmed;
                const isUpcoming = d >= now;
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="group relative rounded-4xl overflow-hidden border border-white/8 hover:border-brand-orange/25 transition-all duration-500 bg-zinc-950/60 backdrop-blur-xl"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-linear-to-r from-brand-orange/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex flex-col md:flex-row">
                      {/* Image side */}
                      <div className="md:w-56 lg:w-72 h-48 md:h-auto relative overflow-hidden shrink-0">
                        <img
                          src={imgSrc}
                          alt={ticket.event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = DEFAULT_IMG;
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-transparent to-zinc-950/60 md:block hidden" />
                        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 to-transparent md:hidden" />

                        {/* Date badge */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-3 text-center min-w-[56px] group-hover:bg-brand-orange/90 group-hover:border-transparent transition-all duration-500">
                            <p className="text-[9px] font-black uppercase text-brand-orange group-hover:text-white/80 leading-none mb-1">
                              {isValid(d) ? format(d, "MMM") : "???"}
                            </p>
                            <p className="text-xl font-black text-white leading-none">
                              {isValid(d) ? format(d, "dd") : "?"}
                            </p>
                          </div>
                        </div>

                        {isUpcoming && (
                          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
                            Live
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          {/* Top row */}
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${sc.className}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                              />{" "}
                              {sc.label}
                            </span>
                            {ticket.event.category && (
                              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                {ticket.event.category}
                              </span>
                            )}
                            <span className="ml-auto text-[9px] font-mono text-zinc-600 font-bold tracking-widest">
                              {ticket.bookingId}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-5 group-hover:text-brand-orange transition-colors leading-tight line-clamp-2">
                            {ticket.event.title}
                          </h2>

                          {/* Info grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                              {
                                icon: <FiClock size={12} />,
                                label: "Time",
                                val: ticket.event.time,
                              },
                              {
                                icon: <FiMapPin size={12} />,
                                label: "Venue",
                                val: ticket.event.location.split(",")[0],
                              },
                              {
                                icon: <FiTag size={12} />,
                                label: "Type",
                                val: ticket.ticketType,
                              },
                              {
                                icon: <FiUsers size={12} />,
                                label: "Passes",
                                val: `${ticket.quantity}x`,
                              },
                            ].map((item) => (
                              <div key={item.label}>
                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">
                                  {item.label}
                                </p>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-white/80 line-clamp-1">
                                  <span className="text-brand-orange">
                                    {item.icon}
                                  </span>{" "}
                                  {item.val}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-white/5">
                          <div>
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                              Total Paid
                            </p>
                            <p className="text-2xl font-black text-white tracking-tight">
                              ৳{ticket.totalPrice.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all shadow-lg hover:shadow-brand-orange/25 cursor-pointer"
                          >
                            <BsQrCode className="text-lg" /> View Pass
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ticket perforated edge decoration */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-1.5 -mr-[3px]">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-3 bg-[#05050a] rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── QR Modal ── */}
        <AnimatePresence>
          {selectedTicket && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTicket(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 30 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="relative w-full max-w-sm overflow-hidden rounded-4xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
              >
                {/* Ticket top section */}
                <div className="bg-linear-to-br from-brand-orange to-rose-600 p-7 relative">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/40 transition-all cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                  <div className="flex items-center gap-2 mb-3">
                    <BsTicketPerforated className="text-white/60 text-sm" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                      Entry Pass
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white leading-tight mb-4 pr-8">
                    {selectedTicket.event.title}
                  </h2>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
                    <div>
                      <p className="text-[8px] font-black uppercase text-white/50 mb-0.5">
                        Venue
                      </p>
                      <p className="text-xs font-bold text-white truncate">
                        {selectedTicket.event.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase text-white/50 mb-0.5">
                        Time
                      </p>
                      <p className="text-xs font-bold text-white">
                        {selectedTicket.event.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Perforation */}
                <div className="relative h-5 bg-zinc-950 flex items-center">
                  <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#05050a]" />
                  <div className="w-full h-px border-t-2 border-dashed border-zinc-800" />
                  <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#05050a]" />
                </div>

                {/* QR section */}
                <div className="bg-zinc-950 p-7 flex flex-col items-center">
                  <div className="p-4 bg-white rounded-2xl shadow-2xl mb-5">
                    <QRCodeSVG
                      value={selectedTicket.qrData}
                      size={180}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-base font-mono font-bold text-white tracking-[0.3em] mb-1">
                    {selectedTicket.bookingId}
                  </p>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-6">
                    Scan at entry gate
                  </p>

                  <div className="grid grid-cols-3 gap-4 w-full text-center border-t border-b border-zinc-800/60 py-4 mb-6">
                    {[
                      {
                        label: "Type",
                        val: selectedTicket.ticketType.split(" ")[0],
                      },
                      { label: "Seats", val: selectedTicket.quantity },
                      { label: "Status", val: selectedTicket.status },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p className="text-[8px] font-bold text-zinc-600 uppercase mb-1">
                          {label}
                        </p>
                        <p className="text-xs font-black text-white capitalize">
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-2xl font-black text-white">
                    ৳{selectedTicket.totalPrice.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-zinc-600 font-medium mt-1">
                    Total Paid
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTickets;
