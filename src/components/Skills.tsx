import React, { useEffect, useRef, useState } from 'react';
import * as Lucide from 'lucide-react';
import { API_URL } from '../config';
import { fetchWithCache } from '../lib/cache';

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const staticStack = [
    {
      title: "Experience",
      icon: <Lucide.Award className="text-[#8b1ff5]" size={22} />,
      skills: [
        { name: "React", rating: 4, icon: <Lucide.Cpu size={12} /> },
        { name: "Next.js", rating: 4, icon: <Lucide.Globe size={12} /> },
        { name: "Node", rating: 5, icon: <Lucide.Server size={12} /> },
        { name: "Mongo", rating: 5, icon: <Lucide.Database size={12} /> },
        { name: "Flutter", rating: 4, icon: <Lucide.Smartphone size={12} /> }
      ],
      side: "left"
    },
    {
      title: "Frontend",
      icon: <Lucide.Layers className="text-[#d946ef]" size={22} />,
      skills: [
        { name: "Next.js", icon: <Lucide.Globe size={12} /> },
        { name: "React", icon: <Lucide.Cpu size={12} /> },
        { name: "TypeScript", icon: <Lucide.Code2 size={12} /> },
        { name: "Tailwind", icon: <Lucide.Layers size={12} /> },
        { name: "HTML5/CSS3", icon: <Lucide.Terminal size={12} /> },
        { name: "EJS", icon: <Lucide.Code2 size={12} /> }
      ],
      side: "right"
    },
    {
      title: "Backend",
      icon: <Lucide.Database className="text-[#8b1ff5]" size={22} />,
      skills: [
        { name: "Node.js", icon: <Lucide.Server size={12} /> },
        { name: "Express", icon: <Lucide.Zap size={12} /> },
        { name: "MongoDB", icon: <Lucide.Database size={12} /> },
        { name: "Mongoose", icon: <Lucide.Box size={12} /> },
        { name: "Multer", icon: <Lucide.Terminal size={12} /> },
        { name: "Firebase", icon: <Lucide.Globe size={12} /> },
        { name: "MySQL", icon: <Lucide.Database size={12} /> },
        { name: "JWT", icon: <Lucide.Terminal size={12} /> }
      ],
      side: "left"
    },
    {
      title: "App Dev",
      icon: <Lucide.SmartphoneNfc className="text-[#d946ef]" size={22} />,
      skills: [
        { name: "Flutter", icon: <Lucide.Smartphone size={12} /> },
        { name: "Dart", icon: <Lucide.Code2 size={12} /> },
        { name: "Android", icon: <Lucide.Smartphone size={12} /> },
        { name: "iOS", icon: <Lucide.Smartphone size={12} /> }
      ],
      side: "right"
    },
    {
      title: "Tools & Cloud",
      icon: <Lucide.GitBranch className="text-[#8b1ff5]" size={22} />,
      skills: [
        { name: "Git/GitHub", icon: <Lucide.GitBranch size={12} /> },
        { name: "Vercel", icon: <Lucide.Globe size={12} /> },
        { name: "Netlify", icon: <Lucide.Globe size={12} /> },
        { name: "Figma", icon: <Lucide.Layers size={12} /> },
        { name: "Canva", icon: <Lucide.Layers size={12} /> },
        { name: "Power BI", icon: <Lucide.Database size={12} /> }
      ],
      side: "left"
    },
    {
      title: "Design & UI/UX",
      icon: <Lucide.Paintbrush className="text-[#d946ef]" size={22} />,
      skills: [
        { name: "Figma", rating: 4, icon: <Lucide.Layers size={12} /> },
        { name: "Canva", rating: 4, icon: <Lucide.Layers size={12} /> },
        { name: "Wireframing", rating: 4, icon: <Lucide.Cpu size={12} /> },
        { name: "UI/UX Design", rating: 5, icon: <Lucide.Globe size={12} /> },
        { name: "Design Systems", rating: 4, icon: <Lucide.Layers size={12} /> }
      ],
      side: "right"
    }
  ];

  const [stack, setStack] = useState<any[]>([]);

  useEffect(() => {
    fetchWithCache(
      `${API_URL}/api/skills`,
      (data) => {
        if (data && data.length > 0) {
          const merged = [...data];
          staticStack.forEach(staticItem => {
            if (!merged.some(item => item.title?.toLowerCase() === staticItem.title?.toLowerCase())) {
              merged.push(staticItem);
            }
          });
          setStack(merged);
        } else {
          setStack(staticStack);
        }
      },
      staticStack,
      (data) => Array.isArray(data) && data.length > 0
    );
  }, []);

  const renderLucideIcon = (name: string, size = 12, className = "") => {
    const IconComponent = (Lucide as any)[name];
    if (IconComponent) {
      return <IconComponent size={size} className={className} />;
    }
    return <Lucide.Code2 size={size} className={className} />;
  };

  const getCategoryIcon = (item: any) => {
    if (React.isValidElement(item.icon)) return item.icon;
    const colorClass = item.title === 'Backend' || item.title === 'Tools & Cloud' ? 'text-[#8b1ff5]' : 'text-[#d946ef]';
    return renderLucideIcon(item.icon, 22, colorClass);
  };

  const getSkillIcon = (s: any) => {
    if (React.isValidElement(s.icon)) return s.icon;
    return renderLucideIcon(s.icon, 12);
  };

  useEffect(() => {
    if (stack.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('translate-y-0', 'opacity-100', 'scale-100');
            entry.target.classList.remove('opacity-0', 'scale-95', 'translate-y-[-50px]');
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.skill-item');
      items.forEach((item) => observer.observe(item));
    }

    return () => observer.disconnect();
  }, [stack]);

  const getTheme = (title: string) => {
    if (title === 'Backend' || title === 'Tools & Cloud' || title === 'Experience') {
      return {
        bgGlow: 'from-[#8b1ff5]/10',
        borderHover: 'hover:border-[#8b1ff5]/30',
        shadowHover: 'hover:shadow-[0_15px_30px_rgba(139,31,245,0.06)]',
        badgeBg: 'bg-[#8b1ff5]/10',
        badgeBorder: 'border-[#8b1ff5]/20',
        textColor: 'group-hover:text-[#8b1ff5]',
        iconColorClass: 'text-[#8b1ff5]'
      };
    }
    return {
      bgGlow: 'from-[#d946ef]/10',
      borderHover: 'hover:border-[#d946ef]/30',
      shadowHover: 'hover:shadow-[0_15px_30px_rgba(217,70,239,0.06)]',
      badgeBg: 'bg-[#d946ef]/10',
      badgeBorder: 'border-[#d946ef]/20',
      textColor: 'group-hover:text-[#d946ef]',
      iconColorClass: 'text-[#d946ef]'
    };
  };

  const outlineStyle = {
    color: 'transparent',
    WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)'
  };

  return (
    <section id="skills" className="py-12 bg-[#050208] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6" ref={containerRef}>

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Lucide.Zap className="text-[#d946ef] fill-[#d946ef]" size={14} />
            <span className="uppercase tracking-[0.4em] text-[9px] font-bold text-slate-500">Professional Toolkit</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-center italic">
            EXPERT<span style={outlineStyle}>ISE</span>
          </h2>
        </div>

        {/* 3-Column Premium Responsive Grid (Compact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stack.map((item, i) => {
            const theme = getTheme(item.title);
            return (
              <div
                key={item.title || i}
                style={{
                  transitionDuration: '1000ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${i * 50}ms`
                }}
                className={`skill-item opacity-0 scale-95 translate-y-[30px] transition-all
                  p-5.5 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-md relative group overflow-hidden
                  ${theme.borderHover} ${theme.shadowHover}
                `}
              >
                {/* Dynamic Background Hover Radial Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                
                {/* Header of Card */}
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className={`p-2 ${theme.badgeBg} rounded-xl border ${theme.badgeBorder} transition-transform duration-500 group-hover:scale-110`}>
                    {getCategoryIcon(item)}
                  </div>
                  <h3 className={`text-base font-black uppercase italic tracking-tight text-white transition-colors duration-300 ${theme.textColor}`}>
                    {item.title}
                  </h3>
                </div>

                {/* Compact wrap pills inside card */}
                <div className="flex flex-wrap gap-2.5 relative z-10">
                  {item.skills?.map((s: any, idx: number) => (
                    <div 
                      key={s.name || idx} 
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300"
                    >
                      <span className={`opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${theme.iconColorClass}`}>
                        {getSkillIcon(s)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors duration-300">
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact Coding Personality Panel */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center">
          <h3 className="text-[9px] uppercase font-mono tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-1.5">
            <Lucide.Heart size={10} className="text-[#d946ef] fill-[#d946ef] animate-pulse" /> Outside Coding
          </h3>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl">
            {[
              { label: "Football", emoji: "⚽" },
              { label: "AI", emoji: "🧠" },
              { label: "Gaming", emoji: "🎮" },
              { label: "Learning", emoji: "📚" },
              { label: "Building products", emoji: "🚀" }
            ].map((interest, i) => (
              <span key={i} className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-[#d946ef]/20 hover:bg-[#d946ef]/5 transition-all duration-300 hover:scale-105">
                <span>{interest.emoji}</span>
                {interest.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;