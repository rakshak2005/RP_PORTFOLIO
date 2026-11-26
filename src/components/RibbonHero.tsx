import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { Link } from 'react-router-dom';
import { CARD_DATA } from './ribbon/data';
import './ribbon/cardTunnel.css';

/* ---------- tunnel geometry ---------- */

const RADIUS = 1150;
const PER_RING = 22;
const ROWS = 7;
const ROW_GAP = 200;
const EYE_Z = 800;

type Tile = {
  key: string;
  project: number;
  theta: number;
  y: number;
  depth: number;
  shade: number;
};

const TILES: Tile[] = (() => {
  const out: Tile[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    const y = (row - (ROWS - 1) / 2) * ROW_GAP;
    for (let col = 0; col < PER_RING; col += 1) {
      const theta = (col / PER_RING) * 360;
      const depth = RADIUS * Math.cos((theta * Math.PI) / 180);
      // Cards behind the eye are never visible — drop them.
      if (depth > EYE_Z) continue;
      const t = (depth + RADIUS) / (2 * RADIUS);
      out.push({
        key: `${row}-${col}`,
        project: (col * 5 + row * 3) % CARD_DATA.length,
        theta,
        y,
        depth,
        shade: 0.5 + t * 0.5,
      });
    }
  }
  return out;
})();

const cardStyle = (tile: Tile): CSSProperties =>
  ({
    transform: `translate3d(0, ${tile.y}px, 0) rotateY(${tile.theta}deg) translateZ(${RADIUS}px) rotateY(180deg)`,
    '--ct-o': tile.shade,
  } as unknown as CSSProperties);

/* ---------- a single tunnel card ---------- */

const TileCard = memo(function TileCard({
  tile,
  hot,
  onOpen,
}: {
  tile: Tile;
  hot: boolean;
  onOpen: (index: number) => void;
}) {
  const project = CARD_DATA[tile.project];
  return (
    <div className="ct-card" data-hot={hot ? 'true' : 'false'} style={cardStyle(tile)}>
      <button
        type="button"
        className="ct-card-in"
        style={{ backgroundImage: `url(${project.poster})` }}
        onClick={() => onOpen(tile.project)}
        aria-label={`Preview ${project.caption}`}
      />
    </div>
  );
});

/* ---------- walking silhouette ---------- */

const Figure = () => (
  <svg viewBox="0 0 160 360" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="ct-fig" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0b0908" />
        <stop offset="0.5" stopColor="#171311" />
        <stop offset="1" stopColor="#070505" />
      </linearGradient>
    </defs>
    <g fill="url(#ct-fig)">
      <ellipse cx="80" cy="36" rx="14" ry="16" />
      <rect x="73" y="50" width="14" height="14" rx="5" />
      <path d="M62 64C52 72 47 92 46 118L44 176L42 236L58 262L72 250L80 210L88 250L102 262L118 236L116 176L114 118C113 92 108 72 98 64Z" />
      <path d="M64 252L78 252L76 296L80 338L64 338L60 296Z" />
      <path d="M82 252L96 252L100 296L104 338L88 338L84 296Z" />
      <path d="M60 334L80 334L82 344L56 344Z" />
      <path d="M86 334L106 334L108 344L84 344Z" />
    </g>
    <path
      d="M62 64C52 72 47 92 46 118L44 176L42 236"
      fill="none"
      stroke="rgba(240,177,131,0.4)"
      strokeWidth="1.7"
    />
    <path d="M70 60Q80 68 90 60" fill="none" stroke="rgba(255,200,160,0.22)" strokeWidth="1.8" />
  </svg>
);

/* ---------- page ---------- */

