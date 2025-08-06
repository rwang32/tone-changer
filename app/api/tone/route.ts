// app/api/tone/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { original, tone } = await req.json();

  if (!original || !tone) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4", // or "gpt-3.5-turbo"
    messages: [
      {
        role: "system",
        content:
          "You are a professional writing assistant. Rewrite user messages in the requested tone, keeping meaning intact.",
      },
      {
        role: "user",
        content: `Rewrite the following message in a ${tone} tone:\n\n"${original}"`,
      },
    ],
    temperature: 0.7,
  });

  const rewritten = completion.choices[0]?.message?.content ?? "No response.";
  return NextResponse.json({ rewritten });
}
