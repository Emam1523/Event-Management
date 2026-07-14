import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { format } from "date-fns";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const totalServiceFee = cartItems.reduce((sum, item) => {
    const rate = item.event.serviceCharge || 0;
    return (
      sum + Math.round(item.ticketType.price * item.quantity * (rate / 100))
    );
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-center px-4">
        <div className="glass-card p-16 max-w-lg bg-white/5 border-white/5 rounded-[3em]">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
            <FiShoppingBag className="text-4xl text-zinc-600" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
            Your Bag is Empty
          </h2>
          <p className="text-zinc-400 mb-10 font-medium leading-relaxed">
            Looks like you haven't secured any passes yet. Explore the hottest
            events happening soon!
          </p>
          <Link to="/events" className="btn-primary py-4 px-10 text-[11px]">
            Browse Experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-32 pb-24 text-zinc-200">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tighter uppercase">
          YOUR <span className="text-primary">BAG.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <div
                key={`${item.event.id}-${item.ticketType.id}`}
                className="glass-card p-8 bg-white/5 border-white/5 group hover:border-white/10 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Event Image */}
                  <div className="relative w-full md:w-40 h-40 overflow-hidden rounded-3xl">
                    <img
                      src={item.event.image}
                      alt={item.event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/events/${item.event.id}`}
                        className="text-xl font-black text-white hover:text-primary transition-colors uppercase tracking-tight"
                      >
                        {item.event.title}
                      </Link>
                      <button
                        onClick={() =>
                          removeFromCart(item.event.id, item.ticketType.id)
                        }
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-white/5"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                      <span>
                        {format(new Date(item.event.date), "MMM d, yyyy")}
                      </span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span>{item.event.location}</span>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {item.ticketType.name}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:min-w-[120px] pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="flex items-center bg-white/5 rounded-2xl border border-white/5 p-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.event.id,
                            item.ticketType.id,
                            item.quantity - 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                      >
                        –
                      </button>
                      <span className="w-8 text-center font-black text-white text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.event.id,
                            item.ticketType.id,
                            item.quantity + 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-2xl font-black text-white tracking-tighter">
                      ৳
                      {(item.ticketType.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="glass-card p-10 bg-slate-900 border-white/10 sticky top-32 shadow-3xl shadow-black/40">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-10 text-center">
                ORDER SUMMARY
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-white">
                    ৳{getCartTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                    Service Fee
                  </span>
                  <span className="text-lg font-bold text-white">
                    ৳{totalServiceFee.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-white/5 pt-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                      Total Amount
                    </span>
                    <span className="text-4xl font-black text-primary tracking-tighter">
                      ৳{(getCartTotal() + totalServiceFee).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full btn-primary py-5 rounded-4xl text-[11px] mb-6 shadow-2xl shadow-primary/20"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/events"
                className="block text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Security Badges */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-6 text-center">
                  SECURE PAYMENTS
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["VISA", "MASTERCARD", "AMARPAY", "BKASH", "NAGAD"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black text-zinc-500 border border-white/5"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