const RibbonHero = () => {
  const [active, setActive] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const id = new URLSearchParams(window.location.search).get('project');
    if (!id) return null;
    const index = CARD_DATA.findIndex((item) => item.id === id);
    return index >= 0 ? index : null;
  });
  const [hot, setHot] = useState<number | null>(null);
  const [sound, setSound] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const audioRef = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);
  const closeTimer = useRef<number | null>(null);

  const open = useCallback((index: number) => setActive(index), []);
  const close = useCallback(() => setActive(null), []);

  const showIndex = indexOpen || active !== null;

  const holdIndex = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setIndexOpen(true);
  }, []);

  const releaseIndex = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setIndexOpen(false), 280);
  }, []);

  /* lock the page + fade the scene in */
  useEffect(() => {
    const html = document.documentElement;
    const previousTitle = document.title;
    html.classList.add('ct-lock');
    document.body.classList.add('ct-lock');
    document.title = 'Rakshak Patel V — Card Tunnel';

    const raf = requestAnimationFrame(() => setReady(true));

    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove('ct-lock');
      document.body.classList.remove('ct-lock');
      document.title = previousTitle;
    };
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const dir = event.key === 'ArrowRight' ? 1 : -1;
        setActive((current) => {
          const base = current ?? (dir === 1 ? -1 : 0);
          return (base + dir + CARD_DATA.length) % CARD_DATA.length;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  /* audio cleanup */
  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) audio.ctx.close().catch(() => undefined);
    },
    [],
  );

  const toggleSound = useCallback(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audioRef.current = null;
      audio.gain.gain.cancelScheduledValues(audio.ctx.currentTime);
      audio.gain.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + 0.4);
      window.setTimeout(() => audio.ctx.close().catch(() => undefined), 700);
      setSound(false);
      return;
    }

    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 430;
    filter.Q.value = 0.7;
    filter.connect(master);

    [55, 82.5, 110, 164.81].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = i === 0 ? 0.5 : 0.16;
      osc.connect(gain).connect(filter);
      osc.start();
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 170;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.4);
    audioRef.current = { ctx, gain: master };
    setSound(true);
  }, []);

  const project = active === null ? null : CARD_DATA[active];
  const progress = useMemo(() => {
    const current = active ?? 0;
    return {
      index: String(current + 1).padStart(2, '0'),
      total: String(CARD_DATA.length).padStart(2, '0'),
      width: `${((current + 1) / CARD_DATA.length) * 100}%`,
    };
  }, [active]);

  return (
    <div className={`ct-root${ready ? ' ct-ready' : ''}`} data-view={active === null ? 'intro' : 'focus'}>
      <div className="ct-scene" aria-hidden={active !== null}>
        <div className="ct-floor" />
        <div className="ct-world">
          <div className="ct-drift">
            {TILES.map((tile) => (
              <TileCard
                key={tile.key}
                tile={tile}
                hot={hot === tile.project}
                onOpen={open}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="ct-glow" aria-hidden="true" />
      <div className="ct-vignette" aria-hidden="true" />

      <div className="ct-dim" onClick={close} aria-hidden="true" />

      {project && (
        <div className="ct-preview" key={project.id}>
          <a
            className="ct-preview-card"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundImage: `url(${project.poster})` }}
            aria-label={`Open ${project.caption} in a new tab`}
          >
            <span className="ct-preview-cta">Open {project.caption} ↗</span>
          </a>
        </div>
      )}

      <div className="ct-person" aria-hidden="true">
        <Figure />
      </div>
      <div className="ct-person-shadow" aria-hidden="true" />

      <div className="ct-ui">
        <header className="ct-top">
          <Link className="ct-brand" to="/">
            Rakshak Patel V
          </Link>
          <div className="ct-topright" onMouseLeave={releaseIndex}>
            <button
              type="button"
              className="ct-index-toggle"
              data-open={showIndex ? 'true' : 'false'}
              onMouseEnter={holdIndex}
              onFocus={holdIndex}
              onClick={() => setIndexOpen((v) => !v)}
              aria-expanded={showIndex}
            >
              Index
            </button>
            <span className="ct-rule" aria-hidden="true" />
            <button
              type="button"
              className="ct-sound"
              data-on={sound ? 'true' : 'false'}
              onClick={toggleSound}
              aria-pressed={sound}
            >
              <span className="ct-sound-dot" aria-hidden="true" />
              {sound ? 'Sound on' : 'Sound off'}
            </button>
          </div>
        </header>

        <nav
          className="ct-index"
          data-open={showIndex ? 'true' : 'false'}
          aria-label="Project index"
          onMouseEnter={holdIndex}
          onMouseLeave={releaseIndex}
        >
          {CARD_DATA.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className="ct-index-item"
              data-active={i === active ? 'true' : 'false'}
              data-hot={i === hot ? 'true' : 'false'}
              onMouseEnter={() => setHot(i)}
              onFocus={() => setHot(i)}
              onMouseLeave={() => setHot((h) => (h === i ? null : h))}
              onBlur={() => setHot((h) => (h === i ? null : h))}
              onClick={() => open(i)}
            >
              <span>{item.caption}</span>
              <span className="ct-index-line" aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className="ct-caption">
          <div className="ct-caption-inner" key={project ? project.id : 'intro'}>
            <div className="ct-progress">
              <span>{progress.index}</span>
              <span className="ct-progress-line" aria-hidden="true">
                <i className="ct-progress-fill" style={{ width: progress.width }} />
              </span>
              <span>{progress.total}</span>
            </div>

            {project ? (
              <>
                <h1 className="ct-title">{project.caption}</h1>
                <p className="ct-category">{project.category}</p>
                <p className="ct-tagline">{project.tagline}</p>
                <div className="ct-actions">
                  <a
                    className="ct-action ct-action--primary"
                    href={project.href}
                    rel="noopener noreferrer"
                  >
                    Step inside <span aria-hidden="true">→</span>
                  </a>
                  <a
                    className="ct-action"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in a new tab <span aria-hidden="true">↗</span>
                  </a>
                  <button type="button" className="ct-action" onClick={close}>
                    Back <span aria-hidden="true">×</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="ct-title">
                  Every card is a live
                  <br />
                  project.
                </h1>
                <p className="ct-tagline">Designed, built and shipped by Rakshak Patel.</p>
                <div className="ct-actions">
                  <Link className="ct-action ct-action--primary" to="/projects">
                    View all projects <span aria-hidden="true">→</span>
                  </Link>
                  <Link className="ct-action" to="/#contact">
                    Get in touch <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </>
            )}

            <div className="ct-mobile-dots" role="tablist" aria-label="Projects">
              {CARD_DATA.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  className="ct-mobile-dot"
                  data-active={i === active ? 'true' : 'false'}
                  aria-selected={i === active}
                  aria-label={item.caption}
                  onClick={() => open(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ct-grain" aria-hidden="true" />
    </div>
  );
};

export default RibbonHero;
