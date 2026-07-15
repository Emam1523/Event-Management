import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { BsTicketPerforated } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LogoImg from "../assets/logosm.png";

const Navbar = ({ hideMenu = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/events" },
    { label: "About", to: "/about" },
  ];

  const userMenuItems = [
    {
      to: user?.role === "admin" ? "/admin/profile" : "/profile",
      label: "Identity Profile",
      icon: <FiUser />,
    },
    { to: "/my-tickets", label: "Pass Archive", icon: <BsTicketPerforated /> },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-100 transition-all duration-500 pointer-events-none"
      ref={mobileMenuRef}
    >
      <div
        className={`mx-auto max-w-360 transition-all duration-700 bg-black/60 backdrop-blur-3xl border border-white/5 shadow-2xl pointer-events-auto ${
          scrolled ? "translate-y-2.5 scale-98 rounded-2xl" : "rounded-b-2xl"
        }`}
      >
        <div className="flex justify-between items-center h-16 sm:h-20 px-4 sm:px-10">
          {/* Logo Section */}
          <Link
            to={
              isAuthenticated ? (user?.role === "admin" ? "/admin" : "/") : "/"
            }
            className="group flex items-center gap-4"
          >
            <div className="flex gap-2">
              <img
                src={LogoImg}
                alt="NextDHAKA LOGO"
                className="w-7 h-7 rounded-lg bg-brand-orange aspect-square shadow-2xl shadow-brand-orange group-hover:rotate-360 ease-out transition-all duration-700 delay-200"
                width={64}
                height={64}
              />

              <span className="text-sm md:text-lg xl:text-2xl font-black text-white tracking-widest">
                NEXT<span className="text-brand-orange font-mono">DHAKA</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Guest) */}
          {!isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 rounded-2xl ${
                    location.pathname === link.to
                      ? "text-brand-secondary"
                      : "text-zinc-300/60 hover:text-zinc-200 border-2 border-transparent hover:border-primary/20"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-brand-orange/10 border border-brand-primary/10 rounded-2xl shadow-inner"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Right Section: Cart + Auth Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/cart"
              className="relative p-2 text-zinc-500 hover:text-white transition-all transform hover:scale-110 active:scale-90 shrink-0"
              hidden={!isAuthenticated}
            >
              <FiShoppingCart className="text-xl sm:text-2xl" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-black">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <Link
                  to="/login"
                  className="btn-secondary text-brand-orange  hover:text-white hover:bg-brand-primary font-black text-[9px] sm:text-[10px] uppercase tracking-widest px-3 py-2.5 transition-all text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary hover:bg-white hover:text-black text-white text-[9px] sm:text-[10px] uppercase shadow-xl shadow-orange-800/50"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div
                className="relative flex items-center gap-3"
                ref={userMenuRef}
              >
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-2xl transition-all border border-transparent  group group-active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all text-xl">
                    <FiUser />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">
                      {user?.name?.split(" ")[0]}
                    </p>
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                      {user?.role === "admin" ? "Commander" : "NEXTDHAKA Elite"}
                    </p>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-64 bg-zinc-950 border border-white/10 rounded-4xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-6 z-50 backdrop-blur-3xl overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl opacity-50" />

                      <div className="relative space-y-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-4 px-4 py-4 text-[10px] font-black text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                          >
                            <span className="text-lg group-hover:text-brand-orange transition-colors">
                              {item.icon}
                            </span>
                            <span className="uppercase tracking-[0.2em]">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-4 px-4 py-4 text-[10px] font-black text-red-500/70 hover:text-red-50 hover:bg-red-500 rounded-2xl transition-all group"
                        >
                          <FiLogOut className="text-lg" />
                          <span className="uppercase tracking-[0.2em]">
                            Logout
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden shrink-0" hidden={hideMenu}>
              <button
                onClick={() => setMobileOpen((p) => !p)}
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
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="lg:hidden border-t border-white/5 overflow-hidden "
            >
              <div className="p-8 space-y-6">
                {/* Guest Links */}
                {!isAuthenticated ? (
                  <>
                    {navLinks.map((link) => (
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
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="btn-secondary text-brand-orange  hover:text-white hover:bg-brand-primary font-black text-[10px] uppercase tracking-widest border border-white/5 rounded-2xl"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="btn-primary hover:bg-white text-white hover:text-black text-center text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-brand-orange/20"
                      >
                        Register
                      </Link>
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
