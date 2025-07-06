import useSWR from "swr";
import { Podcast } from "../types/podcast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useBestPodcasts(
  params: Record<string, string | number | boolean> = {}
) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const url = `/api/best-podcasts?${searchParams.toString()}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 min cache
  });
  return {
    podcasts: (data?.podcasts as Podcast[]) || [],
    error,
    isLoading,
    mutate,
  };
}
