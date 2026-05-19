/**
 * Islamediaku — SEO Utilities
 * Custom hook for dynamic meta tags + JSON-LD component
 */
/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';

export const SITE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL)
  ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
  : 'https://islamediaku.vercel.app';

export const SITE_NAME = 'Islamediaku';

export const DEFAULT_SEO = {
  title: 'Islamediaku - Teks Khutbah Jumat, Kultum, Tausiyah, dan Aplikasi Islami Lengkap',
  description: 'Kumpulan teks khutbah Jumat, kultum Ramadhan, tausiyah Islam, dan rekomendasi tema dakwah berdasarkan kalender Hijriah. Siap pakai untuk khatib, dai, ustaz, dan pengurus masjid.',
  image: `${SITE_URL}/logo.png`,
};

/**
 * useSEO - Dynamically sets document title, meta description,
 * canonical URL, Open Graph, and Twitter Card tags.
 *
 * @param {Object} config
 * @param {string} config.title - Page title
 * @param {string} config.description - Page description
 * @param {string} [config.path] - Path after base URL (e.g. '/khutbah')
 * @param {string} [config.type] - OG type (default: 'website')
 * @param {string} [config.image] - OG image URL
 * @param {string} [config.robots] - Robots directive (default: 'index, follow')
 */
export function useSEO({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  path = '',
  type = 'website',
  image = DEFAULT_SEO.image,
  robots = 'index, follow',
} = {}) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`;

    // Title
    document.title = title;

    // Helper to set/create meta tags
    const setMeta = (attr, attrVal, content) => {
      let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:locale', 'id_ID');

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = DEFAULT_SEO.title;
      setMeta('name', 'description', DEFAULT_SEO.description);
    };
  }, [title, description, path, type, image, robots]);
}

/**
 * JsonLd - Renders a JSON-LD structured data script tag.
 * @param {Object} props
 * @param {Object|Array} props.data - JSON-LD data object(s)
 */
export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
