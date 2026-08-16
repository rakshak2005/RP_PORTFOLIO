import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Sparkles, Globe, ArrowLeft, Search, Code, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { API_URL } from '../config';
import { fetchWithCache } from '../lib/cache';

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
        className="absolute top-0 left-0 border-none pointer-events-none group-hover:pointer-events-auto transition-transform duration-700"
        loading="lazy"
      />
    </div>
  );
};

const ProjectsPage = () => {
  const staticProjects = [
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
      _id: "4",
      title: "Shortify",
      category: "SaaS Tool",
      description: "Advanced URL shortening with real-time analytics and QR generation.",
      demoLink: "https://shortify-url-shortner-ctap.vercel.app/",
      technologies: ["Next.js", "Express", "MongoDB", "Tailwind"],
      githubLink: "https://github.com/rakshak2005",
      image: ""
    },
  ];

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchWithCache(
      `${API_URL}/api/projects`,
      (data) => {
        if (data && data.length > 0) {
          setProjects(data.filter((p: any) => !p.isHidden));
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
                    <>
                      {/* Premium Procedural Mockup fallback */}
                      <div className="absolute inset-0 z-10 bg-[#050208]/80 backdrop-blur-sm group-hover:backdrop-blur-none group-hover:bg-transparent transition-all duration-1000 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center gap-2 group-hover:opacity-0 transition-opacity duration-500">
                          <div className="p-2.5 rounded-full bg-[#d946ef]/5 border border-[#d946ef]/20 animate-pulse">
                            <Globe className="text-[#d946ef]" size={20} />
                          </div>
                          <span className="text-[7px] uppercase tracking-[0.4em] font-bold text-slate-400">Hover to expand</span>
                        </div>
                      </div>

                      {/* Micro background matrix grid for aesthetics */}
                      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

                      <IframePreview src={project.demoLink} title={project.title} />
                    </>
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

                    <p className="text-slate-400 text-[11px] leading-relaxed mb-4 font-light max-w-md">
                      {project.description}
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
