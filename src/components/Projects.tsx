import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Sparkles, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { fetchWithCache } from '../lib/cache';
import bmwImg from '@/assets/bmw.jpg';

const IframePreview = ({ src, title }: { src: string; title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setScale(containerWidth / 1280);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black">
      <iframe
        src={src}
        title={title}
        style={{
          width: '1280px',
          height: '720px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="absolute top-0 left-0 border-none transition-transform duration-700"
        loading="lazy"
        scrolling="no"
      />
    </div>
  );
};

const Projects = () => {
  const staticProjects = [
    {
      _id: "0",
      title: "Carrer iq",
      category: "AI Platform",
      description: "AI-powered career analysis platform that evaluates resumes, GitHub profiles, and projects to generate a comprehensive employability score.",
      demoLink: "https://carrer-iq.vercel.app/",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Firebase", "OpenAI API", "GitHub API", "Vercel"],
      githubLink: "https://github.com/rakshak2005",
      image: ""
    },
    {
      _id: "5",
      title: "OpsSphere",
      category: "SaaS Tool",
      description: "A high-performance enterprise operations panel combining ERP workflows, real-time CRM tracking, inventory monitoring, and business analytics into a single responsive hub.",
      demoLink: "https://ops-sphere.vercel.app/",
      technologies: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
      githubLink: "https://github.com/rakshak2005/OpsSphere",
      image: ""
    },
    {
      _id: "2",
      title: "Campus Connect",
      category: "AI Platform",
      description: "Intelligent college ecosystem powered by large language models.",
      demoLink: "https://amc-campus-connect-real-c6qg.vercel.app/",
      technologies: ["React", "MERN Stack", "OpenAI API"],
      githubLink: "https://github.com/rakshak2005",
      image: ""
    },
    {
      _id: "10",
      title: "SiskshaSethu (Updated)",
      category: "Web App",
      description: "A unified search aggregator that continuously fetches, categorizes, and updates available scholarships and internships globally to streamline student applications.",
      demoLink: "https://siskshasethu.vercel.app/",
      technologies: ["Flutter", "Dart", "Node.js", "MongoDB", "Web Scraping"],
      githubLink: "https://github.com/rakshak2005/SiskshaSethu",
      image: ""
    },
    {
      _id: "9",
      title: "Out-OF-OFFICE",
      category: "Web App",
      description: "A full-stack enterprise leave management portal featuring dynamic request pipelines, holiday calendars, balance tracking, and role-based approval dashboards.",
      demoLink: "https://out-of-office-xi.vercel.app/",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      githubLink: "https://github.com/rakshak2005/OUT-OF-OFFICE",
      image: ""
    },
    {
      _id: "6",
      title: "BMW SCROLL EXPERIENCE",
      category: "Web App",
      description: "An immersive landing page utilizing advanced scroll-driven animations, high-fidelity asset rendering, and cinematic typography to showcase BMW performance models.",
      demoLink: "https://bmw-scroll-experience.vercel.app/",
      technologies: ["React", "Framer Motion", "Tailwind CSS", "Three.js"],
      githubLink: "https://github.com/rakshak2005/BMW---Scroll---Experience",
      image: bmwImg
    },
    {
      _id: "4",
      title: "Shortify",
      category: "SaaS Tool",
      description: "Advanced URL shortening with real-time analytics and QR generation.",
      demoLink: "https://shortify-url-shortner-ctap.vercel.app/",
      technologies: ["Next.js", "Express", "MongoDB", "Tailwind"],
      githubLink: "https://github.com/rakshak2005",
      image: ""
    },
    {
      _id: "1",
      title: "THINKSHIFT",
      category: "Mobile App",
      description: "A location-intelligent reminder system built for modern efficiency.",
      demoLink: "https://think-shift-kappa.vercel.app/",
      technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
      githubLink: "https://github.com/rakshak2005",
      image: ""
    },
    {
      _id: "8",
      title: "The Wine Store",
      category: "Web App",
      description: "A premium, elegant e-commerce landing page designed for a boutique wine collection, featuring modern filters, vintage galleries, and seamless cart flows.",
      demoLink: "https://thewinestore.vercel.app/",
      technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
      githubLink: "https://github.com/rakshak2005/THEWINESTORE",
      image: ""
    },
    {
      _id: "7",
      title: "Commander",
      category: "AI Platform",
      description: "An advanced, futuristic dashboard-style personal operating system panel designed for real-time collaboration, cloud storage, password management, and artificial intelligence integration.",
      demoLink: "https://commander-lime.vercel.app/",
      technologies: ["React 19", "Vite", "Tailwind CSS", "Framer Motion", "Firebase", "Gemini API"],
      githubLink: "https://github.com/rakshak2005/Commander",
      image: ""
    },
    {
      _id: "3",
      title: "SHIKSHA SETHU",
      category: "Mobile App",
      description: "A location-intelligent reminder system built for modern efficiency.",
      demoLink: "https://siksha-sethu.vercel.app/", 
      technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
      githubLink: "https://github.com/rakshak2005",
      image: ""
    },
    {
      _id: "11",
      title: "The Quizler",
      category: "Mobile App",
      description: "An interactive, gamified IQ testing application built with Flutter featuring time-attack quizzes, cognitive assessment tracking, and global leaderboard rankings.",
      demoLink: "https://quizler-the-iq-checker.vercel.app/",
      technologies: ["Flutter", "Dart", "Firebase", "State Management"],
      githubLink: "https://github.com/rakshak2005/Quizler-The-IQ-Checker-",
      image: ""
    },
    {
      _id: "12",
      title: "Netflix Clone",
      category: "Web App",
      description: "A high-fidelity Netflix mockup dashboard featuring dynamic category galleries, preview carousels, and responsive video players fetching live media feeds.",
      demoLink: "https://netflixclone-six-iota.vercel.app/",
      technologies: ["React", "Tailwind CSS", "TMDB API", "Firebase"],
      githubLink: "https://github.com/rakshak2005/Netflixweb-Clone",
      image: ""
    },
    {
      _id: "13",
      title: "Tesla Web Clone",
      category: "Web App",
      description: "A responsive replication of the Tesla landing page, featuring custom full-page scroll transitions, snap layouts, and sleek navigation menus.",
      demoLink: "https://teslaclone-pied.vercel.app/",
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      githubLink: "https://github.com/rakshak2005/TeslaWEB-Clone",
      image: ""
    },
    {
      _id: "14",
      title: "Amazon Clone",
      category: "Web App",
      description: "A responsive Amazon e-commerce clone featuring interactive shopping carts, user profile panels, product categories, and mock checkout flows.",
      demoLink: "https://amazonclone-five-chi.vercel.app/",
      technologies: ["React", "Tailwind CSS", "Firebase Auth", "Context API"],
      githubLink: "https://github.com/rakshak2005/Amazon-Clone",
      image: ""
    }
  ];

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchWithCache(
      `${API_URL}/api/projects`,
      (data) => {
        if (data && data.length > 0) {
          const dbProjects = data.filter((p: any) => !p.isHidden);
          const merged = [...dbProjects];
          
          staticProjects.forEach((staticProj) => {
            const exists = dbProjects.some(
              (dbProj: any) => dbProj.title.toLowerCase() === staticProj.title.toLowerCase()
            );
            if (!exists) {
              merged.push(staticProj);
            }
          });

          // Sort merged list based on the order in staticProjects
          merged.sort((a, b) => {
            const indexA = staticProjects.findIndex(
              (p) => p.title.toLowerCase() === a.title.toLowerCase()
            );
            const indexB = staticProjects.findIndex(
              (p) => p.title.toLowerCase() === b.title.toLowerCase()
            );
            
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
          });

          setProjects(merged);
        } else {
          setProjects(staticProjects);
        }
      },
      staticProjects,
      (data) => Array.isArray(data) && data.length > 0
    );
  }, []);

  return (
    <section id="projects" className="py-16 bg-[#050208] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="max-w-xl w-full">
            <div className="flex items-center gap-2 text-[#d946ef] mb-3">
              <Sparkles size={16} />
              <span className="uppercase tracking-[0.3em] text-[10px] font-bold">Selected Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] md:leading-none">
              DIGITAL <br /> <span className="text-[#d946ef]">CRAFTSMANSHIP</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm md:text-base max-w-sm font-light leading-relaxed">
            Live interactive previews of systems built to solve real-world problems.
          </p>
        </div>

        {/* Dynamic 3-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project) => (
            <div 
              key={project._id}
              className="group relative flex flex-col bg-gradient-to-br from-[#0c0514] to-[#050208] border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#d946ef]/40 hover:shadow-[0_0_40px_rgba(217,70,239,0.1)] rounded-2xl"
            >
              {/* Floating premium category badge */}
              <div className="absolute top-3 left-3 z-30 pointer-events-none px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[7px] font-black uppercase tracking-[0.2em] text-[#d946ef]">
                {project.category}
              </div>

              <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0a0510] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {project.image ? (
                  <img 
                    src={project.image.startsWith('/uploads') ? `${API_URL}${project.image}` : project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <IframePreview src={project.demoLink} title={project.title} />
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black tracking-tighter group-hover:text-[#d946ef] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-1.5">
                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          className="p-2 rounded-full bg-white/5 border border-white/5 hover:border-[#d946ef]/30 hover:bg-[#d946ef] hover:text-black transition-all hover:-translate-y-0.5"
                          target="_blank"
                          rel="noreferrer"
                          title="View Source Code"
                        >
                          <Github size={14} />
                        </a>
                      )}
                      {project.demoLink && (
                        <a 
                          href={project.demoLink} 
                          className="p-2 rounded-full bg-white/5 border border-white/5 hover:border-[#d946ef]/30 hover:bg-[#d946ef] hover:text-black transition-all hover:-translate-y-0.5"
                          target="_blank"
                          rel="noreferrer"
                          title="Explore Live Preview"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4 font-light max-w-md line-clamp-2" title={project.description}>
                    {project.title.toLowerCase() === 'carrer iq' || project.title.toLowerCase() === 'career iq'
                      ? "AI-powered career analysis platform that evaluates resumes, GitHub profiles, and projects to generate a comprehensive employability score."
                      : project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
                  {project.technologies?.map((tech: string) => (
                    <span 
                      key={tech}
                      className="text-[8px] font-mono px-2 py-0.5 bg-white/[0.02] border border-white/5 text-slate-400 rounded-md transition-all group-hover:border-[#d946ef]/20 group-hover:text-slate-200 uppercase tracking-tighter"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/projects" className="group relative px-10 py-4 overflow-hidden border border-white/10 bg-white/[0.02] transition-all rounded-full">
            <div className="absolute inset-0 bg-[#d946ef] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">
              Archive of all works
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;