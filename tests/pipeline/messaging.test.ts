import { describe, it, expect, vi } from "vitest";
import { generateMessaging } from "@/lib/pipeline/messaging";
import type { Fact, BriefSection } from "@/lib/schemas";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";

const mockGenerateObject = vi.mocked(generateObject);

describe("generateMessaging", () => {
  it("returns messaging angles and CRM note", async () => {
    const mockResult = {
      angles: [
        {
          label: "Cost Efficiency",
          hook: "Cut ingredient costs",
          valueProp: "We help identify swaps.",
          suggestedCta: "Book a demo",
          factIds: ["f1"],
        },
      ],
      crmNote: {
        companyName: "Acme Foods",
        accountType: "brand",
        summary: "Plant-based food company.",
        keyInsights: ["Growing retail presence"],
        suggestedNextSteps: ["Schedule call"],
        tags: ["plant-based"],
        factIds: ["f1"],
      },
    };

    mockGenerateObject.mockResolvedValueOnce({
      object: mockResult,
    } as any);

    const facts: Fact[] = [
      {
        id: "f1",
        claim: "Sells plant-based products",
        support: "direct",
        sourceUrl: "https://example.com/",
        sourceSnippet: "plant-based",
      },
    ];

    const brief: BriefSection[] = [
      { title: "What They Do", content: "Plant-based foods", factIds: ["f1"] },
    ];

    const result = await generateMessaging(facts, brief, "brand");
    expect(result.angles).toHaveLength(1);
    expect(result.crmNote.companyName).toBe("Acme Foods");
  });
});
