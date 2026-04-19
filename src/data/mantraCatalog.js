const CATEGORY_ALIASES = {
  all: "all",
  mantra: "mantra",
  mantras: "mantra",
  stotra: "stotra",
  stotras: "stotra",
  aarti: "aarti-vandana",
  vandana: "aarti-vandana",
  "aarti vandana": "aarti-vandana",
  "aarti-vandana": "aarti-vandana",
  chalisa: "chalisa",
  gods: "gods",
  god: "gods",
  goddesses: "goddesses",
  goddess: "goddesses"
};

export const CATEGORY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Mantra", value: "mantra" },
  { label: "Stotra", value: "stotra" },
  { label: "Aarti & Vandana", value: "aarti-vandana" },
  { label: "Chalisa", value: "chalisa" },
  { label: "Gods", value: "gods" },
  { label: "Goddesses", value: "goddesses" }
];

export const MANTRA_CATALOG = [
  {
    id: "annapoorna_stotram",
    slug: "annapoorna-stotram",
    title: "Annapoorna Stotram",
    category: "stotra",
    deity: "Annapoorna",
    deityGroup: "goddesses"
  },
  {
    id: "asitakrutam_shivastotram",
    slug: "asitakrutam-shivastotram",
    title: "Asitakrutam Shivastotram",
    category: "stotra",
    deity: "Shiva",
    deityGroup: "gods"
  },
  {
  id: "ashta_laxmi_stotram",
  slug: "ashta-laxmi-stotram",
  title: "Ashta Laxmi Stotram",
  category: "stotra",
  deity: "Lakshmi",
  deityGroup: "goddesses"
  },
  {
    id: "daxinmurti_stotram",
    slug: "dakshinamurti-stotram",
    title: "Dakshinamurti Stotram",
    category: "stotra",
    deity: "Shiva",
    deityGroup: "gods"
  },
  {
    id: "durga_mantra_1",
    slug: "durga-mantra-1",
    title: "Durga Mantra 1",
    category: "mantra",
    deity: "Durga",
    deityGroup: "goddesses"
  },
  {
    id: "durga_mantra_2",
    slug: "durga-mantra-2",
    title: "Durga Mantra 2",
    category: "mantra",
    deity: "Durga",
    deityGroup: "goddesses"
  },
  {
    id: "gayatri_mantra",
    slug: "gayatri-mantra",
    title: "Gayatri Mantra",
    category: "mantra",
    deity: "Gayatri",
    deityGroup: "goddesses"
  },
  {
    id: "hanuman_chalisa",
    slug: "hanuman-chalisa",
    title: "Hanuman Chalisa",
    category: "chalisa",
    deity: "Hanuman",
    deityGroup: "gods"
  },
  {
    id: "karagre_vasate_lakshmi_shloka",
    slug: "karagre-vasate-lakshmi-shloka",
    title: "Karagre Vasate Lakshmi Shloka",
    category: "aarti-vandana",
    deity: "Lakshmi",
    deityGroup: "goddesses"
  },
  {
    id: "laxmi_stotra",
    slug: "laxmi-stotra",
    title: "Lakshmi Stotra",
    category: "stotra",
    deity: "Lakshmi",
    deityGroup: "goddesses"
  },
  {
    id: "mahamrityunjai_mantra",
    slug: "mahamrityunjai-mantra",
    title: "Mahamrityunjai Mantra",
    category: "mantra",
    deity: "Shiva",
    deityGroup: "gods"
  },
  {
    id: "mahisasur_mardini",
    slug: "mahishasur-mardini",
    title: "Mahishasur Mardini",
    category: "stotra",
    deity: "Durga",
    deityGroup: "goddesses"
  },
  {
    id: "maruti_stotra",
    slug: "maruti-stotra",
    title: "Maruti Stotra",
    category: "stotra",
    deity: "Hanuman",
    deityGroup: "gods"
  },
  {
    id: "narasimha_kavacham",
    slug: "narasimha-kavacham",
    title: "Narasimha Kavacham",
    category: "stotra",
    deity: "Narasimha",
    deityGroup: "gods"
  },
  {
    id: "om_asatoma_sadgamaya",
    slug: "om-asatoma-sadgamaya",
    title: "Om Asatoma Sadgamaya",
    category: "mantra",
    deity: "Universal",
    deityGroup: "other"
  },
  {
    id: "om_sarve_bhavantu_sukhinah",
    slug: "om-sarve-bhavantu-sukhinah",
    title: "Om Sarve Bhavantu Sukhinah",
    category: "mantra",
    deity: "Universal",
    deityGroup: "other"
  },
  {
    id: "saraswati_puranokta",
    slug: "saraswati-puranokta",
    title: "Saraswati Puranokta",
    category: "stotra",
    deity: "Saraswati",
    deityGroup: "goddesses"
  },
  {
    id: "saraswati_vandana",
    slug: "saraswati-vandana",
    title: "Saraswati Vandana",
    category: "aarti-vandana",
    deity: "Saraswati",
    deityGroup: "goddesses"
  },
  {
    id: "sarva_shanti_mantra",
    slug: "sarva-shanti-mantra",
    title: "Sarva Shanti Mantra",
    category: "mantra",
    deity: "Universal",
    deityGroup: "other"
  },
  {
    id: "shiv_yajur_mantra",
    slug: "shiv-yajur-mantra",
    title: "Shiv Yajur Mantra",
    category: "mantra",
    deity: "Shiva",
    deityGroup: "gods"
  },
  {
    id: "shiv_mahima_stotra_pushp_dant",
    slug: "shiv-mahima-stotra-pushp-dant",
    title: "Shiv Mahima Stotra Pushp Dant",
    category: "stotra",
    deity: "Shiva",
    deityGroup: "gods"
  },
  {
    id: "shiv_panchakshar",
    slug: "shiv-panchakshar",
    title: "Shiv Panchakshar",
    category: "mantra",
    deity: "Shiva",
    deityGroup: "gods"
  },
  {
    id: "shiv_tandav_stotra",
    slug: "shiv-tandav-stotra",
    title: "Shiv Tandav Stotra",
    category: "stotra",
    deity: "Shiva",
    deityGroup: "gods"
  },
  {
    id: "shri_hari_stotram",
    slug: "shri-hari-stotram",
    title: "Shri Hari Stotram",
    category: "stotra",
    deity: "Vishnu",
    deityGroup: "gods"
  },
  {
    id: "shri_haygriv_stotra",
    slug: "shri-haygriv-stotra",
    title: "Shri Haygriv Stotra",
    category: "stotra",
    deity: "Hayagriva",
    deityGroup: "gods"
  },
  {
    id: "shri_ram_raksha_stotra",
    slug: "shri-ram-raksha-stotra",
    title: "Shri Ram Raksha Stotra",
    category: "stotra",
    deity: "Rama",
    deityGroup: "gods"
  },
  {
    id: "vakratunda_mahakaya",
    slug: "vakratunda-mahakaya",
    title: "Vakratunda Mahakaya",
    category: "mantra",
    deity: "Ganesha",
    deityGroup: "gods"
  },
  {
    id: "vishnu_mantra",
    slug: "vishnu-mantra",
    title: "Vishnu Mantra",
    category: "mantra",
    deity: "Vishnu",
    deityGroup: "gods"
  },
  {
    id: "vishnu_mantra_1",
    slug: "vishnu-mantra-1",
    title: "Vishnu Mantra 1",
    category: "mantra",
    deity: "Vishnu",
    deityGroup: "gods"
  },
  {
    id: "vishnu_mantra_2",
    slug: "vishnu-mantra-2",
    title: "Vishnu Mantra 2",
    category: "mantra",
    deity: "Vishnu",
    deityGroup: "gods"
  }
];

