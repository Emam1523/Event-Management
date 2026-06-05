import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiShare2, FiPrinter } from 'react-icons/fi';
import QRTicket from '../../components/booking/QRTicket';
import bookingService from '../../services/bookingService';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const data = await bookingService.getBookingById(id);
        if (data) {
          setTicket({
            id: data.id,
            eventTitle: data.event?.title || 'Event',
            eventDate: data.event?.date || '',
            location: data.event?.location || '',
            ticketType: data.ticketType || 'Standard',
            userName: data.user?.name || 'Attendee',
            price: data.totalPrice || 0,
            date: data.event?.date || ''
          });
        }
      } catch {
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };
    loadTicket();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Ticket...</div>;
  if (!ticket) return <div className="text-center py-20">Ticket not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <Link to="/my-tickets" className="flex items-center text-gray-500 hover:text-primary-600 transition-colors font-medium">
          <FiArrowLeft className="mr-2" /> My Tickets
        </Link>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 text-sm"><FiPrinter /> Print</button>
          <button className="btn-primary flex items-center gap-2 text-sm"><FiDownload /> Download PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <QRTicket ticketData={ticket} />
        </div>
        
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Booking Details</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Confirmed</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ticket Type</p>
                <p className="font-bold text-gray-900">{ticket.ticketType}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                <p className="font-bold text-gray-900">৳{ticket.price.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Attendee</p>
              <p className="font-bold text-gray-900">{ticket.userName}</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700">
                <FiShare2 /> Transfer Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
