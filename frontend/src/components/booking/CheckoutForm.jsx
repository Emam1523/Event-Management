import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

const CheckoutForm = ({ formData, onInputChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onInputChange}
              placeholder="John"
              className="input-field pl-10"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onInputChange}
              placeholder="Doe"
              className="input-field pl-10"
              required
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="john@example.com"
              className="input-field pl-10"
              required
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              placeholder="+880 1XXXXXXXXX"
              className="input-field pl-10"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
