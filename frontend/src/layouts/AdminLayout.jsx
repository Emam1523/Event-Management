import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiCalendar, FiPlus, FiTrendingUp, FiUsers, FiUser,
  FiLogOut, FiMenu, FiX, FiShield, FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin',                icon: <FiGrid />,        label: 'COMMAND CENTER',      exact: true },
  { to: '/admin/profile',        icon: <FiUser />,        label: 'ADMIN IDENTITY' },
  { to: '/admin/create-event',   icon: <FiPlus />,        label: 'CREATE MASTERPIECE' },
  { to: '/admin/manage-events',  icon: <FiCalendar />,    label: 'CURATE EVENTS' },
  { to: '/admin/manage-users',   icon: <FiUsers />,       label: 'ELITE MEMBERS' },
  { to: '/admin/analytics',      icon: <FiTrendingUp />,  label: 'INSIGHT ARCHIVE' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 120 : 320 }}
        className="hidden md:flex flex-col bg-zinc-950 border-r border-white/5 relative z-40"
      >
        <div className="p-10 flex items-center gap-4">
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-orange/20 hover:scale-105 active:scale-95 transition-transform"
           >
              <FiShield className="text-2xl text-white" />
           </button>
           {!isCollapsed && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <span className="text-xl font-black tracking-tighter">AURA<span className="text-brand-orange">PASS</span></span>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">ADMIN PORTAL</span>
             </motion.div>
           )}
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-10">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all duration-300 group relative overflow-hidden ${
                  active 
                    ? 'bg-white/5 text-white shadow-inner' 
                    : 'text-zinc-600 hover:text-white hover:bg-white/5'
                }`}
              >
                {active && (
                  <motion.div 
                    layoutId="admin-nav-active"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-orange rounded-full"
                  />
                )}
                <span className={`text-xl transition-transform duration-500 ${active ? 'text-brand-orange scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    {item.label}
                  </motion.span>
                )}
                {active && !isCollapsed && (
                   <FiChevronRight className="ml-auto text-brand-orange" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <FiLogOut className="text-xl group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-28 border-b border-white/5 flex items-center justify-between px-10 bg-black/50 backdrop-blur-xl z-30">
          <div className="flex items-center gap-6">
             <button 
               onClick={() => setMobileOpen(true)}
               className="md:hidden w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
             >
                <FiMenu />
             </button>
             <div className="hidden md:block">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">System Status</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs font-bold text-white uppercase tracking-wider">Cloud Engine Operational</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white truncate max-w-[150px]">{user?.name}</p>
                <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Administrator</p>
             </div>
             <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 p-1">
                <div className="w-full h-full rounded-xl bg-brand-orange/20 flex items-center justify-center text-brand-orange text-xl font-black">
                   {user?.name?.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
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

      {/* Mobile Sidebar Overlay */}
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
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-zinc-950 z-[60] p-10 md:hidden flex flex-col shadow-2xl shadow-black"
            >
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
                        <FiShield className="text-xl text-white" />
                     </div>
                     <span className="text-lg font-black tracking-tighter uppercase">Admin</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-zinc-500 hover:text-white">
                     <FiX size={24} />
                  </button>
               </div>

               <nav className="flex-1 space-y-4">
                 {navItems.map((item) => {
                   const active = isActive(item.to);
                   return (
                     <Link
                       key={item.to}
                       to={item.to}
                       onClick={() => setMobileOpen(false)}
                       className={`flex items-center gap-4 px-6 py-5 rounded-2xl transition-all ${
                         active ? 'bg-brand-orange text-white' : 'text-zinc-600 hover:bg-white/5'
                       }`}
                     >
                       <span className="text-xl">{item.icon}</span>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                     </Link>
                   );
                 })}
               </nav>

               <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-6 py-5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all mt-auto"
               >
                  <FiLogOut className="text-xl" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Termination Signal</span>
               </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;