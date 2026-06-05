import { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle, FiTrash2, FiCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNotifications([]);
    setLoading(false);
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <FiCheckCircle className="text-green-400" />;
      case 'error': return <FiAlertCircle className="text-red-400" />;
      default: return <FiInfo className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Notifications</h1>
          <p className="text-zinc-500 font-medium">Keep track of your bookings and upcoming events.</p>
        </div>
        <button className="text-xs font-black text-brand-orange uppercase tracking-widest hover:text-white transition-colors">
          Mark all as read
        </button>
      </header>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-900/50 rounded-2xl animate-pulse border border-zinc-800" />
          ))
        ) : notifications.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {notifications.map((n, idx) => (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group p-6 rounded-[2rem] border transition-all flex gap-5 relative overflow-hidden ${
                  n.isRead 
                  ? 'bg-zinc-900/30 border-zinc-800/50' 
                  : 'bg-zinc-900/80 border-brand-orange/20 shadow-xl shadow-brand-orange/5'
                }`}
              >
                {!n.isRead && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange" />
                )}
                
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                  n.isRead ? 'bg-zinc-800/50' : 'bg-zinc-800'
                }`}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                    <h3 className={`font-black text-lg ${n.isRead ? 'text-zinc-400' : 'text-white'}`}>
                      {n.title}
                    </h3>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                      {formatDistanceToNow(new Date(n.createdAt))} ago
                    </span>
                  </div>
                  <p className={`text-sm font-medium leading-relaxed ${n.isRead ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    {n.message}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-zinc-600 hover:text-red-500 transition-colors p-2">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="glass-card p-20 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-zinc-700">
               <FiBell />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">All caught up!</h2>
            <p className="text-zinc-500">You don't have any new notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;
