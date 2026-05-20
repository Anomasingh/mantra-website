import { MANTRA_CATALOG, getCategoryLabel } from '../data/mantraCatalog';
import {
  getLanguageMeta,
  normalizeLanguageSlug,
  titleCase,
  truncateText,
  uniqueValues
} from './utils';
import { DEFAULT_OG_IMAGE_PATH, SITE_DESCRIPTION, SITE_NAME } from './siteConfig';
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createCreativeWorkSchema,
  createWebsiteSchema
} from './schema';

// Deity-aware spiritual taglines
const DEITY_TAGLINES = {
  'Durga': 'A powerful invocation to the divine mother for protection, courage, and victory over inner obstacles.',
  'Shiva': 'A sacred chant to awaken transformation, inner peace, and the divine masculine principle.',
  'Lakshmi': 'A devotional offering to the goddess of abundance, prosperity, and divine grace.',
  'Saraswati': 'An invocation to the goddess of wisdom, learning, arts, and spiritual enlightenment.',
  'Hanuman': 'A heartfelt chant to the divine devotee, embodying courage, strength, and unwavering faith.',
  'Gayatri': 'A universal meditation mantra for illuminating the mind and awakening inner divine light.',
  'Vishnu': 'A sacred invocation to the cosmic preserver, offering blessings of love, protection, and harmony.',
  'Ram': 'A devotional hymn celebrating divine love, righteousness, and the triumph of virtue.',
  'Narasimha': 'An invocation to the fierce form of divine protection, vanquishing inner demons and negative forces.',
  'Annapoorna': 'A prayer to the mother of nourishment, awakening gratitude and abundance in all forms.',
  'Ganesha': 'An auspicious invocation to the remover of obstacles, Lord of wisdom and beginnings.',
  'Hayagriva': 'A powerful mantra to the divine horse-headed incarnation, embodying supreme knowledge and protection.',
  'Universal': 'A sacred vibration transcending all forms, connecting you to the universal divine essence.',
};

const DEFAULT_MANTRA_TAGLINES = {
  mantra: 'A sacred mantra for spiritual awakening, inner peace, and devotional connection.',
  chalisa: 'A devotional hymn sequence for deepening faith, devotion, and spiritual remembrance.',
  stotra: 'A Sanskrit hymn of praise and contemplation, honoring divine qualities and spiritual wisdom.',
  'aarti-vandana': 'A reverent devotional offering, expressing gratitude and seeking divine blessings.',
  gods: 'Divine forms and sacred chants for spiritual inspiration and devotional practice.',
  goddesses: 'Divine feminine expressions for awakening inner strength, wisdom, and spiritual grace.'
};

const getDeityTagline = (deity) => {
  if (!deity) return null;
  return DEITY_TAGLINES[deity] || DEITY_TAGLINES['Universal'];
};

const getMantraItemFromCatalog = (mantra = {}) => {
  const item = MANTRA_CATALOG.find((entry) => entry.id === mantra.id || entry.slug === mantra.slug);
  return item || mantra;
};

const getMantraTitle = (mantra = {}) => getMantraItemFromCatalog(mantra).title || titleCase(mantra.name || mantra.slug || 'Mantra');

const buildMantraDescription = (mantra, languageLabel) => {
  const title = getMantraTitle(mantra);
  const deity = mantra.deity || '';
  const targetLanguage = languageLabel || 'English';
  
  // Create deity-specific, spiritually meaningful description
  const deityTagline = getDeityTagline(deity);
  
  if (deityTagline) {
    return `${deityTagline} Access the lyrics, transliteration, translation, and guidance for chanting ${title} in ${targetLanguage}.`;
  }
  
  return `Experience the spiritual depth of ${title} in ${targetLanguage}. Explore the lyrics, transliteration, translation, and practical chanting guidance to deepen your devotional practice.`;
};

const buildMantraKeywords = (mantra, languageLabel) => {
  const title = getMantraTitle(mantra);
  const categoryLabel = getCategoryLabel(mantra.category || 'mantra');
  const deity = mantra.deity || '';
  const languagePhrase = languageLabel ? `in ${languageLabel}` : '';

  return uniqueValues([
    `${title} meaning ${languagePhrase}`.trim(),
    `${title} lyrics ${languagePhrase}`.trim(),
    `${title} transliteration ${languagePhrase}`.trim(),
    `${title} translation ${languagePhrase}`.trim(),
    `${title} benefits`,
    `${title} how to chant`,
    categoryLabel,
    deity,
    'devotional mantra',
    'sacred chant',
    'spiritual lyrics'
  ]);
};

