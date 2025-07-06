import { NextRequest, NextResponse } from "next/server";
import { getBestPodcasts } from "@/app/utils/listenNotesApi";
import { Podcast } from "../../types/podcast";
import { stripHtmlTags } from "../../utils/htmlCleaner";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const page_size = parseInt(searchParams.get("page_size") || "8", 10);

  try {
    // ListenNotes best podcasts API supports page parameter
    const params: Record<string, string | number> = {
      page: page,
      page_size: page_size,
      region: "us", // You can make this configurable
      safe_mode: 0,
    };

    const data = (await getBestPodcasts(params)) as { podcasts: Podcast[] };

    // Clean HTML from podcast descriptions
    const cleanedPodcasts = (data.podcasts || []).map((podcast) => ({
      ...podcast,
      description: stripHtmlTags(podcast.description || ""),
    }));

    return NextResponse.json({ podcasts: cleanedPodcasts });
  } catch (err) {
    return NextResponse.json(
      { podcasts: [], error: String(err) },
      { status: 500 }
    );
  }
}
