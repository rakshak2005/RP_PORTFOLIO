import React from 'react';
import { GraduationCap, Calendar, Award, BookOpen, Sparkles } from 'lucide-react';

const Education = () => {
  const education = [
    {
      degree: "Bachelor of Engineering in Computer Science",
      institution: "Amc Engineering College",
      period: "2023 — 2027",
      description: "Focusing on full-stack development and scalable systems. Engaged in building modern web applications using the MERN stack and exploring cloud-native architectures.",
      achievements: ["8.3 GPA Current"],
      courses: ["Data Structures", "Web Technologies", "Database Systems", "Cloud Computing"]
    },
  ];

  const certifications = [
    { title: "Front End Development", issuer: "Codsoft", date: "2025" },
    { title: "Development", issuer: "Oasis Infobyte", date: "2025" },
    { title: "Flutter Development", issuer: "Oasis Infobyte", date: "2025" },
    { title: "Azure Fundamentals", issuer: "Microsoft", date: "2022" }
  ];

  return (
    <section id="education" className="py-32 bg-[#050208] text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d946ef]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-6 text-center md:text-left">
          <div className="max-w-xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#d946ef] mb-4">
              <Sparkles size={18} />
              <span className="uppercase tracking-[0.3em] text-xs font-bold">Evolution</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-none">
              LEARNING <br /> <span className="text-[#d946ef]">JOURNEY</span>
            </h2>
          </div>
          <p className="text-slate-400 text-base md:text-lg max-w-sm font-light leading-relaxed">
            A fusion of formal engineering education and specialized technical certifications.
          </p>
        </div>

        <div className="mb-24">
          {education.map((edu, index) => (
            <div 
              key={index}
              className="group relative bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 hover:bg-white/[0.04] transition-all duration-700"
            >
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 text-center md:text-left">
                    <div className="p-4 rounded-2xl bg-[#d946ef]/10 border border-[#d946ef]/20 text-[#d946ef]">
                      <GraduationCap size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-3xl font-bold tracking-tight">{edu.degree}</h4>
                      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-slate-400 mt-1">
                        <span className="text-[#d946ef] font-medium">{edu.institution}</span>
                        <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-1.5 text-xs md:text-sm uppercase tracking-wider">
                          <Calendar size={14} /> {edu.period}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 font-light text-center md:text-left">
                    {edu.description}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {edu.courses.map((course) => (
                      <span 
                        key={course}
                        className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-mono text-slate-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col justify-center">
                  <div className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-[#d946ef]/10 to-transparent border border-white/5 text-center md:text-left">
                    <h5 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#d946ef] mb-6">Academic Merit</h5>
                    {edu.achievements.map((item) => (
                      <div key={item} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d946ef]">
                          <Award size={24} />
                        </div>
                        <span className="text-xl md:text-2xl font-bold tracking-tighter">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-[2rem] bg-[#0c0613] border border-white/5 hover:border-[#d946ef]/30 transition-all duration-500 overflow-hidden text-center sm:text-left"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity hidden sm:block">
                <Award size={40} className="text-[#d946ef] -rotate-12" />
              </div>
              
              <h4 className="text-lg font-bold mb-2 sm:pr-8">{cert.title}</h4>
              <p className="text-slate-500 text-sm mb-6">{cert.issuer}</p>
              
              <div className="flex items-center justify-center sm:justify-between mt-auto gap-4">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#d946ef] bg-[#d946ef]/10 px-3 py-1 rounded-full">
                  {cert.date}
                </span>
                <BookOpen size={16} className="text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;