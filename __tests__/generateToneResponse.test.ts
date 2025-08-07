import { generateToneResponse } from "@/lib/generateToneResponse";

// Mocks
jest.mock("openai", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn()
            .mockResolvedValueOnce({ choices: [{ message: { content: "Mocked response" } }] }) // success
            .mockRejectedValueOnce(new Error("API failure")), // simulate failure
        },
      },
    })),
  };
});

describe("generateToneResponse", () => {
  it("returns the rewritten message from OpenAI", async () => {
    const result = await generateToneResponse("Hello", "professional");
    expect(result).toBe("Mocked response");
  });

  it("throws an error if OpenAI fails", async () => {
    await expect(generateToneResponse("Oops", "friendly")).rejects.toThrow("API failure");
  });
});
