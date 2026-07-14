import {
  FiArrowUpRight,
  FiBarChart2,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiLink,
  FiMap,
  FiSearch,
  FiShield,
  FiShoppingCart,
  FiTrendingUp,
} from "react-icons/fi";
import { BsTicketPerforated } from "react-icons/bs";
import { motion } from "framer-motion";

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const steps = [
    {
      icon: <FiSearch />,
      title: "DISCOVER",
      desc: "Browse curated events across Bangladesh and find your next experience.",
      color: "bg-primary",
    },
    {
      icon: <BsTicketPerforated />,
      title: "BOOK",
      desc: "Secure your tickets instantly with trusted payments and verified hosts.",
      color: "bg-indigo-600",
    },
    {
      icon: <FiCheckCircle />,
      title: "EXPERIENCE",
      desc: "Show your digital pass and enjoy the moment with confidence.",
      color: "bg-emerald-500",
    },
  ];

  const analyticsItems = [
    {
      icon: <FiTrendingUp />,
      title: "Monitor ticket sales and trends in real time",
    },
    {
      icon: <FiDollarSign />,
      title: "Track revenue and run analysis across events",
    },
    {
      icon: <FiMap />,
      title: "See event page heatmaps and user behavior",
    },
    {
      icon: <FiLink />,
      title: "Create and monitor UTM and referral links",
    },
    {
      icon: <FiBarChart2 />,
      title: "Analyze post-event feedback from attendees",
    },
    {
      icon: <FiShoppingCart />,
      title: "Use abandoned cart data to capture leads",
    },
  ];

  const paymentItems = [
    {
      icon: <FiArrowUpRight />,
      title: "Transaction Monitoring",
      desc: "Track every payment and payout in real time",
    },
    {
      icon: <FiCreditCard />,
      title: "Payment Options",
      desc: "Multiple payment methods so attendees can pay their way",
    },
    {
      icon: <FiDollarSign />,
      title: "Financial Dashboard",
      desc: "One clear overview for accountability and transparency",
    },
    {
      icon: <FiShield />,
      title: "Secure Transactions",
      desc: "Enterprise-grade security for every transaction",
    },
  ];

  return (
    <div className="min-h-screen text-zinc-200">
      <section className="relative pt-48  pb-20 overflow-hidden">
        <div className="absolute -top-32 left-[-10%] w-130 h-130 bg-amber-400/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 right-[-10%] w-130 h-130 bg-indigo-500/10 rounded-full blur-[140px]" />
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl text-white tracking-tight mb-6">
              Crafted for bold explorers
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl">
              NEXTDHAKA is Bangladesh's premium platform for discovering and
              booking elite events. We connect audiences with verified hosts,
              secure ticketing, and curated experiences across the country.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-custom">
          <div className="bg-white/5 border border-white/10 rounded-4xl p-10 md:p-14 card-glow">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-4">
              Introduction
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              What is NEXTDHAKA?
            </h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-4xl">
              NEXTDHAKA is a Bangladesh-first event platform that lets people
              discover, book, and manage tickets in one place. Event organizers
              can publish events and ticket types, while users browse by
              category, secure seats instantly, and access digital passes on
              their phones.
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
            <p className="text-zinc-400 text-lg font-medium">
              Simple. Secure. Built for modern explorers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                {...fadeInUp}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-4xl p-10 card-glow"
              >
                <div className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                  0{i + 1}
                </div>
                <div
                  className={`${step.color} w-20 h-20 rounded-[1.75rem] flex items-center justify-center text-white text-3xl shadow-2xl mb-8`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-4 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,92,72,0.09),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_34%)]" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-5">
              Know how you're <span className="text-primary">performing</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl font-medium">
              Live sales, revenue, and behavior. One dashboard so you can act on
              the numbers.
            </p>
          </div>

          <div>
            <div className="mb-6 text-left">
              <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">
                What you can track
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {analyticsItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  {...fadeInUp}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-3xl border border-white/10 bg-white/3 p-5 card-glow flex items-center gap-4"
                >
                  <div className="shrink-0 h-12 w-12 rounded-2xl bg-primary/15 border border-primary/20 text-primary grid place-items-center text-xl">
                    {item.icon}
                  </div>
                  <p className="text-lg md:text-xl font-medium leading-snug text-zinc-100">
                    {item.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,92,72,0.08),transparent_38%),radial-gradient(circle_at_top_right,rgba(255,92,72,0.04),transparent_30%)]" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-5">
              Payments and <span className="text-primary">payouts</span>, clear
              and secure
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-3xl mx-auto">
              Track every transaction, support multiple payment methods, and
              keep one clear financial view.
            </p>
          </div>
  
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            {paymentItems.map((item, index) => (
              <motion.div
                key={item.title}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="rounded-[1.65rem] border border-white/10 bg-white/3 p-6 md:p-7 card-glow min-h-56 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl border border-primary/20 bg-primary/12 text-primary grid place-items-center text-2xl">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
