import { paymentAPI } from './api';

const paymentService = {
  processPayment: async (paymentData) => {
    const response = await paymentAPI.process(paymentData);
    return response.data;
  }
};

export default paymentService;
