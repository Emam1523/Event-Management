import { motion } from 'framer-motion';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';

const TermsOfService = () => {
  const terms = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using the AuraPass platform, you agree to be bound by these Terms of Service and all applicable laws and regulations."
    },
    {
      title: "Ticket Purchases",
      content: "All ticket sales are final unless otherwise stated by the event organizer. AuraPass acts as a platform and is not responsible for event cancellations or modifications."
    },
    {
      title: "User Conduct",
      content: "Users must provide accurate information and are responsible for maintaining the confidentiality of their accounts. Any fraudulent activity will result in immediate termination."
    },
    {
      title: "Intellectual Property",
      content: "All content, logos, and software on AuraPass are the property of AuraPass or its licensors and are protected by copyright and other intellectual property laws."
    }
  ];

  return (
    <div className="bg-dark-bg min-h-screen pt-32 pb-24 text-slate-200">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase">
              TERMS OF <span className="text-primary">SERVICE.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              The rules and regulations for using the AuraPass platform. Please read these carefully before using our services.
            </p>
          </motion.div>

          <div className="space-y-12 mb-20">
            {terms.map((term, idx) => (
              <motion.div
                key={term.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <FiInfo />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">{term.title}</h3>
                </div>
                <div className="pl-18 border-l border-white/10 ml-6 pb-6">
                  <p className="text-slate-400 font-medium leading-relaxed text-lg">{term.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-violet-600/10 to-rose-600/10 border border-white/5 text-center">
            <FiAlertCircle className="text-4xl text-primary mx-auto mb-6" />
            <p className="text-slate-300 font-medium italic">
              "We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms."
            </p>
            <p className="text-slate-500 mt-6 text-sm font-bold uppercase tracking-widest">Last Updated: May 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
