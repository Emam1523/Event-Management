import { motion } from 'framer-motion';
import { FiSearch, FiHelpCircle, FiBookOpen, FiMessageCircle, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const faqs = [
    {
      q: "How do I book a ticket?",
      a: "Simply browse our events, select your preferred ticket type, and click 'Confirm & Secure Pass'. Follow the secure checkout process to complete your booking."
    },
    {
      q: "Where can I find my tickets?",
      a: "Once purchased, your digital passes are instantly available in your 'My Tickets' dashboard. You'll also receive a confirmation email with a link to your tickets."
    },
    {
      q: "Can I get a refund?",
      a: "Refund policies vary by event organizer. Please check the specific event details or contact the organizer directly through the event page."
    },
    {
      q: "How do I host my own event?",
      a: "Click on 'Start Selling' in the navigation or footer. Follow the step-by-step guide to create your event, set ticket prices, and start reaching thousands of explorers."
    }
  ];

  return (
    <div className="bg-dark-bg min-h-screen pt-32 pb-24 text-slate-200">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase">
              HELP <span className="text-primary">CENTER.</span>
            </h1>
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-rose-500 rounded-3xl blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 shadow-2xl">
                <FiSearch className="ml-6 text-slate-500 text-2xl" />
                <input
                  type="text"
                  placeholder="Search for articles, guides, and FAQs..."
                  className="flex-1 bg-transparent border-none outline-none px-6 py-5 text-white font-bold text-lg placeholder:text-slate-700"
                />
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              { icon: <FiBookOpen />, title: "User Guide", desc: "Learn how to use AuraPass like a pro." },
              { icon: <FiHelpCircle />, title: "FAQs", desc: "Quick answers to common questions." },
              { icon: <FiMessageCircle />, title: "Support", desc: "Talk to our dedicated help team." }
            ].map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 bg-white/5 border-white/10 text-center hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary text-3xl mx-auto mb-8 border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-widest">{cat.title}</h3>
                <p className="text-slate-500 font-medium">{cat.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* FAQ List */}
          <div className="glass-card p-12 bg-white/5 border-white/10">
            <h2 className="text-3xl font-black text-white mb-12 tracking-tight uppercase border-b border-white/5 pb-8">Popular Questions</h2>
            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{faq.q}</h4>
                    <FiChevronRight className="text-slate-600 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                  </div>
                  <p className="text-slate-400 font-medium leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="text-slate-500 font-medium mb-8">Still need help? Our support team is available 24/7.</p>
            <Link to="/contact" className="btn-primary">
              Contact Support Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
