import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Medal,
  Sparkles,
  Trophy,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  certificateFilters,
  certificates,
  featuredAchievements,
  type AchievementAccent,
  type CertificateCategory,
  type CertificateFilter,
  type CertificateItem,
  type FeaturedAchievement,
} from '@/data/achievements';
import { API_URL } from '../config';
import { fetchWithCache } from '../lib/cache';

/* -------------------------------------------------------------------------- */
/*  API mapping                                                               */
/* -------------------------------------------------------------------------- */

interface ApiAchievement {
  _id?: string;
  id?: string;
  type?: string;
  title?: string;
  project?: string;
  achievement?: string;
  year?: string;
  organization?: string;
  description?: string;
  category?: CertificateCategory;
  accent?: AchievementAccent;
  image?: string;
  certificate?: string;
  isHidden?: boolean;
}

const resolveUrl = (value?: string) => {
  if (!value) return '';
  return value.startsWith('/uploads') ? `${API_URL}${value}` : value;
};

const toFeaturedAchievement = (item: ApiAchievement, index: number): FeaturedAchievement => ({
  id: item._id || item.id || `hackathon-${index}`,
  type: 'hackathon',
  title: item.title || '',
  project: item.project || '',
  achievement: item.achievement || 'Winner',
  year: item.year || '',
  organization: item.organization || '',
  image: resolveUrl(item.image),
  certificate: resolveUrl(item.certificate),
  description: item.description || '',
  accent: item.accent === 'silver' ? 'silver' : 'gold',
});

const toCertificateItem = (item: ApiAchievement, index: number): CertificateItem => ({
  id: item._id || item.id || `certificate-${index}`,
  title: item.title || '',
  issuer: item.organization || '',
  year: item.year || '',
  category: item.category || 'Other',
  image: resolveUrl(item.image || item.certificate),
});

const staticFallback: ApiAchievement[] = [
  ...featuredAchievements.map((item) => ({ ...item, _id: item.id })),
  ...certificates.map((item) => ({
    ...item,
    _id: item.id,
    type: 'certificate',
    organization: item.issuer,
  })),
];

/* -------------------------------------------------------------------------- */
/*  Accent themes                                                             */
/* -------------------------------------------------------------------------- */

const ACCENTS: Record<
  AchievementAccent,
  {
    text: string;
    border: string;
    hoverBorder: string;
    badge: string;
    gradient: string;
    line: string;
    shadow: string;
    hoverShadow: string;
    dot: string;
  }
> = {
  gold: {
    text: 'text-[#e8c97a]',
    border: 'border-[#e8c97a]/20',
    hoverBorder: 'group-hover:border-[#e8c97a]/40',
    badge: 'border-[#e8c97a]/30 bg-[#e8c97a]/10 text-[#e8c97a]',
    gradient: 'from-[#e8c97a]/12 via-[#e8c97a]/[0.03] to-transparent',
    line: 'via-[#e8c97a]/60',
    shadow: 'shadow-[0_30px_90px_-50px_rgba(232,201,122,0.4)]',
    hoverShadow: 'group-hover:shadow-[0_50px_120px_-50px_rgba(232,201,122,0.5)]',
    dot: 'bg-[#e8c97a]',
  },
  silver: {
    text: 'text-[#cbd5e4]',
    border: 'border-[#cbd5e4]/20',
    hoverBorder: 'group-hover:border-[#cbd5e4]/40',
    badge: 'border-[#cbd5e4]/30 bg-[#cbd5e4]/10 text-[#cbd5e4]',
    gradient: 'from-[#cbd5e4]/10 via-[#cbd5e4]/[0.03] to-transparent',
    line: 'via-[#cbd5e4]/50',
    shadow: 'shadow-[0_30px_90px_-50px_rgba(203,213,228,0.32)]',
    hoverShadow: 'group-hover:shadow-[0_50px_120px_-50px_rgba(203,213,228,0.42)]',
    dot: 'bg-[#cbd5e4]',
  },
};

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
  eager?: boolean;
}

/** Renders an image, or the supplied placeholder if the path is empty/broken. */
const SafeImage = ({ src, alt, className = '', fallback, eager = false }: SafeImageProps) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};

