/**
 * Centralized Cloudflare R2 Media Configuration
 * 
 * Target Bucket: thedivevillage-co
 * Public Development/Staging URL: https://pub-4163c0b42ded4a0a9b4f34a1460da643.r2.dev
 */

export const R2_PUBLIC_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_R2_PUBLIC_BASE_URL) ||
  'https://pub-4163c0b42ded4a0a9b4f34a1460da643.r2.dev';

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
