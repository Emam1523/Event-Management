import { QRCodeSVG } from 'qrcode.react';

const QRTicket = ({ ticketData }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-sm mx-auto text-center">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">{ticketData.eventTitle}</h2>
        <p className="text-sm text-gray-500 font-medium">{ticketData.ticketType} • {ticketData.userName}</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-2xl inline-block mb-6">
        <QRCodeSVG 
          value={ticketData.id} 
          size={180}
          fgColor="#4F46E5"
          includeMargin={true}
        />
      </div>

      <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Order ID</span>
          <span className="font-bold text-gray-900">#{ticketData.id.slice(-8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Date</span>
          <span className="font-bold text-gray-900">{ticketData.date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Location</span>
          <span className="font-bold text-gray-900">{ticketData.location}</span>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400">
        Please present this QR code at the entry gate.
      </p>
    </div>
  );
};

export default QRTicket;
