import { describe, it, expect, vi } from "vitest";
import { verifyAnalysis } from "@/lib/pipeline/verify";
import type { Fact, BriefSection, MessagingAngle, CrmNote } from "@/lib/schemas";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";

const mockGenerateObject = vi.mocked(generateObject);

describe("verifyAnalysis", () => {
  it("returns verification result with evidence coverage", async () => {
    const mockVerification = {
      unsupportedClaims: [],
      contradictions: [],
      evidenceCoverage: 90,
      warnings: [],
    };

    mockGenerateObject.mockResolvedValueOnce({
      object: mockVerification,
    } as any);

    const facts: Fact[] = [
      {
        id: "f1",
        claim: "Sells burgers",
        support: "direct",
        sourceUrl: "https://example.com/",
        sourceSnippet: "We sell burgers.",
      },
    ];

    const brief = [{ title: "What", content: "Burgers", factIds: ["f1"] }];
    const angles = [
      {
        label: "Efficiency",
        hook: "h",
        valueProp: "v",
        suggestedCta: "c",
        factIds: ["f1"],
      },
    ];
    const crmNote = {
      companyName: "Test",
      accountType: "brand" as const,
      summary: "s",
      keyInsights: ["i"],
      suggestedNextSteps: ["n"],
      tags: ["t"],
      factIds: ["f1"],
    };

    const result = await verifyAnalysis(facts, brief, angles, crmNote);
    expect(result.evidenceCoverage).toBe(90);
    expect(result.unsupportedClaims).toEqual([]);
  });
});
