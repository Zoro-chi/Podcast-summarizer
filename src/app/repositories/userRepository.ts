import User, { IUser } from "../models/User";
import connectToDatabase from "../utils/mongodb";

/**
 * UserRepository provides methods to interact with the User model in the database.
 * It includes methods to find, create, update, and delete users, as well as manage
 * saved podcasts and episodes.
 */
export class UserRepository {
  /**
   * Finds a user by their email address.
   * @param email - The email address of the user.
   * @returns A promise that resolves to the user object or null if not found.
   */
  static async findByEmail(email: string): Promise<IUser | null> {
    await connectToDatabase();
    return User.findOne({ email });
  }

  /**
   * Creates a new user with the provided data.
   * @param userData - Partial user data to create a new user.
   * @returns A promise that resolves to the created user object.
   */
  static async create(userData: Partial<IUser>): Promise<IUser> {
    await connectToDatabase();
    const user = new User(userData);
    return user.save();
  }

  /**
   * Updates an existing user by their email address.
   * @param email - The email address of the user to update.
   * @param updates - Partial user data to update.
   * @returns A promise that resolves to the updated user object or null if not found.
   */
  static async update(
    email: string,
    updates: Partial<IUser>
  ): Promise<IUser | null> {
    await connectToDatabase();
    return User.findOneAndUpdate({ email }, updates, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Adds a podcast to the user's saved podcasts.
   * @param email - The email address of the user.
   * @param podcastId - The ID of the podcast to save.
   * @returns A promise that resolves to the updated user object or null if not found.
   */
  static async addSavedPodcast(
    email: string,
    podcastId: string
  ): Promise<IUser | null> {
    await connectToDatabase();
    return User.findOneAndUpdate(
      { email },
      { $addToSet: { savedPodcasts: podcastId } },
      { new: true }
    );
  }

  /**
   * Removes a podcast from the user's saved podcasts.
   * @param email - The email address of the user.
   * @param podcastId - The ID of the podcast to remove.
   * @returns A promise that resolves to the updated user object or null if not found.
   */
  static async removeSavedPodcast(
    email: string,
    podcastId: string
  ): Promise<IUser | null> {
    await connectToDatabase();
    return User.findOneAndUpdate(
      { email },
      { $pull: { savedPodcasts: podcastId } },
      { new: true }
    );
  }

  /**
   * Adds an episode to the user's saved episodes.
   * @param email - The email address of the user.
   * @param episodeId - The ID of the episode to save.
   * @returns A promise that resolves to the updated user object or null if not found.
   */
  static async addSavedEpisode(
    email: string,
    episodeId: string
  ): Promise<IUser | null> {
    await connectToDatabase();
    return User.findOneAndUpdate(
      { email },
      { $addToSet: { savedEpisodes: episodeId } },
      { new: true }
    );
  }

  /**
   * Removes an episode from the user's saved episodes.
   * @param email - The email address of the user.
   * @param episodeId - The ID of the episode to remove.
   * @returns A promise that resolves to the updated user object or null if not found.
   */
  static async removeSavedEpisode(
    email: string,
    episodeId: string
  ): Promise<IUser | null> {
    await connectToDatabase();
    return User.findOneAndUpdate(
      { email },
      { $pull: { savedEpisodes: episodeId } },
      { new: true }
    );
  }

  /**
   * Deletes a user by their email address.
   * @param email - The email address of the user to delete.
   * @returns A promise that resolves to true if the user was deleted, false otherwise.
   */
  static async delete(email: string): Promise<boolean> {
    await connectToDatabase();
    const result = await User.deleteOne({ email });
    return result.deletedCount > 0;
  }
}
