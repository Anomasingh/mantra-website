const normalizeMantraName = (value = "") =>
  value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTitleCase = (value) =>
  value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const getMantraImageCandidates = (mantraName = "") => {
  const normalized = normalizeMantraName(mantraName);
  const nameVariants = [normalized, normalized.toUpperCase(), toTitleCase(normalized)].filter(Boolean);
  const extensions = ["png", "jpg", "jpeg", "webp"];

  const candidates = [];
  nameVariants.forEach((name) => {
    extensions.forEach((ext) => {
      candidates.push(`/images/${name}.${ext}`);
    });
  });

  // Keep only unique candidate paths while preserving order.
  return [...new Set(candidates)];
};
