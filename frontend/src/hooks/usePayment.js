import { useState } from 'react';
import paymentService from '../services/paymentService';
import { useNotifications } from '../context/NotificationContext';

const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showNotification } = useNotifications();

  const processPayment = async (paymentData) => {
    setIsProcessing(true);
    try {
      const data = await paymentService.processPayment(paymentData);
      showNotification('Payment processed successfully!', 'success');
      return data;
    } catch (err) {
      showNotification('Payment failed. Please try again.', 'error');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment, isProcessing };
};

export default usePayment;
