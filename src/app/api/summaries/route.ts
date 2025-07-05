import { NextRequest, NextResponse } from "next/server";
import { SummaryRepository } from "../../repositories/summaryRepository";
import connectToDatabase from "../../utils/mongodb";
import mongoose from "mongoose";

// --- EXTEND SUMMARY MODEL TO SUPPORT USER ID ---
import Summary from "../../models/Summary";

// PATCH: Add userId to summary schema if not present (for migration)
// (In production, update the schema and model properly)

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
  console.log("POST /api/summaries body:", body);
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
    console.error("Missing required fields", { userId, id, summary });
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const db = await connectToDatabase();
  console.log(
    "Connected to DB:",
    db?.connection?.name || db?.connections?.[0]?.name
  );
  // Check if summary already exists for this user and episode
  const existing = await Summary.findOne({ userId, episodeId: id });
  if (existing) {
    return NextResponse.json({ alreadyExists: true });
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
    sentiment,
    episodeImage,
    summaryType: "manual",
    status: "completed",
    updatedAt: new Date(),
  });
  return NextResponse.json({ summary: saved });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  await connectToDatabase();
  await Summary.deleteMany({ userId });
  return NextResponse.json({ success: true });
}
