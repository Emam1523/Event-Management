import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        showNotification('Successfully logged in!', 'success');
        
        // If there's a specific 'from' path to go back to, use it. 
        // Otherwise, redirect based on role.
        if (from !== '/dashboard') {
          navigate(from, { replace: true });
        } else {
          // Check role from session storage or we can slightly adjust login to return user
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData?.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Login failed. Please check your credentials.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <div className="min-h-screen flex bg-[#030303] overflow-hidden">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/brain/226d3ace-de25-4609-aa10-ea42c35fe210/auth_side_bg_1778872608061.png" 
            alt="Event Background" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-[3s]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#030303] via-[#030303]/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform">
                <span className="text-2xl font-black text-white">A</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">Aura <span className="text-primary">Pass</span></span>
            </Link>
          </motion.div>

          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-8"
            >
              EXPERIENCE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 italic">THE EXTRAORDINARY.</span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="space-y-6"
            >
              {[
                "Exclusive access to global events",
                "Seamless ticket management",
                "Vibrant community of enthusiasts"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-400 group/item">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                    <FiCheckCircle size={14} />
                  </div>
                  <span className="text-sm font-medium tracking-wide">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-slate-500 text-xs font-bold uppercase tracking-widest"
          >
            &copy; 2026 AURA PASS PLATFORM. ALL RIGHTS RESERVED.
          </motion.p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        {/* Mobile Background Pattern */}
        <div className="lg:hidden absolute inset-0 bg-aurora opacity-10 animate-aurora pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[460px] w-full relative z-10"
        >
          <div className="mb-12">
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4"
            >
              WELCOME <span className="text-primary">BACK.</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-slate-500 font-medium"
            >
              Login to access your exclusive event passes and dashboard.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identity</label>
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-primary/50 transition-all focus:bg-white/[0.08]"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Credentials</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-primary hover:text-orange-400 uppercase tracking-widest transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-primary/50 transition-all focus:bg-white/[0.08]"
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-orange-600 text-white py-5 rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    SECURE LOGIN <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
                <span className="bg-[#030303] px-4">Social Login</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
              {[FaGoogle, FaGithub, FaFacebook].map((Icon, i) => (
                <button key={i} type="button" className="flex items-center justify-center py-4 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border-glow">
                  <Icon size={20} />
                </button>
              ))}
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              New to Aura Pass?{' '}
              <Link to="/register" className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-4 transition-all">
                Create Account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

