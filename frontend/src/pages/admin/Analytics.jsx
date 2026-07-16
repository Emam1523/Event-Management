import { useState, useEffect, useCallback } from "react";
import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiActivity,
  FiLayers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { adminAPI } from "../../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
          {label}
        </p>
        <p className="text-xl font-black text-white">
          {chartType === "revenue"
            ? `৳${payload[0].value.toLocaleString()}`
            : `${payload[0].value} Passes`}
        </p>
        <p className="text-[10px] text-brand-orange font-bold uppercase mt-1">
          {chartType === "revenue" ? "Gross Wealth" : "Ticket Volume"}
        </p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [timeframe] = useState("month");
  const [chartType, setChartType] = useState("revenue"); // 'revenue' or 'tickets'
  const [revenueData, setRevenueData] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: { current: 0, previous: 0, growth: 0 },
    bookings: { current: 0, previous: 0, growth: 0 },
    customers: { current: 0, previous: 0, growth: 0 },
    events: { current: 0, previous: 0, growth: 0 },
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getAnalytics({ timeframe });
      const data = res.data;

      setRevenueData(data.revenueData || []);
      setTopEvents(data.topEvents || []);
      if (data.stats) setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalytics();
  }, [fetchAnalytics]);

  const statCards = [
    {
      key: "revenue",
      label: "Gross Wealth",
      value: `৳${stats.revenue.current.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "text-brand-orange",
      bg: "bg-brand-orange/10",
    },
    {
      key: "bookings",
      label: "Total Passes",
      value: stats.bookings.current.toLocaleString(),
      sub: `Tickets issued`,
      icon: <FiLayers />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      key: "customers",
      label: "Elite Members",
      value: stats.customers.current.toLocaleString(),
      sub: `Loyal attendees`,
      icon: <FiUsers />,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      key: "events",
      label: "Exhibitions",
      value: stats.events.current,
      sub: `Active curation`,
      icon: <FiCalendar />,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-white/5 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Command Center
          </h1>
          <p className="text-gray-400 font-medium italic">
            Deciphering the elite economy of your gatherings.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          return (
            <motion.div
              key={card.key}
              variants={itemVariants}
              className="bg-white/5 border border-white/10 rounded-4xl p-8 backdrop-blur-xl relative group hover:bg-white/8 transition-all overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <div className="text-9xl">{card.icon}</div>
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div
                  className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center text-xl`}
                >
                  {card.icon}
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-1 relative z-10">
                {card.label}
              </p>
              <p className="text-3xl font-black text-white group-hover:scale-105 origin-left transition-transform relative z-10">
                {card.value}
              </p>
              <p className="text-[10px] text-gray-600 font-bold uppercase mt-4 flex items-center gap-1 relative z-10">
                {card.sub || "Active Monitoring"}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white/5 border border-white/10 rounded-4xl p-10 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                <FiActivity className="text-brand-orange" /> Performance Pulse
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                Financial & Volume Metrics Over Time
              </p>
            </div>

            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setChartType("revenue")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${chartType === "revenue" ? "bg-brand-orange text-white" : "text-gray-500"}`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartType("tickets")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${chartType === "tickets" ? "bg-brand-orange text-white" : "text-gray-500"}`}
              >
                Tickets
              </button>
            </div>
          </div>

          <div className="h-100 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F55F1D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F55F1D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 900 }}
                  tickFormatter={(value) =>
                    chartType === "revenue" ? `৳${value / 1000}k` : value
                  }
                />
                <Tooltip
                  content={<CustomTooltip chartType={chartType} />}
                  cursor={{ stroke: "#F55F1D", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey={chartType}
                  stroke="#F55F1D"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Events Sidebar */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 border border-white/10 rounded-4xl p-10 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">
              Elite
            </h2>
            <FiTrendingUp className="text-emerald-400 text-2xl" />
          </div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-wide mb-8">
            Top performing exhibitions
          </p>

          <div className="space-y-6">
            {topEvents.map((event, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.02)" }}
                className="flex items-center gap-5 p-4 rounded-3xl border border-white/5 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${event.color} flex items-center justify-center font-black text-white shadow-xl shrink-0`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-sm truncate">
                    {event.name}
                  </p>
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
                    {event.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-brand-orange text-sm">
                    ৳{(event.revenue / 1000).toFixed(1)}K
                  </p>
                  <p className="text-[9px] text-gray-600 font-bold uppercase">
                    {event.bookings} Sold
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-10 py-5 rounded-4xl border border-white/10 text-[10px] font-black text-white hover:bg-white/5 uppercase tracking-widest transition-all">
            View Full Report
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
