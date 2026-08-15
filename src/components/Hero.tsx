import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Instagram, Twitter, Download, Sparkles, MousePointer2 } from 'lucide-react';
import mainImg from '@/assets/hero.jpeg';
import { API_URL } from '../config';
import { fetchWithCache } from '../lib/cache';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    greeting: "I'M",
    name: "RAKSHAK",
    subtitle: "Full-Stack Developer specializing in AI, scalable systems, and modern web applications.",
    description: "Engineering high-performance digital architectures where logic meets aesthetics. Specializing in scalable full-stack ecosystems.",
    resumeLink: "https://drive.google.com/file/d/18c-63HXD1zYQ7wdPW5LrmUAqtdhCqF6z/view?usp=sharing",
    githubLink: "https://github.com/rakshak2005",
    linkedinLink: "https://www.linkedin.com/in/rakshak-patel-v-12b2b624a",
    instagramLink: "https://www.instagram.com/rakshak_2005",
    openForProjects: true
  });
  const [displayText, setDisplayText] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHoveredImg, setIsHoveredImg] = useState(false);
  const targetText = heroData.subtitle;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%&#$@";

  useEffect(() => {
    fetchWithCache(
      `${API_URL}/api/hero`,
      (data) => {
        if (data) setHeroData(data);
      },
      heroData
    );
  }, []);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev =>
        targetText.split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) return targetText[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) clearInterval(interval);
      iteration += 1;
    }, 30);
    return () => clearInterval(interval);
  }, [targetText]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 18, y: -y * 18 }); // Slightly increased tilt for response
    setIsHoveredImg(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHoveredImg(false);
  };

  return (
    <section id="home" className="relative min-h-screen lg:h-screen flex items-start lg:items-center justify-center bg-[#050208] overflow-hidden px-6 pt-32 sm:pt-36 lg:pt-16 pb-12">

      {/* Background glow layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[40%] rounded-full bg-[#d946ef]/12 blur-[130px] animate-pulse" />
        <div className="absolute top-[20%] left-[10%] w-[35%] h-[35%] rounded-full bg-[#d946ef]/5 blur-[120px]" /> {/* Faint glow behind text on left */}
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] rounded-full bg-[#8b1ff5]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Rebalanced grid system (7-5) with left padding to push the text column right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

          {/* Left Content column */}
          <div className="lg:col-span-7 text-center lg:text-left items-center lg:items-start order-2 lg:order-1 flex flex-col justify-center lg:pl-12 xl:pl-24">
            {heroData.openForProjects && (
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 lg:mb-5 self-center lg:self-start rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <span className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em]">Open for new projects</span>
              </div>
            )}

            <h1 className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-4">
              {heroData.greeting} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#8b1ff5]">{heroData.name}</span>
            </h1>

            <h2 className="text-base md:text-xl lg:text-lg xl:text-xl font-mono text-slate-300 min-h-[1.5em] mb-4">
              {displayText}
            </h2>

            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed font-light mb-4">
              {heroData.description}
            </p>

            {/* Micro branding tagline */}
            <div className="text-[9px] font-mono text-[#d946ef] uppercase tracking-[0.25em] mb-6">
              Passionate about AI • Full-Stack Development • Problem Solving
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
              {heroData.resumeLink && (
                <a
                  href={heroData.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-6 py-4 overflow-hidden rounded-full bg-white text-black font-black uppercase tracking-widest text-[10px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                >
                  <div className="absolute inset-0 bg-[#d946ef] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-1.5 group-hover:text-white">
                    Download Resume <Download size={14} className="group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </a>
              )}

              <div className="flex items-center gap-3">
                {[
                  { icon: <Linkedin size={20} />, link: heroData.linkedinLink },
                  { icon: <Github size={20} />, link: heroData.githubLink },
                  { icon: <Instagram size={20} />, link: heroData.instagramLink }
                ].filter(social => social.link).map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    className="p-3.5 rounded-full border border-white/5 bg-white/[0.02] text-white/40 hover:text-[#d946ef] hover:border-[#d946ef]/30 hover:bg-[#d946ef]/5 transition-all duration-500 hover:-translate-y-0.5"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Structured Border-y Stats Panel - Perfectly Aligned to Left Baseline */}
            <div className="py-5 border-y border-white/5 w-full max-w-lg mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 sm:gap-2 divide-y-0 divide-x-0 sm:divide-x divide-white/10">
                {[
                  { number: "30+", label: "Repositories" },
                  { number: "12+", label: "Projects" },
                  { number: "8.5", label: "CGPA" },
                  { number: "3+", label: "Internships" }
                ].map((stat, idx) => (
                  <div key={idx} className={`flex flex-col items-center sm:items-start ${idx > 0 ? 'sm:pl-5' : 'pl-0'} ${idx % 2 === 1 ? 'pl-4 border-l border-white/10 sm:border-l-0' : 'pl-0'}`}>
                    <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#8b1ff5] leading-none">
                      {stat.number}
                    </div>
                    <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400 mt-1.5 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image column */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center items-center">
            {/* Inline stylesheet for premium keyframe animations */}
            <style>{`
              @keyframes tilt3D {
                0%, 100% {
                  transform: perspective(1000px) rotateX(6deg) rotateY(-8deg) translateY(0px);
                }
                33% {
                  transform: perspective(1000px) rotateX(-6deg) rotateY(-5deg) translateY(-10px);
                }
                66% {
                  transform: perspective(1000px) rotateX(-3deg) rotateY(8deg) translateY(-5px);
                }
              }
              @keyframes badgeFloat1 {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(-6px) translateX(3px); }
              }
              @keyframes badgeFloat2 {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(6px) translateX(-3px); }
              }
              @keyframes borderRotate {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
              }
              @keyframes kenBurns {
                0%, 100% { transform: scale(1.03) translate(0, 0); }
                50% { transform: scale(1.09) translate(-1%, -1.5%); }
              }
              
              .animate-3d-tilt {
                animation: tilt3D 7s ease-in-out infinite;
              }
              .animate-badge-float1 {
                animation: badgeFloat1 4.5s ease-in-out infinite;
              }
              .animate-badge-float2 {
                animation: badgeFloat2 5.5s ease-in-out infinite;
              }
              .animate-ken-burns {
                animation: kenBurns 16s ease-in-out infinite;
              }
              
              /* Spinning colorful gradient background behind the image to create a rotating border */
              .rotating-border-bg {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 150%;
                height: 150%;
                background: conic-gradient(from 0deg, #d946ef, #8b1ff5, #3b82f6, #d946ef);
                animation: borderRotate 8s linear infinite;
              }
            `}</style>

            {/* 3D tilt/wobble card */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`relative group scale-90 sm:scale-95 lg:scale-95 xl:scale-100 cursor-pointer ${!isHoveredImg ? 'animate-3d-tilt' : ''}`}
              style={isHoveredImg ? {
                transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                transition: 'transform 0.15s ease-out'
              } : undefined}
            >
              {/* Soft glowing blob behind image */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#d946ef]/25 to-[#8b1ff5]/25 rounded-[2.5rem] blur-2xl group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none" />

              {/* Advanced Rotating Gradient Border Container */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden p-[1.5px] pointer-events-none">
                <div className="rotating-border-bg" />
                <div className="absolute inset-0 bg-[#050208] rounded-[2.5rem]" />
              </div>

              {/* Symmetrical Sized Floating Experience Badge - Parallax float */}
              <div className="absolute -bottom-6 -left-6 p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 z-20 hidden md:block shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:border-[#d946ef]/30 transition-all duration-500 pointer-events-none animate-badge-float1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#d946ef]/10 rounded-lg text-[#d946ef]">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-white uppercase tracking-wider">Industry Dev</p>
                    <p className="text-slate-400 text-[7px] font-mono mt-0.5">2+ Projects</p>
                  </div>
                </div>
              </div>

              {/* Symmetrical Sized Floating Code Badge - Parallax float */}
              <div className="absolute -top-6 -right-6 p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 z-20 hidden md:block shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:border-[#8b1ff5]/30 transition-all duration-500 pointer-events-none animate-badge-float2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#8b1ff5]/10 rounded-lg text-[#8b1ff5]">
                    <MousePointer2 size={12} className="rotate-90 text-[#8b1ff5]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-white uppercase tracking-wider">Open Source</p>
                    <p className="text-slate-400 text-[7px] font-mono mt-0.5">15+ Repos</p>
                  </div>
                </div>
              </div>

              {/* Profile Image Container with inner Ken Burns Zoom/Pan Animation */}
              <div className="relative w-64 h-64 sm:w-[320px] sm:h-[400px] lg:w-[310px] lg:h-[410px] xl:w-[340px] xl:h-[440px] rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(217,70,239,0.12)] bg-[#050208] border border-white/10">
                <img
                  src={mainImg}
                  alt="Rakshak"
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 animate-ken-burns"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050208] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Bouncing Scroll Indicator Mouse Icon */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30 hidden lg:flex pointer-events-none">
        <div className="w-5 h-8 rounded-full border border-white/30 p-1 flex justify-center">
          <div className="w-1 h-1.5 rounded-full bg-[#d946ef] animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;