const MANTRA_CATALOG_BY_ID = new Map(MANTRA_CATALOG.map((item) => [item.id, item]));
const MANTRA_CATALOG_BY_SLUG = new Map(MANTRA_CATALOG.map((item) => [item.slug, item]));

const titleToSlug = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

export const normalizeCategoryValue = (value = "all") => {
  const normalized = String(value).trim().toLowerCase();
  return CATEGORY_ALIASES[normalized] || "all";
};

export const getCategoryLabel = (value = "all") => {
  const normalized = normalizeCategoryValue(value);
  const option = CATEGORY_OPTIONS.find((item) => item.value === normalized);
  return option?.label || "All";
};

const toTitleCase = (value = "") =>
  value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const createSlug = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

export const resolveMantraMeta = (mantra = {}) => {
  const rawIdentifier = String(mantra.id || mantra.slug || mantra.path || mantra.name || "").trim();
  const normalizedSlug = createSlug(rawIdentifier);
  const catalogItem =
    MANTRA_CATALOG_BY_ID.get(rawIdentifier) ||
    MANTRA_CATALOG_BY_SLUG.get(normalizedSlug) ||
    MANTRA_CATALOG_BY_ID.get(String(mantra.name || "").trim()) ||
    MANTRA_CATALOG_BY_SLUG.get(createSlug(mantra.name || ""));

  return {
    ...mantra,
    title: catalogItem?.title || toTitleCase(mantra.name || mantra.id || mantra.path || "Mantra"),
    slug: catalogItem?.slug || normalizedSlug || createSlug(mantra.name || mantra.id || "mantra"),
    category: catalogItem?.category || "mantra",
    deity: catalogItem?.deity || "Universal",
    deityGroup: catalogItem?.deityGroup || "other"
  };
};

export const filterMantrasByCategory = (mantras = [], category = "all") => {
  const normalizedCategory = normalizeCategoryValue(category);

  if (normalizedCategory === "all") {
    return mantras;
  }

  return mantras.filter((mantra) => {
    if (normalizedCategory === "gods" || normalizedCategory === "goddesses") {
      return mantra.deityGroup === normalizedCategory;
    }

    return mantra.category === normalizedCategory;
  });
};

export const createCategoryPath = (category = "all") => {
  const normalizedCategory = normalizeCategoryValue(category);
  return normalizedCategory === "all" ? "/mantras" : `/mantras?category=${encodeURIComponent(normalizedCategory)}`;
};

export const getMantraByTitle = (title = "") => {
  const slug = titleToSlug(title);
  return MANTRA_CATALOG_BY_SLUG.get(slug) || null;
};

export const getMantraPathByTitle = (title = "") => {
  const mantra = getMantraByTitle(title);
  return mantra ? `/mantra/${mantra.id}` : "/mantras";
};