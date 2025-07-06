// src/app/utils/userPreferences.ts

/**
 * Get the user's preferred results per page from localStorage, or fallback to default.
 */
export function getResultsPerPage(defaultValue = 10): number {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    const val = localStorage.getItem("ps_resultsPerPage");
    const num = val ? parseInt(val, 10) : NaN;
    if (!isNaN(num) && num > 0) return num;
  }
  return defaultValue;
}
