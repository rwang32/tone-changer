import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { original, tone } = await req.json();

    if (
      typeof original !== "string" ||
      original.trim().length === 0 ||
      typeof tone !== "string" ||
      tone.trim().length === 0
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // For local dev -- save tokens ;)
    if (process.env.MOCK_MODE === "true") {
      return NextResponse.json({
        rewritten: `FAKE: Rewritten in ${tone} tone — "${original}"`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a writing assistant that rewrites text in different tones.",
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

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
