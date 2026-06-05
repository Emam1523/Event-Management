import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiShield, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { authAPI } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const { setUser } = useAuth();

  const email = searchParams.get('email') || '';
  const purpose = searchParams.get('purpose') || 'registration';
  const next = searchParams.get('next') || '/dashboard';

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const title = useMemo(() => {
    if (purpose === 'checkout') return 'Verify your email to continue checkout';
    if (purpose === 'password-change') return 'Verify the code to confirm your password change';
    return 'Verify your email address';
  }, [purpose]);

  const description = useMemo(() => {
    if (purpose === 'checkout') return 'We sent a code to your email before ticket purchase.';
    if (purpose === 'password-change') return 'Enter the code before updating your password.';
    return 'Enter the verification code sent to your inbox to activate your account.';
  }, [purpose]);

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      await authAPI.requestVerificationCode({ email, purpose });
      showNotification('A new verification code has been sent.', 'success');
    } catch {
      showNotification('Unable to resend the verification code.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !code) return;

    setIsSubmitting(true);
    try {
      const response = await authAPI.verifyCode({ email, purpose, code });

      if (purpose === 'registration' && response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      showNotification('Verification completed successfully.', 'success');
      navigate(next, { replace: true });
    } catch (error) {
      showNotification(error.response?.data?.message || 'Verification failed.', 'error');
    } finally {
      setIsSubmitting(false);
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
          <span className="text-[10px] font-black uppercase tracking-[0.35em]">Secure Verification</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">{title}</h1>
        <p className="text-zinc-400 mb-8">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-12 pr-4 text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-center text-2xl font-black tracking-[0.4em] text-white outline-none focus:border-brand-orange/50"
              maxLength={6}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:scale-[1.01] disabled:opacity-60"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Code'} <FiArrowRight />
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-zinc-300 transition hover:text-white disabled:opacity-60"
            >
              <FiRefreshCw className={isResending ? 'animate-spin' : ''} />
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;