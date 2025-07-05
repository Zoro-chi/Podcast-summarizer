import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI();

/**
 * Summarize a podcast transcript using OpenAI GPT-4o.
 * @param transcript The full transcript or text of the podcast episode.
 * @param options Optional: { language, maxTokens, prompt }
 * @returns The summary string.
 */
export async function summarizePodcastOpenAI(
  transcript: string,
  options?: {
    language?: string;
    maxTokens?: number;
    prompt?: string;
  }
): Promise<string> {
  const systemPrompt =
    options?.prompt ||
    `You are a helpful assistant. Summarize the following podcast transcript in a concise, engaging, and informative way for a general audience.`;

  const userPrompt =
    options?.language && options.language !== "en"
      ? `Please write the summary in ${options.language}.

Podcast transcript:
${transcript}`
      : `Podcast transcript:
${transcript}`;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_API_MODEL || "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: options?.maxTokens || 512,
    temperature: 0.5,
  });

  return completion.choices[0]?.message?.content?.trim() || "";
}
