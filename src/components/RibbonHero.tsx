import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createRibbonEngine } from './ribbon/engine';
import { CARD_DATA } from './ribbon/data';
import { RIBBON_CSS } from './ribbon/styles';

const RibbonHero = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const previousTitle = document.title;
    document.title = 'Rakshak Patel V — Portfolio';

    const dispose = createRibbonEngine({
      canvas,
      root,
      onReady: () => setReady(true),
    });

    return () => {
      document.title = previousTitle;
      dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className={`ml-ribbon${ready ? ' ml-ready' : ''}`}>
      <style>{RIBBON_CSS}</style>

      <canvas ref={canvasRef} id="gl" aria-hidden="true" />

      <nav className="ml-ui" aria-label="Portfolio">
        <Link className="tl" to="/">
          Rakshak Patel V
        </Link>
        <Link className="tr" to="/#skills">
          Skills
        </Link>
        <Link className="bl" to="/projects">
          Projects <span>/</span> <span>Full</span>
        </Link>
        <Link className="br" to="/#contact">
          Contact
        </Link>
      </nav>

      <div className="ml-loader" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="ml-veil" aria-hidden="true" />

      <main className="ml-sr" id="list" aria-label="Featured work">
        {CARD_DATA.map((card) => (
          <article key={card.caption}>
            <h2>
              <a href={card.href} target="_blank" rel="noopener noreferrer">
                {card.caption}
              </a>
            </h2>
          </article>
        ))}
      </main>
    </div>
  );
};

export default RibbonHero;
