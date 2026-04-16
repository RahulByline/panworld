/**
 * Strips HTML tags from a string and optionally truncates it.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  // Simple regex to strip tags. For more complex cases a DOMParser would be better,
  // but for a simple preview this is usually enough.
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ");
}

/**
 * Truncates a string to a specified length with an ellipsis.
 */
export function truncate(text: string, limit = 180): string {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit).trim() + "...";
}