const FeaturedPlaceholder = ({ accent }: { accent: AchievementAccent }) => {
  const theme = ACCENTS[accent];
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#07030c]">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
      <div className={`absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border ${theme.border}`} />
      <div className={`absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border ${theme.border} opacity-60`} />
      <div className={`absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent ${theme.line} to-transparent opacity-40`} />
      <div className="relative flex flex-col items-center gap-3">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${theme.badge}`}>
          <Trophy size={28} />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-500">Award Visual</span>
      </div>
    </div>
  );
};

const CertificatePlaceholder = () => (  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b0513] to-[#050208]">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(217,70,239,0.09),transparent_65%)]" />

    {/* Stylised blank document */}
    <div className="relative flex h-[84%] w-[88%] flex-col items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.015] px-6">
      <span className="pointer-events-none absolute inset-1.5 rounded border border-white/[0.04]" />
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8c97a]/25 bg-[#e8c97a]/[0.06] text-[#e8c97a]/70">
        <Award size={15} />
      </div>
      <div className="mt-4 w-full space-y-1.5">
        <span className="mx-auto block h-px w-2/3 bg-white/[0.09]" />
        <span className="mx-auto block h-px w-1/2 bg-white/[0.06]" />
        <span className="mx-auto block h-px w-3/5 bg-white/[0.05]" />
      </div>
      <span className="mt-4 font-mono text-[7px] uppercase tracking-[0.3em] text-slate-600">Awaiting upload</span>
    </div>
  </div>
);

/** Compact fallback used inside the full-screen viewer (never a giant blank page). */
const ViewerFallback = () => (
  <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-8 py-14 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e8c97a]/25 bg-[#e8c97a]/[0.06] text-[#e8c97a]">
      <Award size={24} />
    </div>
    <div>
      <p className="text-sm font-bold text-white">Certificate image coming soon</p>
      <p className="mt-1.5 text-xs font-light leading-relaxed text-slate-500">
        The document for this entry has not been uploaded yet.
      </p>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Featured hackathon panel                                                  */
/* -------------------------------------------------------------------------- */

interface FeaturedCardProps {
  item: FeaturedAchievement;
  index: number;
  total: number;
  inView: boolean;
  onViewCertificate: () => void;
}

const FeaturedCard = ({ item, index, total, inView, onViewCertificate }: FeaturedCardProps) => {
  const theme = ACCENTS[item.accent];
  const reversed = index % 2 === 1;

  return (
    <article
      className={`achv-reveal ${inView ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${120 + index * 140}ms` }}
    >
      {/* Ledger rail */}
      <div className="mb-4 flex items-center gap-4">
        <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.3em] ${theme.text}`}>
          No. {String(index + 1).padStart(2, '0')}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.28em] text-slate-400 sm:block">
          {item.achievement}
        </span>
        <span className={`hidden h-1 w-1 rounded-full sm:block ${theme.dot}`} />
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">{item.year}</span>
      </div>

      <div
        className={`group relative overflow-hidden rounded-[2rem] border ${theme.border} ${theme.hoverBorder} bg-gradient-to-br from-[#0b0613] via-[#07020d] to-[#050208] transition-all duration-700 motion-reduce:transition-none ${theme.shadow} ${theme.hoverShadow}`}
      >
        {/* Accent hairline */}
        <div className={`absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent ${theme.line} to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-100`} />
        {/* Animated edge */}
        <div className={`pointer-events-none absolute inset-y-8 left-0 z-30 w-px bg-gradient-to-b from-transparent ${theme.line} to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100`} />

        <div className="grid lg:grid-cols-[1.08fr_1fr]">
          {/* Artwork */}
          <div
            className={`relative min-h-[300px] overflow-hidden border-b border-white/5 sm:min-h-[360px] lg:min-h-[470px] lg:border-b-0 ${
              reversed ? 'lg:order-2 lg:border-l' : 'lg:border-r'
            }`}
          >
            <SafeImage
              src={item.image}
              alt={`${item.title} achievement`}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
              fallback={<FeaturedPlaceholder accent={item.accent} />}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07020d] via-[#07020d]/15 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050208]/40 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-[1400ms] ease-out group-hover:translate-x-full motion-reduce:hidden" />

            {/* Winner label */}
            <div className={`absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border ${theme.badge} px-3.5 py-1.5 backdrop-blur-md`}>
              <Trophy size={12} />
              <span className="text-[9px] font-black uppercase tracking-[0.25em]">{item.achievement}</span>
            </div>

            {/* Year */}
            <div className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md">
              <Calendar size={11} className="text-slate-400" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">{item.year}</span>
            </div>

            {/* Artwork footer */}
            <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <span className="block font-mono text-[8px] uppercase tracking-[0.35em] text-white/40">Presented by</span>
                <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                  {item.organization || 'Organizing Body'}
                </span>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${theme.border} bg-black/40 backdrop-blur-md ${theme.text}`}>
                <Medal size={18} />
              </div>
            </div>
          </div>

          {/* Story */}
          <div className={`relative flex flex-col justify-center p-7 sm:p-9 lg:p-12 ${reversed ? 'lg:order-1' : ''}`}>
            {/* Ghost numeral */}
            <span className="pointer-events-none absolute -right-3 -top-8 z-0 select-none text-[9rem] font-black leading-none tracking-tighter text-white/[0.025]">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className={`h-px w-7 ${theme.dot} opacity-70`} />
                <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.35em] ${theme.text}`}>
                  Featured Win
                </span>
              </div>

              <h3 className="mt-4 text-[1.85rem] font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl lg:text-[2.7rem]">
                {item.title || 'Hackathon Name'}
              </h3>

              <p className="mt-4 flex items-center gap-2.5 text-sm font-medium text-slate-300">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot} opacity-80`} />
                <span className="truncate">{item.project || 'Project Name'}</span>
              </p>

              <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-slate-400">
                {item.description}
              </p>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between gap-4 border-t border-white/5 pt-6">
              <button
                type="button"
                onClick={onViewCertificate}
                className="group/btn inline-flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d946ef]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050208]"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border ${theme.border} bg-white/[0.02] ${theme.text} transition-transform duration-500 group-hover/btn:scale-105 motion-reduce:transition-none`}>
                  <SafeImage
                    src={item.certificate}
                    alt=""
                    className="h-full w-full object-cover"
                    fallback={<Award size={18} />}
                  />
                </span>
                <span className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/90 transition-colors group-hover/btn:text-white">
                    View Certificate
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
                    Award document
                    <ArrowUpRight
                      size={11}
                      className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                    />
                  </span>
                </span>
              </button>

              <span className="font-mono text-[10px] tracking-[0.25em] text-slate-600">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*  Certificate gallery card                                                  */
