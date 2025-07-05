// src/app/api/summarize/route.ts
import { SummaryRepository } from "../../repositories/summaryRepository";
import { NextRequest, NextResponse } from "next/server";
// import { callGeminiLLM } from "@/utils/gemini"; // You implement this

export async function POST(req: NextRequest) {
  const { episodeId } = await req.json();

  // 1. Check for existing summary
  const existing = await SummaryRepository.findByEpisodeId(episodeId);
  if (existing) {
    return NextResponse.json({ summary: existing.content, cached: true });
  }

  // 2. Generate summary with Gemini
  // const { transcript } = await req.json(); // Use transcript when implementing summarization
  // const summary = await callGeminiLLM(transcript);

  // 3. Save and return
  // await SummaryRepository.createOrUpdate(episodeId, summary);
  // return NextResponse.json({ summary, cached: false });

  // Temporary response until summarization is implemented
  return NextResponse.json(
    { message: "Summarization not yet implemented" },
    { status: 501 }
  );
}
