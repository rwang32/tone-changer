const mockCreate = jest.fn();

jest.mock("openai", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

import { POST } from "@/app/api/tone/route";

beforeEach(() => {
  mockCreate.mockReset();
});

describe("POST /api/tone", () => {
  it("returns 200 with rewritten message", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "Mocked GPT response" } }],
    });

    const req = new Request("http://localhost/api/tone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original: "Let's meet at 3",
        tone: "friendly",
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.rewritten).toBe("Mocked GPT response");
  });

  it("returns 500 if OpenAI fails", async () => {
    mockCreate.mockRejectedValue(new Error("API Down"));

    const req = new Request("http://localhost/api/tone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original: "Hello there",
        tone: "professional",
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to generate tone response.");
  });
});
