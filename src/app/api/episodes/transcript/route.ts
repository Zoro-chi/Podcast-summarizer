import { NextRequest, NextResponse } from "next/server";
import { getEpisodeById } from "../../../utils/listenNotesApi";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const episodeId = searchParams.get("episodeId");
  if (!episodeId) {
    return NextResponse.json({ error: "Missing episodeId" }, { status: 400 });
  }
  try {
    const data = await getEpisodeById(episodeId);
    const transcript = (data as { transcript?: string }).transcript || null;
    return NextResponse.json({ transcript });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
