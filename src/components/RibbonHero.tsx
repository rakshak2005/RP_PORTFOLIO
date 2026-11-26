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

const RADIUS = 1500;
const PER_RING = 24;
const ROWS = 6;
const ROW_GAP = 206;
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
        shade: 0.42 + t * 0.58,
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
  <svg viewBox="0 0 160 344" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="ct-fig" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0b0908" />
        <stop offset="0.5" stopColor="#171311" />
        <stop offset="1" stopColor="#070505" />
      </linearGradient>
    </defs>
    <g fill="url(#ct-fig)">
      <ellipse cx="80" cy="44" rx="17" ry="19" />
      <rect x="71" y="58" width="18" height="16" rx="6" />
      <path d="M58 70C47 78 42 96 40 122L34 200L30 238L54 242L62 200L68 242L92 242L98 200L106 242L130 238L126 200L120 122C118 96 113 78 102 70Z" />
      <path d="M62 240L78 240L76 296L80 332L62 332L58 296Z" />
      <path d="M82 240L98 240L102 296L106 332L88 332L84 296Z" />
      <path d="M58 328L82 328L84 338L54 338Z" />
      <path d="M86 328L110 328L112 338L82 338Z" />
    </g>
    <path
      d="M58 70C47 78 42 96 40 122L34 200L30 238"
      fill="none"
      stroke="rgba(240,177,131,0.35)"
      strokeWidth="1.6"
    />
    <path d="M66 66Q80 75 94 66" fill="none" stroke="rgba(255,200,160,0.22)" strokeWidth="2" />
  </svg>
);

/* ---------- page ---------- */

const RibbonHero = () => {
  const [active, setActive] = useState<number | null>(null);
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
