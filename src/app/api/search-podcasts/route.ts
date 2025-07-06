import { NextRequest, NextResponse } from "next/server";
import { searchPodcasts } from "../../utils/listenNotesApi";
import { Podcast } from "../../types/podcast";
import { stripHtmlTags } from "../../utils/htmlCleaner";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const page_size = parseInt(searchParams.get("page_size") || "8", 10);

  if (!q) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );
  }

  try {
    // Calculate offset for ListenNotes API (it uses offset instead of page)
    const offset = (page - 1) * page_size;

    const data = (await searchPodcasts({
      q,
      type: "podcast",
      page_size,
      offset, // ListenNotes uses offset for pagination
    })) as { results?: Podcast[] };

    // Clean HTML from podcast descriptions
    const cleanedPodcasts = (data.results || []).map((podcast) => ({
      ...podcast,
      description: stripHtmlTags(podcast.description || ""),
    }));

    return NextResponse.json({ podcasts: cleanedPodcasts });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Search failed" },
      { status: 500 }
    );
  }
}
