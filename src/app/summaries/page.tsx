"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import { tailwindColors } from "../constants/Color";
import dummyEpisodes from "../episodes/dummyEpisodes.json";

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

export default function SummariesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const summaryParam =
    searchParams.get("summary")?.trim() ||
    "This is a sample summary for the episode. Replace with real AI summary when available.";
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSummaries, setUserSummaries] = useState<any[]>([]);
  const userId = getOrCreateUserId();

  // Get episode details from query params
  const id = searchParams.get("id") || "";
  const title = searchParams.get("title") || "";
  const description = searchParams.get("description") || "";
  const pubDate = searchParams.get("pubDate") || "";
  const audio = searchParams.get("audio") || "";
  const podcastTitle =
    searchParams.get("podcastTitle") || "Dummy Podcast Title";
  const episodeImage =
    searchParams.get("episodeImage") || "/images/episode_details.png";
  const keyPoints = [
    "Key point 1 for this episode.",
    "Key point 2 for this episode.",
    "Key point 3 for this episode.",
  ];
  const sentiment = "neutral";

  useEffect(() => {
    console.log("SummariesPage query params:", {
      id,
      title,
      description,
      pubDate,
      audio,
    });
  }, [id, title, description, pubDate, audio]);

  // On load, check if a summary for this episode already exists for the user
  useEffect(() => {
    if (!userId) return;

    // Always set the default summary first
    setSummary(summaryParam);
    setSaved(false);

    // If we have an id, check for existing summaries
    if (id) {
      fetch(`/api/summaries?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserSummaries(data.summaries || []);
          // If a summary for this episode exists, show it
          const existing = (data.summaries || []).find(
            (s: any) => s.episodeId === id
          );
          if (existing) {
            setSummary(existing.content);
            setSaved(true);
          }
        })
        .catch(() => setUserSummaries([]));
    } else {
      // If no id, just fetch user summaries
      fetch(`/api/summaries?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserSummaries(data.summaries || []);
        })
        .catch(() => setUserSummaries([]));
    }
  }, [userId, id, summaryParam]);

  // Save summary to backend
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          id: 2,
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
        setError("You have already summarized this episode.");
        setSaved(true);
      } else {
        setSaved(true);
        // Reload the page to fetch the latest saved summaries
        window.location.reload();
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Clear all summaries for this user
  const handleClearSummaries = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/summaries?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear summaries");
      setUserSummaries([]);
      setSaved(false);
    } catch (e: any) {
      setError(e.message);
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
        <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="mb-2 text-gray-600 dark:text-gray-300">{description}</p>
          {audio ? (
            <audio controls src={audio} className="mb-2 w-full" />
          ) : null}
          <div className="mb-2 text-sm text-gray-500">
            Published:{" "}
            {pubDate ? new Date(Number(pubDate)).toLocaleString() : ""}
          </div>
          <div className="mb-2 text-sm text-gray-500">
            <strong>Podcast:</strong> {podcastTitle}
          </div>
          <div className="mb-4 flex justify-center">
            <img
              src={episodeImage}
              alt="Episode"
              className="rounded w-40 h-40 object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/episode_details.png";
              }}
            />
          </div>
          {saved ? (
            <div className="p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 rounded mb-4 text-center font-semibold">
              You have already summarized this episode.
            </div>
          ) : (
            <>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <strong>Summary:</strong>
                <div className="mt-2 text-gray-800 dark:text-gray-100">
                  {summary}
                </div>
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
              {error && <div className="mt-2 text-red-500">{error}</div>}
            </>
          )}
        </div>
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
          {userSummaries.map((s) => (
            <div
              key={s._id}
              className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="mb-2 flex justify-center">
                <img
                  src={s.episodeImage || "/images/episode_details.png"}
                  alt="Episode"
                  className="rounded w-32 h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/episode_details.png";
                  }}
                />
              </div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {s.description}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                <strong>Podcast:</strong> {s.podcastTitle || "N/A"}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                Published:{" "}
                {s.pubDate ? new Date(Number(s.pubDate)).toLocaleString() : ""}
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
                <strong>Summary:</strong> {s.content}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
