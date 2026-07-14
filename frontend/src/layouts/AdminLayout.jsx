import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiCalendar,
  FiPlus,
  FiTrendingUp,
  FiUsers,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
  FiMessageSquare,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", icon: <FiGrid />, label: "Dashboard", exact: true },
  { to: "/admin/profile", icon: <FiUser />, label: "Profile" },
  { to: "/admin/create-event", icon: <FiPlus />, label: "Create Event" },
  { to: "/admin/manage-events", icon: <FiCalendar />, label: "Manage Events" },
  { to: "/admin/manage-users", icon: <FiUsers />, label: "Users" },
  { to: "/admin/analytics", icon: <FiTrendingUp />, label: "Analytics" },
  { to: "/admin/reviews", icon: <FiMessageSquare />, label: "App Reviews" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) =>
    location.pathname === to ||
    (to !== "/admin" && location.pathname.startsWith(to));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans">
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 100 : 280 }}
        className="hidden md:flex flex-col bg-zinc-950 border-r border-white/5 relative z-40"
      >
        <div className="p-8 flex items-center gap-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-orange/20 hover:scale-105 active:scale-95 transition-transform"
          >
            <FiShield className="text-xl text-white" />
          </button>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-lg font-black tracking-tighter">
                Admin Portal
              </span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  active
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="admin-nav-active"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-orange rounded-full"
                  />
                )}
                <span
                  className={`text-xl transition-transform duration-500 ${active ? "text-brand-orange scale-110" : "group-hover:scale-110"}`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-bold"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <FiLogOut className="text-xl group-hover:rotate-12 transition-transform" />
            {!isCollapsed && (
              <span className="text-xs font-bold">Sign Out</span>
            )}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <FiMenu />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white truncate max-w-[150px]">
                {user?.name}
              </p>
              <p className="text-[10px] text-brand-orange uppercase">Admin</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center text-brand-orange text-lg font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative bg-[#050505]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-zinc-950 z-[60] p-6 md:hidden flex flex-col shadow-2xl shadow-black"
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg">
                    <FiShield className="text-xl text-white" />
                  </div>
                  <span className="text-lg font-bold">Admin Portal</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-zinc-500 hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`text-xl ${active ? "text-brand-orange" : ""}`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-xs font-bold">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-auto border border-red-500/10"
              >
                <FiLogOut className="text-lg" />
                <span className="text-xs font-bold">Sign Out</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
