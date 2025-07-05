import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

/**
 * Summarize a podcast transcript using Google Gemini.
 * @param transcript The full transcript or text of the podcast episode.
 * @param options Optional: { language, prompt, model }
 * @returns The summary string.
 */
export async function summarizePodcastGemini(
  transcript: string,
  options?: {
    language?: string;
    prompt?: string;
    model?: string;
  }
): Promise<string> {
  const modelName =
    options?.model || process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const systemPrompt =
    options?.prompt ||
    `You are a helpful assistant. Summarize the following podcast transcript in a concise, engaging, and informative way for a general audience.`;

  const userPrompt =
    options?.language && options.language !== "en"
      ? `Please write the summary in ${options.language}.
\nPodcast transcript:\n${transcript}`
      : `Podcast transcript:\n${transcript}`;

  // Use the correct Gemini API based on the docs
  const prompt = `${systemPrompt}\n${userPrompt}`;
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
  });

  return response.text || "";
}