const buildAlternates = (slug, languages = []) => {
  const basePath = `/mantras/${slug}`;
  const normalizedLanguages = uniqueValues(languages.map((language) => normalizeLanguageSlug(language)));

  return [
    { hrefLang: 'x-default', href: basePath },
    ...normalizedLanguages.map((language) => ({
      hrefLang: getLanguageMeta(language).hreflang,
      href: `${basePath}/${language}`
    }))
  ];
};

export const buildHomeSeo = () => ({
  title: `${SITE_NAME} | Mantras, Chalisas, Stotras, Lyrics & Meanings`,
  description: SITE_DESCRIPTION,
  canonical: '/',
  keywords: [
    'devotional mantras',
    'mantra meanings',
    'Hindi transliteration',
    'Sanskrit hymns',
    'chanting guides',
    'spiritual lyrics'
  ],
  ogType: 'website',
  image: DEFAULT_OG_IMAGE_PATH,
  jsonLd: [
    createWebsiteSchema({
      url: '/',
      description: SITE_DESCRIPTION,
      searchPath: '/mantras'
    })
  ]
});

export const buildMantrasListingSeo = ({ pathname = '/mantras' } = {}) => ({
  title: `All Mantras, Chalisas & Stotras | ${SITE_NAME}`,
  description: 'Browse devotional mantras, chalisas, and stotras with lyrics, transliteration, translation, meaning, and practical chanting guidance.',
  canonical: pathname,
  keywords: ['mantras list', 'chalisas', 'stotras', 'devotional songs', 'chanting guides'],
  ogType: 'website',
  image: DEFAULT_OG_IMAGE_PATH,
  jsonLd: [
    createBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Mantras', url: '/mantras' }
    ])
  ]
});

export const buildCategorySeo = ({ category = 'all', pathname = '/mantras' } = {}) => {
  const normalizedCategory = category === 'all' ? 'all' : category;
  const categoryLabel = normalizedCategory === 'all' ? 'All' : getCategoryLabel(normalizedCategory);
  const title = normalizedCategory === 'all'
    ? `All Mantras, Chalisas & Stotras | ${SITE_NAME}`
    : `${categoryLabel} Mantras, Chalisas & Stotras | ${SITE_NAME}`;

  return {
    title,
    description: normalizedCategory === 'all'
      ? 'Explore all devotional content across mantras, chalisas, stotras, and chanting guides.'
      : `Explore ${categoryLabel.toLowerCase()} devotional content with lyrics, meaning, transliteration, and chanting guidance.`,
    canonical: pathname,
    keywords: uniqueValues([
      `${categoryLabel} mantras`,
      `${categoryLabel} lyrics`,
      `${categoryLabel} meaning`,
      `${categoryLabel} transliteration`,
      `${categoryLabel} chanting`
    ]),
    ogType: 'website',
    image: DEFAULT_OG_IMAGE_PATH,
    jsonLd: [
      createBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Mantras', url: '/mantras' },
        { name: categoryLabel, url: pathname }
      ])
    ]
  };
};

export const buildBlogListingSeo = ({ pathname = '/blogs' } = {}) => ({
  title: `Mantra Blogs, Chanting Guides & Spiritual Articles | ${SITE_NAME}`,
  description: 'Read devotional blog articles on mantra meaning, chanting guidance, Sanskrit translations, and spiritual learning.',
  canonical: pathname,
  keywords: ['mantra blogs', 'chanting guides', 'spiritual articles', 'Sanskrit meaning', 'devotional insights'],
  ogType: 'website',
  image: DEFAULT_OG_IMAGE_PATH,
  jsonLd: [
    createBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blogs', url: '/blogs' }
    ])
  ]
});

export const buildBlogSeo = ({ blog, pathname = '/blogs' } = {}) => {
  if (!blog) {
    return {
      title: `Blog Not Found | ${SITE_NAME}`,
      description: SITE_DESCRIPTION,
      canonical: pathname,
      robots: 'noindex,follow'
    };
  }

  const description = truncateText(blog.description || blog.intro || '', 170) || SITE_DESCRIPTION;
  const image = DEFAULT_OG_IMAGE_PATH;
  const keywords = uniqueValues([
    blog.title,
    ...(blog.tags || []),
    blog.domain,
    'mantra blog',
    'devotional article'
  ]);

  return {
    title: `${blog.title} | ${SITE_NAME}`,
    description,
    canonical: pathname,
    keywords,
    ogType: 'article',
    image,
    jsonLd: [
      createBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blogs', url: '/blogs' },
        { name: blog.title, url: pathname }
      ]),
      createArticleSchema({
        name: blog.title,
        url: pathname,
        description,
        image,
        inLanguage: 'en',
        authorName: blog.author || SITE_NAME,
        publishedTime: '2026-02-19',
        modifiedTime: '2026-02-19',
        keywords
      })
    ]
  };
};

