import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiTrendingUp, FiPlus, FiArrowRight, FiActivity, FiShield, FiCpu } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    bookings: 0,
    revenue: 0,
    recentBookings: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getStats();
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-white/5 border-t-brand-orange rounded-full animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Matrix...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20"
    >
      {/* Dynamic Command Header */}
      <div className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-purple-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
         <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 bg-zinc-950/50 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl">
           <div>
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                 <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em]">Operational Authority</span>
              </motion.div>
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4"
              >
                COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">CENTER</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-zinc-500 font-medium max-w-xl text-lg">
                System heartbeat is stable. All curators and elite members are being monitored in real-time.
              </motion.p>
           </div>
           
           <motion.div variants={itemVariants} className="flex gap-4">
              <div className="px-6 py-4 bg-white/5 rounded-3xl border border-white/10 text-center">
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Elite Members</p>
                 <p className="text-xl font-black text-white">{stats.users || 0}</p>
              </div>
           </motion.div>
         </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Exhibition Pulse', value: stats.events || 0, sub: `Active Exhibitions`, icon: <FiCpu />, color: 'from-orange-500 to-brand-orange' },
          { label: 'Elite Attendance', value: stats.bookings || 0, sub: 'Total Passes Issued', icon: <FiUsers />, color: 'from-zinc-500 to-zinc-700' },
          { label: 'Wealth Accumulation', value: `৳${(stats.revenue || 0).toLocaleString()}`, sub: 'Net Platform Revenue', icon: <FiDollarSign />, color: 'from-brand-orange to-red-600' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-[#09090b] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-brand-orange/5"
          >
            <div className={`absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
            
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} p-[1px]`}>
                 <div className="w-full h-full bg-black rounded-[calc(1rem-1px)] flex items-center justify-center text-2xl text-white group-hover:bg-transparent transition-colors duration-500">
                    {stat.icon}
                 </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pt-2 flex items-center gap-2">
                 <span className="w-1 h-1 rounded-full bg-brand-orange" />
                 {stat.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#09090b] border border-white/5 rounded-[3rem] overflow-hidden group shadow-2xl">
           <div className="p-10 border-b border-white/5 flex items-center justify-between bg-zinc-950/30">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange">
                    <FiActivity />
                 </div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tighter">Transmission Log</h2>
              </div>
              <Link to="/admin/manage-events" className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                 Archive <FiArrowRight />
              </Link>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                       <th className="px-10 py-5">Elite Member</th>
                       <th className="px-10 py-5">Target Event</th>
                       <th className="px-10 py-5">Value</th>
                       <th className="px-10 py-5 text-right font-black">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {stats.recentBookings && stats.recentBookings.length > 0 ? stats.recentBookings.map((booking) => (
                       <tr key={booking.id} className="group/row hover:bg-white/[0.02] transition-colors">
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-zinc-400 group-hover/row:bg-brand-orange/20 group-hover/row:text-brand-orange transition-all">
                                   {booking.user?.charAt(0)}
                                </div>
                                <span className="text-sm font-bold text-white tracking-tight">{booking.user}</span>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-sm font-medium text-zinc-500 group-hover/row:text-zinc-300 transition-colors uppercase tracking-widest text-[10px]">{booking.event}</td>
                          <td className="px-10 py-6 text-sm font-black text-white">৳{booking.totalPrice?.toLocaleString()}</td>
                          <td className="px-10 py-6 text-right">
                             <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/5">Authorized</span>
                          </td>
                       </tr>
                    )) : (
                       <tr>
                          <td colSpan="4" className="px-10 py-20 text-center">
                             <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px]">No active transmissions detected.</p>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </motion.div>

        {/* Sidebar Intelligence */}
        <motion.div variants={itemVariants} className="space-y-8">
           <div className="bg-gradient-to-br from-brand-orange to-orange-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-brand-orange/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
              <FiShield className="text-6xl mb-8 opacity-20" />
              <h3 className="text-2xl font-black tracking-tighter mb-4 leading-tight uppercase">Expansion Protocol?</h3>
              <p className="text-white/80 font-medium mb-8 text-sm">Deploy new exhibitions to enhance the Aura Elite network and increase gross wealth.</p>
              <Link to="/admin/create-event" className="flex items-center justify-center gap-2 bg-black text-white font-black py-5 px-8 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all shadow-xl">
                 Initialize <FiPlus />
              </Link>
           </div>

           <div className="bg-[#09090b] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                    <FiTrendingUp />
                 </div>
                 <h3 className="text-lg font-black text-white uppercase tracking-tighter">System Health</h3>
              </div>
              <div className="space-y-8">
                 {[
                    { label: 'CPU Cluster B', value: 42, color: 'bg-emerald-500' },
                    { label: 'Database Sync', value: 100, color: 'bg-brand-orange' },
                    { label: 'Network Flow', value: 88, color: 'bg-blue-500' },
                 ].map((item, i) => (
                    <div key={i}>
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                          <span className="text-zinc-500">{item.label}</span>
                          <span className="text-white">{item.value}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1.5, delay: i * 0.2, ease: "circOut" }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;