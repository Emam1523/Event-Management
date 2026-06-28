import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome, FiShoppingCart } from 'react-icons/fi';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-amber-500 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="text-3xl text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-amber-100">You have cancelled the payment</p>
          </div>
          <div className="p-6 space-y-4 text-center">
            <p className="text-gray-600">Your payment was cancelled. No charges have been made.</p>
            <div className="space-y-3">
              <Link to="/cart" className="btn-primary w-full flex items-center justify-center gap-2">
                <FiShoppingCart /> Return to Cart
              </Link>
              <Link to="/" className="btn-secondary w-full flex items-center justify-center gap-2">
                <FiHome /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
