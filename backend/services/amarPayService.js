const axios = require('axios');

const AMARPAY_BASE_URL = process.env.AMARPAY_BASE_URL || 'https://sandbox.aamarpay.com';
const AMARPAY_STORE_ID = process.env.AMARPAY_STORE_ID || '';
const AMARPAY_SIGNATURE_KEY = process.env.AMARPAY_SIGNATURE_KEY || '';

const amarPayService = {
  async initiatePayment({ amount, orderId, customerName, customerEmail, customerPhone, cancelUrl, successUrl, failUrl }) {
    const data = {
      store_id: AMARPAY_STORE_ID,
      signature_key: AMARPAY_SIGNATURE_KEY,
      amount: amount.toFixed(2),
      currency: 'BDT',
      tran_id: orderId,
      cus_name: customerName || 'Customer',
      cus_email: customerEmail || 'customer@example.com',
      cus_phone: customerPhone || '01XXXXXXXXX',
      desc: 'Event Ticket Payment',
      cus_add1: 'N/A',
      cus_city: 'N/A',
      cus_country: 'Bangladesh',
      ipn_url: `${process.env.API_URL || 'http://localhost:5005'}/api/payments/amar-pay/ipn`,
      success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`,
      fail_url: failUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-cancelled`,
      type: 'json',
    };

    const { data: response } = await axios.post(`${AMARPAY_BASE_URL}/jsonpost.php`, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.result === 'true' || response.payment_url) {
      return {
        success: true,
        paymentUrl: response.payment_url,
        transactionId: response.tran_id || orderId,
      };
    }

    return {
      success: false,
      message: response.msg || 'Failed to initiate payment with amarPay',
    };
  },

  async verifyPayment(transactionId) {
    const data = {
      store_id: AMARPAY_STORE_ID,
      signature_key: AMARPAY_SIGNATURE_KEY,
      type: 'json',
      request_id: transactionId,
    };

    const { data: response } = await axios.post(`${AMARPAY_BASE_URL}/api/v1/trxcheck/request.php`, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response && (response.pay_status === 'Successful' || response.status === 'success')) {
      return {
        verified: true,
        transactionId: response.tran_id || transactionId,
        amount: parseFloat(response.amount || 0),
        bankTransactionId: response.bank_tran_id || '',
        cardType: response.card_type || '',
        currency: response.currency || 'BDT',
      };
    }

    return { verified: false };
  },
};

module.exports = amarPayService;
