import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ArrowUpRight, Award, Code2 } from 'lucide-react';
import amiloLogo from '@/assets/amilo_ai.png';
import pentagonLogo from '@/assets/pentagon_space.png';
import { API_URL } from '../config';

const Companies = () => {
  const staticExperiences = [
    {
      company: "AMILO AI Pvt Ltd",
      logo: amiloLogo,
      badge: "Industry Projects",
      role: "Project Developer",
      timeline: "Practical Experience",
      description: "Successfully built and deployed industry-level projects. Developed robust, production-ready full-stack applications and integrated AI technologies, focusing on creating efficient and scalable digital architectures.",
      highlights: ["Industry-grade Architecture", "Full-Stack Integration", "AI Technologies"],
      color: "from-[#d946ef]/5 to-[#8b1ff5]/5",
      borderColor: "hover:border-[#d946ef]/40",
      glowColor: "bg-[#d946ef]/5",
      icon: <Code2 size={16} className="text-[#d946ef]" />
    },
    {
      company: "Pentagon Space",
      logo: pentagonLogo,
      badge: "Selected Candidate",
      role: "Trainee Software Engineer",
      timeline: "Selection Merit",
      description: "Cleared multiple competitive screening, aptitude, and technical assessment rounds to secure selection for advanced software engineering placement training, demonstrating strong computer science foundations.",
      highlights: ["Technical Aptitude", "Multi-Round Clearance", "Advanced Dev Track"],
      color: "from-[#8b1ff5]/5 to-[#3b82f6]/5",
      borderColor: "hover:border-[#8b1ff5]/40",
      glowColor: "bg-[#8b1ff5]/5",
      icon: <Award size={16} className="text-[#8b1ff5]" />
    }
  ];

  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/companies`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) {
          setExperiences(data);
        } else {
          setExperiences(staticExperiences);
        }
      })
      .catch(() => {
        setExperiences(staticExperiences);
      });
  }, []);

  const getLogoSrc = (logo: string) => {
    if (logo && logo.startsWith('/uploads')) {
      return `${API_URL}${logo}`;
    }
    return logo;
  };

  const getIcon = (exp: any) => {
    if (React.isValidElement(exp.icon)) {
      return exp.icon;
    }
    if (exp.badge?.toLowerCase().includes('candidate') || exp.role?.toLowerCase().includes('trainee')) {
      return <Award size={16} className="text-[#8b1ff5]" />;
    }
    return <Code2 size={16} className="text-[#d946ef]" />;
  };

  const outlineStyle = {
    color: 'transparent',
    WebkitTextStroke: '1.2px rgba(255, 255, 255, 0.55)'
  };

  return (
    <section id="companies" className="py-20 bg-[#050208] text-white relative overflow-hidden">
      {/* Decorative subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[150px] bg-[#d946ef]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Section Header - Balanced Medium Size */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="text-[#d946ef] fill-[#d946ef]" size={14} />
            <span className="uppercase tracking-[0.4em] text-[9px] font-bold text-slate-500">Industry Affiliations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase text-slate-100">
            Associated <span className="text-[#d946ef]" style={outlineStyle}>Companies</span>
          </h2>
        </div>

        {/* Experience Cards Grid - Balanced Medium Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className={`group relative rounded-[2rem] p-6 md:p-8 bg-gradient-to-br ${exp.color || 'from-[#d946ef]/5 to-[#8b1ff5]/5'} border border-white/10 ${exp.borderColor || 'hover:border-white/20'} transition-all duration-500 hover:translate-y-[-3px] overflow-hidden flex flex-col justify-between`}
            >
              {/* Inner card light glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full ${exp.glowColor || 'bg-[#d946ef]/5'} blur-[70px] pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-90`} />

              <div>
                {/* Top Header details - Medium Size */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/40 border border-white/10 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-white/20 transition-all duration-300 shadow-[0_0_12px_rgba(0,0,0,0.3)]">
                      <img
                        src={getLogoSrc(exp.logo)}
                        alt={exp.company}
                        className="w-full h-full object-contain filter brightness-95 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-white/95 group-hover:text-white transition-all duration-300">
                        {exp.company}
                      </h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono mt-0.5">
                        {exp.timeline}
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-1.5 rounded-full border border-white/5 bg-white/[0.04] backdrop-blur-md">
                    {getIcon(exp)}
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300">{exp.badge}</span>
                  </div>
                </div>

                {/* Subtitle / Role - Medium Size */}
                <h5 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-1.5 group-hover:text-[#d946ef] transition-colors duration-300">
                  {exp.role}
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </h5>

                {/* Description - Medium Size */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                  {exp.description}
                </p>
              </div>

              {/* Highlights tags - Medium Size */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {exp.highlights?.map((tag: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 rounded-xl border border-white/5 bg-black/30 text-[10px] font-mono text-slate-400 group-hover:border-white/10 transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Companies;
