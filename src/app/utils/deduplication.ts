/**
 * Utility functions for deduplicating podcast and episode data
 */

import { Podcast } from "../types/podcast";
import { Episode } from "../types/podcast";

/**
 * Remove duplicate podcasts by ID
 */
export function deduplicatePodcasts(podcasts: Podcast[]): Podcast[] {
  const seen = new Set<string>();
  return podcasts.filter((podcast) => {
    if (seen.has(podcast.id)) {
      return false;
    }
    seen.add(podcast.id);
    return true;
  });
}

/**
 * Remove duplicate episodes by ID
 */
export function deduplicateEpisodes(episodes: Episode[]): Episode[] {
  const seen = new Set<string>();
  return episodes.filter((episode) => {
    if (seen.has(episode.id)) {
      return false;
    }
    seen.add(episode.id);
    return true;
  });
}

/**
 * Merge new items with existing items, removing duplicates
 */
export function mergeWithoutDuplicates<T extends { id: string }>(
  existing: T[],
  newItems: T[]
): T[] {
  const existingIds = new Set(existing.map((item) => item.id));
  const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));
  return [...existing, ...uniqueNewItems];
}
