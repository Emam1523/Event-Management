import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiShield, FiEdit3, FiSave,
  FiCheckCircle, FiPhone,
  FiCalendar, FiMapPin, FiArrowRight, FiEye, FiEyeOff,
  FiStar, FiZap, FiMessageSquare, FiAlertCircle, FiLogOut,
} from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { adminAPI, bookingsAPI, appReviewsAPI, API_ROOT } from '../../services/api';
import { format, isValid } from 'date-fns';

/* ── helpers ── */
const resolveImage = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${API_ROOT}${image}`;
};

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-2">
    {[1,2,3,4,5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)} className="cursor-pointer transition-transform hover:scale-125">
        <FiStar
          size={28}
          className={s <= value ? 'text-amber-400' : 'text-slate-700 hover:text-amber-400/50'}
          style={{ fill: s <= value ? 'currentColor' : 'none', transition: 'all 0.2s' }}
        />
      </button>
    ))}
  </div>
);

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

/* ═══════════════════════════════════════════════════════════════ */
const UserProfile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [awaitingPasswordCode, setAwaitingPasswordCode] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [stats, setStats] = useState({ total: 0, upcoming: 0, spent: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  /* Review state */
  const [myReview, setMyReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [savingReview, setSavingReview] = useState(false);
  const [reviewEditing, setReviewEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', confirmPassword: '', passwordVerificationCode: '',
  });

  /* ── Populate form ── */
  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((p) => ({ ...p, name: user.name || '', phone: user.phone || '', password: '', confirmPassword: '' }));
  }, [user]);

  /* ── Load stats + bookings + review ── */
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        if (user.role === 'admin') {
          const { data } = await adminAPI.getStats();
          setStats({ total: data.totalEvents || 0, upcoming: data.totalUsers || 0, spent: data.totalRevenue || 0 });
          setLoadingBookings(false);
          return;
        }
        const [bookingsRes, reviewRes] = await Promise.allSettled([
          bookingsAPI.getMyBookings(),
          appReviewsAPI.getMine(),
        ]);
        if (bookingsRes.status === 'fulfilled') {
          const data = bookingsRes.value.data || [];
          const now = new Date();
          const upcoming = data.filter((b) => new Date(b.event?.date) >= now);
          const spent = data.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
          setStats({ total: data.length, upcoming: upcoming.length, spent });
          setRecentBookings(data.slice(0, 3));
        }
        if (reviewRes.status === 'fulfilled' && reviewRes.value.data) {
          const rev = reviewRes.value.data;
          setMyReview(rev);
          setReviewForm({ rating: rev.rating, comment: rev.comment });
        }
      } catch { /* silent */ }
      finally { setLoadingBookings(false); }
    };
    load();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (passwordError) setPasswordError('');
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData((p) => ({
        ...p,
        name: user.name || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
      }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name: formData.name.trim(), phone: formData.phone.trim() };
    const result = await updateProfile(payload);
    if (result.success) {
      showNotification('Profile updated!', 'success');
      setIsEditing(false);
    } else {
      showNotification(result.message || 'Failed to update profile.', 'error');
    }
    setSaving(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      showNotification('Passwords do not match.', 'error'); return;
    }
    setSaving(true);
    const payload = {
      name: user?.name,
      phone: user?.phone || '',
      password: formData.password,
      ...(formData.passwordVerificationCode ? { passwordVerificationCode: formData.passwordVerificationCode } : {}),
    };
    const result = await updateProfile(payload);
    if (result.requiresVerification) {
      setAwaitingPasswordCode(true);
      showNotification(result.message || 'Verification code sent.', 'success');
      setSaving(false); return;
    }
    if (result.success) {
      showNotification('Password changed!', 'success');
      setAwaitingPasswordCode(false);
      setFormData((p) => ({ ...p, password: '', confirmPassword: '', passwordVerificationCode: '' }));
    } else {
      setPasswordError(result.message || 'Verification failed.');
      showNotification(result.message || 'Failed.', 'error');
    }
    setSaving(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) { showNotification('Please select a star rating.', 'error'); return; }
    if (reviewForm.comment.trim().length < 5) { showNotification('Comment must be at least 5 characters.', 'error'); return; }
    setSavingReview(true);
    try {
      const res = await appReviewsAPI.submit(reviewForm);
      setMyReview(res.data);
      setReviewEditing(false);
      showNotification(myReview ? 'Review updated!' : 'Review submitted! Thank you ✨', 'success');
    } catch {
      showNotification('Failed to submit review.', 'error');
    }
    setSavingReview(false);
  };

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || 'U';
  const isAdmin = user?.role === 'admin';

  const statCards = !isAdmin ? [
    { label: 'Total Passes', value: stats.total, icon: <BsTicketPerforated />, color: 'from-brand-orange to-rose-500' },
    { label: 'Upcoming', value: stats.upcoming, icon: <FiCalendar />, color: 'from-violet-500 to-purple-600' },
  ] : [];
  const tabs = [
    { id: 'profile',  label: 'Profile',  icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    ...(isAdmin ? [] : [
      { id: 'activity', label: 'Activity', icon: <FiZap /> },
      { id: 'review',   label: 'Review App', icon: <FiMessageSquare /> },
    ]),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-slate-200 pt-28 pb-24 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-orange/8 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Hero Banner ── */}
        <motion.div {...fadeUp} className="relative rounded-[2.5rem] overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-r from-[#1a0a00] via-[#1a0020] to-[#00101a] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 via-violet-500/20 to-cyan-500/20" />
            {[...Array(6)].map((_, i) => (
              <motion.div key={i}
                animate={{ y: [0, -12, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
                className="absolute w-1 h-1 rounded-full bg-white/60"
                style={{ left: `${15 + i * 14}%`, top: `${30 + (i % 3) * 20}%` }}
              />
            ))}
          </div>
          <div className="bg-zinc-950/95 backdrop-blur-2xl border border-white/8 px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-14 relative">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-orange via-rose-500 to-violet-600 p-[3px] shadow-2xl shadow-brand-orange/30">
                  <div className="w-full h-full rounded-[22px] bg-zinc-950 flex items-center justify-center">
                    <span className="text-4xl font-black text-white">{avatarLetter}</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-zinc-950" />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user?.name}</h1>
                      {isAdmin && <span className="px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[9px] font-black uppercase tracking-widest">Admin</span>}
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{user?.email}</p>
                    {user?.phone && <p className="text-slate-600 text-xs mt-1">{user.phone}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg shadow-brand-orange/25 cursor-pointer">
                        <FiEdit3 /> Edit Profile
                      </button>
                  )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {statCards.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                  className="relative rounded-2xl bg-white/[0.03] border border-white/8 p-4 overflow-hidden group hover:border-white/15 transition-all">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-sm mb-3`}>{s.icon}</div>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.aside {...fadeUp} transition={{ delay: 0.15, duration: 0.5 }} className="lg:col-span-3 space-y-4">
            
            {/* Tab Navigation */}
            <div className="rounded-[2rem] bg-zinc-950/90 border border-white/8 p-3 space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600 px-3 pb-2">Navigation</p>
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}>
                  <span className="text-base">{t.icon}</span>
                  {t.label}
                  {activeTab === t.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />}
                </button>
              ))}

              {!isAdmin && (
                <div className="pt-2 mt-2 border-t border-white/5">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer text-red-500 hover:text-white hover:bg-red-500/20 border border-transparent">
                    <span className="text-base"><FiLogOut /></span>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Account badge */}
            <div className="rounded-[2rem] bg-gradient-to-br from-brand-orange/10 to-violet-600/10 border border-brand-orange/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                  <FiStar className="text-brand-orange text-sm" />
                </div>
                <p className="text-xs font-black text-white">{isAdmin ? 'Administrator' : 'Aura Member'}</p>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                {isAdmin ? 'You have full platform access and management privileges.' : 'Enjoy exclusive access to premium events across Bangladesh.'}
              </p>
            </div>
          </motion.aside>

          {/* ── Main Content ── */}
          <motion.section {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} className="lg:col-span-9">
            <AnimatePresence mode="wait">

              {/* ── Profile Tab ── */}
              {activeTab === 'profile' && (
                <motion.form key="profile" onSubmit={handleProfileSubmit}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="rounded-[2.5rem] bg-zinc-950/90 border border-white/8 p-8 md:p-10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                    <div className="w-11 h-11 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                      <FiUser className="text-lg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Personal Information</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Update your name and phone number</p>
                    </div>
                    {isEditing && <span className="ml-auto px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[9px] font-black uppercase tracking-widest animate-pulse">Editing</span>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                      <div className={`flex items-center rounded-2xl border bg-white/[0.03] px-4 py-1 transition-all ${isEditing ? 'border-white/15 focus-within:border-brand-orange/50 focus-within:ring-2 focus-within:ring-brand-orange/10' : 'border-white/5'}`}>
                        <FiUser className={`shrink-0 ${isEditing ? 'text-brand-orange' : 'text-slate-600'}`} />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} required
                          className="w-full bg-transparent border-none outline-none py-3 px-3 text-white disabled:text-slate-500 font-semibold text-sm" />
                      </div>
                    </div>

                    {/* Email — READ ONLY */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Email Address <span className="text-slate-700 normal-case font-normal">(cannot be changed)</span>
                      </label>
                      <div className="flex items-center rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-1 opacity-60 cursor-not-allowed">
                        <FiMail className="shrink-0 text-slate-600" />
                        <input type="email" value={user?.email || ''} readOnly
                          className="w-full bg-transparent border-none outline-none py-3 px-3 text-slate-500 font-semibold text-sm cursor-not-allowed" />
                        <FiLock size={12} className="text-slate-700 shrink-0" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Phone Number <span className="text-slate-700">(optional)</span></label>
                      <div className={`flex items-center rounded-2xl border bg-white/[0.03] px-4 py-1 transition-all ${isEditing ? 'border-white/15 focus-within:border-brand-orange/50 focus-within:ring-2 focus-within:ring-brand-orange/10' : 'border-white/5'}`}>
                        <FiPhone className={`shrink-0 ${isEditing ? 'text-brand-orange' : 'text-slate-600'}`} />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing}
                          placeholder={isEditing ? '+880 1XXXXXXXXX' : '—'}
                          className="w-full bg-transparent border-none outline-none py-3 px-3 text-white disabled:text-slate-500 placeholder:text-slate-700 font-semibold text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Account status */}
                  <div className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400"><FiCheckCircle /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Account Status</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {user?.emailVerified ? '✅ Email Verified' : '⚠️ Email Not Verified'}
                        <span className="text-slate-500 font-medium text-xs ml-3">· {isAdmin ? 'Administrator' : 'Standard Member'}</span>
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isEditing && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                        className="flex gap-4 justify-end mt-8 pt-6 border-t border-white/5">
                        <button type="button" onClick={handleCancelEdit}
                          className="px-8 py-3.5 rounded-2xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all cursor-pointer">
                          Cancel
                        </button>
                        <button type="submit" disabled={saving}
                          className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-brand-orange text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all shadow-lg shadow-brand-orange/25 disabled:opacity-50 cursor-pointer">
                          {saving ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</> : <><FiSave /> Save Changes</>}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}

              {/* ── Security Tab ── */}
              {activeTab === 'security' && (
                <motion.form key="security" onSubmit={handlePasswordSubmit}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="rounded-[2.5rem] bg-zinc-950/90 border border-white/8 p-8 md:p-10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                    <div className="w-11 h-11 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <FiShield className="text-lg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Security Settings</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Change your password — must be strong</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] ml-1 text-slate-500">New Password</label>
                      <div className="relative group">
                        <FiLock
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-400 transition-colors"
                          size={18}
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                      disabled={!isEditing}
                          placeholder="••••••••"
                      className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50 transition-all focus:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                      disabled={!isEditing}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setShowPassword(p => !p)}
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] ml-1 text-slate-500">Confirm New Password</label>
                      <div className="relative group">
                        <FiCheckCircle
                          className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'text-emerald-400' : 'text-slate-600 group-focus-within:text-violet-400'}`}
                          size={18}
                        />
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                      disabled={!isEditing}
                          placeholder="••••••••"
                      className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50 transition-all focus:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                      disabled={!isEditing}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setShowConfirm(p => !p)}
                        >
                          {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-400 font-medium pl-2">Passwords do not match</p>
                      )}
                    </div>

                    {/* Verification code */}
                    <AnimatePresence>
                      {awaitingPasswordCode && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Email Verification Code</label>
                          <div className="flex items-center rounded-2xl border border-brand-orange/40 bg-brand-orange/5 px-4 py-1">
                            <FiShield className="shrink-0 text-brand-orange" />
                        <input type="text" name="passwordVerificationCode" value={formData.passwordVerificationCode} onChange={handleChange} disabled={!isEditing}
                              placeholder="6-digit code from your email"
                          className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder:text-slate-600 font-semibold text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed" />
                          </div>
                          <p className="text-[10px] text-slate-500 pl-2">Sent to <span className="text-brand-orange">{user?.email}</span></p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                {/* Error Alert */}
                <AnimatePresence mode="wait">
                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="overflow-hidden mt-6"
                    >
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-start gap-3 text-left">
                        <FiAlertCircle className="text-red-400 text-xl shrink-0" />
                        <p className="text-[11px] font-bold text-red-300 tracking-wider uppercase">{passwordError}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                      className="flex gap-4 justify-end mt-8 pt-6 border-t border-white/5">
                      {awaitingPasswordCode && (
                        <button
                          type="button"
                          onClick={() => {
                            setAwaitingPasswordCode(false);
                            setPasswordError('');
                            setFormData(p => ({ ...p, passwordVerificationCode: '' }));
                          }}
                          className="px-8 py-3.5 rounded-2xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button type="submit" disabled={saving || !formData.password}
                        className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-violet-600 text-[11px] font-black uppercase tracking-widest text-white hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/25 disabled:opacity-40 cursor-pointer">
                        {saving ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing...</> : <><FiShield /> {awaitingPasswordCode ? 'Verify & Update' : 'Change Password'}</>}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                </motion.form>
              )}

              {/* ── Activity Tab ── */}
              {activeTab === 'activity' && !isAdmin && (
                <motion.div key="activity"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6">
                  <div className="rounded-[2.5rem] bg-zinc-950/90 border border-white/8 p-8 md:p-10 shadow-2xl">
                    <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><FiZap className="text-lg" /></div>
                        <div>
                          <h2 className="text-xl font-black text-white">Recent Activity</h2>
                          <p className="text-xs text-slate-500 mt-0.5">Your latest ticket purchases</p>
                        </div>
                      </div>
                      <Link to="/my-tickets" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-orange hover:text-white transition-colors">
                        View All <FiArrowRight />
                      </Link>
                    </div>

                    {loadingBookings ? (
                      <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}</div>
                    ) : recentBookings.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-5"><BsTicketPerforated className="text-4xl text-slate-600" /></div>
                        <h3 className="text-lg font-black text-white mb-2">No tickets yet</h3>
                        <p className="text-slate-500 text-sm mb-6">You haven't purchased any event tickets yet.</p>
                        <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                          Browse Events <FiArrowRight />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentBookings.map((booking, i) => {
                          const eventDate = booking.event?.date ? new Date(booking.event.date) : null;
                          const isUpcoming = eventDate && eventDate >= new Date();
                          const imgSrc = resolveImage(booking.event?.image);
                          return (
                            <motion.div key={booking.id}
                              onClick={() => navigate(`/my-tickets/${booking.id}`)}
                              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/12 hover:bg-white/[0.05] transition-all group cursor-pointer">
                              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white/5">
                                {imgSrc ? <img src={imgSrc} alt={booking.event?.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                                  : <div className="w-full h-full flex items-center justify-center text-2xl">🎫</div>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-white text-sm truncate group-hover:text-brand-orange transition-colors">{booking.event?.title || 'Event'}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                  {eventDate && isValid(eventDate) && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold"><FiCalendar className="text-slate-600" />{format(eventDate, 'MMM d, yyyy')}</span>
                                  )}
                                  {booking.event?.location && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold"><FiMapPin className="text-slate-600" />{booking.event.location}</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-black text-white text-sm">৳{Number(booking.totalPrice||0).toLocaleString()}</p>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mt-1.5 inline-block ${isUpcoming ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                                  {isUpcoming ? 'Upcoming' : 'Past'}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="rounded-[2.5rem] bg-gradient-to-br from-brand-orange/10 via-rose-500/5 to-violet-600/10 border border-brand-orange/15 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-black text-white">Ready for the next experience?</h3>
                      <p className="text-slate-400 text-sm mt-1">Discover premium events happening across Bangladesh.</p>
                    </div>
                    <Link to="/events" className="shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-orange text-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg shadow-brand-orange/25">
                      Explore Events <FiArrowRight />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ── Review App Tab ── */}
              {activeTab === 'review' && !isAdmin && (
                <motion.div key="review"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="rounded-[2.5rem] bg-zinc-950/90 border border-white/8 p-8 md:p-10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <FiMessageSquare className="text-lg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Rate AuraPass</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Share your experience with the platform — shown on the home page</p>
                    </div>
                  </div>

                  {myReview && !reviewEditing ? (
                    /* Existing review display */
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-white/[0.03] border border-amber-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Your Review</p>
                          <button onClick={() => setReviewEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer">
                            <FiEdit3 size={12} /> Edit
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          {[1,2,3,4,5].map((s) => (
                            <FiStar key={s} size={22}
                              className={s <= myReview.rating ? 'text-amber-400' : 'text-slate-700'}
                              style={{ fill: s <= myReview.rating ? 'currentColor' : 'none' }} />
                          ))}
                          <span className="text-amber-400 font-black text-lg ml-1">{myReview.rating}/5</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{myReview.comment}</p>
                        <p className="text-slate-600 text-[10px] font-medium mt-4">
                          Submitted {isValid(new Date(myReview.createdAt)) ? format(new Date(myReview.createdAt), 'MMM d, yyyy') : ''}
                        </p>
                      </div>
                      <p className="text-slate-500 text-sm text-center">Thank you for sharing your feedback! ✨ It's displayed on the home page.</p>
                    </div>
                  ) : (
                    /* Review form */
                    <form onSubmit={handleReviewSubmit} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Rating</label>
                        <StarRating value={reviewForm.rating} onChange={(v) => setReviewForm(p => ({ ...p, rating: v }))} />
                        {reviewForm.rating > 0 && (
                          <p className="text-sm font-bold text-amber-400">
                            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent! 🎉'][reviewForm.rating]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Review</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                          rows={5}
                          placeholder="Share your experience with AuraPass — what did you love? What could be better?"
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-slate-700 font-semibold text-sm focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 resize-none transition-all"
                        />
                        <p className="text-[10px] text-slate-600 text-right">{reviewForm.comment.length} chars</p>
                      </div>

                      <div className="flex gap-4 justify-end pt-4 border-t border-white/5">
                        {myReview && reviewEditing && (
                          <button type="button" onClick={() => setReviewEditing(false)}
                            className="px-8 py-3.5 rounded-2xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all cursor-pointer">
                            Cancel
                          </button>
                        )}
                        <button type="submit" disabled={savingReview}
                          className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-amber-500 text-[11px] font-black uppercase tracking-widest text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 cursor-pointer">
                          {savingReview ? <><span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" /> Submitting...</> : <><FiStar /> {myReview ? 'Update Review' : 'Submit Review'}</>}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
