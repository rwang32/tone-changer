import { buildPrompt } from "@/utils/promptBuilder";
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateToneResponse(
  original: string,
  tone: string,
  model = "gpt-4o"
) {
  const prompt = buildPrompt(original, tone);

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a writing assistant that rewrites text in different tones.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content ?? "No output.";
}
