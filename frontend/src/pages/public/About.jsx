import { FiSearch, FiCheckCircle } from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import { motion } from 'framer-motion';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const steps = [
    {
      icon: <FiSearch />,
      title: 'DISCOVER',
      desc: 'Browse curated events across Bangladesh and find your next experience.',
      color: 'bg-primary'
    },
    {
      icon: <BsTicketPerforated />,
      title: 'BOOK',
      desc: 'Secure your tickets instantly with trusted payments and verified hosts.',
      color: 'bg-indigo-600'
    },
    {
      icon: <FiCheckCircle />,
      title: 'EXPERIENCE',
      desc: 'Show your digital pass and enjoy the moment with confidence.',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="bg-dark-bg min-h-screen text-slate-200">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute -top-32 left-[-10%] w-[520px] h-[520px] bg-amber-400/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 right-[-10%] w-[520px] h-[520px] bg-indigo-500/10 rounded-full blur-[140px]" />
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              About AuraPass
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
              Crafted for bold explorers
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl">
              AuraPass is Bangladesh's premium platform for discovering and booking elite events. We connect
              audiences with verified hosts, secure ticketing, and curated experiences across the country.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-custom">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 card-glow">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-4">Introduction</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              What is AuraPass?
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-4xl">
              AuraPass is a Bangladesh-first event platform that lets people discover, book, and manage tickets in one place.
              Event organizers can publish events and ticket types, while users browse by category, secure seats instantly,
              and access digital passes on their phones.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              Three Easy Steps
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              HOW IT <span className="text-primary">WORKS.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              Simple. Secure. Built for modern explorers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                {...fadeInUp}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-[2.5rem] p-10 card-glow"
              >
                <div className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                  0{i + 1}
                </div>
                <div className={`${step.color} w-20 h-20 rounded-[1.75rem] flex items-center justify-center text-white text-3xl shadow-2xl mb-8`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-4 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
