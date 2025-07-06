import { NextRequest, NextResponse } from "next/server";
import { searchPodcasts } from "../../utils/listenNotesApi";
import { Podcast } from "../../types/podcast";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );
  }
  try {
    // Reduce page_size to 8 to minimize API usage and avoid rate limits
    const data = (await searchPodcasts({
      q,
      type: "podcast",
      page_size: 8,
    })) as { results?: Podcast[] };

    return NextResponse.json({ podcasts: data.results || [] });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Search failed" },
      { status: 500 }
    );
  }
}
