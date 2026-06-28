import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiCreditCard,
  FiLock,
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiSmartphone,
  FiAlertCircle,
} from 'react-icons/fi';
import { format, isValid } from 'date-fns';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { authAPI, bookingsAPI, paymentAPI } from '../services/api';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [awaitingEmailVerification, setAwaitingEmailVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const nameParts = (user?.name || '').split(' ');
  const [formData, setFormData] = useState(() => ({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    mobileNumber: '',
  }));

  const requiresCheckoutVerification = Boolean(user?.email && user.email.toLowerCase().endsWith('@gmail.com') && !user?.emailVerified);

  // Redirect with useEffect — NOT during render
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && requiresCheckoutVerification && !awaitingEmailVerification) {
      authAPI.requestVerificationCode({ email: user.email, purpose: 'checkout' }).catch(() => {});
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAwaitingEmailVerification(true);
      setError('We sent a verification code to your email before checkout.');
    }
  }, [awaitingEmailVerification, isAuthenticated, requiresCheckoutVerification, user]);

  if (!isAuthenticated || cartItems.length === 0) {
    return null; // Will be redirected by useEffect
  }

  const subtotal = getCartTotal();
  const serviceFee = cartItems.reduce((sum, item) => {
    const rate = item.event.serviceCharge || 0;
    return sum + Math.round((item.ticketType.price * item.quantity) * (rate / 100));
  }, 0);
  const total = subtotal + serviceFee;

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === 'cardNumber') {
      nextValue = formatCardNumber(value);
    }

    if (name === 'cardExpiry') {
      nextValue = formatExpiry(value);
    }

    if (name === 'cardCvv') {
      nextValue = value.replace(/\D/g, '').slice(0, 4);
    }

    if (name === 'phone' || name === 'mobileNumber') {
      nextValue = value.replace(/[^\d+]/g, '').slice(0, 14);
    }

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    setError('');
  };

  const createBookings = async () => {
    const bookings = [];

    for (const item of cartItems) {
      const response = await bookingsAPI.create({
        eventId: item.event.id,
        ticketType: item.ticketType.name,
        quantity: item.quantity,
        totalPrice: item.ticketType.price * item.quantity,
      });
      bookings.push(response.data);
    }

    return bookings;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    if (formData.paymentMethod === 'card') {
      const cardDigits = formData.cardNumber.replace(/\s/g, '');
      if (cardDigits.length < 16 || formData.cardExpiry.length !== 5 || formData.cardCvv.length < 3) {
        setError('Please enter valid card details before proceeding.');
        setIsProcessing(false);
        return;
      }
    }

    if ((formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') && formData.mobileNumber.length < 11) {
      setError('Please enter a valid mobile wallet number.');
      setIsProcessing(false);
      return;
    }

    if (requiresCheckoutVerification && !verificationCode) {
      try {
        await authAPI.requestVerificationCode({ email: formData.email, purpose: 'checkout' });
        setAwaitingEmailVerification(true);
        setError('Enter the verification code sent to your email to continue.');
      } catch {
        setError('Unable to send a verification code right now.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    try {
      if (requiresCheckoutVerification) {
        const response = await authAPI.verifyCode({
          email: formData.email,
          purpose: 'checkout',
          code: verificationCode,
        });

        if (response.data?.verified) {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const nextUser = { ...currentUser, emailVerified: true };
          localStorage.setItem('user', JSON.stringify(nextUser));
          setUser(nextUser);
        }
      }

      const bookings = await createBookings();

      if (formData.paymentMethod === 'amarPay') {
        const { data } = await paymentAPI.initiateAmarPay({ bookingId: bookings[0]?.id });
        if (data?.success && data?.paymentUrl) {
          clearCart();
          window.location.href = data.paymentUrl;
          return;
        } else {
          throw new Error(data?.message || 'Failed to initiate amarPay');
        }
      }

      clearCart();
      navigate(`/payment-success?booking=${bookings[0]?.id || ''}`);
    } catch {
      setError('Payment failed. Please check your details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex', icon: <FiCreditCard /> },
    { id: 'amarPay', label: 'amarPay', sub: 'Pay with amarPay (Cards, Mobile Banking)', icon: <FiSmartphone /> },
    { id: 'bkash', label: 'bKash', sub: 'Pay with bKash mobile wallet' },
    { id: 'nagad', label: 'Nagad', sub: 'Pay with Nagad mobile wallet' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container-custom">
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors text-sm font-semibold">
            <FiArrowLeft className="mr-2" /> Back to Cart
          </Link>
        </div>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Secure Payment</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Checkout</h1>
              <p className="mt-2 text-sm text-slate-600">Review your details and confirm your booking in one step.</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">Cart</div>
              <div className="rounded-xl border border-slate-900 bg-slate-900 px-3 py-2 text-white">Checkout</div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">Complete</div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <FiAlertCircle />
                {error}
              </div>
            )}

            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-7">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" placeholder="01XXXXXXXXX" required />
                  </div>
                </div>
                {awaitingEmailVerification && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-900 mb-2">Email verification required</p>
                    <p className="text-xs text-amber-800 mb-3">
                      Enter the 6-digit code sent to {formData.email} to continue with checkout.
                    </p>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={verificationCode}
                      onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-center text-xl font-black tracking-[0.35em] text-slate-900 outline-none"
                      maxLength={6}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-7 mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center">
                  <FiCreditCard className="mr-2" /> Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  {paymentMethods.map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                        formData.paymentMethod === pm.id
                          ? 'border-slate-900 bg-slate-900/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={formData.paymentMethod === pm.id}
                        onChange={handleChange}
                        className="mr-3 accent-slate-900"
                      />
                      <span className="mr-3 text-slate-500">{pm.icon || <FiSmartphone />}</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{pm.label}</p>
                        <p className="text-slate-500 text-xs">{pm.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Card Fields */}
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Card Number *</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                        placeholder="1234 5678 9012 3456" className="w-full rounded-xl border border-slate-300 bg-white py-3 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" maxLength={19} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiry *</label>
                        <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleChange}
                          placeholder="MM/YY" className="w-full rounded-xl border border-slate-300 bg-white py-3 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" maxLength={5} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">CVV *</label>
                        <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleChange}
                          placeholder="123" className="w-full rounded-xl border border-slate-300 bg-white py-3 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" maxLength={4} required />
                      </div>
                    </div>
                  </div>
                )}

                {(formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {formData.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number *
                    </label>
                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange}
                      placeholder="01XXXXXXXXX" className="w-full rounded-xl border border-slate-300 bg-white py-3 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" required />
                  </div>
                )}

                {formData.paymentMethod === 'amarPay' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    You will be redirected to amarPay secure payment page to complete the transaction.
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="flex items-start bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6">
                <FiLock className="text-emerald-600 text-lg mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-emerald-800">
                  Your payment is encrypted and secure. We never store card details on our servers.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full rounded-2xl bg-slate-900 text-white text-center text-lg py-4 font-semibold transition hover:bg-slate-800 ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Confirm & Pay ৳${total.toLocaleString()}`
                )}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {cartItems.map((item) => {
                  const d = new Date(item.event.date);
                  return (
                    <div key={`${item.event.id}-${item.ticketType.id}`} className="pb-4 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 text-sm mb-1">{item.event.title}</p>
                      <p className="text-xs text-slate-500 mb-1">
                        {isValid(d) ? format(d, 'MMM d, yyyy') : 'Date TBA'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">{item.ticketType.name} × {item.quantity}</span>
                        <span className="font-semibold text-slate-900 text-sm">৳{(item.ticketType.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Service Fee</span>
                  <span>৳{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-slate-900">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-slate-500 mb-2 font-medium">Accepted payments:</p>
                <div className="flex flex-wrap gap-2">
                  {['Visa', 'Mastercard', 'amarPay', 'bKash', 'Nagad'].map((m) => (
                    <span key={m} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{m}</span>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <FiCheckCircle />
                Instant ticket delivery after successful payment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
