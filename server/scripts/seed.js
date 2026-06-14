import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Import models
import User from '../models/User.js';
import Hero from '../models/Hero.js';
import Project from '../models/Project.js';
import Company from '../models/Company.js';
import Skill from '../models/Skill.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Hero.deleteMany();
    await Project.deleteMany();
    await Company.deleteMany();
    await Skill.deleteMany();
    console.log('Cleared existing collections...');

    // 1. Create Default Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin12345', salt);
    
    const admin = new User({
      username: 'admin',
      password: hashedPassword
    });
    await admin.save();
    console.log('Default admin user created successfully!');

    // 2. Seed Hero Details
    const hero = new Hero({
      greeting: "I'M",
      name: "RAKSHAK",
      subtitle: "Full-stack Web and App Developer.",
      description: "Engineering high-performance digital architectures where logic meets aesthetics. Specializing in scalable full-stack ecosystems.",
      resumeLink: "https://drive.google.com/file/d/18c-63HXD1zYQ7wdPW5LrmUAqtdhCqF6z/view?usp=sharing",
      githubLink: "https://github.com/rakshak2005",
      linkedinLink: "https://www.linkedin.com/in/rakshak-patel-v-12b2b624a",
      instagramLink: "https://www.instagram.com/rakshak_2005",
      openForProjects: true
    });
    await hero.save();
    console.log('Hero details seeded!');

    // 3. Seed Projects
    const projects = [
      {
        title: "THINKSHIFT",
        category: "Mobile App",
        description: "A location-intelligent reminder system built for modern efficiency.",
        demoLink: "https://think-shift-kappa.vercel.app/",
        technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
        githubLink: "https://github.com/rakshak2005"
      },
      {
        title: "Campus Connect",
        category: "AI Platform",
        description: "Intelligent college ecosystem powered by large language models.",
        demoLink: "https://amc-campus-connect-real-c6qg.vercel.app/",
        technologies: ["React", "MERN Stack", "OpenAI API"],
        githubLink: "https://github.com/rakshak2005"
      },
      {
        title: "SHIKSHA SETHU",
        category: "Mobile App",
        description: "A location-intelligent reminder system built for modern efficiency.",
        demoLink: "https://siksha-sethu.vercel.app/",
        technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
        githubLink: "https://github.com/rakshak2005"
      },
      {
        title: "Shortify",
        category: "SaaS Tool",
        description: "Advanced URL shortening with real-time analytics and QR generation.",
        demoLink: "https://shortify-url-shortner-ctap.vercel.app/",
        technologies: ["Next.js", "Express", "MongoDB", "Tailwind"],
        githubLink: "https://github.com/rakshak2005"
      }
    ];
    await Project.insertMany(projects);
    console.log('Projects seeded!');

    // 4. Seed Companies (using copied local asset paths)
    const companies = [
      {
        company: "AMILO AI Pvt Ltd",
        logo: "/src/assets/amilo_ai.png",
        badge: "Industry Projects",
        role: "Project Developer",
        timeline: "Practical Experience",
        description: "Successfully built and deployed industry-level projects. Developed robust, production-ready full-stack applications and integrated AI technologies, focusing on creating efficient and scalable digital architectures.",
        highlights: ["Industry-grade Architecture", "Full-Stack Integration", "AI Technologies"],
        color: "from-[#d946ef]/5 to-[#8b1ff5]/5",
        borderColor: "hover:border-[#d946ef]/40",
        glowColor: "bg-[#d946ef]/5"
      },
      {
        company: "Pentagon Space",
        logo: "/src/assets/pentagon_space.png",
        badge: "Selected Candidate",
        role: "Trainee Software Engineer",
        timeline: "Selection Merit",
        description: "Cleared multiple competitive screening, aptitude, and technical assessment rounds to secure selection for advanced software engineering placement training, demonstrating strong computer science foundations.",
        highlights: ["Technical Aptitude", "Multi-Round Clearance", "Advanced Dev Track"],
        color: "from-[#8b1ff5]/5 to-[#3b82f6]/5",
        borderColor: "hover:border-[#8b1ff5]/40",
        glowColor: "bg-[#8b1ff5]/5"
      }
    ];
    await Company.insertMany(companies);
    console.log('Companies seeded!');

    // 5. Seed Skills
    const skills = [
      {
        title: "Frontend",
        icon: "Layers",
        side: "left",
        order: 1,
        skills: [
          { name: "Next.js", icon: "Globe" },
          { name: "React", icon: "Cpu" },
          { name: "TypeScript", icon: "Code2" },
          { name: "Tailwind", icon: "Layers" },
          { name: "HTML5/CSS3", icon: "Terminal" },
          { name: "EJS", icon: "Code2" }
        ]
      },
      {
        title: "Backend",
        icon: "Database",
        side: "right",
        order: 2,
        skills: [
          { name: "Node.js", icon: "Server" },
          { name: "Express", icon: "Zap" },
          { name: "MongoDB", icon: "Database" },
          { name: "Mongoose", icon: "Box" },
          { name: "Multer", icon: "Terminal" },
          { name: "Firebase", icon: "Globe" },
          { name: "MySQL", icon: "Database" },
          { name: "JWT", icon: "Terminal" }
        ]
      },
      {
        title: "App Dev",
        icon: "SmartphoneNfc",
        side: "left",
        order: 3,
        skills: [
          { name: "Flutter", icon: "Smartphone" },
          { name: "Dart", icon: "Code2" },
          { name: "Android", icon: "Smartphone" },
          { name: "iOS", icon: "Smartphone" }
        ]
      },
      {
        title: "Tools & Cloud",
        icon: "GitBranch",
        side: "right",
        order: 4,
        skills: [
          { name: "Git/GitHub", icon: "GitBranch" },
          { name: "Vercel", icon: "Globe" },
          { name: "Netlify", icon: "Globe" },
          { name: "Figma", icon: "Layers" },
          { name: "Canva", icon: "Layers" },
          { name: "Power BI", icon: "Database" }
        ]
      }
    ];
    await Skill.insertMany(skills);
    console.log('Skills seeded!');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
