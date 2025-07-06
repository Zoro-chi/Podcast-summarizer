import Summary, { ISummary } from "../models/Summary";
import connectToDatabase from "../utils/mongodb";

/**
 * SummaryRepository provides methods to interact with the Summary model.
 * It includes methods to find, create, and update summaries based on episode IDs.
 */
export class SummaryRepository {
  /**
   * Finds all summaries in the database.
   * @returns A promise that resolves to an array of summaries.
   */
  static async findAll(): Promise<ISummary[]> {
    await connectToDatabase();
    return Summary.find().sort({ createdAt: -1 });
  }

  /**
   * Finds a summary by its episode ID.
   * @param episodeId - The ID of the episode to find the summary for.
   * @returns A promise that resolves to the summary or null if not found.
   */
  static async findByEpisodeId(episodeId: string): Promise<ISummary | null> {
    await connectToDatabase();
    return Summary.findOne({ episodeId });
  }

  /**
   * Finds all summaries for a specific podcast ID.
   * @param podcastId - The ID of the podcast to find summaries for.
   * @returns A promise that resolves to an array of summaries.
   */
  static async createOrUpdate(
    episodeId: string,
    content: string,
    keyPoints?: string[],
    sentiment?: string
  ): Promise<ISummary> {
    await connectToDatabase();
    return Summary.findOneAndUpdate(
      { episodeId },
      { content, keyPoints, sentiment, updatedAt: new Date() },
      { upsert: true, new: true }
    );
  }
}
