import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      showNotification(
        'Password must be at least 6 characters long',
        'error'
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      if (result.verificationRequired) {
        showNotification('Verification code sent to your email.', 'success');
        navigate(
          `/verify-email?email=${encodeURIComponent(
            result.email
          )}&purpose=registration&next=/dashboard`,
          { replace: true }
        );
      } else if (result.success) {
        showNotification('Account created successfully!', 'success');
        navigate('/dashboard');
      } else {
          setErrorMsg(result.message);
        showNotification(result.message, 'error');
      }
    } catch (error) {
        const msg = error.response?.data?.message || 'Registration failed. Please try again.';
        setErrorMsg(msg);
      showNotification(
          msg,
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
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <div className="min-h-screen flex bg-[#030303] overflow-hidden relative">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group border-r border-white/5">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/auth_background.png"
            alt="Event Background"
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-[3s]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#030303] via-[#030303]/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16 pt-28 sm:pt-32 lg:pt-36">
          <div className="max-w-md my-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-8"
            >
              START YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 italic">
                JOURNEY TODAY.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="space-y-6"
            >
              {[
                'Personalized event recommendations',
                'Instant ticket delivery and QR access',
                'Priority booking for premium events',
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-slate-400 group/item"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                    <FiCheckCircle size={14} />
                  </div>
                  <span className="text-sm font-medium tracking-wide">
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-auto"
          >
            &copy; {new Date().getFullYear()} AURA PASS PLATFORM. ALL RIGHTS RESERVED.
          </motion.p>
        </div>
      </div>

      {/* Right Side: Register Form inside Glass Card container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 pt-28 sm:pt-32 lg:pt-36 relative z-10">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-10 w-[380px] h-[380px] bg-[#ff2d55]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[540px] w-full min-h-[520px] flex flex-col justify-center relative z-10 bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 sm:pt-12 sm:pb-8 sm:px-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border-t-white/10"
        >
          <div className="mb-6">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4"
            >
              JOIN <span className="text-primary">US.</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-slate-500 font-medium"
            >
              Create account to start exploring and booking events.
            </motion.p>
          </div>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-start gap-3 text-left">
                <FiAlertCircle className="text-red-400 text-xl shrink-0" />
                <p className="text-[11px] font-bold text-red-300 tracking-wider uppercase">{errorMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-5 relative z-10"
          animate={errorMsg ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
            {/* Full Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <FiUser
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-primary/50 transition-all focus:bg-white/[0.08]"
                />
              </div>
            </motion.div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                  Email
                </label>
                <div className="relative group">
                  <FiMail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
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
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                  Phone
                </label>
                <div className="relative group">
                  <FiPhone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXX"
                    className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-primary/50 transition-all focus:bg-white/[0.08]"
                  />
                </div>
              </motion.div>
            </div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                  Password
                </label>
                <div className="relative group">
                  <FiLock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-primary/50 transition-all focus:bg-white/[0.08]"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                  Confirm
                </label>
                <div className="relative group">
                  <FiLock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-primary/50 transition-all focus:bg-white/[0.08]"
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Terms checkbox */}
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-3 px-1 pt-2"
            >
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 bg-white/5 border-white/10 rounded accent-primary text-white cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed cursor-pointer"
              >
                I agree to the{' '}
                <span className="text-primary hover:underline"><Link to="/terms">Terms</Link></span> and{' '}
                <span className="text-primary hover:underline"><Link to="/privacy">Privacy Policy.</Link></span>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-orange-600 text-white py-5 rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    CREATE ACCOUNT{' '}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Sign In
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
