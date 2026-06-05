import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiShield, FiArrowRight, FiLock, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Code & New Password
  const [isLoading, setIsLoading] = useState(false);
  
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.requestVerificationCode({ email, purpose: 'password-change' });
      showNotification('Verification code sent to your email.', 'success');
      setStep(2);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to send code.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.confirmPasswordChange({ email, code, newPassword: password });
      showNotification('Password updated successfully. You can now login.', 'success');
      navigate('/login');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Verification failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 shadow-2xl shadow-black/40"
      >
        <div className="flex items-center gap-3 mb-6 text-brand-orange">
          <FiShield className="text-2xl" />
          <span className="text-[10px] font-black uppercase tracking-[0.35em]">Security Protocol</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
          {step === 1 ? 'Find your account' : 'Reset your password'}
        </h1>
        <p className="text-zinc-500 font-medium mb-8">
          {step === 1 
            ? 'Enter your verified email address to receive a security code.' 
            : 'Enter the 6-digit code we sent you and choose a new masterpiece for your password.'}
        </p>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestCode}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Identity</label>
                <div className="relative">
                  <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-14 pr-4 text-white outline-none focus:border-brand-orange/50 transition-all font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Request Code'} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleResetPassword}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Verification Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-center text-2xl font-black tracking-[0.5em] text-white outline-none focus:border-brand-orange/50"
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-14 pr-4 text-white outline-none focus:border-brand-orange/50 transition-all font-bold"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Confirm Reset'} <FiCheck />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center">
          <Link to="/login" className="text-zinc-600 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;