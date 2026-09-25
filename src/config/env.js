/**
 * Centralized Environment & URL Configuration
 * 
 * Never hardcode domains or R2 endpoints in application code.
 * Live site URL is driven by NEXT_PUBLIC_SITE_URL (default: https://mehranrasool.me).
 * File storage URL is driven by R2_PUBLIC_URL.
 */

// Determine base site URL from environment variables
export const SITE_URL = (
  (typeof import.meta !== 'undefined' && (import.meta.env?.NEXT_PUBLIC_SITE_URL || import.meta.env?.VITE_SITE_URL)) ||
  (typeof globalThis !== 'undefined' && (globalThis.process?.env?.NEXT_PUBLIC_SITE_URL || globalThis.process?.env?.SITE_URL)) ||
  'https://mehranrasool.me'
).replace(/\/+$/, '');

// Determine R2 public CDN URL from environment variables (using public prefixes only)
export const R2_PUBLIC_URL = (
  (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_R2_PUBLIC_URL || import.meta.env?.NEXT_PUBLIC_R2_PUBLIC_URL)) ||
  (typeof globalThis !== 'undefined' && (globalThis.process?.env?.VITE_R2_PUBLIC_URL || globalThis.process?.env?.NEXT_PUBLIC_R2_PUBLIC_URL || globalThis.process?.env?.R2_PUBLIC_URL)) ||
  ''
).replace(/\/+$/, '');

/**
 * Returns an absolute URL for any site route using the configured SITE_URL
 */
export const getSiteUrl = (path = '') => {
  if (!path) return SITE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;
};

/**
 * Returns an absolute URL for an R2 object key using the configured R2_PUBLIC_URL
 */
export const getR2Url = (key = '') => {
  if (!key) return '';
  if (key.startsWith('http://') || key.startsWith('https://') || key.startsWith('blob:')) {
    return key;
  }
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${cleanKey}` : `/${cleanKey}`;
};
