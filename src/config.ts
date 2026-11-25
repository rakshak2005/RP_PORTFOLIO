// In production, fall back to the hosted API. Locally, use the dev server.
const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://rp-portfolio-gb82.onrender.com'
  : 'http://localhost:5001';

export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
