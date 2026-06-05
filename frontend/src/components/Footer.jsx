import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter, FiArrowRight, FiGlobe } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const Footer = () => {
  return (
    <footer className="bg-[#09090b] text-white mt-20 pt-20 pb-12 overflow-hidden relative border-t border-zinc-800/50">
      {/* Subtle Glows */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
      
      <div className="container-custom relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 mb-14">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-orange/20">
                <HiSparkles />
              </div>
              <span className="text-xl font-bold tracking-tighter">AuraPass</span>
            </Link>
            <p className="text-zinc-400 font-medium mb-8 leading-relaxed text-lg max-w-2xl">
              The world's premier platform for discovering and booking elite events. Experience the future of ticketing with AuraPass.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em]">
                Bangladesh Only
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
                Verified Events
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-amber-400/30 via-rose-500/30 to-indigo-500/30 blur-xl opacity-70" />
            <div className="relative bg-zinc-950/70 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-6">Newsletter</h3>
              <p className="text-zinc-400 font-medium mb-6 text-sm">
                Get notified about the biggest events in Bangladesh.
              </p>
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl px-5 py-3.5 text-sm font-bold text-white outline-none focus:border-brand-orange/50 transition-all"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-orange text-white px-3.5 rounded-xl hover:bg-brand-orange/90 transition-colors">
                  <FiArrowRight />
                </button>
              </form>
              <div className="mt-8 flex items-center gap-2 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <FiGlobe className="text-brand-orange" />
                BANGLADESH NETWORK
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pb-10 border-b border-zinc-900">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">Support</div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-zinc-500 font-semibold text-sm">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

        <div className="pt-10 flex flex-col items-center gap-4">
          <p className="text-zinc-600 text-[11px] font-black tracking-widest uppercase">
            © 2026 AuraPass. CRAFTED FOR THE BOLD.
          </p>
          <div className="flex gap-4">
            {[FiFacebook, FiInstagram, FiTwitter, FiLinkedin].map((Icon, i) => (
              <a 
                key={i}
                href="#" 
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
