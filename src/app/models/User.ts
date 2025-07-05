import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  preferences?: {
    defaultSummaryLength?: "short" | "medium" | "long";
    favoriteGenres?: string[];
  };
  savedPodcasts?: string[];
  savedEpisodes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    preferences: {
      defaultSummaryLength: {
        type: String,
        enum: ["short", "medium", "long"],
        default: "medium",
      },
      favoriteGenres: [String],
    },
    savedPodcasts: [String],
    savedEpisodes: [String],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
