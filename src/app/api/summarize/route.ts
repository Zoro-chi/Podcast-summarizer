// src/app/api/summarize/route.ts
import { SummaryRepository } from "../../repositories/summaryRepository";
import { NextRequest, NextResponse } from "next/server";
import { summarizePodcastGemini } from "../../utils/gemini";
import { summarizePodcastOpenAI } from "../../utils/openai";

export async function POST(req: NextRequest) {
  const { episodeId, transcript, language } = await req.json();

  // 1. Check for existing summary
  const existing = await SummaryRepository.findByEpisodeId(episodeId);
  if (existing) {
    return NextResponse.json({
      summary: existing.content,
      keyPoints: existing.keyPoints || [],
      sentiment: existing.sentiment || "neutral",
      cached: true,
    });
  }

  // 2. Generate summary with Gemini (preferred) or OpenAI (fallback)
  let aiResult;
  try {
    aiResult = await summarizePodcastGemini(transcript, { language });
    if (!aiResult.summary) throw new Error("Gemini returned empty summary");
  } catch {
    aiResult = await summarizePodcastOpenAI(transcript, { language });
  }

  // 3. Return the AI result without saving (user must explicitly save)
  return NextResponse.json({
    summary: aiResult.summary,
    keyPoints: aiResult.keyPoints,
    sentiment: aiResult.sentiment,
    cached: false,
  });
}
