"use client";
import Header from "./components/Header";
import PodcastCard from "./components/PodcastCard";
import { useEffect, useState, useRef } from "react";
import { tailwindColors } from "./constants/Color";

function normalizePodcast(p: any): any {
  return {
    id: p.id,
    image: p.image,
    title: p.title || p.title_original,
    description: p.description || p.description_original,
    publisher: p.publisher || p.publisher_original,
  };
}

const SEARCH_DEBOUNCE_MS = 900; // Increased debounce delay
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
    resultsPerPage: Number(localStorage.getItem("ps_resultsPerPage")) || 8,
    genre: localStorage.getItem("ps_genre") || "",
    showExplicit: localStorage.getItem("ps_showExplicit") === "true",
    language: localStorage.getItem("ps_language") || "en",
  };
}

export default function Home() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialLoad = useRef(true);
  const searchTriggered = useRef(false);
  // Add settings state to trigger re-fetch on change
  const [settings, setSettings] = useState(getUserSettings());

  // Listen for settings changes (e.g., if user updates settings page)
  useEffect(() => {
    const onStorage = () => setSettings(getUserSettings());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Helper to trigger search immediately (used for Enter key)
  const triggerSearch = () => {
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
    params.set("page_size", String(settings.resultsPerPage));
    if (settings.genre) params.set("genre", settings.genre);
    if (settings.showExplicit) params.set("explicit_content", "1");
    fetch(`/api/search-podcasts?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPodcasts(
          (data.podcasts || []).map((p: any) => ({
            id: p.id,
            image: p.image,
            title: p.title_original,
            description: p.description_original,
            publisher: p.publisher_original,
          }))
        );
        if (data.error) setError(data.error);
      })
      .catch(() => setError("Failed to fetch podcasts"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Commented out to avoid rate limiting on best-podcasts endpoint
    /*
    async function fetchPodcasts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("page_size", String(settings.resultsPerPage));
        if (settings.genre) params.set("genre", settings.genre);
        if (settings.showExplicit) params.set("explicit_content", "1");
        const res = await fetch(`/api/best-podcasts?${params.toString()}`);
        const data = await res.json();
        setPodcasts((data.podcasts || []).map(normalizePodcast));
        if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to fetch podcasts");
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPodcasts();
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!search) {
      setPodcasts([]);
      setError(null);
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
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        params.set("q", search);
        params.set("type", "podcast");
        params.set("page_size", String(settings.resultsPerPage));
        if (settings.genre) params.set("genre", settings.genre);
        if (settings.showExplicit) params.set("explicit_content", "1");
        fetch(`/api/search-podcasts?${params.toString()}`)
          .then((res) => res.json())
          .then((data) => {
            setPodcasts(
              (data.podcasts || []).map((p: any) => ({
                id: p.id,
                image: p.image,
                title: p.title_original,
                description: p.description_original,
                publisher: p.publisher_original,
              }))
            );
            if (data.error) setError(data.error);
          })
          .catch(() => setError("Failed to fetch podcasts"))
          .finally(() => setLoading(false));
      }, SEARCH_DEBOUNCE_MS);
    }
    searchTriggered.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, settings]);

  return (
    <div
      className={`min-h-screen ${tailwindColors.background} transition-colors`}
    >
      <Header
        search={search}
        onSearchChange={setSearch}
        onSearchEnter={() => {
          searchTriggered.current = true;
          triggerSearch();
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
          {loading && <div className="text-center text-lg">Loading...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && podcasts.length === 0 && (
            <div className="text-center text-gray-500">No podcasts found.</div>
          )}
          {!loading &&
            !error &&
            podcasts.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                image={podcast.image}
                title={podcast.title}
                description={podcast.description}
                publisher={podcast.publisher}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
