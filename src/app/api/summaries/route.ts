import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../utils/mongodb";
import Summary from "../../models/Summary";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  await connectToDatabase();
  const summaries = await Summary.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json({ summaries });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    userId,
    id,
    title,
    description,
    pubDate,
    audio,
    summary,
    podcastTitle,
    keyPoints,
    sentiment,
    episodeImage,
  } = body;
  if (!userId || !id || !summary) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  await connectToDatabase();
  // Check if summary already exists for this user and episode
  const existing = await Summary.findOne({ userId, episodeId: id });
  if (existing) {
    return NextResponse.json({ alreadyExists: true });
  }
  // Map non-English sentiment to English enum
  function normalizeSentiment(sent: string) {
    if (!sent) return "neutral";
    // Add more mappings as needed
    const map: Record<string, string> = {
      positive: "positive",
      negative: "negative",
      neutral: "neutral",
      // Chinese
      积极: "positive",
      消极: "negative",
      中性: "neutral",
      // Spanish
      positivo: "positive",
      negativo: "negative",
      // French
      positif: "positive",
      négatif: "negative",
      neutre: "neutral",
      // German
      positiv: "positive",
      negativ: "negative",
    };
    return map[sent.trim().toLowerCase()] || "neutral";
  }
  // Create new summary
  const saved = await Summary.create({
    userId,
    episodeId: id,
    title,
    description,
    pubDate,
    audio,
    content: summary,
    podcastTitle,
    keyPoints,
    sentiment: normalizeSentiment(sentiment),
    episodeImage,
    summaryType: "auto",
    status: "completed",
  });
  return NextResponse.json({ summary: saved });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const summaryId = searchParams.get("summaryId");
  await connectToDatabase();
  if (summaryId) {
    // Delete a single summary by its _id
    const deleted = await Summary.deleteOne({ _id: summaryId, userId });
    if (deleted.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Summary not found or not deleted" },
        { status: 404 }
      );
    }
  }
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  await Summary.deleteMany({ userId });
  return NextResponse.json({ success: true });
}
