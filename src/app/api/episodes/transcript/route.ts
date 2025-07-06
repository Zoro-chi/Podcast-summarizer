import { NextRequest, NextResponse } from "next/server";
import { getEpisodeById } from "../../../utils/listenNotesApi";
import { stripHtmlTags } from "../../../utils/htmlCleaner";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const episodeId = searchParams.get("episodeId");
  if (!episodeId) {
    return NextResponse.json({ error: "Missing episodeId" }, { status: 400 });
  }
  try {
    const data = await getEpisodeById(episodeId);
    const transcript = (data as { transcript?: string }).transcript;
    const description = (data as { description?: string }).description;

    return NextResponse.json({
      transcript: transcript || null,
      description: description ? stripHtmlTags(description) : null,
      hasTranscript: !!transcript,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch episode data" },
      { status: 500 }
    );
  }
}
