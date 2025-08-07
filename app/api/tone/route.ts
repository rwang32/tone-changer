import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { original, tone } = await req.json();

    if (!original || !tone) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use gpt-4 only if your key has access
      messages: [
        {
          role: "system",
          content: "You are a writing assistant that rewrites text in different tones.",
        },
        {
          role: "user",
          content: `Rewrite this in a ${tone} tone: "${original}"`,
        },
      ],
      temperature: 0.7,
    });

    const rewritten = completion.choices[0]?.message?.content ?? "No output.";
    return NextResponse.json({ rewritten });
  } catch (error) {
    console.error("🔥 API route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
