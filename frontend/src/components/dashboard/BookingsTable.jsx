import { formatCurrency } from "../../utils/formatCurrency";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiEye, FiMoreVertical } from "react-icons/fi";

const BookingsTable = ({ bookings, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white/5 border border-white/10 rounded-4xl overflow-hidden backdrop-blur-xl">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-white/2 border-b border-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-4xl overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/2 border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-wide">
                Transaction ID
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-wide">
                Acquisition By
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-wide">
                Curation
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-wide">
                Investment
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-wide">
                Mandate Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-wide text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            <AnimatePresence>
              {bookings.map((b) => (
                <motion.tr
                  key={b.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  className="group hover:bg-white/3 transition-colors"
                >
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-lg border border-brand-orange/20">
                      #{b.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white group-hover:text-brand-orange transition-colors">
                        {b.userName}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                        {b.userEmail}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-gray-300 font-bold">
                      {b.eventTitle}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-white">
                    {formatCurrency(b.totalAmount)}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border ${
                        b.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <FiEye />
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <FiDownload />
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <FiMoreVertical />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            No transactions recorded
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;