/* -------------------------------------------------------------------------- */

const CertificateCard = ({
  item,
  onOpen,
}: {
  item: CertificateItem;
  onOpen: () => void;
}) => (
  <button
    type="button"
    onClick={onOpen}
    className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08040e] text-left transition-all duration-500 hover:-translate-y-1 hover:border-[#e8c97a]/35 hover:shadow-[0_30px_70px_-35px_rgba(232,201,122,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c97a]/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
  >
    {/* Foil strip */}
    <span className="block h-px w-full bg-gradient-to-r from-[#e8c97a]/70 via-[#d946ef]/40 to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#06030b] p-3">
      <span className="pointer-events-none absolute inset-3 z-10 rounded-lg border border-white/[0.06] transition-colors duration-500 group-hover:border-[#e8c97a]/20" />
      <SafeImage
        src={item.image}
        alt={`${item.title} certificate`}
        className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        fallback={<CertificatePlaceholder />}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050208]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <span className="absolute left-5 top-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
        {item.category}
      </span>
      <span className="absolute right-5 top-5 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/50 text-slate-300 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:border-[#e8c97a]/40 group-hover:text-[#e8c97a] group-hover:opacity-100">
        <ZoomIn size={12} />
      </span>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
        <span className="truncate">{item.issuer || 'Credential'}</span>
        <span className="shrink-0">{item.year}</span>
      </div>
      <h4 className="mt-2.5 text-[15px] font-bold leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-[#e8c97a]">
        {item.title}
      </h4>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/5 pt-3.5">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-600">{item.category}</span>
        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors duration-300 group-hover:text-white">
          View
          <ArrowUpRight
            size={12}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </div>
  </button>
);

/* -------------------------------------------------------------------------- */
/*  Full-screen certificate viewer                                            */
/* -------------------------------------------------------------------------- */

