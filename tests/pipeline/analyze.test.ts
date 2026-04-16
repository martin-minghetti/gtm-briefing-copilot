import { describe, it, expect, vi } from "vitest";
import { analyzeFacts } from "@/lib/pipeline/analyze";
import type { Fact } from "@/lib/schemas";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";

const mockGenerateObject = vi.mocked(generateObject);

describe("analyzeFacts", () => {
  it("returns brief sections from LLM response", async () => {
    const mockBrief = [
      {
        title: "What They Do",
        content: "They make plant-based burgers.",
        factIds: ["f1"],
      },
    ];

    mockGenerateObject.mockResolvedValueOnce({
      object: { sections: mockBrief },
    } as any);

    const facts: Fact[] = [
      {
        id: "f1",
        claim: "Sells plant-based burgers",
        support: "direct",
        sourceUrl: "https://example.com/",
        sourceSnippet: "We sell plant-based burgers.",
      },
    ];

    const result = await analyzeFacts(facts, "brand");
    expect(result).toEqual(mockBrief);
    expect(result[0].factIds).toContain("f1");
  });
});
