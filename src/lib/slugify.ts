/**
 * Converts any string into a URL-safe slug.
 *
 * Rules applied in order:
 *  1. Lowercase
 *  2. Strip characters that are not letters, digits, spaces, or hyphens
 *  3. Replace whitespace runs with a single hyphen
 *  4. Collapse multiple consecutive hyphens into one
 *  5. Trim leading and trailing hyphens
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
