import React, { useEffect, useRef } from 'react';
import { 
  Code2, Server, Smartphone, GitBranch, Zap,
  Layers, Database, Cpu, Globe, Terminal, Box, SmartphoneNfc
} from 'lucide-react';

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('translate-y-0', 'opacity-100', 'scale-100');
            entry.target.classList.remove('opacity-0', 'scale-95', 'translate-y-[-100px]');
          } else {
            entry.target.classList.remove('translate-y-0', 'opacity-100', 'scale-100');
            entry.target.classList.add('opacity-0', 'scale-95', 'translate-y-[-100px]');
          }
        });
      },
      { threshold: 0.1 } 
    );

    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.skill-item');
      items.forEach((item) => observer.observe(item));
    }

    return () => observer.disconnect();
  }, []);

  const stack = [
    { 
      title: "Frontend", 
      icon: <Layers className="text-[#d946ef]" size={28} />, 
      skills: [
        { name: "Next.js", icon: <Globe size={14} /> },
        { name: "React", icon: <Cpu size={14} /> },
        { name: "TypeScript", icon: <Code2 size={14} /> },
        { name: "Tailwind", icon: <Layers size={14} /> },
        { name: "HTML5/CSS3", icon: <Terminal size={14} /> },
        { name: "EJS", icon: <Code2 size={14} /> }
      ], 
      side: "left" 
    },
    { 
      title: "Backend", 
      icon: <Database className="text-[#8b1ff5]" size={28} />, 
      skills: [
        { name: "Node.js", icon: <Server size={14} /> },
        { name: "Express", icon: <Zap size={14} /> },
        { name: "MongoDB", icon: <Database size={14} /> },
        { name: "Mongoose", icon: <Box size={14} /> },
        { name: "Multer", icon: <Terminal size={14} /> },
        { name: "Firebase", icon: <Globe size={14} /> },
        { name: "MySQL", icon: <Database size={14} /> },
        { name: "JWT", icon: <Terminal size={14} /> }
      ], 
      side: "right" 
    },
    { 
      title: "App Dev", 
      icon: <SmartphoneNfc className="text-[#d946ef]" size={28} />, 
      skills: [
        { name: "Flutter", icon: <Smartphone size={14} /> },
        { name: "Dart", icon: <Code2 size={14} /> },
        { name: "Android", icon: <Smartphone size={14} /> },
        { name: "iOS", icon: <Smartphone size={14} /> }
      ], 
      side: "left" 
    },
    { 
      title: "Tools & Cloud", 
      icon: <GitBranch className="text-[#8b1ff5]" size={28} />, 
      skills: [
        { name: "Git/GitHub", icon: <GitBranch size={14} /> },
        { name: "Vercel", icon: <Globe size={14} /> },
        { name: "Netlify", icon: <Globe size={14} /> },
        { name: "Figma", icon: <Layers size={14} /> },
        { name: "Canva", icon: <Layers size={14} /> },
        { name: "Power BI", icon: <Database size={14} /> }
      ], 
      side: "right" 
    }
  ];

  const outlineStyle = {
    color: 'transparent',
    WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)'
  };

  return (
    <section id="skills" className="py-24 bg-[#050208] text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6" ref={containerRef}>
        
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-[#d946ef] fill-[#d946ef]" size={16} />
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-slate-500">Professional Toolkit</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-center italic">
            EXPERT<span style={outlineStyle}>ISE</span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#d946ef]/50 via-white/10 to-transparent hidden md:block -translate-x-1/2" />

          <div className="space-y-10 md:space-y-6">
            {stack.map((item, i) => (
              <div 
                key={item.title} 
                data-side={item.side}
                style={{ 
                  transitionDuration: '3000ms', 
                  transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
                  transitionDelay: `${i * 150}ms`
                }}
                className={`skill-item flex flex-col md:flex-row items-center justify-between w-full opacity-0 scale-95 translate-y-[-100px] transition-all md:min-h-[160px]
                  ${item.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}
                `}
              >
                <div className={`w-full md:w-[44%] p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col ${item.side === 'left' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                  <div className={`flex items-center gap-4 mb-4 ${item.side === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="p-3 bg-[#d946ef]/10 rounded-2xl border border-[#d946ef]/20">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">{item.title}</h3>
                  </div>
                  
                  <div className={`flex flex-wrap gap-2 ${item.side === 'left' ? 'justify-end' : 'justify-start'}`}>
                    {item.skills.map(s => (
                      <span key={s.name} className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border border-white/10 rounded-xl bg-black/40 hover:border-[#d946ef]/50 hover:bg-[#d946ef]/5 transition-all group">
                        <span className="text-[#d946ef] opacity-50 group-hover:opacity-100">{s.icon}</span>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:flex w-[12%] justify-center relative z-10">
                  <div className="h-8 w-8 rounded-full bg-[#050208] border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.1)]">
                    <div className="h-2 w-2 rounded-full bg-[#d946ef] animate-pulse" />
                  </div>
                </div>

                <div className="hidden md:block w-[44%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;