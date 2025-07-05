import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISummary extends Document {
  userId: string; // Added for user-specific summaries
  episodeId: string;
  podcastId?: string;
  podcastTitle?: string; // Added
  title?: string;
  description?: string;
  pubDate?: string;
  audio?: string;
  episodeImage?: string; // Added
  content: string;
  keyPoints?: string[]; // Already present
  tags?: string[];
  sentiment?: "positive" | "neutral" | "negative"; // Already present
  summaryType: "auto" | "manual";
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const SummarySchema = new Schema<ISummary>(
  {
    userId: { type: String, required: true, index: true },
    episodeId: { type: String, required: true },
    podcastId: { type: String },
    podcastTitle: { type: String }, // Added
    title: { type: String },
    description: { type: String },
    pubDate: { type: String },
    audio: { type: String },
    episodeImage: { type: String }, // Added
    content: { type: String, required: true },
    keyPoints: [String],
    tags: [String],
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
    },
    summaryType: {
      type: String,
      enum: ["auto", "manual"],
      default: "auto",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

SummarySchema.index({ userId: 1, episodeId: 1 }, { unique: true });
SummarySchema.index({ createdAt: -1 });

const Summary: Model<ISummary> =
  mongoose.models.Summary ||
  mongoose.model<ISummary>("Summary", SummarySchema, "Summaries");

export default Summary;
