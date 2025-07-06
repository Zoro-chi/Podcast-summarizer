"use client";
import Header from "./components/Header";
import PodcastCard from "./components/PodcastCard";
import { useEffect, useState, useRef } from "react";
import { useCallback } from "react";
import { tailwindColors } from "./constants/Color";
import { useRouter } from "next/navigation";
import useBestPodcasts from "./hooks/useBestPodcasts";
import { Podcast } from "./types/podcast";
import { getResultsPerPage } from "./utils/userPreferences";
import { deduplicatePodcasts } from "./utils/deduplication";

const SEARCH_DEBOUNCE_MS = 900; // Debounce delay
const MIN_SEARCH_LENGTH = 3; // Minimum characters to trigger search

function getUserSettings() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    // SSR/initial render: return defaults
    return {
      resultsPerPage: 8,
      genre: "",
      showExplicit: false,
      language: "en",
    };
  }
  return {
    resultsPerPage: getResultsPerPage(8),
    genre: localStorage.getItem("ps_genre") || "",
    showExplicit: localStorage.getItem("ps_showExplicit") === "true",
    language: localStorage.getItem("ps_language") || "en",
  };
}

type RawPodcast = {
  id: string;
  image: string;
  title?: string;
  title_original?: string;
  description?: string;
  description_original?: string;
  publisher?: string;
  publisher_original?: string;
};

export default function Home() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialLoad = useRef(true);
  const searchTriggered = useRef(false);
  // Add settings state to trigger re-fetch on change
  const [settings, setSettings] = useState(getUserSettings());
  const router = useRouter();

  const {
    podcasts: swrPodcasts,
    error: swrError,
    isLoading: swrLoading,
  } = useBestPodcasts({
    page: page,
    page_size: settings.resultsPerPage,
    genre: settings.genre,
    explicit_content: settings.showExplicit ? "1" : "",
  });

  // Listen for settings changes (e.g., if user updates settings page)
  useEffect(() => {
    const onStorage = () => setSettings(getUserSettings());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Helper to trigger search immediately (used for Enter key and pagination)
  const triggerSearch = useCallback(
    (searchPage: number = 1) => {
      if (search.length < MIN_SEARCH_LENGTH) {
        setPodcasts([]);
        setError(`Enter at least ${MIN_SEARCH_LENGTH} characters to search.`);
        return;
      }
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("q", search);
      params.set("type", "podcast");
      params.set("page", String(searchPage));
      params.set("page_size", String(settings.resultsPerPage));
      if (settings.genre) params.set("genre", settings.genre);
      if (settings.showExplicit) params.set("explicit_content", "1");
      fetch(`/api/search-podcasts?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          const newPodcasts = (data.podcasts || []).map(
            (p: RawPodcast) =>
              ({
                id: p.id,
                image: p.image,
                title: p.title || p.title_original,
                description: p.description || p.description_original,
                publisher: p.publisher || p.publisher_original,
              } as Podcast)
          );

          // Deduplicate podcasts to ensure no duplicates
          const deduplicatedPodcasts = deduplicatePodcasts(newPodcasts);
          setPodcasts(deduplicatedPodcasts);

          if (data.error) setError(data.error);
        })
        .catch(() => setError("Failed to fetch podcasts"))
        .finally(() => setLoading(false));
    },
    [search, settings.resultsPerPage, settings.genre, settings.showExplicit]
  );

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!search) {
      setPodcasts([]);
      setError(null);
      setPage(1); // Reset page when clearing search
      return;
    }
    if (search.length < MIN_SEARCH_LENGTH) {
      setPodcasts([]);
      setError(`Enter at least ${MIN_SEARCH_LENGTH} characters to search.`);
      return;
    }
    // Only debounce if not triggered by Enter
    if (!searchTriggered.current) {
      searchTimeout.current = setTimeout(() => {
        setPage(1); // Reset to page 1 for new search
        triggerSearch(1);
      }, SEARCH_DEBOUNCE_MS);
    }
    searchTriggered.current = false;
  }, [search, settings, triggerSearch]);

  return (
    <div
      className={`min-h-screen ${tailwindColors.background} transition-colors`}
    >
      <Header
        search={search}
        onSearchChange={setSearch}
        onSearchEnter={() => {
          searchTriggered.current = true;
          setPage(1); // Reset to page 1 for new search
          triggerSearch(1);
        }}
      />
      <main className="w-full max-w-4xl mx-auto py-6 px-3 sm:py-10 sm:px-6">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold ${tailwindColors.text.primary} mb-2`}
          >
            Podcasts
          </h1>
          <p className={`text-xl ${tailwindColors.text.secondary}`}>
            Choose a podcast to view the latest episodes and summaries.
          </p>
        </div>
        <div className="flex flex-col gap-4 min-h-[200px]">
          {(search ? loading : swrLoading) && (
            <div className="text-center text-lg">Loading...</div>
          )}
          {(search ? error : swrError) && (
            <div className="text-center text-red-500">
              {search ? error : swrError}
            </div>
          )}
          {!(search ? loading : swrLoading) &&
            !(search ? error : swrError) &&
            (search ? podcasts.length === 0 : swrPodcasts.length === 0) && (
              <div className="text-center text-gray-500">
                No podcasts found.
              </div>
            )}
          {!(search ? loading : swrLoading) &&
            !(search ? error : swrError) &&
            (search ? podcasts : swrPodcasts).map((podcast: Podcast) => (
              <PodcastCard
                key={podcast.id}
                image={podcast.image}
                title={podcast.title}
                description={podcast.description}
                publisher={podcast.publisher}
                onClick={() =>
                  router.push(
                    `/episodes?podcastId=${encodeURIComponent(podcast.id)}`
                  )
                }
              />
            ))}
        </div>

        {/* Pagination Controls */}
        {(search ? podcasts.length > 0 : swrPodcasts.length > 0) && (
          <div className="flex justify-center mt-6 gap-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
              onClick={() => {
                if (search) {
                  const newPage = Math.max(1, page - 1);
                  setPage(newPage);
                  triggerSearch(newPage);
                } else {
                  setPage((p) => Math.max(1, p - 1));
                }
              }}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-2 py-1">Page {page}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
              onClick={() => {
                if (search) {
                  const newPage = page + 1;
                  setPage(newPage);
                  triggerSearch(newPage);
                } else {
                  setPage((p) => p + 1);
                }
              }}
              disabled={
                (search ? podcasts.length : swrPodcasts.length) <
                settings.resultsPerPage
              }
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
