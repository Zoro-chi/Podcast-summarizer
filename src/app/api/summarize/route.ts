// src/app/api/summarize/route.ts
import { SummaryRepository } from "../../repositories/summaryRepository";
import { NextRequest, NextResponse } from "next/server";
import { summarizePodcastGemini } from "../../utils/gemini";
import { summarizePodcastOpenAI } from "../../utils/openai";

export async function POST(req: NextRequest) {
  const { episodeId, transcript, description, language } = await req.json();

  // Validate input - must have either transcript or description
  if (!transcript && !description) {
    return NextResponse.json(
      {
        error: "Either transcript or description is required for summarization",
      },
      { status: 400 }
    );
  }

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

  // 2. Use transcript if available, otherwise fall back to description
  const contentToSummarize = transcript || description;
  const isFromTranscript = !!transcript;

  // 3. Generate summary with Gemini (preferred) or OpenAI (fallback)
  let aiResult;
  try {
    aiResult = await summarizePodcastGemini(contentToSummarize, {
      language,
      isFromTranscript,
    });
    if (!aiResult.summary) throw new Error("Gemini returned empty summary");
  } catch {
    aiResult = await summarizePodcastOpenAI(contentToSummarize, {
      language,
      isFromTranscript,
    });
  }

  // 4. Return the AI result without saving (user must explicitly save)
  return NextResponse.json({
    summary: aiResult.summary,
    keyPoints: aiResult.keyPoints,
    sentiment: aiResult.sentiment,
    cached: false,
    isFromTranscript,
  });
}
