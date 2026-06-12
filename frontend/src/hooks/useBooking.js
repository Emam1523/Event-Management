import { useState } from 'react';
import bookingService from '../services/bookingService';
import { useNotifications } from '../context/NotificationContext';

const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotifications();

  const createBooking = async (bookingData) => {
    setLoading(true);
    try {
      const data = await bookingService.createBooking(bookingData);
      showNotification('Booking confirmed successfully!', 'success');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create booking';
      setError(msg);
      showNotification(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    setLoading(true);
    try {
      await bookingService.cancelBooking(id);
      showNotification('Booking cancelled.', 'success');
    } catch {
      showNotification('Failed to cancel booking.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, cancelBooking, loading, error };
};

export default useBooking;
