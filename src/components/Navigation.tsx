import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/assets/LOGO.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 pointer-events-none">
      <nav 
        className={`
          pointer-events-auto
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          bg-[#050208]/85 backdrop-blur-xl border border-[#d946ef]/15
          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]
          
          ${isOpen 
            ? 'w-[90%] max-w-[360px] rounded-[2rem]' 
            : scrolled 
              ? 'w-[92%] max-w-[540px] rounded-full' 
              : 'w-[95%] max-w-7xl rounded-2xl'}
        `}
      >
        <div className="flex justify-between items-center h-14 px-6 md:px-10">
          <div className="flex items-center gap-3 shrink-0">
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-5 w-auto object-contain brightness-110" 
            />
            <span className="text-[10px] font-black uppercase tracking-tighter text-white hidden sm:block">
              Portfolio
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 overflow-hidden">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 lg:px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#d946ef] transition-all whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-[#d946ef] transition-colors"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div 
          className={`
            md:hidden overflow-hidden transition-all duration-500 ease-in-out
            ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="flex flex-col items-center gap-5 pb-8 pt-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#d946ef] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;