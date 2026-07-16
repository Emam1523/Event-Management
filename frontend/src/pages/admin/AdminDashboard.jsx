import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiPlus,
  FiArrowRight,
  FiActivity,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { adminAPI } from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    bookings: 0,
    revenue: 0,
    recentBookings: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminStats();
  }, [fetchAdminStats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-white/5 border-t-brand-orange rounded-full animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `৳${(stats.revenue || 0).toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "text-brand-orange",
      bg: "bg-brand-orange/10",
    },
    {
      label: "Total Bookings",
      value: stats.bookings || 0,
      icon: <FiCreditCard />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Events",
      value: stats.events || 0,
      icon: <FiCalendar />,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Total Users",
      value: stats.users || 0,
      icon: <FiUsers />,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 font-medium">
            Real-time statistics and recent platform activities.
          </p>
        </div>
        <Link
          to="/admin/create-event"
          className="group relative px-6 py-3 bg-brand-orange text-white rounded-2xl font-bold flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-brand-orange/20 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <FiPlus className="relative z-10" />
          <span className="relative z-10 uppercase tracking-widest text-xs">
            Create Event
          </span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="bg-white/5 border border-white/10 rounded-4xl p-6 backdrop-blur-xl relative group hover:bg-white/8 transition-all overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`${card.bg} ${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}
              >
                {card.icon}
              </div>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
                {card.label}
              </p>
            </div>
            <p className="text-3xl font-black text-white group-hover:translate-x-1 transition-transform">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Recent Bookings Table */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white/5 border border-white/10 rounded-4xl overflow-hidden backdrop-blur-xl shadow-2xl"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shadow-inner border border-white/5">
                <FiActivity />
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-widest">
                Recent Bookings
              </h2>
            </div>
            <Link
              to="/admin/manage-bookings"
              className="text-[10px] font-black text-brand-orange hover:text-white transition-colors uppercase tracking-wide flex items-center gap-2"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/2 text-[10px] font-black text-gray-500 uppercase tracking-wide border-b border-white/5">
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Event</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentBookings && stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map((booking, i) => (
                    <tr
                      key={i}
                      className="group/row hover:bg-white/3 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-orange/20 to-orange-500/20 text-brand-orange border border-brand-orange/20 flex items-center justify-center text-xs font-black">
                            {booking.user?.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-white tracking-tight">
                            {booking.user}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-medium text-gray-400 group-hover/row:text-gray-300 transition-colors">
                        {booking.event}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-white">
                        ৳{booking.totalPrice?.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                          Authorized
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center">
                      <p className="text-gray-500 font-bold text-sm">
                        No recent bookings found.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Sidebar: Quick Actions & Links */}
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="bg-linear-to-br from-brand-orange to-orange-600 rounded-4xl p-8 text-white shadow-2xl shadow-brand-orange/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-tighter mb-2 leading-tight">
                Ready to host?
              </h3>
              <p className="text-white/90 font-medium mb-8 text-sm">
                Create a new event and start selling tickets immediately.
              </p>
              <Link
                to="/admin/create-event"
                className="flex items-center justify-center gap-2 bg-white text-black font-black py-4 px-6 rounded-xl uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl"
              >
                Create New Event <FiPlus />
              </Link>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-4xl p-8 backdrop-blur-xl shadow-2xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Manage Users",
                  to: "/admin/manage-users",
                  icon: <FiUsers className="text-blue-400" />,
                  bg: "bg-blue-400/10 border-blue-400/20",
                },
                {
                  label: "Manage Events",
                  to: "/admin/manage-events",
                  icon: <FiCalendar className="text-emerald-400" />,
                  bg: "bg-emerald-400/10 border-emerald-400/20",
                },
                {
                  label: "View Analytics",
                  to: "/admin/analytics",
                  icon: <FiTrendingUp className="text-purple-400" />,
                  bg: "bg-purple-400/10 border-purple-400/20",
                },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${link.bg} border flex items-center justify-center text-lg shadow-inner`}
                  >
                    {link.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                    {link.label}
                  </span>
                  <FiArrowRight className="ml-auto text-gray-600 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