export const buildMantraSeo = ({ mantra, pathname = '/', lang = 'english' } = {}) => {
  if (!mantra) {
    return {
      title: `Mantra Not Found | ${SITE_NAME}`,
      description: SITE_DESCRIPTION,
      canonical: pathname,
      robots: 'noindex,follow'
    };
  }

  const normalizedLang = normalizeLanguageSlug(lang);
  const languageMeta = getLanguageMeta(normalizedLang);
  const title = getMantraTitle(mantra);
  const languageLabel = languageMeta.label;
  const description = buildMantraDescription(mantra, languageLabel);
  const keywords = buildMantraKeywords(mantra, languageLabel);
  const alternates = buildAlternates(mantra.slug, mantra.availableLanguages || []);
  const image = DEFAULT_OG_IMAGE_PATH;
  const tagline = DEFAULT_MANTRA_TAGLINES[mantra.category] || DEFAULT_MANTRA_TAGLINES.mantra;

  return {
    title: normalizedLang === 'english'
      ? `${title} Meaning, Lyrics, Benefits and Chanting Guide | ${SITE_NAME}`
      : `${title} ${languageLabel} Meaning, Lyrics, Benefits and Chanting Guide | ${SITE_NAME}`,
    description,
    canonical: pathname,
    keywords,
    image,
    ogType: 'article',
    language: languageMeta.htmlLang,
    dir: languageMeta.direction,
    alternates,
    tagline,
    jsonLd: [
      createBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Mantras', url: '/mantras' },
        { name: title, url: pathname }
      ]),
      createCreativeWorkSchema({
        name: title,
        url: pathname,
        description,
        image,
        inLanguage: languageMeta.hreflang,
        keywords
      })
    ]
  };
};

