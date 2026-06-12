import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCompass, FiUser, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const FloatingDock = () => {
  const { logout } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', to: '/', icon: <FiHome size={20} /> },
    { label: 'Explore', to: '/events', icon: <FiCompass size={20} /> },
    { label: 'Tickets', to: '/my-tickets', icon: <BsTicketPerforated size={20} /> },
    { label: 'Profile', to: '/profile', icon: <FiUser size={20} /> },
    { label: 'Cart', to: '/cart', icon: <FiShoppingCart size={20} />, badge: getCartCount() },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <motion.div 
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 120 }}
        className="bg-black/75 backdrop-blur-2xl border border-white/10 rounded-full py-3 px-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex items-center gap-5 sm:gap-7 pointer-events-auto"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to === '/events' && location.pathname.startsWith('/events/'));
          
          return (
            <Link
              key={item.label}
              to={item.to}
              className="relative p-2.5 text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-95 group flex flex-col items-center"
            >
              {isActive && (
                <motion.div
                  layoutId="dock-active"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-full"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? 'text-brand-orange' : ''}`}>
                {item.icon}
              </span>
              
              
              {item.badge > 0 && (
                <span className="absolute top-1 right-1 bg-brand-orange text-white text-[8px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 border-black">
                  {item.badge}
                </span>
              )}

             
              <span className="absolute bottom-14 bg-zinc-950 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300 px-3 py-1.5 rounded-xl opacity-0 scale-90 pointer-events-none transition-all group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap shadow-xl">
                {item.label}
              </span>
            </Link>
          );
        })}

        
        <div className="h-6 w-px bg-white/10 mx-1" />

      
        <button
          onClick={handleLogout}
          className="relative p-2.5 text-zinc-500 hover:text-red-400 transition-all hover:scale-110 active:scale-95 group flex flex-col items-center cursor-pointer"
        >
          <FiLogOut size={20} />
          
         
          <span className="absolute bottom-14 bg-zinc-950 border border-white/10 text-[9px] font-black uppercase tracking-widest text-red-400 px-3 py-1.5 rounded-xl opacity-0 scale-90 pointer-events-none transition-all group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap shadow-xl">
            Logout
          </span>
        </button>
      </motion.div>
    </div>
  );
};

export default FloatingDock;
