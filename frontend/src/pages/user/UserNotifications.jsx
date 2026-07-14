import { useState, useEffect, useCallback } from "react";
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle } from "react-icons/fi";
import { formatDistanceToNow, isValid } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { notificationsAPI } from "../../services/api";
import toast from "react-hot-toast";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationsAPI.getAll();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    try {
      await Promise.all(unread.map((n) => notificationsAPI.markAsRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to update all notifications");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-400" />;
      case "error":
        return <FiAlertCircle className="text-red-400" />;
      default:
        return <FiInfo className="text-blue-400" />;
    }
  };

  const formatDistanceSafe = (dateStr) => {
    const d = new Date(dateStr);
    return isValid(d) ? `${formatDistanceToNow(d)} ago` : "recently";
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Notifications
          </h1>
          <p className="text-zinc-500 font-medium">
            Keep track of your bookings and upcoming events.
          </p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-black text-brand-orange uppercase tracking-widest hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </header>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-zinc-900/50 rounded-2xl animate-pulse border border-zinc-800"
            />
          ))
        ) : notifications.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {notifications.map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => !n.read && handleMarkAsRead(n.id)}
                className={`group p-6 rounded-4xl border transition-all flex gap-5 relative overflow-hidden cursor-pointer ${
                  n.read
                    ? "bg-zinc-900/30 border-zinc-800/50"
                    : "bg-zinc-900/80 border-brand-orange/20 shadow-xl shadow-brand-orange/5"
                }`}
              >
                {!n.read && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange" />
                )}

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    n.read ? "bg-zinc-800/50" : "bg-zinc-800"
                  }`}
                >
                  {getIcon(n.type)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                    <h3
                      className={`font-black text-lg ${n.read ? "text-zinc-400" : "text-white"}`}
                    >
                      {n.read ? "Notification" : "New Update"}
                    </h3>
                    <span className="text-[10px] font-black text-zinc-300/60 uppercase tracking-widest mt-1">
                      {formatDistanceSafe(n.createdAt)}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-medium leading-relaxed ${n.read ? "text-zinc-500" : "text-zinc-300"}`}
                  >
                    {n.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="glass-card p-20 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-zinc-700">
              <FiBell />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              All caught up!
            </h2>
            <p className="text-zinc-500">
              You don't have any new notifications at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;
