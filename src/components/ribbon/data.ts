/* Screenshots of Rakshak's live projects, captured at 1440×900.
   The tunnel cards and the preview both open the matching live URL. */
const PROJECTS = [
  {
    id: 'gmpx',
    caption: 'GMPX',
    category: 'SaaS Tool',
    tagline: 'Track, monitor and calculate GMP without the spreadsheets.',
    href: 'https://gmpx-track-monitor-calculate.vercel.app/',
    poster: '/ribbon/gmpx.jpg',
  },
  {
    id: 'geobuzz',
    caption: 'GeoBuzz',
    category: 'Mobile App',
    tagline: 'Location-first discovery for the people and places around you.',
    href: 'https://geobuzz-app.vercel.app/',
    poster: '/ribbon/geobuzz.jpg',
  },
  {
    id: 'carreriq',
    caption: 'Carrer iq',
    category: 'AI Platform',
    tagline: 'AI-guided career intelligence, from résumé to offer.',
    href: 'https://carreriq-nine.vercel.app/',
    poster: '/ribbon/carreriq.jpg',
  },
  {
    id: 'opssphere',
    caption: 'OpsSphere',
    category: 'SaaS Tool',
    tagline: 'Operations, telemetry and teams unified in one sphere.',
    href: 'https://ops-sphere.vercel.app/',
    poster: '/ribbon/opssphere.jpg',
  },
  {
    id: 'transit-erp',
    caption: 'Transit ERP',
    category: 'SaaS Tool',
    tagline: 'Fleet, freight and finance in a single transit system.',
    href: 'https://transit-erp.vercel.app/',
    poster: '/ribbon/transit-erp.jpg',
  },
  {
    id: 'campus-connect',
    caption: 'Campus Connect',
    category: 'AI Platform',
    tagline: 'One connected campus for students, faculty and events.',
    href: 'https://amc-campus-connect-real-c6qg.vercel.app/',
    poster: '/ribbon/campus-connect.jpg',
  },
  {
    id: 'siskshasethu',
    caption: 'SiskshaSethu',
    category: 'Web App',
    tagline: 'A bridge between curious learners and great teachers.',
    href: 'https://siskshasethu.vercel.app/',
    poster: '/ribbon/siskshasethu.jpg',
  },
  {
    id: 'out-of-office',
    caption: 'Out of Office',
    category: 'Web App',
    tagline: 'Travel, escapes and the fine art of logging off.',
    href: 'https://out-of-office-xi.vercel.app/',
    poster: '/ribbon/out-of-office.jpg',
  },
];

export type CardData = {
  id: string;
  caption: string;
  category: string;
  tagline: string;
  href: string;
  aspect: number;
  poster: string;
  video?: string;
};

export const CARD_DATA: CardData[] = PROJECTS.map((project) => ({
  ...project,
  aspect: 1.6,
}));
