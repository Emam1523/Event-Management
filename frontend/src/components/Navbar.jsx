import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LogoImg from '/favicon.ico'; 

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  
  const { user, isAuthenticated, logout } = useAuth(); 
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Explore', to: '/events' },
  ];

  const userMenuItems = [
    { to: user?.role === 'admin' ? '/admin' : '/dashboard', label: 'Dashboard Hub', icon: <FiUser /> },
    { to: user?.role === 'admin' ? '/admin/profile' : '/profile', label: 'Identity Profile', icon: <FiUser /> },
    { to: '/my-tickets', label: 'Pass Archive', icon: <BsTicketPerforated /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 pt-6 md:px-12 md:pt-10 pointer-events-none">
      <div
        className={`max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-700 bg-black/60 backdrop-blur-3xl border border-white/5 shadow-2xl pointer-events-auto ${
          scrolled ? 'translate-y-[-10px] scale-[0.98] opacity-100' : ''
        }`}
      >
        <div className="flex justify-between items-center h-16 sm:h-20 px-4 sm:px-10">
          {/* Logo Section */}
          <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : "/"} className="group flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-orange rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl shadow-brand-orange/40 group-hover:rotate-[15deg] transition-all duration-500">
              <img src={LogoImg} alt="NextDHAKA LOGO" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-2xl font-black text-white tracking-widest uppercase hidden lg:block">
              NEXT<span className="text-brand-orange font-mono">DHAKA</span>
            </span>
          </Link>

          {/* Desktop Nav Links (Guest) */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2">
              {[ { label: 'Home', to: '/' }, ...navLinks ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-2xl ${
                    location.pathname === link.to ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl shadow-inner"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Right Section: Cart + Auth Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/cart" className="relative p-2 text-zinc-500 hover:text-white transition-all transform hover:scale-110 active:scale-90 flex-shrink-0">
              <FiShoppingCart className="text-xl sm:text-2xl" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-black">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <Link to="/login" className="text-zinc-500 hover:text-brand-orange font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] px-3 py-2.5 transition-all text-center">
                  Sign In
                </Link>
                <Link to="/register" className="bg-brand-orange hover:bg-white hover:text-black text-white font-black py-3 sm:py-4 px-5 sm:px-8 rounded-2xl text-[9px] sm:text-[10px] uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(255,90,53,0.3)] transition-all hover:scale-105 active:scale-95 text-center">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative flex items-center gap-3" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group group-active:scale-95"
                >
                   <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all text-xl">
                      <FiUser />
                   </div>
                   <div className="hidden lg:block text-left">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">
                        {user?.name?.split(' ')[0]}
                      </p>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                        {user?.role === 'admin' ? 'Commander' : 'NEXTDHAKA Elite'}
                      </p>
                   </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-64 bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-6 z-50 backdrop-blur-3xl overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl opacity-50" />
                      
                      <div className="relative space-y-1">
                        {userMenuItems.map((item) => (
                           <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 text-[10px] font-black text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                              <span className="text-lg group-hover:text-brand-orange transition-colors">{item.icon}</span>
                              <span className="uppercase tracking-[0.2em]">{item.label}</span>
                           </Link>
                        ))}
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-4 px-4 py-4 text-[10px] font-black text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all group"
                        >
                          <FiLogOut className="text-lg" />
                          <span className="uppercase tracking-[0.2em]">Terminate Session</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex-shrink-0">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-zinc-950 border border-white/5 rounded-2xl text-white shadow-inner active:scale-90 transition-all"
              >
                {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 overflow-hidden bg-black/40"
            >
              <div className="p-8 space-y-6">
                {/* Guest Links */}
                {!isAuthenticated ? (
                  <>
                    {[ { label: 'Home', to: '/' }, ...navLinks ].map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className="block text-2xl font-black text-white hover:text-brand-orange transition-colors tracking-tighter"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-6 grid gap-4">
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-white/5 rounded-2xl">Sign In</Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)} className="bg-brand-orange text-white py-5 text-center text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-brand-orange/20">Sign Up</Link>
                    </div>
                  </>
                ) : (
                  /* Auth Links */
                  <div className="space-y-4">
                     {userMenuItems.map((item) => (
                        <Link 
                          key={item.to} 
                          to={item.to} 
                          onClick={() => setMobileOpen(false)} 
                          className="flex items-center gap-4 text-xl font-black text-zinc-400"
                        >
                          {item.label}
                        </Link>
                     ))}
                     <button 
                       onClick={handleLogout}
                       className="w-full mt-6 bg-red-500/10 text-red-500 py-5 text-center text-[10px] font-black uppercase tracking-widest rounded-2xl"
                     >
                       Sign Out
                     </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;