import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Instagram, Twitter, Download, Sparkles, MousePointer2 } from 'lucide-react';
import mainImg from '@/assets/hero.jpeg';

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const targetText = "Full-stack Web and App Developer.";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%&#$@";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        targetText.split("")
          .map((letter, index) => {
            if (index < iteration) return targetText[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) clearInterval(interval);
      iteration += 1 / 3; 
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-[#050208] overflow-hidden px-6 pt-32 pb-20">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#d946ef]/15 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] rounded-full bg-[#8b1ff5]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">Open for new projects</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6">
              I&apos;M <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#8b1ff5]">RAKSHAK</span>
            </h1>

            <h2 className="text-xl md:text-3xl font-mono text-slate-300 min-h-[1.5em] mb-8">
              {displayText}
            </h2>

            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-light mb-12">
              Engineering high-performance digital architectures where 
              <span className="text-white font-medium"> logic meets aesthetics.</span> Specializing in scalable full-stack ecosystems.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <a
                href="https://drive.google.com/file/d/18c-63HXD1zYQ7wdPW5LrmUAqtdhCqF6z/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-5 overflow-hidden rounded-full bg-white text-black font-black uppercase tracking-widest text-xs transition-all duration-500"
              >
                <div className="absolute inset-0 bg-[#d946ef] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white">
                  Download Resume <Download size={16} />
                </span>
              </a>

              <div className="flex items-center gap-4">
                {[
                  { icon: <Linkedin size={20} />, link: "https://www.linkedin.com/in/rakshak-patel-v-12b2b624a" },
                  { icon: <Github size={20} />, link: "https://github.com/rakshak2005" },
                  { icon: <Instagram size={20} />, link: "https://www.instagram.com/rakshak_2005" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    className="p-4 rounded-full border border-white/5 bg-white/[0.02] text-white/40 hover:text-[#d946ef] hover:border-[#d946ef]/30 hover:bg-[#d946ef]/5 transition-all duration-500"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div className="relative group">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#d946ef]/20 rounded-full blur-2xl animate-bounce" />
              <div className="absolute -bottom-8 -left-8 p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 z-20 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d946ef]/20 rounded-lg text-[#d946ef]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Experience</p>
                    <p className="text-white/60 text-[9px]">UI/UX & Full Stack</p>
                  </div>
                </div>
              </div>

              <div className="relative w-72 h-72 md:w-[400px] md:h-[500px] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(217,70,239,0.1)]">
                <img 
                  src={mainImg} 
                  alt="Rakshak" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050208] via-transparent to-transparent opacity-60" />
              </div>

              <div className="absolute top-1/2 -right-12 -translate-y-1/2 rotate-90 hidden md:block">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 whitespace-nowrap border-b border-white/10 pb-2">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#d946ef] to-transparent" />
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white rotate-90 mt-4">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;