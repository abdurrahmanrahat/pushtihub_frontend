export function createSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, "-") // Space → hyphen
    .replace(/[~`!@#$%^&*()+={}\[\]|\\:;"'<>,.?/]/g, "") // only remove punctuation
    .replace(/-+/g, "-") // merge multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim
}

export function slugToTitle(slug: string) {
  if (!slug) return "";

  return slug
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\s+/g, " ") // Normalize multiple spaces
    .trim()
    .replace(/\band\b/gi, "&") // Optional: reverse the earlier "&" replacement
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}
