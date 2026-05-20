import { Helmet } from 'react-helmet-async';
import { absoluteUrl, getLanguageMeta } from './utils';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME } from './siteConfig';

const Seo = ({
  title,
  description,
  canonical,
  keywords = [],
  robots = 'index,follow',
  language = 'en',
  dir,
  image = DEFAULT_OG_IMAGE_PATH,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  alternates = [],
  jsonLd = []
}) => {
  const languageMeta = getLanguageMeta(language);
  const canonicalUrl = canonical ? absoluteUrl(canonical) : undefined;
  const resolvedImage = absoluteUrl(image);
  const locale = languageMeta.hreflang === 'en' ? 'en_US' : `${languageMeta.hreflang}_${languageMeta.hreflang.toUpperCase()}`;

  return (
    <Helmet htmlAttributes={{ lang: languageMeta.htmlLang, dir: dir || languageMeta.direction }}>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robots} />
      <meta name="language" content={languageMeta.htmlLang} />
      <meta httpEquiv="content-language" content={languageMeta.htmlLang} />

      <link rel="canonical" href={canonicalUrl} />

      {alternates.map((alternate) => (
        <link
          key={`${alternate.hrefLang}-${alternate.href}`}
          rel="alternate"
          hrefLang={alternate.hrefLang}
          href={absoluteUrl(alternate.href)}
        />
      ))}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:alt" content={title} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={resolvedImage} />

      {jsonLd.map((entry, index) => (
        <script key={`${entry['@type'] || 'schema'}-${index}`} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
