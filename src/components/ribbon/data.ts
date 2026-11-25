/* Screenshots of Rakshak's live projects, captured at 1440×900.
   The cards open the matching live URL. */
const PROJECTS = [
  {
    caption: 'GMPX',
    href: 'https://gmpx-track-monitor-calculate.vercel.app/',
    poster: '/ribbon/gmpx.jpg',
  },
  {
    caption: 'GeoBuzz',
    href: 'https://geobuzz-app.vercel.app/',
    poster: '/ribbon/geobuzz.jpg',
  },
  {
    caption: 'Carrer iq',
    href: 'https://carreriq-nine.vercel.app/',
    poster: '/ribbon/carreriq.jpg',
  },
  {
    caption: 'OpsSphere',
    href: 'https://ops-sphere.vercel.app/',
    poster: '/ribbon/opssphere.jpg',
  },
  {
    caption: 'Transit ERP',
    href: 'https://transit-erp.vercel.app/',
    poster: '/ribbon/transit-erp.jpg',
  },
  {
    caption: 'Campus Connect',
    href: 'https://amc-campus-connect-real-c6qg.vercel.app/',
    poster: '/ribbon/campus-connect.jpg',
  },
  {
    caption: 'SiskshaSethu',
    href: 'https://siskshasethu.vercel.app/',
    poster: '/ribbon/siskshasethu.jpg',
  },
  {
    caption: 'Out of Office',
    href: 'https://out-of-office-xi.vercel.app/',
    poster: '/ribbon/out-of-office.jpg',
  },
];

export type CardData = {
  caption: string;
  href: string;
  aspect: number;
  poster: string;
  video?: string;
};

export const CARD_DATA: CardData[] = PROJECTS.map((project) => ({
  ...project,
  aspect: 1.6,
}));
