export const formatCurrency = (amount, currency = '৳') => {
  return `${currency}${Number(amount).toLocaleString()}`;
};

export default formatCurrency;
