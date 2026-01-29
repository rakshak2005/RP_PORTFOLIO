import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050208] pt-24 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="mb-12 group cursor-pointer" onClick={scrollToTop}>
          <div className="relative p-4 rounded-full border border-white/5 bg-white/[0.02] transition-all duration-500 group-hover:border-[#d946ef]/50 group-hover:bg-[#d946ef]/5">
            <ArrowUp className="text-slate-400 group-hover:text-[#d946ef] group-hover:-translate-y-1 transition-all" size={24} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#d946ef] mb-6">
          <Sparkles size={16} />
          <span className="uppercase tracking-[0.4em] text-[10px] font-bold">Stay Inspired</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-8">
          DESIGNED FOR <br /> <span className="text-[#d946ef]">EXCELLENCE</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4 text-slate-500 text-[11px] font-medium uppercase tracking-widest border-t border-white/5 pt-12 w-full justify-between">
          <p>© {currentYear} Rakshak Patel V</p>
          
          <div className="flex items-center gap-2">
             
          </div>

          <div className="flex gap-8">
            <a href="https://github.com/rakshak2005" target="_blank" className="hover:text-white transition-colors">Github</a>
            <a href="https://www.linkedin.com/in/rakshak-patel-v-12b2b624a" target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-[#d946ef]/5 blur-[120px] rounded-full pointer-events-none" />
    </footer>
  );
};

export default Footer;