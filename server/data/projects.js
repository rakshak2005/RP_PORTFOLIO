// Canonical project catalog.
// These entries are automatically synced into MongoDB so that every project
// can be arranged from the admin console (and shown on the public site).
const canonicalProjects = [
  {
    title: "GMPX",
    category: "SaaS Tool",
    description: "Indian IPO market intelligence platform featuring real-time Grey Market Premium (GMP) tracking, pulse analysis, allotment monitoring, and portfolio gain calculations.",
    demoLink: "https://gmpx-track-monitor-calculate.vercel.app/",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "REST API", "Financial Analytics"],
    githubLink: "https://github.com/rakshak2005",
    image: ""
  },
  {
    title: "GeoBuzz",
    category: "Mobile App",
    description: "Automate by location. Intelligent location-based automation system triggering customized actions, alarms, sound profiles, and tasks upon entering or leaving geofenced areas.",
    demoLink: "https://geobuzz-app.vercel.app/",
    technologies: ["Flutter", "Dart", "Firebase", "Geolocation", "PWA"],
    githubLink: "https://github.com/rakshak2005",
    image: ""
  },
  {
    title: "Carrer iq",
    category: "AI Platform",
    description: "AI-powered career analysis platform that evaluates resumes, GitHub profiles, and projects to generate a comprehensive employability score.",
    demoLink: "https://carreriq-nine.vercel.app/",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Firebase", "OpenAI API", "GitHub API", "Vercel"],
    githubLink: "https://github.com/rakshak2005",
    image: ""
  },
  {
    title: "OpsSphere",
    category: "SaaS Tool",
    description: "A high-performance enterprise operations panel combining ERP workflows, real-time CRM tracking, inventory monitoring, and business analytics into a single responsive hub.",
    demoLink: "https://ops-sphere.vercel.app/",
    technologies: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    githubLink: "https://github.com/rakshak2005/OpsSphere",
    image: ""
  },
  {
    title: "Transit ERP",
    category: "SaaS Tool",
    description: "A centralized multi-warehouse supply chain and stock management ERP featuring real-time branch routing, stock transfer pipelines, and inventory reservations.",
    demoLink: "https://transit-erp.vercel.app/",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    githubLink: "https://github.com/rakshak2005",
    image: ""
  },
  {
    title: "Campus Connect",
    category: "AI Platform",
    description: "Intelligent college ecosystem powered by large language models.",
    demoLink: "https://amc-campus-connect-real-c6qg.vercel.app/",
    technologies: ["React", "MERN Stack", "OpenAI API"],
    githubLink: "https://github.com/rakshak2005",
    image: ""
  },
  {
    title: "SiskshaSethu (Updated)",
    category: "Web App",
    description: "A unified search aggregator that continuously fetches, categorizes, and updates available scholarships and internships globally to streamline student applications.",
    demoLink: "https://siskshasethu.vercel.app/",
    technologies: ["Flutter", "Dart", "Node.js", "MongoDB", "Web Scraping"],
    githubLink: "https://github.com/rakshak2005/SiskshaSethu",
    image: ""
  },
  {
    title: "Out-OF-OFFICE",
    category: "Web App",
    description: "A full-stack enterprise leave management portal featuring dynamic request pipelines, holiday calendars, balance tracking, and role-based approval dashboards.",
    demoLink: "https://out-of-office-xi.vercel.app/",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    githubLink: "https://github.com/rakshak2005/OUT-OF-OFFICE",
    image: ""
  },
  {
    title: "BMW SCROLL EXPERIENCE",
    category: "Web App",
    description: "An immersive landing page utilizing advanced scroll-driven animations, high-fidelity asset rendering, and cinematic typography to showcase BMW performance models.",
    demoLink: "https://bmw-scroll-experience.vercel.app/",
    technologies: ["React", "Framer Motion", "Tailwind CSS", "Three.js"],
    githubLink: "https://github.com/rakshak2005/BMW---Scroll---Experience",
    image: "/bmw.jpg"
  },
  {
    title: "Shortify",
    category: "SaaS Tool",
    description: "Advanced URL shortening with real-time analytics and QR generation.",
    demoLink: "https://shortify-url-shortner-ctap.vercel.app/",
    technologies: ["Next.js", "Express", "MongoDB", "Tailwind"],
    githubLink: "https://github.com/rakshak2005",
    image: ""
  },
  {
    title: "THINKSHIFT",
    category: "Mobile App",
    description: "A location-intelligent reminder system built for modern efficiency.",
    demoLink: "https://think-shift-kappa.vercel.app/",
    technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
    githubLink: "https://github.com/rakshak2005",
    image: ""
  },
  {
    title: "The Wine Store",
    category: "Web App",
    description: "A premium, elegant e-commerce landing page designed for a boutique wine collection, featuring modern filters, vintage galleries, and seamless cart flows.",
    demoLink: "https://thewinestore.vercel.app/",
    technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    githubLink: "https://github.com/rakshak2005/THEWINESTORE",
    image: ""
  },
  {
    title: "Commander",
    category: "AI Platform",
    description: "An advanced, futuristic dashboard-style personal operating system panel designed for real-time collaboration, cloud storage, password management, and artificial intelligence integration.",
    demoLink: "https://commander-lime.vercel.app/",
    technologies: ["React 19", "Vite", "Tailwind CSS", "Framer Motion", "Firebase", "Gemini API"],
    githubLink: "https://github.com/rakshak2005/Commander",
    image: ""
  },
  {
    title: "SHIKSHA SETHU",
    category: "Mobile App",
    description: "A location-intelligent reminder system built for modern efficiency.",
    demoLink: "https://siksha-sethu.vercel.app/",
    technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
    githubLink: "https://github.com/rakshak2005",
    image: ""
  },
  {
    title: "The Quizler",
    category: "Mobile App",
    description: "An interactive, gamified IQ testing application built with Flutter featuring time-attack quizzes, cognitive assessment tracking, and global leaderboard rankings.",
    demoLink: "https://quizler-the-iq-checker.vercel.app/",
    technologies: ["Flutter", "Dart", "Firebase", "State Management"],
    githubLink: "https://github.com/rakshak2005/Quizler-The-IQ-Checker-",
    image: ""
  },
  {
    title: "Netflix Clone",
    category: "Web App",
    description: "A high-fidelity Netflix mockup dashboard featuring dynamic category galleries, preview carousels, and responsive video players fetching live media feeds.",
    demoLink: "https://netflixclone-six-iota.vercel.app/",
    technologies: ["React", "Tailwind CSS", "TMDB API", "Firebase"],
    githubLink: "https://github.com/rakshak2005/Netflixweb-Clone",
    image: "/netflix.png"
  },
  {
    title: "Tesla Web Clone",
    category: "Web App",
    description: "A responsive replication of the Tesla landing page, featuring custom full-page scroll transitions, snap layouts, and sleek navigation menus.",
    demoLink: "https://teslaclone-pied.vercel.app/",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    githubLink: "https://github.com/rakshak2005/TeslaWEB-Clone",
    image: ""
  },
  {
    title: "Amazon Clone",
    category: "Web App",
    description: "A responsive Amazon e-commerce clone featuring interactive shopping carts, user profile panels, product categories, and mock checkout flows.",
    demoLink: "https://amazonclone-five-chi.vercel.app/",
    technologies: ["React", "Tailwind CSS", "Firebase Auth", "Context API"],
    githubLink: "https://github.com/rakshak2005/Amazon-Clone",
    image: ""
  }
];

export const normalizeProjectTitle = (title = "") => title.trim().toLowerCase();

export default canonicalProjects;
