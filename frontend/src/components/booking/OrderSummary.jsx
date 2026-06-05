import { formatCurrency } from '../../utils/formatCurrency';

const OrderSummary = ({ items, subtotal, serviceFee, total }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <p className="font-semibold text-gray-900 text-sm">{item.eventTitle}</p>
              <p className="text-xs text-gray-500">{item.ticketType} × {item.quantity}</p>
            </div>
            <span className="font-bold text-gray-900 text-sm">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-6 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Service Fee</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100">
          <span>Total</span>
          <span className="text-primary-600">{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          By clicking pay, you agree to our Terms & Conditions.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
