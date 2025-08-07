const toneOptions: Record<string, string> = {
  professional: "Clear, formal, and respectful",
  friendly: "Warm, conversational, and upbeat",
  casual: "Relaxed, everyday tone",
  assertive: "Direct and confident",
  apologetic: "Humble and empathetic",
};

export function buildPrompt(original: string, tone: string): string {
  const toneDesc = toneOptions[tone] ?? tone;
  return `Rewrite the following message in a ${tone} tone (${toneDesc}). 
    Keep the original meaning, correct grammar, and avoid unnecessary embellishments.

    Message:
    "${original}"`;
}
