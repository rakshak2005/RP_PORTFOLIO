/**
 * Achievements & Recognition data
 * ---------------------------------------------------------------------------
 * All copy and image paths live here so the section stays easy to update.
 *
 * Image paths can be:
 *   - a file in /public, e.g. "/images/achievements/hackathon-1.jpg"
 *   - an absolute URL, e.g. "https://..."
 * Leave a path as an empty string to render the built-in placeholder.
 */

export type AchievementAccent = 'gold' | 'silver';

export interface FeaturedAchievement {
  id: string;
  type: 'hackathon';
  title: string;
  project: string;
  achievement: string;
  year: string;
  organization: string;
  image: string;
  certificate: string;
  description: string;
  accent: AchievementAccent;
}

export type CertificateCategory =
  | 'Hackathons'
  | 'Technical'
  | 'Certifications'
  | 'Workshops'
  | 'Other';

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  category: CertificateCategory;
  image: string;
  project?: string;
  achievement?: string;
}

/**
 * FEATURED HACKATHON WINS
 * Replace the placeholder copy below with the real details once available.
 * Drop the artwork into public/images/achievements/ and reference it here.
 */
export const featuredAchievements: FeaturedAchievement[] = [
  {
    id: 'hackathon-1',
    type: 'hackathon',
    title: 'Hackathon Name',
    project: 'Project Name',
    achievement: 'Winner',
    year: '2026',
    organization: 'Organizing Body',
    image: '', // e.g. "/images/achievements/hackathon-1.jpg"
    certificate: '', // e.g. "/images/achievements/hackathon-1-certificate.jpg"
    description:
      'Add the story behind this win — the challenge, your role, the build, and what the judges recognised.',
    accent: 'gold',
  },
  {
    id: 'hackathon-2',
    type: 'hackathon',
    title: 'Hackathon Name',
    project: 'Project Name',
    achievement: 'Winner',
    year: '2026',
    organization: 'Organizing Body',
    image: '', // e.g. "/images/achievements/hackathon-2.jpg"
    certificate: '', // e.g. "/images/achievements/hackathon-2-certificate.jpg"
    description:
      'Add the story behind this win — the challenge, your role, the build, and what the judges recognised.',
    accent: 'silver',
  },
];

/**
 * OTHER CREDENTIALS
 * These are the certifications already listed in the Education section.
 * Add more entries here as new certificates are earned.
 */
export const certificates: CertificateItem[] = [
  {
    id: 'cert-codsoft-frontend',
    title: 'Front End Development',
    issuer: 'Codsoft',
    year: '2025',
    category: 'Technical',
    image: '', // e.g. "/images/achievements/codsoft-frontend.jpg"
  },
  {
    id: 'cert-oasis-development',
    title: 'Development',
    issuer: 'Oasis Infobyte',
    year: '2025',
    category: 'Certifications',
    image: '', // e.g. "/images/achievements/oasis-development.jpg"
  },
  {
    id: 'cert-oasis-flutter',
    title: 'Flutter Development',
    issuer: 'Oasis Infobyte',
    year: '2025',
    category: 'Technical',
    image: '', // e.g. "/images/achievements/oasis-flutter.jpg"
  },
  {
    id: 'cert-azure-fundamentals',
    title: 'Azure Fundamentals',
    issuer: 'Microsoft',
    year: '2022',
    category: 'Certifications',
    image: '', // e.g. "/images/achievements/azure-fundamentals.jpg"
  },
];

export const certificateFilters = [
  'All',
  'Hackathons',
  'Technical',
  'Certifications',
  'Workshops',
  'Other',
] as const;

export type CertificateFilter = (typeof certificateFilters)[number];
