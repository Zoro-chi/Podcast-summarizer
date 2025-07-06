"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import { tailwindColors } from "../constants/Color";
import usePodcastMetadata from "../hooks/usePodcastMetadata";
import { Episode } from "../types/podcast";
import { getResultsPerPage } from "../utils/userPreferences";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";

const EpisodeCard = dynamic(() => import("../components/EpisodeCard"), {
  loading: () => <div className="animate-pulse">Loading episode...</div>,
});
const SkeletonCard = dynamic(() => import("../components/SkeletonCard"), {
  loading: () => <div className="animate-pulse">Loading...</div>,
});

function getUserSettings() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return { resultsPerPage: 8 };
  }
  return {
    resultsPerPage: getResultsPerPage(8),
  };
}

function EpisodesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const podcastId = searchParams.get("podcastId");
  const [settings, setSettings] = useState(getUserSettings());
  const [summarizing, setSummarizing] = useState<{ [id: string]: boolean }>({});
  const [transcripts, setTranscripts] = useState<{ [id: string]: string }>({});
  const [transcriptLoading, setTranscriptLoading] = useState<{
    [id: string]: boolean;
  }>({});
  const [page, setPage] = useState(1);
  const { toasts, showToast, removeToast } = useToast();

  // Get language preference from localStorage (client-side)
  const [languagePref, setLanguagePref] = useState("en");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("ps_language") || "en";
      setLanguagePref(lang);
    }
  }, []);

  useEffect(() => {
    const onStorage = () => setSettings(getUserSettings());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const {
    episodes: swrEpisodes,
    error: swrError,
    isLoading: swrLoading,
  } = usePodcastMetadata(podcastId || undefined, page, settings.resultsPerPage);

  // Episode summarization handler
  const handleSummarize = async (ep: Episode) => {
    const epId = ep.id;
    setSummarizing((prev) => ({ ...prev, [epId]: true }));
    try {
      // Fetch transcript and description
      const transcriptRes = await fetch(
        `/api/episodes/transcript?episodeId=${encodeURIComponent(epId)}`
      );
      const transcriptData = await transcriptRes.json();

      // Check if we have either transcript or description
      if (!transcriptData.transcript && !transcriptData.description) {
        throw new Error(
          "No transcript or description available for this episode."
        );
      }

      // Show user feedback about what type of content is being used
      const isUsingDescription =
        !transcriptData.transcript && transcriptData.description;
      if (isUsingDescription) {
        showToast(
          "📄 No transcript available. Summarizing episode description instead.",
          "warning",
          6000
        );
      } else {
        showToast("📝 Summarizing episode transcript...", "info", 3000);
      }

      // Call AI summarizer API
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: epId,
          transcript: transcriptData.transcript,
          description: transcriptData.description,
          language: languagePref, // Pass language preference
        }),
      });
      if (!res.ok) throw new Error("Failed to summarize episode");
      const data = await res.json();

      // Clean up summary if it's in JSON format (including markdown-wrapped JSON)
      let cleanSummary = data.summary || "";
      let keyPoints = data.keyPoints || [];
      let sentiment = data.sentiment || "neutral";
      const isFromTranscript = data.isFromTranscript;

      try {
        // Check if summary is a JSON string (possibly wrapped in markdown)
        let summaryText = cleanSummary.trim();

        // Remove markdown code block if present
        if (
          summaryText.startsWith("```json") ||
          summaryText.startsWith("```")
        ) {
          summaryText = summaryText
            .replace(/^```(?:json)?\s*/, "")
            .replace(/```\s*$/, "")
            .trim();
        }

        // Try to parse as JSON
        if (summaryText.startsWith("{")) {
          const parsed = JSON.parse(summaryText);
          if (parsed.summary) {
            cleanSummary = parsed.summary;
            keyPoints = parsed.keyPoints || keyPoints;
            sentiment = parsed.sentiment || sentiment;
          }
        }
      } catch {
        // If parsing fails, use the original values
      }

      // Navigate to summaries page with AI-generated data (using URL params for reliability)
      const episodeImage = ep.image || ep.thumbnail || "";
      const podcastTitle =
        searchParams.get("podcastTitle") || "Unknown Podcast";

      const params = new URLSearchParams({
        id: ep.id,
        title: ep.title,
        description: ep.description,
        pubDate: String(ep.pub_date_ms ?? ep.pub_date ?? ""),
        audio: ep.audio ?? "",
        episodeImage: episodeImage ?? "",
        podcastTitle: podcastTitle ?? "",
        summary: String(cleanSummary ?? ""),
        keyPoints: JSON.stringify(keyPoints ?? []),
        sentiment: String(sentiment ?? ""),
        isFromTranscript: String(isFromTranscript ?? true),
        fromSummarize: "true",
      });

      router.push(`/summaries?${params.toString()}`);
    } catch (error) {
      // Show error toast with specific message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to summarize episode";
      showToast(`❌ ${errorMessage}`, "error", 5000);
    } finally {
      setSummarizing((prev) => ({ ...prev, [epId]: false }));
    }
  };

  const handleShowTranscript = async (ep: Episode) => {
    const epId = ep.id;
    setTranscriptLoading((prev) => ({ ...prev, [epId]: true }));
    try {
      const res = await fetch(
        `/api/episodes/transcript?episodeId=${encodeURIComponent(epId)}`
      );
      const data = await res.json();

      if (data.transcript) {
        setTranscripts((prev) => ({
          ...prev,
          [epId]: data.transcript,
        }));
      } else if (data.description) {
        setTranscripts((prev) => ({
          ...prev,
          [epId]: `[Episode Description - Transcript not available]\n\n${data.description}`,
        }));
      } else {
        setTranscripts((prev) => ({
          ...prev,
          [epId]: "No transcript or description available.",
        }));
      }
    } catch {
      setTranscripts((prev) => ({
        ...prev,
        [epId]: "Failed to fetch episode content.",
      }));
    } finally {
      setTranscriptLoading((prev) => ({ ...prev, [epId]: false }));
    }
  };

  return (
    <div
      className={`min-h-screen ${tailwindColors.background} transition-colors`}
    >
      <Header />
      <ToastContainer
        toasts={toasts.map((toast) => ({
          ...toast,
          onClose: removeToast,
        }))}
      />
      <main className="w-full max-w-3xl mx-auto py-6 px-3 sm:py-10 sm:px-6">
        <h1
          className={`text-2xl font-bold ${tailwindColors.text.primary} mb-6`}
        >
          Episodes
        </h1>
        {swrLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
        {swrError && <div className="text-center text-red-500">{swrError}</div>}
        {!swrLoading && !swrError && swrEpisodes.length === 0 && (
          <div className="text-center text-gray-500">No episodes found.</div>
        )}
        <div className="flex flex-col gap-4">
          {!swrLoading &&
            swrEpisodes.map((ep: Episode) => (
              <EpisodeCard
                key={ep.id}
                title={ep.title}
                description={ep.description}
                pubDate={ep.pub_date_ms ?? ep.pub_date ?? ""}
                audio={ep.audio}
                onSummarize={() => handleSummarize(ep)}
                summarizing={!!summarizing[ep.id]}
                summary={undefined}
                transcript={transcripts[ep.id]}
                onShowTranscript={() => handleShowTranscript(ep)}
                showTranscriptButton={true}
                transcriptLoading={!!transcriptLoading[ep.id]}
              />
            ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-2 py-1">Page {page}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={swrEpisodes.length < settings.resultsPerPage}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default function EpisodesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EpisodesPageInner />
    </Suspense>
  );
}
