import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { Icon: FiFacebook, url: 'https://www.facebook.com/emam.hassan.7330763', label: 'Facebook' },
    { Icon: FiInstagram, url: 'https://www.instagram.com/emam_hassan1523/', label: 'Instagram' },
    { Icon: FaWhatsapp, url: 'https://wa.me/8801307947274', label: 'WhatsApp' },
  ];

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#09090b] text-white mt-0 pt-12 pb-8 overflow-hidden relative border-t border-zinc-800/50">
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
      
      <div className="container-custom relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-4 pb-6 border-b border-zinc-900">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">Support</div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-zinc-500 font-semibold text-sm">
            <Link to="/about" onClick={scrollToTop} className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" onClick={scrollToTop} className="hover:text-white transition-colors">Contact</Link>
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col items-center gap-4">
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
