import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Sparkles, Globe, ArrowLeft, Search, Code, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { API_URL } from '../config';
import { fetchWithCache } from '../lib/cache';
import bmwImg from '@/assets/bmw.jpg';
import netflixImg from '@/assets/netflix.png';

const IframePreview = ({ src, title }: { src: string; title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Compute precise scale based on container width / desktop 1280px standard width
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

const ProjectsPage = () => {
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
      image: netflixImg
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies?.some((tech: string) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Extract categories and dynamic counts
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  
  const getCategoryCount = (category: string) => {
    if (category === 'All') return projects.length;
    return projects.filter(p => p.category === category).length;
  };

  // Get total tech stack size dynamically
  const uniqueTechStackCount = Array.from(new Set(projects.flatMap(p => p.technologies || []))).length;

  return (
    <div className="min-h-screen bg-[#050208] text-white selection:bg-[#d946ef]/20 relative overflow-hidden bg-dots">
      {/* Background Soft Glow Circles */}
      <div className="absolute top-[5%] left-[-15%] w-[50%] h-[40%] rounded-full bg-[#d946ef]/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-15%] w-[50%] h-[40%] rounded-full bg-[#8b1ff5]/4 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[40%] rounded-full bg-[#3b82f6]/3 blur-[150px] pointer-events-none" />

      <main className="relative z-10 pt-10 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header section with inline action link */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-[#d946ef] mb-2">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="uppercase tracking-[0.3em] text-[9px] font-bold">Showcase</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2">
                  ALL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#8b1ff5]">PROJECTS</span>
                </h1>
                <p className="text-slate-400 text-xs font-light leading-relaxed max-w-xl">
                  Interactive preview playground for systems, production applications, and utilities built to solve real-world problems.
                </p>
              </div>
              <div className="shrink-0">
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-[#d946ef] hover:shadow-[0_0_15px_rgba(217,70,239,0.2)] transition-all px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.2em] group"
                >
                  <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
                  Back to Portfolio
                </Link>
              </div>
            </div>

            {/* Filters and Search Bar Container */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center border-b border-white/5 py-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 items-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === category
                        ? 'bg-[#d946ef] text-white shadow-[0_0_20px_rgba(217,70,239,0.35)]'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {category}
                    <span className={`px-2 py-0.5 rounded-full text-[8px] ${
                      selectedCategory === category ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                    }`}>
                      {getCategoryCount(category)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search title, tech, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#d946ef]/50 focus:shadow-[0_0_15px_rgba(217,70,239,0.15)] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
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

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">No matching creation found</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 border border-white/10 rounded-full hover:border-[#d946ef]/30 hover:text-[#d946ef] transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
