import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";

const TermsOfService = () => {
  const terms = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing or using the NEXTDHAKA platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
    },
    {
      title: "Ticket Purchases",
      content:
        "All ticket sales are final unless otherwise stated by the event organizer. NEXTDHAKA acts as a platform and is not responsible for event cancellations or modifications.",
    },
    {
      title: "User Conduct",
      content:
        "Users must provide accurate information and are responsible for maintaining the confidentiality of their accounts. Any fraudulent activity will result in immediate termination.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content, logos, and software on NEXTDHAKA are the property of NEXTDHAKA or its licensors and are protected by copyright and other intellectual property laws.",
    },
  ];

  return (
    <div className="bg-dark-bg min-h-screen pt-32 pb-24 text-zinc-200">
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
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
              The rules and regulations for using the NEXTDHAKA platform. Please
              read these carefully before using our services.
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
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                    {term.title}
                  </h3>
                </div>
                <div className="pl-18 border-l border-white/10 ml-6 pb-6">
                  <p className="text-zinc-400 font-medium leading-relaxed text-lg">
                    {term.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
