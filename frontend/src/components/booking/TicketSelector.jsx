import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const TicketSelector = ({ ticketTypes, onSelect }) => {
  const [selectedId, setSelectedId] = useState(ticketTypes[0]?.id);
  const [quantity, setQuantity] = useState(1);

  const handleSelect = (id) => {
    setSelectedId(id);
    const type = ticketTypes.find(t => t.id === id);
    onSelect(type, quantity);
  };

  const updateQuantity = (newQty) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    const type = ticketTypes.find(t => t.id === selectedId);
    onSelect(type, newQty);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 mb-4">Select Ticket Type</h3>
      <div className="grid gap-3">
        {ticketTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedId === type.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-gray-900">{type.name}</span>
              <span className="font-bold text-primary-600">৳{type.price}</span>
            </div>
            <p className="text-xs text-gray-500">{type.description}</p>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => updateQuantity(quantity - 1)}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FiMinus />
          </button>
          <span className="text-lg font-bold w-8 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(quantity + 1)}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FiPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelector;
