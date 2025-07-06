/**
 * Utility functions for cleaning HTML content from podcast descriptions and other text
 */

/**
 * Remove HTML tags from a string and decode HTML entities
 * @param html The HTML string to clean
 * @returns Clean text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  if (!html) return "";

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  const htmlEntities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&hellip;": "...",
    "&mdash;": "—",
    "&ndash;": "–",
    "&rsquo;": "'",
    "&lsquo;": "'",
    "&rdquo;": '"',
    "&ldquo;": '"',
  };

  // Replace HTML entities
  Object.entries(htmlEntities).forEach(([entity, replacement]) => {
    text = text.replace(new RegExp(entity, "g"), replacement);
  });

  // Handle numeric HTML entities (e.g., &#8217;)
  text = text.replace(/&#(\d+);/g, (match, num) => {
    return String.fromCharCode(parseInt(num, 10));
  });

  // Handle hex HTML entities (e.g., &#x2019;)
  text = text.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Clean up extra whitespace and line breaks
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Clean and truncate text for display purposes
 * @param text The text to clean and truncate
 * @param maxLength Maximum length of the result
 * @returns Clean, truncated text
 */
export function cleanAndTruncateText(
  text: string,
  maxLength: number = 200
): string {
  const cleanText = stripHtmlTags(text);

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Truncate and add ellipsis, but try to break at word boundaries
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}

/**
 * Clean text specifically for AI processing
 * @param text The text to clean
 * @returns Text optimized for AI processing
 */
export function cleanTextForAI(text: string): string {
  let cleanText = stripHtmlTags(text);

  // Remove URLs
  cleanText = cleanText.replace(/https?:\/\/[^\s]+/g, "[URL]");

  // Remove email addresses
  cleanText = cleanText.replace(/\S+@\S+\.\S+/g, "[EMAIL]");

  // Normalize whitespace
  cleanText = cleanText.replace(/\s+/g, " ").trim();

  return cleanText;
}
