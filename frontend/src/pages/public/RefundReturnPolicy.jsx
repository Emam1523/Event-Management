import { motion } from "framer-motion";
import {
  IoIosAlert,
  IoIosCalendar,
  IoIosClock,
  IoIosCheckmarkCircle,
  IoMdRefresh,
} from "react-icons/io";
import { IoTicket, IoBan } from "react-icons/io5";

export default function RefundReturnPolicy() {
  const policies = [
    {
      icon: IoMdRefresh,
      title: "30% Cancellation Fee",
      description:
        "Approved cancellations are subject to a 30% cancellation fee. The remaining 70% of the ticket price will be refunded.",
    },
    {
      icon: IoIosCalendar,
      title: "72-Hour Refund Window",
      description:
        "Refund requests must be submitted at least 72 hours before the scheduled event or service.",
    },
    {
      icon: IoIosClock,
      title: "Late Cancellation",
      description:
        "No refunds will be issued for cancellations made within 72 hours of the event or service.",
    },
    {
      icon: IoBan,
      title: "No-Shows & Late Arrivals",
      description: "No refunds will be issued for no-shows or late arrivals.",
    },
    {
      icon: IoTicket,
      title: "Non-Transferable Tickets",
      description:
        "Tickets cannot be transferred to another person or another date.",
    },
    {
      icon: IoIosCheckmarkCircle,
      title: "Event Cancellation",
      description:
        "If NEXTDHAKA cancels the event or service, customers will receive a full refund.",
    },
    {
      icon: IoIosAlert,
      title: "Refund Processing",
      description:
        "Approved refunds are processed within 5–10 business days to the original payment method.",
    },
  ];

  return (
    <div className="bg-dark-bg min-h-screen pt-32 text-zinc-200">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter my-4 uppercase">
              REFUND & <span className="text-primary">RETURN POLICY.</span>
            </h1>
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Please review our cancellation and refund guidelines carefully
              before purchasing tickets through NEXTDHAKA.
            </p>
          </motion.div>

          {/* Important Notice Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 flex items-start gap-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-2xl shrink-0">
              <IoIosAlert />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight uppercase mb-2">
                Important Notice
              </h3>
              <p className="text-zinc-400 font-medium leading-relaxed">
                Refund eligibility depends on when the cancellation request is
                submitted. Requests received less than 72 hours before the event
                are not eligible for refunds.
              </p>
            </div>
          </motion.div>

          {/* Policies List */}
          <div className="space-y-12 mb-20">
            {policies.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                      <Icon />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                      {item.title}
                    </h3>
                  </div>
                  <div className="pl-18 border-l border-white/10 ml-6 pb-6">
                    <p className="text-zinc-400 font-medium leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center"
          >
            <h3 className="text-3xl font-black text-white tracking-tight uppercase mb-4">
              Questions About Refunds?
            </h3>
            <p className="text-zinc-400 font-medium leading-relaxed max-w-xl mx-auto mb-8">
              If you need assistance regarding cancellations, refunds, or ticket
              purchases, please contact our support team.
            </p>
            <a
              className="px-8 py-4 bg-primary text-white font-black uppercase tracking-wider rounded-2xl hover:bg-opacity-95 transition-all duration-300"
              href="tel:+8801318672928"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
