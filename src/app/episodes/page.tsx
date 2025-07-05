"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import EpisodeCard from "../components/EpisodeCard";
import { tailwindColors } from "../constants/Color";
import dummyEpisodes from "./dummyEpisodes.json";

function getUserSettings() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return { resultsPerPage: 8 };
  }
  return {
    resultsPerPage: Number(localStorage.getItem("ps_resultsPerPage")) || 8,
  };
}

export default function EpisodesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const podcastId = searchParams.get("podcastId");
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState(getUserSettings());
  const [summaries, setSummaries] = useState<{ [id: string]: string }>({});
  const [summarizing, setSummarizing] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const onStorage = () => setSettings(getUserSettings());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    // Use dummy data for now due to API rate limiting
    setEpisodes(dummyEpisodes);
    setLoading(false);
    setError(null);
    /*
    if (!podcastId) return;
    setLoading(true);
    setError(null);
    fetch(
      `/api/episodes?podcastId=${podcastId}&page_size=${settings.resultsPerPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(data.episodes || []);
        if (data.error) setError(data.error);
      })
      .catch(() => setError("Failed to fetch episodes"))
      .finally(() => setLoading(false));
    */
  }, [podcastId, settings]);

  // Dummy summarization handler
  const handleSummarize = (ep: any) => {
    // Always use ep.id for both dummy and live data
    const episodeImage = ep.image || ep.thumbnail || "";
    router.push(
      `/summaries?id=${encodeURIComponent(ep.id)}&title=${encodeURIComponent(
        ep.title
      )}&description=${encodeURIComponent(
        ep.description
      )}&pubDate=${encodeURIComponent(
        ep.pub_date_ms || ep.pub_date
      )}&audio=${encodeURIComponent(
        ep.audio
      )}&episodeImage=${encodeURIComponent(episodeImage)}`
    );
  };

  return (
    <div
      className={`min-h-screen ${tailwindColors.background} transition-colors`}
    >
      <Header />
      <main className="w-full max-w-3xl mx-auto py-6 px-3 sm:py-10 sm:px-6">
        <h1
          className={`text-2xl font-bold ${tailwindColors.text.primary} mb-6`}
        >
          Episodes
        </h1>
        {loading && <div className="text-center text-lg">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && episodes.length === 0 && (
          <div className="text-center text-gray-500">No episodes found.</div>
        )}
        <div className="flex flex-col gap-4">
          {episodes.map((ep) => (
            <EpisodeCard
              key={ep.id}
              title={ep.title}
              description={ep.description}
              pubDate={ep.pub_date_ms || ep.pub_date}
              audio={ep.audio}
              onSummarize={() => handleSummarize(ep)}
              summarizing={false}
              summary={undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
