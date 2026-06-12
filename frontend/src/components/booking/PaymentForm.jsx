import { FiCreditCard, FiLock } from 'react-icons/fi';

const PaymentForm = ({ onPaymentMethodChange, formData, onInputChange }) => {
  const methods = [
    { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
    { id: 'bkash', label: 'bKash', sub: 'Pay with bKash mobile wallet' },
    { id: 'nagad', label: 'Nagad', sub: 'Pay with Nagad mobile wallet' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <FiCreditCard className="mr-2" /> Payment Method
      </h2>

      <div className="grid gap-3 mb-8">
        {methods.map((m) => (
          <label
            key={m.id}
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
              formData.paymentMethod === m.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={m.id}
              checked={formData.paymentMethod === m.id}
              onChange={() => onPaymentMethodChange(m.id)}
              className="mr-4 accent-primary-600 w-5 h-5"
            />
            <div>
              <p className="font-bold text-gray-900 text-sm">{m.label}</p>
              <p className="text-gray-500 text-xs">{m.sub}</p>
            </div>
          </label>
        ))}
      </div>

      {formData.paymentMethod === 'card' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={onInputChange}
              placeholder="1234 5678 9012 3456"
              className="input-field"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry (MM/YY)</label>
              <input
                type="text"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={onInputChange}
                placeholder="MM/YY"
                className="input-field"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                name="cardCvv"
                value={formData.cardCvv}
                onChange={onInputChange}
                placeholder="123"
                className="input-field"
                maxLength={4}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {formData.paymentMethod.toUpperCase()} Account Number
          </label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={onInputChange}
            placeholder="01XXXXXXXXX"
            className="input-field"
          />
        </div>
      )}

      <div className="mt-8 flex items-start bg-blue-50 p-4 rounded-xl border border-blue-100">
        <FiLock className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Your payment information is encrypted and secure. We do not store your full card details on our servers.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
