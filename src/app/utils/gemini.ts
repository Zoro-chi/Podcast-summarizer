import { GoogleGenAI } from "@google/genai";
import { cleanTextForAI } from "./htmlCleaner";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

// Map language codes to full language names for Gemini prompt
const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  zh: "Chinese",
  // Add more as needed
};

/**
 * Summarize a podcast transcript using Google Gemini.
 * @param content The full transcript or text of the podcast episode.
 * @param options Optional: { language, prompt, model, isFromTranscript }
 * @returns { summary: string, keyPoints: string[], sentiment: string }
 */
export async function summarizePodcastGemini(
  content: string,
  options?: {
    language?: string;
    prompt?: string;
    model?: string;
    isFromTranscript?: boolean;
  }
): Promise<{ summary: string; keyPoints: string[]; sentiment: string }> {
  // Clean HTML tags and prepare content for AI processing
  const cleanContent = cleanTextForAI(content);

  const modelName =
    options?.model || process.env.GEMINI_MODEL || "gemini-1.5-flash";
  // Convert language code to full name for prompt
  const languageName =
    options?.language && LANGUAGE_MAP[options.language]
      ? LANGUAGE_MAP[options.language]
      : options?.language;

  const isFromTranscript = options?.isFromTranscript ?? true;
  const contentType = isFromTranscript ? "transcript" : "description";
  const summaryInstruction = isFromTranscript
    ? "in no more than 4 paragraphs"
    : "in 2-3 paragraphs (noting this is based on episode description, not full transcript)";

  const systemPrompt =
    options?.prompt ||
    (languageName && languageName !== "English"
      ? `You are a helpful assistant. Summarize the following podcast ${contentType} ${summaryInstruction} in ${languageName}. Then, extract the key points as a bullet list in ${languageName}, and provide the overall sentiment (positive, negative, or neutral). Respond in JSON format: { "summary": string, "keyPoints": string[], "sentiment": string }. All text content must be written in ${languageName}.`
      : `You are a helpful assistant. Summarize the following podcast ${contentType} ${summaryInstruction}. Then, extract the key points as a bullet list, and provide the overall sentiment (positive, negative, or neutral). Respond in JSON format: { "summary": string, "keyPoints": string[], "sentiment": string }`);

  const userPrompt = `Podcast ${contentType}:\n${cleanContent}`;

  const prompt = `${systemPrompt}\n${userPrompt}`;
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
  });

  // Try to parse JSON from the response
  try {
    const json = JSON.parse(response.text || "{}");
    return {
      summary: json.summary || "",
      keyPoints: json.keyPoints || [],
      sentiment: json.sentiment || "neutral",
    };
  } catch {
    // Fallback: return the whole response as summary
    return {
      summary: response.text || "",
      keyPoints: [],
      sentiment: "neutral",
    };
  }
}
