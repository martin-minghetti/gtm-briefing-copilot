import { describe, it, expect, vi } from "vitest";
import { extractFacts } from "@/lib/pipeline/extract-facts";
import type { ScrapedPage } from "@/lib/scraper";

// Mock the ai SDK
vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";

const mockGenerateObject = vi.mocked(generateObject);

describe("extractFacts", () => {
  it("returns parsed facts from LLM response", async () => {
    const mockFacts = [
      {
        id: "f1",
        claim: "Sells plant-based burgers",
        support: "direct",
        sourceUrl: "https://example.com/",
        sourceSnippet: "We sell plant-based burgers.",
      },
    ];

    mockGenerateObject.mockResolvedValueOnce({
      object: { facts: mockFacts },
    } as any);

    const pages: ScrapedPage[] = [
      { url: "https://example.com/", content: "We sell plant-based burgers." },
    ];

    const result = await extractFacts(pages);
    expect(result).toEqual(mockFacts);
    expect(result[0].support).toBe("direct");
  });
});
