import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  const [hasHover, setHasHover] = useState(false);
  const isHoveredRef = useRef(false);
  const isHiddenRef = useRef(true);

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

  // Track hover status on interactive elements
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

      isHoveredRef.current = !!isInteractive;
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [hasHover]);

  // Main rendering loop (bypasses React state updates entirely for maximum performance)
  useEffect(() => {
    if (!hasHover) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing to match viewport size exactly
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    let particles: Particle[] = [];
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      isHiddenRef.current = false;
    };

    const handleMouseLeave = () => {
      isHiddenRef.current = true;
    };

    const handleMouseEnter = () => {
      isHiddenRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Dynamic core position easing
    const corePos = { x: 0, y: 0 };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isHiddenRef.current) {
        const mouse = mouseRef.current;

        // Smooth easing for the laser core (reduces jitter/stuttering)
        corePos.x += (mouse.x - corePos.x) * 0.4;
        corePos.y += (mouse.y - corePos.y) * 0.4;

        // Generate particles based on movement distance
        const dx = mouse.x - mouse.lastX;
        const dy = mouse.y - mouse.lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 2) {
          const spawnCount = isHoveredRef.current ? 2 : 1;
          const color = isHoveredRef.current ? '#8b1ff5' : '#d946ef';

          for (let i = 0; i < spawnCount; i++) {
            particles.push({
              x: mouse.x + (Math.random() - 0.5) * 4,
              y: mouse.y + (Math.random() - 0.5) * 4,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5 + 0.5, // slight downward drift
              size: Math.random() * 2.5 + 1.5,
              alpha: 0.8,
              color,
            });
          }
        }

        // Update tracking values
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;

        // Update and draw trailing particles
        particles = particles.map((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.025; // Slow, smooth fade out
          p.size = Math.max(0, p.size - 0.05); // Smooth shrink
          return p;
        }).filter((p) => p.alpha > 0);

        particles.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          // Soft neon glow effect on canvas
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        });

        // Draw Core Laser Dot
        const coreSize = isHoveredRef.current ? 10 : 4;
        const coreColor = isHoveredRef.current ? '#3b82f6' : '#d946ef';
        const glowColor = isHoveredRef.current ? '#8b1ff5' : '#d946ef';

        ctx.save();
        ctx.beginPath();
        ctx.arc(corePos.x, corePos.y, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = coreColor;
        ctx.shadowBlur = isHoveredRef.current ? 22 : 12;
        ctx.shadowColor = glowColor;
        ctx.fill();

        // Draw white border for hovered targets
        if (isHoveredRef.current) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasHover]);

  if (!hasHover) return null;

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99999]"
      />
    </>
  );
};

export default CustomCursor;
