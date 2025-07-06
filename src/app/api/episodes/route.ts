import { NextRequest, NextResponse } from "next/server";
import { getEpisodesForPodcast } from "../../utils/listenNotesApi";
import { Episode } from "../../types/podcast";
import { stripHtmlTags } from "../../utils/htmlCleaner";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const podcastId = searchParams.get("podcastId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const page_size = parseInt(searchParams.get("page_size") || "8", 10);

  if (!podcastId) {
    return NextResponse.json({ error: "Missing podcastId" }, { status: 400 });
  }

  try {
    // Calculate offset for pagination (ListenNotes uses next_episode_pub_date for pagination)
    const params: Record<string, string | number> = { page_size };

    // For pages beyond 1, we need to implement offset-based pagination
    // ListenNotes API uses next_episode_pub_date for pagination, but for simplicity,
    // we'll use a client-side approach to track seen episodes
    if (page > 1) {
      // ListenNotes doesn't have traditional offset, so we'll fetch more episodes
      // and handle pagination client-side
      params.page_size = page_size * page; // Get enough episodes to cover all pages
    }

    const data = (await getEpisodesForPodcast(podcastId, params)) as {
      episodes?: Episode[];
    };

    let episodes = data.episodes || [];

    // If we're on page > 1, slice the results to get the correct page
    if (page > 1 && episodes.length > 0) {
      const startIndex = (page - 1) * page_size;
      const endIndex = startIndex + page_size;
      episodes = episodes.slice(startIndex, endIndex);
    } else if (page === 1) {
      // For first page, just take the first page_size episodes
      episodes = episodes.slice(0, page_size);
    }

    // Clean HTML from episode descriptions
    episodes = episodes.map((episode) => ({
      ...episode,
      description: stripHtmlTags(episode.description || ""),
    }));

    return NextResponse.json({ episodes });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch episodes" },
      { status: 500 }
    );
  }
}
