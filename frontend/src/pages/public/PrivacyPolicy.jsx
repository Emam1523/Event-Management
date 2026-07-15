import { motion } from "framer-motion";
import { FiShield, FiLock, FiEye, FiUserCheck } from "react-icons/fi";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FiEye />,
      title: "Data Collection",
      content:
        "We collect information you provide directly to us, such as when you create an account, purchase tickets, or communicate with us. This may include your name, email address, payment information, and event preferences.",
    },
    {
      icon: <FiLock />,
      title: "How We Use Your Data",
      content:
        "Your data helps us personalize your experience, process transactions securely, and provide you with relevant event recommendations. We never sell your personal information to third parties.",
    },
    {
      icon: <FiShield />,
      title: "Security Measures",
      content:
        "NEXTDHAKA employs industry-standard encryption and security protocols to protect your data. Your payment information is handled through secure, PCI-compliant gateways.",
    },
    {
      icon: <FiUserCheck />,
      title: "Your Rights",
      content:
        "You have the right to access, correct, or delete your personal data at any time. You can manage your privacy settings directly from your account dashboard.",
    },
  ];

  return (
    <div className="bg-dark-bg min-h-screen pt-32 pb-10 text-zinc-200">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter my-4 uppercase">
              PRIVACY <span className="text-primary">POLICY.</span>
            </h1>
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Your trust is our most valuable asset. Learn how we protect your
              privacy and secure your data at NEXTDHAKA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 mb-10">
            {sections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 bg-white/5 border-white/10 flex flex-col md:flex-row gap-10 items-start hover:bg-white/10 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl shrink-0 border border-primary/20">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">
                    {section.title}
                  </h3>
                  <p className="text-zinc-400 font-medium leading-relaxed text-lg">
                    {section.content}
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

export default PrivacyPolicy;
