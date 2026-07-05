import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Companies from '@/components/Companies';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  const SectionDivider = () => (
    <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[1px] bg-gradient-to-r from-[#d946ef]/60 to-[#8b1ff5]/60 shadow-[0_0_12px_rgba(217,70,239,0.5)]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050208] text-white selection:bg-[#d946ef]/20 relative overflow-hidden bg-dots">
      {/* Background Soft Glow Circles to fill empty black spaces */}
      <div className="absolute top-[20%] left-[-10%] w-[45%] h-[35%] rounded-full bg-[#d946ef]/5 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[35%] rounded-full bg-[#8b1ff5]/4 blur-[130px] pointer-events-none" />
      <div className="absolute top-[60%] left-[-10%] w-[45%] h-[35%] rounded-full bg-[#3b82f6]/4 blur-[130px] pointer-events-none" />
      <div className="absolute top-[80%] right-[-10%] w-[45%] h-[35%] rounded-full bg-[#d946ef]/5 blur-[130px] pointer-events-none" />

      <Navigation />
      <main className="relative z-10">
        <Hero />
        <SectionDivider />
        <Companies />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Education />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
