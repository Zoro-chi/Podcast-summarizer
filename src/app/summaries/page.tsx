"use client";
import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "../components/Header";
import { tailwindColors } from "../constants/Color";
import { Summary } from "../types/summary";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";

// Utility to get or create a userId in localStorage
function getOrCreateUserId() {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return null;
  let userId = localStorage.getItem("ps_userId");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("ps_userId", userId);
  }
  return userId;
}

// Helper function to clean up summary if it's in JSON format
function cleanSummaryText(summary: string): string {
  if (!summary) return summary;
  try {
    // Check if summary is a JSON string and extract the summary field
    if (summary.trim().startsWith("{")) {
      const parsed = JSON.parse(summary);
      if (parsed.summary) {
        return parsed.summary;
      }
    }
  } catch {
    // If parsing fails, use the original summary
  }
  return summary;
}

function SummariesPageContent() {
  const searchParams = useSearchParams();
  const { toasts, showToast, removeToast } = useToast();

  // Check if we're coming from summarize action
  const fromSummarize = searchParams.get("fromSummarize") === "true";
  const isFromTranscript = searchParams.get("isFromTranscript") !== "false"; // Default to true for backward compatibility

  // Parse summary, keyPoints, sentiment from query params
  const summaryParam = cleanSummaryText(
    searchParams.get("summary")?.trim() || ""
  );

  const keyPointsParam = useMemo(() => {
    let keyPoints: string[] = [];
    try {
      const keyPointsString = searchParams.get("keyPoints");
      if (keyPointsString && keyPointsString.trim() !== "") {
        keyPoints = JSON.parse(keyPointsString);
        if (!Array.isArray(keyPoints)) keyPoints = [];
      } else {
        keyPoints = [
          "Key point 1 for this episode.",
          "Key point 2 for this episode.",
          "Key point 3 for this episode.",
        ];
      }
    } catch (error) {
      console.error("Failed to parse keyPoints:", error);
      keyPoints = [
        "Key point 1 for this episode.",
        "Key point 2 for this episode.",
        "Key point 3 for this episode.",
      ];
    }
    return keyPoints;
  }, [searchParams]);

  const sentimentParam = searchParams.get("sentiment") || "neutral";

  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState("neutral");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userSummaries, setUserSummaries] = useState<Summary[]>([]);
  const [formattedPubDate, setFormattedPubDate] = useState("");
  const [page, setPage] = useState(1);
  const userId = getOrCreateUserId();

  // Initialize state from query params
  useEffect(() => {
    setSummary(summaryParam);
    setKeyPoints(keyPointsParam);
    setSentiment(sentimentParam);
  }, [summaryParam, keyPointsParam, sentimentParam]);

  // Get episode details from query params
  const id = searchParams.get("id") || "";
  const title = searchParams.get("title") || "";
  const description = searchParams.get("description") || "";
  const pubDate = searchParams.get("pubDate") || "";
  const audio = searchParams.get("audio") || "";
  const podcastTitle = searchParams.get("podcastTitle") || "Unknown Podcast";
  const episodeImage =
    searchParams.get("episodeImage") || "/images/episode_details.png";

  // On load, check if a summary for this episode already exists for the user
  useEffect(() => {
    if (!userId) return;

    const fetchSummaries = () => {
      fetch(`/api/summaries?userId=${userId}&page=${page}`)
        .then((res) => res.json())
        .then((data) => {
          setUserSummaries(data.summaries || []);
        })
        .catch(() => setUserSummaries([]));
    };
    if (id) {
      fetch(`/api/summaries?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserSummaries(data.summaries || []);
          // If a summary for this episode exists, show it
          const existing = (data.summaries || []).find(
            (s: Summary) => s.episodeId === id
          );
          if (existing) {
            setSummary(cleanSummaryText(existing.content));
            setKeyPoints(existing.keyPoints || []);
            setSentiment(existing.sentiment || "neutral");
            setSaved(true);
          } else {
            // No existing summary, use query params if present
            setSummary(summaryParam);
            setKeyPoints(keyPointsParam);
            setSentiment(sentimentParam);
            setSaved(false);
          }
        })
        .catch(() => setUserSummaries([]));
    } else {
      fetchSummaries();
    }
  }, [userId, id, summaryParam, keyPointsParam, sentimentParam, page]);

  // Add state for formatted date
  useEffect(() => {
    if (pubDate) {
      const date = new Date(Number(pubDate));
      setFormattedPubDate(date.toLocaleString());
    } else {
      setFormattedPubDate("");
    }
  }, [pubDate]);

  // Store formatted dates for user summaries
  const [formattedUserSummaryDates, setFormattedUserSummaryDates] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (userSummaries.length > 0) {
      setFormattedUserSummaryDates(
        userSummaries.map((s) =>
          s.pubDate ? new Date(Number(s.pubDate)).toLocaleString() : ""
        )
      );
    } else {
      setFormattedUserSummaryDates([]);
    }
  }, [userSummaries]);

  // Save summary to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          id, // Use the actual episode ID
          title,
          description,
          pubDate,
          audio,
          summary,
          podcastTitle,
          keyPoints,
          sentiment,
          episodeImage,
        }),
      });
      if (!res.ok) throw new Error("Failed to save summary");
      const data = await res.json();
      // If the backend returns a flag or message indicating the summary already exists, do not reload
      if (data?.alreadyExists) {
        showToast("You have already summarized this episode.", "warning");
        setSaved(true);
      } else {
        setSaved(true);
        showToast("Summary saved successfully!", "success");
        // Reload the page to fetch the latest saved summaries
        window.location.reload();
      }
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Failed to save summary",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Clear all summaries for this user
  const handleClearSummaries = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/summaries?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear summaries");
      setUserSummaries([]);
      setSaved(false);
      showToast("All summaries cleared successfully!", "success");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Failed to clear summaries",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${tailwindColors.background} transition-colors`}
    >
      <Header hideSearchBar />
      <main className="w-full max-w-3xl mx-auto py-6 px-3 sm:py-10 sm:px-6">
        <h1
          className={`text-2xl font-bold ${tailwindColors.text.primary} mb-6`}
        >
          Episode Summary
        </h1>
        {/* Only show episode details and summary form if coming from summarize or if a summary is present (e.g., after summarizing) */}
        {(fromSummarize || summary) && (
          <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            {audio ? (
              <audio controls src={audio} className="mb-2 w-full" />
            ) : null}
            <div className="mb-2 text-sm text-gray-500">
              Published: {formattedPubDate}
            </div>
            <div className="mb-2 text-sm text-gray-500">
              <strong>Podcast:</strong> {podcastTitle}
            </div>
            <div className="mb-4 flex justify-center">
              <Image
                src={episodeImage}
                alt="Episode"
                width={160}
                height={160}
                className="rounded object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/episode_details.png";
                }}
              />
            </div>
            {saved ? (
              <div className="p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 rounded mb-4 text-center font-semibold">
                You have already summarized this episode.
              </div>
            ) : summary ? (
              <>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <strong>Summary:</strong>
                  <div className="mt-2 text-gray-800 dark:text-gray-100">
                    {summary}
                  </div>
                  {!isFromTranscript && (
                    <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 italic">
                      ⚠️ Note: This summary is based on the episode description
                      as the full transcript was not available.
                    </div>
                  )}
                </div>
                <div className="mt-2 text-gray-800 dark:text-gray-100">
                  <strong>Key Points:</strong>
                  <ul className="list-disc ml-6">
                    {keyPoints.map((kp, i) => (
                      <li key={i}>{kp}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 text-gray-800 dark:text-gray-100">
                  <strong>Sentiment:</strong> {sentiment}
                </div>
                <button
                  className="mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 disabled:opacity-60"
                  onClick={handleSave}
                  disabled={saving || saved || !summary.trim()}
                >
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Summary"}
                </button>
              </>
            ) : null}
          </div>
        )}
        <div className="flex flex-row items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Your Saved Summaries</h2>
          {userSummaries.length > 0 && (
            <button
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
              onClick={handleClearSummaries}
              disabled={saving}
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {userSummaries.length === 0 && (
            <div className="text-gray-500">No saved summaries yet.</div>
          )}
          {userSummaries.map((s: Summary, idx) => (
            <div
              key={s._id}
              className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="mb-2 flex justify-center">
                <Image
                  src={s.episodeImage || "/images/episode_details.png"}
                  alt="Episode"
                  width={128}
                  height={128}
                  className="rounded object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/images/episode_details.png";
                  }}
                />
              </div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-xs text-gray-500 mb-1">
                <strong>Podcast:</strong> {s.podcastTitle || "N/A"}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                Published: {formattedUserSummaryDates[idx] || ""}
              </div>
              <div className="mt-2 text-gray-800 dark:text-gray-100">
                <strong>Key Points:</strong>
                <ul className="list-disc ml-6">
                  {(s.keyPoints || []).map((kp: string, i: number) => (
                    <li key={i}>{kp}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2 text-gray-800 dark:text-gray-100">
                <strong>Sentiment:</strong> {s.sentiment || "N/A"}
              </div>
              <div className="mt-2 text-gray-800 dark:text-gray-100">
                <strong>Summary:</strong> {cleanSummaryText(s.content)}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700 text-sm"
                  onClick={async () => {
                    if (!userId) return;
                    try {
                      const res = await fetch(
                        `/api/summaries?userId=${userId}&summaryId=${s._id}`,
                        {
                          method: "DELETE",
                        }
                      );
                      if (res.ok) {
                        setUserSummaries((prev) =>
                          prev.filter((sum) => sum._id !== s._id)
                        );
                        showToast("Summary deleted successfully!", "success");
                      } else {
                        showToast("Failed to delete summary", "error");
                      }
                    } catch {
                      showToast("Failed to delete summary", "error");
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
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
            disabled={userSummaries.length < 5}
          >
            Next
          </button>
        </div>
      </main>
      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onClose: removeToast }))}
      />
    </div>
  );
}

export default function SummariesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SummariesPageContent />
    </Suspense>
  );
}
