import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [hasHover, setHasHover] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const lastPosition = useRef({ x: 0, y: 0 });
  const particleIdRef = useRef(0);

  // Check if device supports hover (disabled on touch devices)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    setHasHover(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHasHover(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update mouse position and spawn particles on movement
  useEffect(() => {
    if (!hasHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });
      setIsHidden(false);

      // Distance moved since last particle spawn
      const dx = x - lastPosition.current.x;
      const dy = y - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Spawn a particle if the mouse moved at least 8 pixels (for performance and clean visuals)
      if (distance > 8) {
        const count = isHovered ? 2 : 1; // More particles when hovering
        const newParticles: Particle[] = [];

        for (let i = 0; i < count; i++) {
          particleIdRef.current += 1;
          newParticles.push({
            id: particleIdRef.current,
            x: x + (Math.random() - 0.5) * 4,
            y: y + (Math.random() - 0.5) * 4,
            // Small initial outward velocity
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 + 1, // slight downward drift
            size: Math.random() * 3 + 2, // 2px to 5px
            opacity: 0.8,
          });
        }

        setParticles((prev) => [...prev, ...newParticles].slice(-40)); // Cap particles array size for safety
        lastPosition.current = { x, y };
      }
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [hasHover, isHovered]);

  // Particle animation loop using requestAnimationFrame
  useEffect(() => {
    if (!hasHover) return;
    let animationFrameId: number;

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.03, // Fade out rate
            size: Math.max(0, p.size - 0.05), // Shrink size slightly
          }))
          .filter((p) => p.opacity > 0)
      );
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animationFrameId = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasHover]);

  // Detect interactive elements for hover effects
  useEffect(() => {
    if (!hasHover) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [hasHover]);

  if (!hasHover || isHidden) return null;

  return (
    <>
      {/* Hide native cursor globally */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Cyberpunk Laser Dot Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed rounded-full pointer-events-none z-[9998]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: 'translate(-50%, -50%)',
            opacity: p.opacity,
            background: isHovered 
              ? 'radial-gradient(circle, #8b1ff5 20%, transparent 80%)'
              : 'radial-gradient(circle, #d946ef 20%, transparent 80%)',
            boxShadow: isHovered
              ? '0 0 8px #8b1ff5, 0 0 15px #3b82f6'
              : '0 0 8px #d946ef, 0 0 15px #8b1ff5',
          }}
        />
      ))}

      {/* Core Glowing Laser Dot */}
      <div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '20px' : '8px',
          height: isHovered ? '20px' : '8px',
          backgroundColor: isHovered ? '#3b82f6' : '#d946ef',
          boxShadow: isHovered
            ? '0 0 12px #3b82f6, 0 0 25px #8b1ff5'
            : '0 0 12px #d946ef, 0 0 25px #8b1ff5',
          border: isHovered ? '2px solid #ffffff' : 'none',
        }}
      />
    </>
  );
};

export default CustomCursor;
