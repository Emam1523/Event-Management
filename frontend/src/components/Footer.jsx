import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import LogoImg from "../assets/logosm.png";

const Footer = () => {
  const socialLinks = [
    {
      Icon: FiFacebook,
      url: "#",
      label: "Facebook",
    },
    {
      Icon: FiInstagram,
      url: "https://www.instagram.com/p/DaXsNoQnyuY/",
      label: "Instagram",
    },
    { Icon: FaWhatsapp, url: "https://wa.me/8801318672928", label: "WhatsApp" },
  ];

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-dark-card text-white pt-12 pb-8 overflow-hidden relative border-t border-zinc-800/50">
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-brand-orange/50 to-transparent" />

      <div className="container-custom relative z-10 mx-auto px-10">
        {/* Logo Section */}
        <div className="group flex items-center gap-4 pb-10">
          <div className="flex items-center justify-center overflow-hidden shadow-2xl shadow-brand-orange/40 group-hover:rotate-360 ease-out transition-all duration-700 delay-200">
            <img
              src={LogoImg}
              alt="NextDHAKA LOGO"
              className="w-7 h-7 object-contain rounded-lg bg-brand-orange"
              width={32}
              height={32}
            />
          </div>
          <span className="text-sm md:text-lg xl:text-2xl font-black text-white tracking-widest">
            NEXT<span className="text-brand-orange font-mono">DHAKA</span>
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-y-10 justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex flex-col gap-2 text-zinc-500 font-semibold text-sm">
            <Link
              to="/about"
              onClick={scrollToTop}
              className="hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={scrollToTop}
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/terms-and-conditions"
              onClick={scrollToTop}
              className="hover:text-white transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/privacy-policy"
              onClick={scrollToTop}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/refund-return-policy"
              onClick={scrollToTop}
              className="hover:text-white transition-colors"
            >
              Refund Return Policy
            </Link>
          </div>

          {/* organization information */}
          <div title="Company Information" className="lg:text-right">
            <p className="mb-4 text-primary font-black text-xl decoration-brand-primary/60 underline underline-offset-2">
              Organizatation Informations
            </p>
            <div className="space-y-2 text-sm">
              <section className="grid grid-cols-1">
                <p className="text-zinc-500 font-bold">Trade License No</p>
                <p className="text-primary">TRAD/DNCC/049809/2025</p>
              </section>
              <section className="grid grid-cols-1">
                <p className="text-zinc-500 font-bold">E-TIN Number</p>
                <p className="text-primary">421274290182</p>
              </section>
            </div>
            {/* address */}
            <div className="mt-10">
              <p className="text-primary font-bold flex gap-2 items-center lg:justify-end-safe">
                <MdLocationPin size={20} /> Address
              </p>
              <p className="text-sm font-bold text-zinc-400 group-hover:text-amber-500 transition-colors">
                <span>Plot-11.Section-10,Main road -1,</span>
                <br />
                <span>Senpara Parbata,Mirpur-10,Dhaka-1216</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col items-center gap-4">
          <p className="text-zinc-300/60 text-[11px] font-black tracking-widest uppercase">
            &copy; {new Date().getFullYear().toString()} NEXTDHAKA. YOUR GATEWAY
            TO THE CITY.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <social.Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
