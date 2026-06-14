import React, { useEffect, useRef, useState } from 'react';
import * as Lucide from 'lucide-react';
import { API_URL } from '../config';

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const staticStack = [
    { 
      title: "Frontend", 
      icon: <Lucide.Layers className="text-[#d946ef]" size={28} />, 
      skills: [
        { name: "Next.js", icon: <Lucide.Globe size={14} /> },
        { name: "React", icon: <Lucide.Cpu size={14} /> },
        { name: "TypeScript", icon: <Lucide.Code2 size={14} /> },
        { name: "Tailwind", icon: <Lucide.Layers size={14} /> },
        { name: "HTML5/CSS3", icon: <Lucide.Terminal size={14} /> },
        { name: "EJS", icon: <Lucide.Code2 size={14} /> }
      ], 
      side: "left" 
    },
    { 
      title: "Backend", 
      icon: <Lucide.Database className="text-[#8b1ff5]" size={28} />, 
      skills: [
        { name: "Node.js", icon: <Lucide.Server size={14} /> },
        { name: "Express", icon: <Lucide.Zap size={14} /> },
        { name: "MongoDB", icon: <Lucide.Database size={14} /> },
        { name: "Mongoose", icon: <Lucide.Box size={14} /> },
        { name: "Multer", icon: <Lucide.Terminal size={14} /> },
        { name: "Firebase", icon: <Lucide.Globe size={14} /> },
        { name: "MySQL", icon: <Lucide.Database size={14} /> },
        { name: "JWT", icon: <Lucide.Terminal size={14} /> }
      ], 
      side: "right" 
    },
    { 
      title: "App Dev", 
      icon: <Lucide.SmartphoneNfc className="text-[#d946ef]" size={28} />, 
      skills: [
        { name: "Flutter", icon: <Lucide.Smartphone size={14} /> },
        { name: "Dart", icon: <Lucide.Code2 size={14} /> },
        { name: "Android", icon: <Lucide.Smartphone size={14} /> },
        { name: "iOS", icon: <Lucide.Smartphone size={14} /> }
      ], 
      side: "left" 
    },
    { 
      title: "Tools & Cloud", 
      icon: <Lucide.GitBranch className="text-[#8b1ff5]" size={28} />, 
      skills: [
        { name: "Git/GitHub", icon: <Lucide.GitBranch size={14} /> },
        { name: "Vercel", icon: <Lucide.Globe size={14} /> },
        { name: "Netlify", icon: <Lucide.Globe size={14} /> },
        { name: "Figma", icon: <Lucide.Layers size={14} /> },
        { name: "Canva", icon: <Lucide.Layers size={14} /> },
        { name: "Power BI", icon: <Lucide.Database size={14} /> }
      ], 
      side: "right" 
    }
  ];

  const [stack, setStack] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/skills`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) {
          setStack(data);
        } else {
          setStack(staticStack);
        }
      })
      .catch(() => {
        setStack(staticStack);
      });
  }, []);

  const renderLucideIcon = (name: string, size = 14, className = "") => {
    const IconComponent = (Lucide as any)[name];
    if (IconComponent) {
      return <IconComponent size={size} className={className} />;
    }
    return <Lucide.Code2 size={size} className={className} />;
  };

  const getCategoryIcon = (item: any) => {
    if (React.isValidElement(item.icon)) return item.icon;
    const colorClass = item.title === 'Backend' || item.title === 'Tools & Cloud' ? 'text-[#8b1ff5]' : 'text-[#d946ef]';
    return renderLucideIcon(item.icon, 28, colorClass);
  };

  const getSkillIcon = (s: any) => {
    if (React.isValidElement(s.icon)) return s.icon;
    return renderLucideIcon(s.icon, 14);
  };

  useEffect(() => {
    if (stack.length === 0) return;
    
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
  }, [stack]);

  const outlineStyle = {
    color: 'transparent',
    WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)'
  };

  return (
    <section id="skills" className="py-24 bg-[#050208] text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6" ref={containerRef}>
        
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Lucide.Zap className="text-[#d946ef] fill-[#d946ef]" size={16} />
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
                key={item.title || i} 
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
                      {getCategoryIcon(item)}
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">{item.title}</h3>
                  </div>
                  
                  <div className={`flex flex-wrap gap-2 ${item.side === 'left' ? 'justify-end' : 'justify-start'}`}>
                    {item.skills?.map((s: any, idx: number) => (
                      <span key={s.name || idx} className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border border-white/10 rounded-xl bg-black/40 hover:border-[#d946ef]/50 hover:bg-[#d946ef]/5 transition-all group">
                        <span className="text-[#d946ef] opacity-50 group-hover:opacity-100">{getSkillIcon(s)}</span>
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