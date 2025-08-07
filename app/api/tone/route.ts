import { generateToneResponse } from "@/lib/generateToneResponse";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  original: z.string().min(5).max(1000),
  tone: z.enum([
    "professional",
    "friendly",
    "casual",
    "assertive",
    "apologetic",
  ]),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }
    const { original, tone } = parsed.data;

    // For local dev -- save tokens ;)
    if (process.env.MOCK_MODE === "true") {
      return NextResponse.json({
        rewritten: prompt,
      });
    }

    const rewritten = await generateToneResponse(original, tone);

    return NextResponse.json({ rewritten });
  } catch (error) {
    console.error("🔥 API route error:", error);

    return NextResponse.json(
      { error: "Failed to generate tone response." },
      { status: 500 }
    );
  }
}
