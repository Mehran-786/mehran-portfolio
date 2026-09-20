import React, { useEffect } from 'react';
import { SITE_URL, getSiteUrl } from '../config/env';

/**
 * SEO component to dynamically manage per-page head tags & structured data
 * All URLs are dynamically built from SITE_URL (env NEXT_PUBLIC_SITE_URL).
 */
export default function SEO({
  title = "Mehran Rasool — Full-Stack Web & App Developer",
  description = "Mehran Rasool is a full-stack developer and AI engineer based in Wah Cantt, Pakistan, building web apps with React and Next.js, Flutter mobile apps, and applied AI systems.",
  canonical = getSiteUrl('/'),
  ogType = "website",
  ogImage = getSiteUrl('/og-image.png'),
  ogImageAlt = "Mehran Rasool — Full-Stack Web, Flutter App & AI Developer",
  jsonLd = null,
}) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // Helper to set or create meta tags
    const setMeta = (attr, key, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // 2. Standard Meta
    setMeta('name', 'description', description);

    // 3. Canonical Tag
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
    }

    // 4. Open Graph Meta
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:secure_url', ogImage);
    setMeta('property', 'og:image:alt', ogImageAlt);
    setMeta('property', 'og:locale', 'en_US');

    // 5. Twitter Card Meta
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:url', canonical);
    setMeta('name', 'twitter:image', ogImage);
    setMeta('name', 'twitter:image:alt', ogImageAlt);

    // 6. JSON-LD Structured Data
    let scriptEl = document.getElementById('dynamic-jsonld');
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'dynamic-jsonld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      const dataArray = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      scriptEl.textContent = JSON.stringify(dataArray.length === 1 ? dataArray[0] : dataArray);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [title, description, canonical, ogType, ogImage, ogImageAlt, jsonLd]);

  return null;
}
