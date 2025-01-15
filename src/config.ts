// Default to production URL if environment variable is not set
const DEFAULT_API_URL = 'https://deal-cost-calculator.onrender.com';

export const API_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    console.warn('VITE_API_URL not set, using default API URL:', DEFAULT_API_URL);
    return DEFAULT_API_URL;
  }
  // Remove trailing slash if present
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
})();
