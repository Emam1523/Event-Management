import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiEdit3,
  FiSave,
  FiX,
  FiChevronRight,
  FiLogOut,
  FiCheckCircle,
  FiActivity
} from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { adminAPI, bookingsAPI } from '../../services/api';

const UserProfile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    roleLabel: 'Aura Member',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordVerificationCode: '',
  });
  const [awaitingPasswordCode, setAwaitingPasswordCode] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      password: '',
      confirmPassword: '',
    }));
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (user?.role === 'admin') {
          const { data } = await adminAPI.getStats();
          setStats({
            total: data.totalEvents || 0,
            upcoming: data.totalUsers || 0,
            roleLabel: 'Administrator',
          });
          return;
        }

        const { data } = await bookingsAPI.getMyBookings();
        const now = new Date();
        const upcoming = data.filter((booking) => new Date(booking.event?.date) >= now).length;

        setStats({
          total: data.length,
          upcoming,
          roleLabel: 'Aura Member',
        });
      } catch {
        setStats((prev) => ({ ...prev, roleLabel: user?.role === 'admin' ? 'Administrator' : 'Aura Member' }));
      }
    };

    if (user) loadStats();
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      passwordVerificationCode: '',
    }));
    setAwaitingPasswordCode(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password && formData.password.length < 6) {
      showNotification('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('New password and confirmation do not match.', 'error');
      return;
    }

    setSaving(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: user?.phone || '',
      ...(formData.password ? { password: formData.password } : {}),
      ...(formData.passwordVerificationCode ? { passwordVerificationCode: formData.passwordVerificationCode } : {}),
    };

    const result = await updateProfile(payload);

    if (result.requiresVerification) {
      setAwaitingPasswordCode(true);
      showNotification(result.message || 'Verification code sent to your email.', 'success');
      setSaving(false);
      return;
    }

    if (result.success) {
      showNotification('Profile updated successfully.', 'success');
      setIsEditing(false);
      setAwaitingPasswordCode(false);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '', passwordVerificationCode: '' }));
    } else {
      showNotification(result.message || 'Failed to update profile.', 'error');
    }

    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 pt-32 pb-20 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-mesh opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-rose-500 to-indigo-500" />
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                <FiActivity className="text-brand-orange" /> Identity Center
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">
                {user?.role === 'admin' ? 'Admin Interface' : 'Personal Hub'}
              </h1>
              <p className="mt-3 text-sm font-medium text-slate-400 max-w-md">
                Manage your credentials, view activity stats, and configure your AuraPass identity.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                  <FiX className="text-lg" /> Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all shadow-lg shadow-brand-orange/20"
                >
                  <FiEdit3 className="text-lg" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2.5rem] bg-zinc-950/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-brand-orange to-rose-500 p-[2px]">
                   <div className="w-full h-full rounded-[22px] bg-zinc-950 flex items-center justify-center text-3xl font-black text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                   </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange mb-1">Active User</p>
                  <p className="text-2xl font-black text-white leading-none tracking-tight">{user?.name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-2 truncate max-w-[150px]">{user?.email}</p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    {user?.role === 'admin' ? 'Events' : 'Passes'}
                  </p>
                  <p className="text-3xl font-black text-white">{stats.total}</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    {user?.role === 'admin' ? 'Users' : 'Active'}
                  </p>
                  <p className="text-3xl font-black text-brand-orange">{stats.upcoming}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[2.5rem] bg-zinc-950/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl space-y-4"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 px-2">Navigation</p>

              {user?.role === 'admin' ? (
                <>
                  <Link to="/admin/manage-events" className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all group">
                    <span className="flex items-center gap-3"><FiActivity className="text-brand-orange group-hover:scale-110 transition-transform" /> Manage Events</span>
                    <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/admin/analytics" className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all group">
                    <span className="flex items-center gap-3"><FiActivity className="text-brand-orange group-hover:scale-110 transition-transform" /> View Analytics</span>
                    <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              ) : (
                <Link to="/my-tickets" className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all group">
                  <span className="flex items-center gap-3"><BsTicketPerforated className="text-brand-orange group-hover:scale-110 transition-transform" /> My Tickets</span>
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <button onClick={handleLogout} className="w-full flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all group mt-8">
                <span className="flex items-center gap-3"><FiLogOut className="group-hover:scale-110 transition-transform" /> Terminate Session</span>
                <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </aside>

          {/* Main Form Content */}
          <section className="lg:col-span-8">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-[2.5rem] bg-zinc-950/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-2xl h-full"
            >
              <div className="flex items-center gap-4 text-white mb-10 border-b border-white/5 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-orange">
                  {user?.role === 'admin' ? <FiShield className="text-xl" /> : <FiUser className="text-xl" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Identity Details</h2>
                  <p className="text-xs font-medium text-slate-500 mt-1">Update your personal information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-brand-orange/50 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
                    <div className="relative flex items-center bg-black border border-white/10 rounded-2xl px-4 py-1">
                      <FiUser className="text-slate-500 group-focus-within:text-brand-orange transition-colors" />
                      <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} required className="w-full bg-transparent border-none outline-none py-3 px-4 text-white disabled:text-slate-500 font-semibold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-brand-orange/50 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
                    <div className="relative flex items-center bg-black border border-white/10 rounded-2xl px-4 py-1">
                      <FiMail className="text-slate-500 group-focus-within:text-brand-orange transition-colors" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} required className="w-full bg-transparent border-none outline-none py-3 px-4 text-white disabled:text-slate-500 font-semibold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">New Password</label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-brand-orange/50 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
                    <div className="relative flex items-center bg-black border border-white/10 rounded-2xl px-4 py-1">
                      <FiLock className="text-slate-500 group-focus-within:text-brand-orange transition-colors" />
                      <input type="password" name="password" value={formData.password} onChange={handleChange} disabled={!isEditing} placeholder="Leave blank to keep current" className="w-full bg-transparent border-none outline-none py-3 px-4 text-white placeholder:text-slate-600 disabled:placeholder:text-slate-800 disabled:text-slate-500 font-semibold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-brand-orange/50 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
                    <div className="relative flex items-center bg-black border border-white/10 rounded-2xl px-4 py-1">
                      <FiCheckCircle className="text-slate-500 group-focus-within:text-brand-orange transition-colors" />
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} disabled={!isEditing} placeholder="Repeat new password" className="w-full bg-transparent border-none outline-none py-3 px-4 text-white placeholder:text-slate-600 disabled:placeholder:text-slate-800 disabled:text-slate-500 font-semibold" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {awaitingPasswordCode && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:col-span-2 space-y-2 overflow-hidden">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-orange pl-2">Verification Code</label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-brand-orange/50 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
                        <div className="relative flex items-center bg-black border border-brand-orange/50 rounded-2xl px-4 py-1">
                          <FiShield className="text-brand-orange" />
                          <input type="text" name="passwordVerificationCode" value={formData.passwordVerificationCode} onChange={handleChange} disabled={!isEditing} placeholder="Enter the code sent to your email" className="w-full bg-transparent border-none outline-none py-3 px-4 text-white font-semibold" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 justify-end"
                  >
                    <button type="button" onClick={handleCancelEdit} className="px-8 py-4 rounded-2xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all">
                      Cancel Update
                    </button>
                    <button type="submit" disabled={saving} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-orange text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all shadow-lg shadow-brand-orange/20 disabled:opacity-50">
                      {saving ? (
                        <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Committing...</>
                      ) : (
                        <><FiSave className="text-lg" /> Commit Changes</>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
