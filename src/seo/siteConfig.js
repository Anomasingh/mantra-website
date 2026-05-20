export const SITE_NAME = 'MantraSpirit';
export const SITE_DESCRIPTION = 'Explore devotional mantras, chalisas, stotras, lyrics, transliteration, translation, meaning, benefits, and chanting guides.';
export const DEFAULT_OG_IMAGE_PATH = '/images/Om1-Desktop.jpg';

export const getSiteUrl = () => {
  const configuredUrl = import.meta.env?.VITE_SITE_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }

  return 'https://mantraspirit.com';
};