export const getMantraContentSections = (mantra, lang = 'english') => {
  const title = getMantraTitle(mantra);
  const deity = mantra?.deity || 'the divine';
  const categoryLabel = getCategoryLabel(mantra?.category || 'mantra');
  const category = mantra?.category || 'mantra';

  // Deity-specific intros
  const deityIntros = {
    'Durga': `${title} is a powerful invocation to the Divine Mother, Durga, who embodies courage, strength, and the power to overcome obstacles. Chanting this mantra awakens your inner warrior—not for conflict, but for overcoming limitations and protecting your peace.`,
    'Shiva': `${title} is a sacred chant honoring Lord Shiva, the cosmic dancer of transformation. This mantra invokes deep meditation, inner peace, and the profound power of silence that underlies all existence.`,
    'Lakshmi': `${title} is a joyful prayer to the goddess of abundance, Lakshmi. More than material prosperity, it invokes the grace of generosity, compassion, and the natural flow of gifts into your life.`,
    'Saraswati': `${title} is a luminous invocation to the goddess of wisdom, Saraswati. Chanting this mantra opens the channels of learning, creativity, and the inner voice of truth.`,
    'Hanuman': `${title} is a devoted hymn to Hanuman, the embodiment of pure devotion and boundless courage. This mantra awakens loyalty, strength, and the power of sincere faith.`,
    'Gayatri': `${title} is one of the most revered mantras in Hindu tradition. It is a universal prayer for illumination, calling upon divine light to guide the mind toward truth and wisdom.`,
    'Vishnu': `${title} honors Lord Vishnu, the cosmic preserver who maintains harmony and balance in the universe. This mantra invokes compassion, protection, and the loving sustenance of divine grace.`,
    'Ram': `${title} is a loving invocation to Lord Rama, whose life exemplifies dharma (righteousness) and divine love. Chanting this mantra awakens virtue, devotion, and spiritual strength.`,
    'Narasimha': `${title} is a fierce and protective invocation to Lord Narasimha, the divine warrior who destroys inner darkness. This mantra empowers you to overcome fear and negativity.`,
    'Annapoorna': `${title} is a prayer to Annapoorna, the mother of nourishment. This mantra awakens gratitude, abundance, and the awareness of divine generosity.`,
    'Ganesha': `${title} is an auspicious invocation to Ganesha, the remover of obstacles and lord of beginnings. This mantra clears the path forward, awakens wisdom, and invites divine blessings into new endeavors.`,
    'Hayagriva': `${title} is a sacred invocation to Hayagriva, the divine horse-headed incarnation of wisdom and protection. This mantra awakens supreme knowledge, banishes ignorance, and offers powerful spiritual protection.`,
  };

  const intro = deityIntros[deity] || `${title} is a sacred ${categoryLabel.toLowerCase()} dedicated to ${deity}. Chanting with intention, transliteration support, and understanding the meaning creates a complete devotional experience that deepens your spiritual practice.`;

  // Deity-specific benefits
  const deityBenefits = {
    'Durga': [
      "Strengthens inner courage and confidence in facing life's challenges",
      'Awakens protective energy within, fostering mental clarity and emotional resilience',
      'Supports overcoming fear, doubt, and negative thought patterns',
      'Invokes divine feminine power and creative transformation'
    ],
    'Shiva': [
      "Deepens meditation and connects you to inner silence and peace",
      "Awakens transformative energy for letting go of what no longer serves you",
      'Supports healing, regeneration, and renewal at every level',
      'Opens channels for divine wisdom and spiritual insight'
    ],
    'Lakshmi': [
      "Invokes the natural flow of abundance and prosperity into your life",
      'Awakens generosity, gratitude, and the joy of giving',
      'Attracts grace, blessings, and meaningful relationships',
      'Supports both material and spiritual wealth'
    ],
    'Saraswati': [
      'Enhances learning, memory, and intellectual clarity',
      'Awakens creativity, artistic expression, and the flow of ideas',
      'Supports clear communication and authentic self-expression',
      'Opens channels to intuitive wisdom and inner knowing'
    ],
    'Hanuman': [
      "Strengthens devotion, faith, and unwavering commitment to your spiritual path",
      'Awakens courage, strength, and the power to overcome obstacles',
      'Cultivates loyalty, humility, and selfless service',
      'Protects and empowers you to face challenges with inner strength'
    ],
    'Gayatri': [
      'Illuminates the mind, clearing confusion and awakening clarity',
      'Connects you to universal divine light and cosmic consciousness',
      'Supports spiritual awakening and the journey toward enlightenment',
      'Harmonizes the three dimensions of consciousness: physical, mental, and spiritual'
    ],
    'Vishnu': [
      'Invokes divine protection, love, and cosmic harmony',
      'Awakens compassion, kindness, and the desire to serve others',
      'Supports health, vitality, and overall well-being',
      'Creates a sense of safety and divine grace in daily life'
    ],
    'Ram': [
      'Awakens righteous living and ethical strength in all situations',
      'Invokes divine love and the triumph of virtue over negativity',
      'Supports spiritual devotion and connection to higher principles',
      'Brings joy, inspiration, and peaceful resolution'
    ],
    'Narasimha': [
      'Empowers you to overcome fear and face inner demons',
      'Invokes fierce protection and the strength to stand against negativity',
      'Awakens spiritual warrior consciousness and unwavering determination',
      'Supports justice, courage, and righteous action'
    ],
    'Annapoorna': [
      'Awakens deep gratitude for all forms of nourishment and abundance',
      'Supports generosity and the joy of sharing with others',
      "Invokes the mother's loving care and compassionate presence",
      'Creates awareness of divine sustenance in every moment'
    ],
    'Ganesha': [
      'Removes obstacles and clears the path forward for success and growth',
      'Awakens wisdom, intellect, and clear discernment',
      'Invites divine blessings for new beginnings and endeavors',
      'Cultivates courage to overcome challenges with grace and humor'
    ],
    'Hayagriva': [
      'Awakens supreme knowledge and transcendent wisdom',
      'Removes ignorance and illuminates the path of truth',
      'Offers powerful spiritual protection and divine grace',
      'Enhances learning, memory, and intellectual power'
    ],
  };

  const benefits = deityBenefits[deity] || [
    `Deepens your connection to ${deity} and the divine qualities they represent`,
    'Supports consistent meditation and devotional practice',
    'Awakens inner peace, clarity, and spiritual growth',
    'Creates a sacred space for transformation and healing'
  ];

  // Deity-specific chanting guidance
  const deityChantingGuides = {
    'Durga': [
      "Choose a quiet time, preferably early morning, when your mind is fresh and receptive",
      'Sit in a comfortable position with your spine upright, allowing energy to flow freely',
      'Begin by calling to mind the image or qualities of Durga—strength, protection, compassion',
      "Chant with steady rhythm and gentle intention; let the sound vibrate through your body",
      'Practice for 11, 21, or 108 repetitions for deeper spiritual benefit',
      'End with gratitude, feeling the empowering energy of divine protection'
    ],
    'Shiva': [
      'Create a calm, meditative space free from distractions and rushing energy',
      "Sit with awareness of the space around you—Shiva pervades all emptiness and silence",
      'Begin chanting slowly, allowing each syllable to settle into your consciousness',
      "Focus on the cool, peaceful quality of Shiva energy—like moonlight on still water",
      'Let the rhythm slow naturally, moving deeper into meditation as you chant',
      'Finish in silence, resting in the peace and stillness that Shiva embodies'
    ],
    'Lakshmi': [
      'Chant with an open heart, cultivating feelings of gratitude and worthiness',
      'Light a lamp or candle, symbolizing the illumination that Lakshmi brings',
      "Sit with awareness of abundance—already present in your life and yet flowing toward you",
      'Chant with warmth and joy, inviting prosperity and grace to blossom naturally',
      'Practice regularly, ideally on auspicious days or during the full moon',
      'Follow your chanting with acts of generosity or kindness'
    ],
    'Saraswati': [
      "Sit with awareness of the creative flow within you—ideas, inspiration, truth",
      'Chant in the early morning when the mind is clearest and most receptive',
      'Hold an image of knowledge, creativity, or wisdom as you chant',
      'Let each sound awaken deeper layers of understanding and insight',
      'Practice especially before studies, creative work, or important communication',
      'Trust that clarity and the right words will come to you'
    ],
    'Hanuman': [
      'Chant with devotion and sincere faith, opening your heart fully',
      'Call to mind the qualities of Hanuman—loyalty, courage, selfless devotion',
      'Chant with steady strength, feeling the power of unwavering commitment',
      'Practice before challenging situations or when you need inner strength',
      'Let the mantra remind you that obstacles can be overcome through faith and dedication',
      'Offer your chanting to something greater than yourself'
    ],
    'Gayatri': [
      'Practice at sunrise if possible, aligning with the awakening light of day',
      'Sit facing east, opening yourself to illumination and new beginnings',
      'Chant with awareness of light—both external sunlight and inner divine radiance',
      'Begin slowly, allowing each word to penetrate your consciousness',
      'Visualize golden light purifying and clarifying your mind',
      'Practice with reverence, knowing this mantra is used by yogis and seekers worldwide'
    ],
    'Vishnu': [
      'Chant with feelings of trust, safety, and divine care',
      "Create a space that feels sacred and protected—Vishnu's realm of harmony",
      'Sit with awareness of the love and compassion that Vishnu embodies',
      'Chant with steady, calming rhythm, like waves of grace washing over you',
      'Practice before sleep or during times of need for comfort and guidance',
      'Rest in the feeling of being held and protected by divine love'
    ],
    'Ram': [
      'Chant with an open heart, calling to the divine love that Ram represents',
      'Sit with reverence for righteousness and virtue (dharma) in all its forms',
      'Chant with devotional feeling, connecting to the joy and divine play (lila)',
      'Let each repetition deepen your commitment to living with integrity',
      'Practice especially when facing moral choices or seeking inspiration',
      'End feeling uplifted, knowing virtue and love always triumph'
    ],
    'Narasimha': [
      'Sit with the awareness that you are calling upon fierce divine protection',
      'Chant with strength and determination, not timidity or fear',
      'Visualize fierce light consuming negative patterns and inner darkness',
      'Practice when facing inner demons—doubt, fear, negativity, or limitation',
      "Let the mantra strengthen your will and resolve",
      'Trust in the power of divine justice and spiritual warrior consciousness'
    ],
    'Annapoorna': [
      "Sit with gratitude, aware of all the ways you are nourished and cared for",
      "Chant with tenderness and love, connecting to the mother's caring presence",
      'Visualize abundance flowing freely—food, resources, grace, and blessings',
      'Practice with the feeling of receiving nourishment from the divine mother',
      'Share food or resources with others as part of your practice',
      'End by blessing all beings with abundance, health, and well-being'
    ],
    'Ganesha': [
      'Sit with the intention to remove obstacles and invite auspicious new beginnings',
      'Call to mind the image of Ganesha—the elephant-headed lord of wisdom and beginnings',
      'Chant with joy and reverence, feeling the lightness and clarity Ganesha brings',
      'Practice at the start of new projects, studies, or significant endeavors',
      'Let the mantra fill you with confidence and the knowing that obstacles will be cleared',
      'End feeling blessed, confident, and ready to move forward with clarity'
    ],
    'Hayagriva': [
      'Sit with the awareness that you are invoking divine wisdom and supreme knowledge',
      'Call to mind the divine form—the horse-headed incarnation of perfect knowledge',
      'Chant with reverence and focus, each syllable a gateway to deeper understanding',
      'Practice before important studies, learning, or when seeking transcendent insight',
      'Visualize pure light of wisdom illuminating your mind and consciousness',
      'Close in stillness, resting in the clarity and protection Hayagriva offers'
    ],
  };

  const chantGuide = deityChantingGuides[deity] || [
    'Find a quiet, clean space and sit with your spine gently upright',
    'Begin with the meaning clearly in mind, setting your intention for practice',
    'Chant at a comfortable pace, allowing the sound to resonate naturally within you',
    "Let the transliteration guide your pronunciation; accuracy deepens the practice",
    'Practice regularly for consistency; even a few minutes daily creates real transformation',
    'Close your practice with a few moments of silence, absorbing the energy of the mantra'
  ];

  // FAQ content
  const deityFAQs = {
    'Durga': [
      {
        question: 'What is Durga?',
        answer: 'Durga is the Divine Mother who represents divine power, courage, and protection. She is worshipped as the destroyer of negativity and obstacles, and the guardian of dharma (righteousness). Durga embodies both fierce strength and compassionate love.'
      },
      {
        question: 'When should I chant this mantra?',
        answer: 'You can chant anytime, but early morning or during challenging periods is especially powerful. Many practice Durga mantras during Navaratri (the nine nights of celebration). Consistency matters more than timing—daily practice, even briefly, creates lasting benefits.'
      },
      {
        question: 'What are the spiritual benefits?',
        answer: "Chanting strengthens inner courage, awakens protective energy, and helps overcome fear and doubt. It connects you to the Divine Mother's strength and transforms obstacles into opportunities for growth. Many experience greater confidence and mental clarity."
      },
      {
        question: 'Who can chant this mantra?',
        answer: "Anyone can chant this mantra—there are no restrictions. It is equally powerful for men and women, children and elders. No special initiation is required; sincere intention and regular practice are what matter."
      },
      {
        question: 'How long should I practice?',
        answer: 'Start with what feels comfortable—even 5-10 minutes daily is beneficial. Many practice 11 or 21 repetitions, or chant for 108 times (a sacred number). Consistency creates deeper results than occasional long sessions.'
      }
    ],
    'Shiva': [
      {
        question: 'Who is Shiva?',
        answer: 'Shiva is the cosmic dancer and destroyer of ignorance. He represents transformation, meditation, and the absolute consciousness underlying all existence. Shiva is the stillness within chaos, the eternal now, and the power of profound inner peace.'
      },
      {
        question: 'When is the best time to chant?',
        answer: 'Shiva mantras are particularly powerful in the early morning (Brahma muhurta) or during meditation. Many practice during the night or in cool hours when the energy is naturally calm and introspective. However, any time with sincere intention works.'
      },
      {
        question: 'What benefits can I expect?',
        answer: 'Deepened meditation, inner peace, and clarity of mind. Shiva mantras help release attachments, transform negative patterns, and connect you to the infinite consciousness. Many experience profound calm and spiritual insight.'
      },
      {
        question: 'Can anyone chant Shiva mantras?',
        answer: 'Yes, Shiva mantras are universal and accessible to all. They are powerful for both beginners and advanced practitioners. No special preparation or initiation is required, though approaching with respect and genuine intention enhances the practice.'
      },
      {
        question: 'How often should I practice?',
        answer: 'Daily practice, even briefly, creates transformative results. Consistency matters more than duration. Many practice 108 repetitions or meditate while chanting. Even a few minutes each day can shift your consciousness significantly.'
      }
    ],
    'Lakshmi': [
      {
        question: 'Who is Lakshmi?',
        answer: 'Lakshmi is the goddess of abundance, prosperity, grace, and all forms of wealth—material and spiritual. She represents generosity, beauty, and the natural flow of blessings. Lakshmi is not just about money; she embodies grace and divine care.'
      },
      {
        question: 'When should I chant for prosperity?',
        answer: 'Lakshmi mantras are especially powerful during the full moon, Diwali (Festival of Lights), or Friday. However, daily practice aligns your energy with abundance. Early morning or evening meditation times are ideal, though anytime with sincere intention works.'
      },
      {
        question: 'What are the real benefits?',
        answer: 'Beyond material prosperity, Lakshmi mantras invite grace, generosity, and abundance in all forms—health, relationships, opportunities, and spiritual growth. They shift your consciousness from scarcity to gratitude, which naturally attracts more blessings into your life.'
      },
      {
        question: 'Who can call upon Lakshmi?',
        answer: "Anyone can practice Lakshmi mantras. She welcomes all sincere seekers, regardless of background. The key is approaching with genuine gratitude and the intention to receive and share abundance with others. Generosity and gratitude amplify the mantra's power."
      },
      {
        question: 'How long does it take to see results?',
        answer: 'Some experience shifts in energy and mindset immediately. Lasting transformation typically unfolds over weeks or months of consistent practice. The key is approaching with faith and gratitude rather than desperate need. Regular practice, combined with aligned action, creates real prosperity.'
      }
    ],
    'Saraswati': [
      {
        question: 'What does Saraswati represent?',
        answer: 'Saraswati is the goddess of wisdom, learning, arts, music, and clear communication. She represents the flow of knowledge, creativity, and the divine voice of truth. Saraswati opens channels to higher wisdom and inspires authentic expression.'
      },
      {
        question: 'When should students chant this?',
        answer: 'Saraswati mantras are powerful before study sessions, exams, or creative work. Early morning practice, especially before dawn, is ideal. Practice whenever you need mental clarity, creative inspiration, or courage to express yourself authentically.'
      },
      {
        question: 'What benefits does this practice offer?',
        answer: 'Enhanced learning and memory, improved focus and concentration, creative breakthroughs, and clearer communication. Many experience greater confidence in speaking and writing. The mantra awakens your inner wisdom and natural ability to learn and create.'
      },
      {
        question: "Can I chant if I'm not a student?",
        answer: 'Absolutely. Saraswati mantras benefit anyone seeking wisdom, clarity, or creative expression. Writers, artists, teachers, professionals, and spiritual seekers all benefit. Learning and creativity are lifelong practices for all of us.'
      },
      {
        question: 'How long should I practice daily?',
        answer: 'Even 10-15 minutes before study or creative work creates real benefit. Many practice 108 times or while working through creative projects. Combine the mantra with focused study or creative practice for maximum benefit. Consistency over weeks creates lasting results.'
      }
    ],
    'Hanuman': [
      {
        question: 'Who is Hanuman?',
        answer: 'Hanuman is the embodiment of pure devotion, courage, and selfless service. He represents unwavering loyalty, fearlessness, and the power of sincere faith. Hanuman shows us that limitations can be overcome through dedication and divine connection.'
      },
      {
        question: 'When should I chant to build strength?',
        answer: 'Chant Hanuman mantras when facing challenges, before difficult situations, or whenever you need inner strength and courage. Early morning or evening practice builds steady power. Many practice on Tuesdays (a day traditionally associated with Hanuman and Mars/strength).'
      },
      {
        question: 'What spiritual benefits come from this practice?',
        answer: "Strengthened faith and devotion, increased courage and confidence, protection from negative energy, and the power to overcome obstacles. The mantra awakens your inner warrior—not for conflict, but for standing strong in your truth and values."
      },
      {
        question: 'Can anyone chant Hanuman mantras?',
        answer: "Yes, everyone benefits. Hanuman represents universal courage and devotion. Whether you're facing fear, working toward goals, or seeking spiritual strength, this mantra is accessible and powerful for all sincere practitioners."
      },
      {
        question: 'How often should I practice?',
        answer: 'Daily practice creates cumulative strength. Many chant 11 or 21 repetitions, or practice 108 times for deeper transformation. Even brief daily practice, combined with sincere devotion, creates real strength and changes your life.'
      }
    ],
    'Gayatri': [
      {
        question: 'What is the Gayatri Mantra?',
        answer: 'The Gayatri Mantra is one of the oldest and most revered mantras in Hindu tradition. It is a universal prayer calling upon divine light to illuminate the mind and guide us toward truth, wisdom, and enlightenment. It transcends all religions and traditions.'
      },
      {
        question: 'When should I practice Gayatri?',
        answer: 'Gayatri is most powerful at sunrise (Brahma Muhurta), aligning with the awakening sun. Many practice at sunset as well. However, sincere practice at any time connects you to divine illumination. The key is approaching with reverence and clear intention.'
      },
      {
        question: 'What are the transformative benefits?',
        answer: 'Mental clarity, spiritual awakening, purification of consciousness, and connection to universal divine light. The Gayatri Mantra elevates consciousness, removes ignorance, and guides the mind toward truth. Many experience profound clarity and spiritual insight.'
      },
      {
        question: "Can I practice if I'm not Hindu?",
        answer: 'Absolutely. The Gayatri Mantra is universal. It transcends religion and reaches all sincere seekers. The prayer is for illumination and guidance—gifts that belong to all humanity. Your faith and sincere intention matter most.'
      },
      {
        question: 'How should I practice?',
        answer: 'Sit facing east if possible, with spine upright. Visualize divine golden light filling your mind. Chant slowly and reverently, 3, 11, 21, or 108 times. Let each repetition deepen your connection to truth and divine wisdom. Daily practice creates lasting spiritual transformation.'
      }
    ],
    'Ganesha': [
      {
        question: 'Who is Ganesha?',
        answer: 'Ganesha is the beloved elephant-headed god, the remover of obstacles, and the lord of beginnings. He represents wisdom, intellect, and auspiciousness. Ganesha is worshipped at the start of all new ventures, studies, and spiritual practices.'
      },
      {
        question: 'When should I chant this mantra?',
        answer: 'Chant Ganesha mantras at the beginning of new projects, before important exams, before starting studies, or whenever you need obstacles removed. Many practice on Wednesdays (Budhvar) or at the start of the lunar month. However, anytime you need clarity and blessings works.'
      },
      {
        question: 'What are the spiritual benefits?',
        answer: 'Ganesha mantras remove obstacles that block your path, awaken wisdom and clear discernment, invite auspicious beginnings, and cultivate the courage to overcome challenges. Many experience unexpected ease in their endeavors and clearer decision-making.'
      },
      {
        question: 'Can anyone chant Ganesha mantras?',
        answer: 'Absolutely. Ganesha is universally beloved and accessible to all. These mantras are especially powerful for students, entrepreneurs, or anyone beginning a new chapter. No restrictions—approach with joy and sincere intention.'
      },
      {
        question: 'How often should I practice?',
        answer: 'Practice especially before starting something new, or daily for cumulative benefits. Many chant 21, 27, or 108 repetitions. You can also chant just once with full attention. Consistency and sincere intention create rapid results with Ganesha.'
      }
    ],
    'Hayagriva': [
      {
        question: 'Who is Hayagriva?',
        answer: 'Hayagriva is the divine horse-headed incarnation, an avatar of supreme wisdom and protection. He represents transcendent knowledge, the destroyer of ignorance, and the remover of spiritual obstacles. Hayagriva is worshipped for supreme learning and divine protection.'
      },
      {
        question: 'When should I practice Hayagriva mantras?',
        answer: 'Practice before important learning, studying, or when seeking transcendent insight. Early morning practice is ideal. Many practice on days devoted to knowledge and wisdom. You can also practice whenever you need clarity, protection, or deeper understanding.'
      },
      {
        question: 'What are the real benefits?',
        answer: 'Hayagriva mantras awaken supreme wisdom, remove ignorance and mental confusion, offer powerful spiritual protection, and enhance learning and memory. Many experience profound clarity, rapid understanding, and protection from negativity. Intellectuals and spiritual seekers find this especially powerful.'
      },
      {
        question: 'Who can chant this mantra?',
        answer: 'Anyone can practice Hayagriva mantras. They are especially beneficial for students, scholars, teachers, and spiritual seekers. However, all sincere practitioners benefit from this mantra. No special initiation is required—approach with reverence and genuine intention.'
      },
      {
        question: 'How long should I practice?',
        answer: 'Practice 27, 108 times, or for at least 15-20 minutes. You can also chant for shorter periods regularly. Consistency matters more than duration. Many practice before important intellectual work or daily during meditation for sustained spiritual protection and wisdom.'
      }
    ],
  };

  const faq = deityFAQs[deity] || [
    {
      question: 'What is this mantra?',
      answer: `This is a sacred mantra dedicated to ${deity}. It carries spiritual energy and meaning developed through centuries of devotional practice. Chanting with understanding and sincerity opens you to the blessings and wisdom it represents.`
    },
    {
      question: 'When should I chant?',
      answer: 'You can chant anytime, though early morning or quiet evening hours are ideal. Consistency matters more than timing—a few minutes daily creates real benefits. Choose a time that fits naturally into your routine.'
    },
    {
      question: 'What are the benefits?',
      answer: 'Chanting this mantra deepens your spiritual connection, calms the mind, and aligns you with the divine qualities it represents. Benefits include increased peace, clarity, protection, and spiritual growth. Effects unfold naturally with consistent practice.'
    },
    {
      question: 'Who can chant this?',
      answer: 'Anyone can chant this mantra regardless of age, background, or experience. No special initiation or preparation is required. Sincere intention and regular practice are what matter most.'
    },
    {
      question: 'How long should I practice?',
      answer: 'Start with what feels comfortable—even 5-10 minutes daily is beneficial. Many practice 11, 21, or 108 repetitions. Consistency creates deeper results than occasional long sessions. Find a rhythm that fits your life.'
    }
  ];

  return {
    intro,
    meaningPoints: benefits,  // Renamed for clarity - these are spiritual meaning points
    benefits,
    chantGuide,
    faq,
    relatedHeading: `Related ${categoryLabel} Pages`
  };
};

export const getRelatedMantras = (mantra, limit = 6) => {
  if (!mantra) return [];

  const currentSlug = mantra.slug;
  const sameCategory = MANTRA_CATALOG.filter((item) => item.slug !== currentSlug && item.category === mantra.category);
  const sameDeity = MANTRA_CATALOG.filter((item) => item.slug !== currentSlug && item.deity === mantra.deity);
  const fallback = MANTRA_CATALOG.filter((item) => item.slug !== currentSlug);

  return uniqueValues([...sameCategory, ...sameDeity, ...fallback]).slice(0, limit);
};
