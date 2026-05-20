import { absoluteUrl, truncateText } from './utils';
import { SITE_NAME } from './siteConfig';

export const createWebsiteSchema = ({
  url = '/',
  description = '',
  searchPath = '/mantras'
} = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: absoluteUrl(url),
  description,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${absoluteUrl(searchPath)}?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
});

export const createBreadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.url)
  }))
});

export const createCreativeWorkSchema = ({
  name,
  url,
  description,
  image,
  inLanguage = 'en',
  keywords = []
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name,
  headline: name,
  description: truncateText(description, 240),
  url: absoluteUrl(url),
  inLanguage,
  keywords,
  image: image ? [absoluteUrl(image)] : undefined,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/')
  }
});

export const createArticleSchema = ({
  name,
  url,
  description,
  image,
  inLanguage = 'en',
  authorName = SITE_NAME,
  publishedTime,
  modifiedTime,
  keywords = []
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: name,
  name,
  description: truncateText(description, 240),
  url: absoluteUrl(url),
  inLanguage,
  author: {
    '@type': 'Organization',
    name: authorName
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/')
  },
  image: image ? [absoluteUrl(image)] : undefined,
  datePublished: publishedTime,
  dateModified: modifiedTime || publishedTime,
  keywords
});
