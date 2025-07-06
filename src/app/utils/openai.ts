import OpenAI from "openai";
import dotenv from "dotenv";
import { cleanTextForAI } from "./htmlCleaner";
dotenv.config();

const client = new OpenAI();

// Map language codes to full language names for OpenAI prompt
const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  zh: "Chinese",
  // Add more as needed
};

/**
 * Summarize a podcast transcript using OpenAI GPT-4o.
 * @param content The full transcript or text of the podcast episode.
 * @param options Optional: { language, maxTokens, prompt, isFromTranscript }
 * @returns { summary: string, keyPoints: string[], sentiment: string }
 */
export async function summarizePodcastOpenAI(
  content: string,
  options?: {
    language?: string;
    maxTokens?: number;
    prompt?: string;
    isFromTranscript?: boolean;
  }
): Promise<{ summary: string; keyPoints: string[]; sentiment: string }> {
  // Clean HTML tags and prepare content for AI processing
  const cleanContent = cleanTextForAI(content);

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

  const userPrompt = `Podcast ${contentType}:
${cleanContent}`;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_API_MODEL || "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: options?.maxTokens || 1024,
    temperature: 0.5,
  });

  // Try to parse JSON from the response
  const text = completion.choices[0]?.message?.content?.trim() || "";
  try {
    const json = JSON.parse(text);
    return {
      summary: json.summary || "",
      keyPoints: json.keyPoints || [],
      sentiment: json.sentiment || "neutral",
    };
  } catch {
    // Fallback: return the whole response as summary
    return {
      summary: text,
      keyPoints: [],
      sentiment: "neutral",
    };
  }
}
