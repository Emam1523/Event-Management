import { FiChevronRight, FiCalendar, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const TicketList = ({ tickets }) => {
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          to={`/my-tickets/${ticket.id}`}
          className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary-200 transition-all group"
        >
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-bold mr-4">
            #{ticket.id.slice(-4).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {ticket.eventTitle}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center text-xs text-gray-400">
                <FiCalendar className="mr-1" /> {ticket.eventDate}
              </span>
              <span className="flex items-center text-xs text-gray-400">
                <FiMapPin className="mr-1" /> {ticket.location}
              </span>
            </div>
          </div>
          <div className="text-right mr-4">
            <p className="text-sm font-bold text-gray-900">{ticket.ticketType}</p>
            <p className="text-xs text-gray-500">{ticket.quantity} Pass(es)</p>
          </div>
          <FiChevronRight className="text-gray-300 group-hover:text-primary-600 transition-colors" />
        </Link>
      ))}
    </div>
  );
};

export default TicketList;
