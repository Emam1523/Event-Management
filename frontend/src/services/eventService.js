import { eventsAPI } from './api';

const eventService = {
  getAllEvents: async (params) => {
    const response = await eventsAPI.getAll(params);
    return response.data;
  },

  getEventById: async (id) => {
    const response = await eventsAPI.getById(id);
    return response.data;
  },

  getFeaturedEvents: async () => {
    const response = await eventsAPI.getFeatured();
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await eventsAPI.create(eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await eventsAPI.update(id, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await eventsAPI.delete(id);
    return response.data;
  }
};

export default eventService;
