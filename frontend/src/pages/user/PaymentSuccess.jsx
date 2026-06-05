import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiDownload, FiMail, FiHome } from 'react-icons/fi';
import bookingService from '../../services/bookingService';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('booking');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      navigate('/');
      return;
    }

    const loadBooking = async () => {
      try {
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
      } catch {
        setError('We could not load your booking details.');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 text-center">
        <div className="space-y-4 max-w-md">
          <p className="text-lg font-semibold text-slate-900">{error}</p>
          <Link to="/my-tickets" className="btn-primary inline-flex items-center justify-center gap-2">
            <FiCheck /> View My Tickets
          </Link>
        </div>
      </div>
    );
  }

  const bookingDate = booking?.event?.date ? new Date(booking.event.date) : null;
  const ticketLabel = booking?.ticketType || 'Ticket';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-500 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-3xl text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Your tickets have been confirmed</p>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Booking ID */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Booking ID</p>
              <p className="text-xl font-mono font-bold text-primary-600">{booking?.id || bookingId}</p>
            </div>

            {/* Event Details */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-2">{booking?.event?.title || 'Booking confirmed'}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📅 {bookingDate ? bookingDate.toLocaleDateString() : 'Date TBA'}</p>
                <p>🕐 {booking?.event?.time || 'Time TBA'}</p>
                <p>📍 {booking?.event?.location || 'Location TBA'}</p>
              </div>
            </div>

            {/* Tickets */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Your Tickets</h4>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{ticketLabel}</p>
                  <p className="text-sm text-gray-500">{booking?.quantity || 0} ticket{booking?.quantity > 1 ? 's' : ''}</p>
                </div>
                <p className="font-bold text-primary-600">৳{((booking?.totalPrice || 0)).toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <p className="font-bold text-gray-900">Total Paid</p>
                <p className="text-xl font-bold text-primary-600">৳{(booking?.totalPrice || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Next steps:</strong> Check your email for the ticket confirmation.
                Bring a valid ID and show your QR code at the venue entrance.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/my-tickets" className="btn-primary w-full flex items-center justify-center gap-2">
                <FiCheck /> View My Tickets
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <button className="btn-outline flex items-center justify-center gap-2">
                  <FiDownload /> Download
                </button>
                <button className="btn-outline flex items-center justify-center gap-2">
                  <FiMail /> Email
                </button>
              </div>

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

export default PaymentSuccess;
