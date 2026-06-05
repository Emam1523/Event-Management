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
    roleLabel: 'Member',
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
    if (!user) {
      return;
    }

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
          roleLabel: 'Member',
        });
      } catch {
        setStats((prev) => ({ ...prev, roleLabel: user?.role === 'admin' ? 'Administrator' : 'Member' }));
      }
    };

    if (user) {
      loadStats();
    }
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
    <div className="space-y-8 pb-20">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">Account Center</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              {user?.role === 'admin' ? 'Admin Profile' : 'User Profile'}
            </h1>
            <p className="mt-2 text-slate-600">
              Keep your identity and security settings up to date.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <FiX /> Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                <FiEdit3 /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Signed In As</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{user?.name}</p>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500">Total</p>
                <p className="text-xl font-black text-slate-900">{stats.total}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500">Active</p>
                <p className="text-xl font-black text-slate-900">{stats.upcoming}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500">Role</p>
                <p className="text-sm font-black text-slate-900 pt-1">{stats.roleLabel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-slate-900">Quick Actions</p>

            {user?.role === 'admin' ? (
              <>
                <Link
                  to="/admin/manage-events"
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Manage Events <FiChevronRight />
                </Link>
                <Link
                  to="/admin/analytics"
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View Analytics <FiChevronRight />
                </Link>
              </>
            ) : (
              <Link
                to="/my-tickets"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="inline-flex items-center gap-2">
                  <BsTicketPerforated /> My Tickets
                </span>
                <FiChevronRight />
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            >
              <span className="inline-flex items-center gap-2">
                <FiLogOut /> Logout
              </span>
              <FiChevronRight />
            </button>
          </div>
        </aside>

        <section className="xl:col-span-2">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-center gap-2 text-slate-700 mb-6">
              {user?.role === 'admin' ? <FiShield className="text-lg" /> : <FiUser className="text-lg" />}
              <h2 className="text-xl font-bold">Profile Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Leave blank to keep current password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {awaitingPasswordCode && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Verification Code</label>
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="passwordVerificationCode"
                      value={formData.passwordVerificationCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter the code sent to your email"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-3 justify-end"
                >
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FiX /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave /> Save Changes
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
