import { NextResponse } from "next/server";
import { getBestPodcasts } from "@/app/utils/listenNotesApi";

export async function GET() {
  try {
    const data = (await getBestPodcasts()) as { podcasts: any[] };
    return NextResponse.json({ podcasts: data.podcasts || [] });
  } catch (err) {
    return NextResponse.json(
      { podcasts: [], error: String(err) },
      { status: 500 }
    );
  }
}
