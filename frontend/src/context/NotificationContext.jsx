// NotificationContext.jsx - Global notification state management
import { createContext, useContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const newNotifications = prev.filter(n => n.id !== id);

      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }

      return newNotifications;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const showNotification = useCallback((message, type = 'info', title = null) => {
    addNotification({
      title: title || (type.charAt(0).toUpperCase() + type.slice(1)),
      message,
      type
    });
  }, [addNotification]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    showNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Predefined notification types
export const notificationTypes = {
  BOOKING_SUCCESS: 'booking_success',
  BOOKING_CANCELLED: 'booking_cancelled',
  EVENT_REMINDER: 'event_reminder',
  PAYMENT_FAILED: 'payment_failed',
  TICKET_TRANSFER: 'ticket_transfer',
  EVENT_UPDATE: 'event_update'
};

// Helper function to create typed notifications
export const createNotification = (type, data) => {
  const templates = {
    [notificationTypes.BOOKING_SUCCESS]: {
      title: 'Booking Confirmed!',
      message: `Your booking for ${data.eventTitle} has been confirmed.`,
      type: 'success'
    },
    [notificationTypes.BOOKING_CANCELLED]: {
      title: 'Booking Cancelled',
      message: `Your booking for ${data.eventTitle} has been cancelled.`,
      type: 'warning'
    },
    [notificationTypes.EVENT_REMINDER]: {
      title: 'Event Reminder',
      message: `${data.eventTitle} starts tomorrow at ${data.time}.`,
      type: 'info'
    },
    [notificationTypes.PAYMENT_FAILED]: {
      title: 'Payment Failed',
      message: `Payment for ${data.eventTitle} could not be processed.`,
      type: 'error'
    },
    [notificationTypes.TICKET_TRANSFER]: {
      title: 'Ticket Transferred',
      message: `Your ticket for ${data.eventTitle} has been transferred.`,
      type: 'success'
    },
    [notificationTypes.EVENT_UPDATE]: {
      title: 'Event Updated',
      message: `${data.eventTitle} has been updated. Check for changes.`,
      type: 'info'
    }
  };

  return templates[type] || {
    title: 'Notification',
    message: data.message || 'You have a new notification.',
    type: 'info'
  };
};
