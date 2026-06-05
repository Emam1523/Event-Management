import { useState, useEffect } from 'react';
import eventService from '../services/eventService';

const useEvents = (params = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.getAllEvents(params);
        setEvents(data.events || []);
        setTotal(data.total || 0);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [JSON.stringify(params)]);

  return { events, loading, error, total };
};

export default useEvents;
