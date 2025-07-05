import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const LISTEN_NOTES_API_KEY = process.env.LISTEN_NOTES_API_KEY;
const BASE_URL = "https://listen-api.listennotes.com/api/v2";

async function listenNotesFetch(
  endpoint: string,
  params?: Record<string, string | number>
) {
  const url = BASE_URL + endpoint;
  try {
    const res = await axios.get(url, {
      params,
      headers: {
        "X-ListenAPI-Key": LISTEN_NOTES_API_KEY!,
      },
    });
    return res.data;
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; statusText?: string };
      };
      throw new Error(
        `Listen Notes API error: ${axiosError.response?.status} ${axiosError.response?.statusText}`
      );
    }
    throw new Error(`Listen Notes API error: ${String(error)}`);
  }
}

/**
 * Search for podcasts using the Listen Notes API.
 * @param params Search parameters for the Listen Notes API.
 * Example: { q: "ai", type: "podcast", page_size: 10 }
 * @returns
 */
export async function searchPodcasts(params: Record<string, string | number>) {
  return listenNotesFetch("/search", params);
}

/** * Get a podcast by its ID.
 * @param id The ID of the podcast to retrieve.
 * @returns The podcast data.
 */
export async function getPodcastById(id: string) {
  return listenNotesFetch(`/podcasts/${id}`);
}

/** Get a list of episodes for a podcast.
 * @param podcastId The ID of the podcast.
 * @param params Additional parameters for the request, e.g., { page_size: 10 }
 * @returns The list of episodes for the podcast.
 */
export async function getEpisodeById(id: string) {
  return listenNotesFetch(`/episodes/${id}`);
}

/**
 * Get episodes for a specific podcast.
 * @param podcastId The ID of the podcast.
 * @param params Additional parameters for the request, e.g., { page_size: 10 }
 * @returns The list of episodes for the podcast.
 */
export async function getEpisodesForPodcast(
  podcastId: string,
  params: Record<string, string | number> = {}
) {
  return listenNotesFetch(`/podcasts/${podcastId}`, params);
}

/**
 * Get best podcasts by genre or globally.
 * @param params Optional parameters, e.g., { genre_id: 68, page: 1, region: 'us', safe_mode: 0 }
 * @returns The best podcasts data from Listen Notes.
 */
export async function getBestPodcasts(
  params: Record<string, string | number> = {}
) {
  return listenNotesFetch("/best_podcasts", params);
}
