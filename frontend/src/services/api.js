import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';
export const API_ROOT = API_BASE_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  requestVerificationCode: (data) => api.post('/auth/request-code', data),
  verifyCode: (data) => api.post('/auth/verify-code', data),
  confirmPasswordChange: (data) => api.post('/auth/confirm-password-change', data),
};

// ── Events ────────────────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getFeatured: () => api.get('/events/featured'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getBookings: (params) => api.get('/admin/bookings', { params }),
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  getByEvent: (eventId) => api.get(`/reviews/event/${eventId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentAPI = {
  process: (data) => api.post('/payments', data),
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statsAPI = {
  getGlobalStats: () => api.get('/stats'),
};

// ── Chat ─────────────────────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
};

export default api;
