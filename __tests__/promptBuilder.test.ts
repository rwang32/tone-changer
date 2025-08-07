import { buildPrompt } from "@/utils/promptBuilder";

describe("buildPrompt", () => {
  it("builds prompt with known tone", () => {
    const result = buildPrompt("Let's meet at 3pm", "assertive");
    expect(result).toContain("assertive");
    expect(result).toContain("Let's meet at 3pm");
  });

  it("falls back to raw tone name for unknown tone", () => {
    const result = buildPrompt("Check this out", "weird" as any);
    expect(result).toContain("weird");
  });
});
