import { bookingsAPI } from './api';

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await bookingsAPI.create(bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await bookingsAPI.getMyBookings();
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await bookingsAPI.getById(id);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await bookingsAPI.cancel(id);
    return response.data;
  }
};

export default bookingService;
