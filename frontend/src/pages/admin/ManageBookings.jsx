import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BookingsTable from '../../components/dashboard/BookingsTable';
import { adminAPI } from '../../services/api';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await adminAPI.getBookings();
        setBookings(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Transaction Ledger</h1>
          <p className="text-gray-400 font-medium">Oversee all elite passes and historical transactions.</p>
        </div>
      </div>
      
      <BookingsTable bookings={bookings} isLoading={loading} />
    </motion.div>
  );
};

export default ManageBookings;