interface CertificateViewerProps {
  items: CertificateItem[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

const CertificateViewer = ({ items, index, onNavigate, onClose }: CertificateViewerProps) => {
  const item = items[index];
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(onClose, 220);
  }, [onClose]);

  const goTo = useCallback(
    (next: number) => {
      if (items.length === 0) return;
      onNavigate((next + items.length) % items.length);
    },
    [items.length, onNavigate]
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goTo, index, requestClose]);

  if (!item) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 ${
        visible && !closing ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-200`}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} certificate`}
    >
      <button
        type="button"
        aria-label="Close certificate viewer"
        onClick={requestClose}
        tabIndex={-1}
        className="absolute inset-0 h-full w-full cursor-default bg-black/85 backdrop-blur-xl"
      />

      <div
        ref={panelRef}
        className={`relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08030e] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] transition-all duration-300 ease-out md:rounded-[2rem] ${
          visible && !closing ? 'translate-y-0 scale-100' : 'translate-y-5 scale-[0.97]'
        }`}
      >
        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-7">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8c97a]/50 to-transparent" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-[0.25em] text-slate-500">
              <span className="rounded-full border border-[#e8c97a]/25 bg-[#e8c97a]/10 px-2 py-0.5 text-[#e8c97a]">
                {item.category}
              </span>
              <span>{item.issuer}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>{item.year}</span>
            </div>
            <h3 className="mt-2 truncate text-lg font-black tracking-tight text-white sm:text-xl">{item.title}</h3>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {item.image && (
              <a
                href={item.image}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300 transition-colors hover:border-[#e8c97a]/35 hover:text-white sm:inline-flex"
              >
                <ExternalLink size={12} /> Open Original
              </a>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={requestClose}
              aria-label="Close certificate viewer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition-all hover:border-[#e8c97a]/40 hover:bg-[#e8c97a]/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Stage */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/40 p-3 sm:p-6">
          <div className="flex max-h-[62vh] w-full items-center justify-center sm:max-h-[66vh]">
            <SafeImage
              key={item.id}
              src={item.image}
              alt={`${item.title} certificate`}
              eager
              className="max-h-[62vh] w-auto max-w-full rounded-lg object-contain shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] sm:max-h-[66vh]"
              fallback={
                <div className="flex w-full items-center justify-center px-2">
                  <ViewerFallback />
                </div>
              }
            />
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous certificate"
                className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-md transition-all hover:border-[#e8c97a]/40 hover:bg-[#e8c97a]/15 hover:text-white sm:left-4 sm:h-11 sm:w-11"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next certificate"
                className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-md transition-all hover:border-[#e8c97a]/40 hover:bg-[#e8c97a]/15 hover:text-white sm:right-4 sm:h-11 sm:w-11"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-white/5 px-5 py-3.5 sm:px-7">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-3">
            {item.image && (
              <a
                href={item.image}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-white sm:hidden"
              >
                <ExternalLink size={12} /> Open
              </a>
            )}
            <span className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600 sm:flex">
              <span className="inline-flex items-center gap-1">
                <ArrowLeft size={11} /> Prev
              </span>
              <span className="inline-flex items-center gap-1">
                Next <ArrowRight size={11} />
              </span>
              <span className="rounded border border-white/10 px-1.5 py-0.5">Esc</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

const Achievements = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CertificateFilter>('All');
  const [viewer, setViewer] = useState<{ items: CertificateItem[]; index: number } | null>(null);
  const [featured, setFeatured] = useState<FeaturedAchievement[]>(featuredAchievements);
  const [credentialList, setCredentialList] = useState<CertificateItem[]>(certificates);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchWithCache<ApiAchievement[]>(
      `${API_URL}/api/achievements`,
      (data) => {
        const visible = (Array.isArray(data) ? data : []).filter((item) => !item.isHidden);
        setFeatured(visible.filter((item) => item.type === 'hackathon').map(toFeaturedAchievement));
        setCredentialList(visible.filter((item) => item.type !== 'hackathon').map(toCertificateItem));
      },
      staticFallback,
      (data) => Array.isArray(data)
    );
  }, []);

  const allCertificates = useMemo<CertificateItem[]>(
    () => [
      ...featured.map((item) => ({
        id: `${item.id}-certificate`,
        title: item.title,
        issuer: item.organization,
        year: item.year,
        category: 'Hackathons' as CertificateCategory,
        image: item.certificate,
        project: item.project,
        achievement: item.achievement,
      })),
      ...credentialList,
    ],
    [featured, credentialList]
  );

  const filteredCertificates = useMemo(
    () =>
      activeFilter === 'All'
        ? allCertificates
        : allCertificates.filter((certificate) => certificate.category === activeFilter),
    [activeFilter, allCertificates]
  );

  const countFor = (filter: CertificateFilter) =>
    filter === 'All'
      ? allCertificates.length
      : allCertificates.filter((certificate) => certificate.category === filter).length;

  const openFeaturedCertificate = (item: FeaturedAchievement) => {
    const index = allCertificates.findIndex((certificate) => certificate.id === `${item.id}-certificate`);
    if (index >= 0) {
      setViewer({ items: allCertificates, index });
    }
  };

  const outlineStyle = {
    color: 'transparent',
    WebkitTextStroke: '1px rgba(255, 255, 255, 0.22)',
  };

  return (
    <section id="achievements" ref={sectionRef} className="relative overflow-hidden bg-[#050208] py-24 text-white md:py-32">
      <style>{`
        @keyframes achv-card-in {
          from { opacity: 0; transform: translateY(18px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .achv-card {
          animation: achv-card-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .achv-reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .achv-reveal.is-visible {
          opacity: 1;
          transform: none;
        }
        @keyframes achv-shimmer {
          0%, 100% { opacity: 0.35; transform: scaleX(0.85); }
          50% { opacity: 1; transform: scaleX(1.15); }
        }
        .achv-shimmer {
          animation: achv-shimmer 4.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .achv-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .achv-card,
          .achv-shimmer {
            animation: none !important;
          }
        }
      `}</style>

      {/* Background lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-0 h-[28rem] w-[28rem] rounded-full bg-[#d946ef]/[0.06] blur-[150px]" />
        <div className="absolute right-[-8%] top-[22%] h-[30rem] w-[30rem] rounded-full bg-[#e8c97a]/[0.045] blur-[160px]" />
        <div className="absolute bottom-[8%] left-[-8%] h-[26rem] w-[26rem] rounded-full bg-[#8b1ff5]/[0.06] blur-[150px]" />
        {/* Faint vertical rules */}
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.02]" />
          <div className="absolute inset-y-0 left-[20%] w-px bg-white/[0.015]" />
          <div className="absolute inset-y-0 right-[20%] w-px bg-white/[0.015]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ---------------------------------------------------------------- */}
        {/*  Chapter marker                                                   */}
        {/* ---------------------------------------------------------------- */}
        <div className={`achv-reveal ${inView ? 'is-visible' : ''} flex items-center gap-4`}>
          <span className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-[#e8c97a]">
            <Trophy size={12} /> Recognition
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500">2024 — 2026</span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Introduction                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className={`achv-reveal ${inView ? 'is-visible' : ''} lg:col-span-7`} style={{ transitionDelay: '60ms' }}>
            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl md:text-7xl">
              Beyond the
              <br />
              <span className="bg-gradient-to-r from-[#e8c97a] via-[#f3ddb0] to-[#d946ef] bg-clip-text text-transparent">
                Code.
              </span>
            </h2>
            <div className="achv-shimmer mt-7 h-px w-40 bg-gradient-to-r from-[#e8c97a]/70 to-transparent" />
          </div>

          <div
            className={`achv-reveal ${inView ? 'is-visible' : ''} flex flex-col justify-end gap-8 lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-10`}
            style={{ transitionDelay: '140ms' }}
          >
            <p className="max-w-md text-sm font-light leading-relaxed text-slate-400 sm:text-base">
              Every achievement represents a challenge accepted, an idea brought to life, and a milestone
              worth remembering.
            </p>

            <div className="grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#e8c97a]/15 bg-[#e8c97a]/[0.03] px-5 py-4">
                <span className="block text-3xl font-black leading-none tracking-tighter text-[#e8c97a]">
                  {String(featured.length).padStart(2, '0')}
                </span>
                <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.22em] text-slate-500">
                  Hackathon Wins
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <span className="block text-3xl font-black leading-none tracking-tighter text-[#d946ef]">
                  {String(allCertificates.length).padStart(2, '0')}
                </span>
                <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.22em] text-slate-500">
                  Credentials
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Featured wins                                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-20 md:mt-24">
          <div
            className={`achv-reveal ${inView ? 'is-visible' : ''} flex items-end justify-between gap-6`}
            style={{ transitionDelay: '80ms' }}
          >
            <div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-slate-500">
                The Honours List
              </span>
              <h3 className="mt-2 text-2xl font-black uppercase leading-none tracking-tighter sm:text-3xl">
                Signature <span className="text-[#e8c97a]">Wins</span>
              </h3>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600 sm:block">
              {String(featured.length).padStart(2, '0')} Entries
            </span>
          </div>

          {featured.length > 0 ? (
            <div className="mt-10 space-y-16 md:space-y-20">
              {featured.map((item, index) => (
                <FeaturedCard
                  key={item.id}
                  item={item}
                  index={index}
                  total={featured.length}
                  inView={inView}
                  onViewCertificate={() => openFeaturedCertificate(item)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.01] px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e8c97a]/20 bg-[#e8c97a]/5 text-[#e8c97a]">
                <Trophy size={18} />
              </div>
              <p className="text-sm text-slate-400">Signature wins will be showcased here soon.</p>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Certificate gallery                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-24 border-t border-white/5 pt-16 md:mt-32 md:pt-20">
          <div
            className={`achv-reveal ${inView ? 'is-visible' : ''} flex flex-col justify-between gap-6 lg:flex-row lg:items-end`}
            style={{ transitionDelay: '80ms' }}
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[#d946ef]">
                <span className="h-px w-8 bg-[#d946ef]" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.35em]">The Archive</span>
              </div>
              <h3 className="mt-4 text-3xl font-black uppercase leading-none tracking-tighter sm:text-4xl md:text-5xl">
                Credentials <span className="text-[#d946ef]">&</span>{' '}
                <span style={outlineStyle}>Milestones</span>
              </h3>
            </div>
            <p className="max-w-sm text-sm font-light leading-relaxed text-slate-400">
              A verified record of technical programs, workshops, and certifications earned along the way.
            </p>
          </div>

          {/* Filter toolbar */}
          <div
            className={`achv-reveal ${inView ? 'is-visible' : ''} mt-10 flex flex-col gap-4 border-y border-white/5 py-4 sm:flex-row sm:items-center sm:justify-between`}
            style={{ transitionDelay: '160ms' }}
          >
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter certificates by category">
              {certificateFilters.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                      isActive
                        ? 'border-[#e8c97a] bg-[#e8c97a] text-[#140d02] shadow-[0_0_30px_rgba(232,201,122,0.25)]'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-[#e8c97a]/35 hover:text-white'
                    }`}
                  >
                    {filter}
                    <span
                      className={`rounded px-1.5 py-0.5 text-[8px] ${
                        isActive ? 'bg-black/10 text-[#140d02]/70' : 'bg-white/[0.04] text-slate-500'
                      }`}
                    >
                      {countFor(filter)}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-600 sm:block">
              {String(filteredCertificates.length).padStart(2, '0')} Documents
            </span>
          </div>

          {/* Grid */}
          <div aria-live="polite">
            {filteredCertificates.length > 0 ? (
              <div key={activeFilter} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCertificates.map((item, index) => (
                  <div
                    key={item.id}
                    className={inView ? 'achv-card' : 'opacity-0'}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <CertificateCard
                      item={item}
                      onOpen={() => setViewer({ items: filteredCertificates, index })}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.01] px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-slate-500">
                  <Sparkles size={18} />
                </div>
                <p className="text-sm text-slate-400">No credentials in this category yet.</p>
                <button
                  type="button"
                  onClick={() => setActiveFilter('All')}
                  className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#e8c97a] transition-colors hover:text-white"
                >
                  Show all credentials
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewer && (
        <CertificateViewer
          items={viewer.items}
          index={viewer.index}
          onNavigate={(index) => setViewer((previous) => (previous ? { ...previous, index } : previous))}
          onClose={() => setViewer(null)}
        />
      )}
    </section>
  );
};

export default Achievements;
