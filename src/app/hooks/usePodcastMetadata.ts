import useSWR from "swr";
import { Episode } from "../types/podcast";
import { deduplicateEpisodes } from "../utils/deduplication";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function usePodcastMetadata(
  podcastId: string | undefined,
  page: number = 1,
  pageSize: number = 8
) {
  const shouldFetch = Boolean(podcastId);
  const params = new URLSearchParams();
  if (podcastId) params.set("podcastId", podcastId);
  params.set("page", String(page));
  params.set("page_size", String(pageSize));
  const url = shouldFetch ? `/api/episodes?${params.toString()}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 min cache
  });
  return {
    episodes: deduplicateEpisodes((data?.episodes as Episode[]) || []),
    error,
    isLoading,
    mutate,
  };
}
