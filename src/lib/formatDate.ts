/**
 * Formats an ISO date string into a human-readable date.
 * Extracted as a shared utility to avoid duplication between
 * the blog listing and blog detail pages.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
