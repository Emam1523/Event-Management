import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const Footer = () => {
  const socialLinks = [
    { Icon: FiFacebook, url: 'https://www.facebook.com/emam.hassan.7330763', label: 'Facebook' },
    { Icon: FiInstagram, url: 'https://www.instagram.com/emam_hassan1523/', label: 'Instagram' },
    { Icon: FaWhatsapp, url: 'https://wa.me/8801307947274', label: 'WhatsApp' },
    { Icon: FiLinkedin, url: 'https://www.linkedin.com/in/emam-hassan-6131592a5/', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-[#09090b] text-white mt-20 pt-20 pb-12 overflow-hidden relative border-t border-zinc-800/50">
      {/* Subtle Glows */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
      
      <div className="container-custom relative z-10 max-w-7xl mx-auto px-6">
        {/* Brand Block - Centered */}
        <div className="flex flex-col items-center text-center mb-14">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-orange/20">
              <HiSparkles />
            </div>
            <span className="text-xl font-bold tracking-tighter">AuraPass</span>
          </Link>
          <p className="text-zinc-400 font-medium mb-8 leading-relaxed text-lg max-w-2xl">
            The world's premier platform for discovering and booking elite experiences. Access exclusive credentials, manage tickets, and experience the future of ticketing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em]">
              Bangladesh Only
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
              Verified Entries
            </div>
          </div>
        </div>

        {/* Support Links */}
        <div className="flex flex-col items-center gap-4 pb-10 border-b border-zinc-900">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">Support</div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-zinc-500 font-semibold text-sm">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 flex flex-col items-center gap-4">
          <p className="text-zinc-600 text-[11px] font-black tracking-widest uppercase">
            © 2026 AuraPass. CRAFTED FOR THE BOLD.
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
