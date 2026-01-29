import React from 'react';
import { ExternalLink, Github, Sparkles, Globe } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "THINKSHIFT",
      type: "Mobile App",
      description: "A location-intelligent reminder system built for modern efficiency.",
      liveUrl: "https://think-shift-kappa.vercel.app/", // Replace with your actual live URLs
      technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
      githubUrl: "https://github.com/rakshak2005",
    },
    {
      id: 2,
      title: "Campus Connect",
      type: "AI Platform",
      description: "Intelligent college ecosystem powered by large language models.",
      liveUrl: "https://amc-campus-connect-real-c6qg.vercel.app/",
      technologies: ["React", "MERN Stack", "OpenAI API"],
      githubUrl: "https://github.com/rakshak2005",
    },
    {
      id: 3,
      title: "SHIKSHA SETHU",
      type: "Mobile App",
      description: "A location-intelligent reminder system built for modern efficiency.",
      liveUrl: "https://siksha-sethu.vercel.app/", 
      technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
      githubUrl: "https://github.com/rakshak2005",
    },
    
    {
      id: 4,
      title: "Shortify",
      type: "SaaS Tool",
      description: "Advanced URL shortening with real-time analytics and QR generation.",
      liveUrl: "https://shortify-url-shortner-ctap.vercel.app/",
      technologies: ["Next.js", "Express", "MongoDB", "Tailwind"],
      githubUrl: "https://github.com/rakshak2005",
    },
    

  ];

  return (
    <section id="projects" className="py-32 bg-[#050208] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#d946ef] mb-4">
              <Sparkles size={18} />
              <span className="uppercase tracking-[0.3em] text-xs font-bold">Selected Works</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              DIGITAL <br /> <span className="text-[#d946ef]">CRAFTSMANSHIP</span>
            </h2>
          </div>
          <p className="text-slate-400 text-lg max-w-sm font-light leading-relaxed">
            Live interactive previews of systems built to solve real-world problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="group relative flex flex-col bg-[#0a0510] border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#d946ef]/30"
            >
              <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0a0510] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute inset-0 z-10 bg-[#050208]/50 backdrop-blur-sm group-hover:backdrop-blur-none group-hover:bg-transparent transition-all duration-1000 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 group-hover:opacity-0 transition-opacity duration-500">
                    <Globe className="text-[#d946ef] animate-pulse" size={32} />
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Hover to explore live</span>
                  </div>
                </div>

                <iframe 
                  src={project.liveUrl}
                  title={project.title}
                  className="w-[1280px] h-[720px] origin-top-left scale-[0.3] md:scale-[0.45] lg:scale-[0.5] pointer-events-none group-hover:pointer-events-auto transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="p-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[#d946ef] text-[10px] font-black tracking-widest uppercase mb-2 block">
                      {project.type}
                    </span>
                    <h3 className="text-4xl font-bold tracking-tighter">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex gap-4">
                    <a 
                      href={project.githubUrl} 
                      className="p-3 rounded-full bg-white/5 hover:bg-[#d946ef] hover:text-black transition-all"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github size={20} />
                    </a>
                    <a 
                      href={project.liveUrl} 
                      className="p-3 rounded-full bg-white/5 hover:bg-[#d946ef] hover:text-black transition-all"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light max-w-md">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="text-[9px] font-mono px-3 py-1 bg-white/5 border border-white/10 text-slate-300 uppercase tracking-tighter"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
          <button className="group relative px-12 py-5 overflow-hidden border border-white/10 bg-white/[0.02] transition-all">
            <div className="absolute inset-0 bg-[#d946ef] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">
              Archive of all works
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;