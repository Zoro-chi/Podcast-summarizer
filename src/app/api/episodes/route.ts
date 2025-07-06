import { NextRequest, NextResponse } from "next/server";
import { getEpisodesForPodcast } from "../../utils/listenNotesApi";
import { Episode } from "../../types/podcast";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const podcastId = searchParams.get("podcastId");
  const page_size = searchParams.get("page_size") || 8;
  if (!podcastId) {
    return NextResponse.json({ error: "Missing podcastId" }, { status: 400 });
  }
  try {
    const data = (await getEpisodesForPodcast(podcastId, { page_size })) as {
      episodes?: Episode[];
    };
    return NextResponse.json({ episodes: data.episodes || [] });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch episodes" },
      { status: 500 }
    );
  }
}
