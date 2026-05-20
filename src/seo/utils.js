import { getSiteUrl } from './siteConfig';

const LANGUAGE_MAP = {
  arabic: { hreflang: 'ar', label: 'Arabic', htmlLang: 'ar', direction: 'rtl' },
  bengali: { hreflang: 'bn', label: 'Bengali', htmlLang: 'bn', direction: 'ltr' },
  english: { hreflang: 'en', label: 'English', htmlLang: 'en', direction: 'ltr' },
  german: { hreflang: 'de', label: 'German', htmlLang: 'de', direction: 'ltr' },
  gujarati: { hreflang: 'gu', label: 'Gujarati', htmlLang: 'gu', direction: 'ltr' },
  hindi: { hreflang: 'hi', label: 'Hindi', htmlLang: 'hi', direction: 'ltr' },
  kannada: { hreflang: 'kn', label: 'Kannada', htmlLang: 'kn', direction: 'ltr' },
  malayalam: { hreflang: 'ml', label: 'Malayalam', htmlLang: 'ml', direction: 'ltr' },
  mandarin: { hreflang: 'zh', label: 'Mandarin', htmlLang: 'zh', direction: 'ltr' },
  marathi: { hreflang: 'mr', label: 'Marathi', htmlLang: 'mr', direction: 'ltr' },
  punjabi: { hreflang: 'pa', label: 'Punjabi', htmlLang: 'pa', direction: 'ltr' },
  russian: { hreflang: 'ru', label: 'Russian', htmlLang: 'ru', direction: 'ltr' },
  sanskrit: { hreflang: 'sa', label: 'Sanskrit', htmlLang: 'sa', direction: 'ltr' },
  tamil: { hreflang: 'ta', label: 'Tamil', htmlLang: 'ta', direction: 'ltr' },
  telegu: { hreflang: 'te', label: 'Telugu', htmlLang: 'te', direction: 'ltr' },
  telugu: { hreflang: 'te', label: 'Telugu', htmlLang: 'te', direction: 'ltr' },
  urdu: { hreflang: 'ur', label: 'Urdu', htmlLang: 'ur', direction: 'rtl' }
};

export const normalizeLanguageSlug = (value = 'english') => {
  const normalized = String(value).trim().toLowerCase();

  if (!normalized) return 'english';

  const cleaned = normalized.replace(/^_+|_+$/g, '');

  if (cleaned === 'mandarine') return 'mandarin';
  if (cleaned === 'telegu') return 'telugu';
  if (cleaned === 'gujrati') return 'gujarati';
  if (cleaned === 'kannadaa') return 'kannada';

  return cleaned;
};

export const getLanguageMeta = (value = 'english') => {
  const normalized = normalizeLanguageSlug(value);
  return LANGUAGE_MAP[normalized] || {
    hreflang: normalized,
    label: normalized.charAt(0).toUpperCase() + normalized.slice(1),
    htmlLang: normalized,
    direction: 'ltr'
  };
};

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
};

export const stripHtml = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const truncateText = (value = '', maxLength = 160) => {
  const text = stripHtml(value);
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
};

export const uniqueValues = (values = []) => [...new Set(values.filter(Boolean))];

export const titleCase = (value = '') =>
  String(value)
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
