/**
 * Centralized Cloudflare R2 Media Configuration
 * 
 * Target Bucket: thedivevillage-co
 * Media Delivery: /media rewritten via Vercel Edge Rules
 */

export const R2_PUBLIC_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_R2_PUBLIC_BASE_URL) ||
  '/media';

export function getR2Url(objectKey) {
  if (!objectKey) return '';
  const cleanKey = objectKey.replace(/^\/+/, '');
  // Encode each segment preserving slashes
  const encodedPath = cleanKey
    .split('/')
    .map(seg => encodeURIComponent(seg).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase()))
    .join('/');
  return `${R2_PUBLIC_BASE_URL}/${encodedPath}`;
}
