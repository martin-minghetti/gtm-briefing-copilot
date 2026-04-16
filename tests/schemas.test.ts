import { describe, it, expect } from "vitest";
import {
  FactSchema,
  BriefSectionSchema,
  MessagingAngleSchema,
  CrmNoteSchema,
  VerificationResultSchema,
  AnalyzeRequestSchema,
} from "@/lib/schemas";

describe("FactSchema", () => {
  it("accepts a valid fact with direct support", () => {
    const fact = {
      id: "f1",
      claim: "Sells plant-based burgers to retail chains",
      support: "direct",
      sourceUrl: "https://example.com/about",
      sourceSnippet: "We sell plant-based burgers to major retail chains nationwide.",
    };
    expect(FactSchema.parse(fact)).toEqual(fact);
  });

  it("rejects invalid support level", () => {
    const fact = {
      id: "f1",
      claim: "Something",
      support: "verified",
      sourceUrl: "https://example.com",
      sourceSnippet: "text",
    };
    expect(() => FactSchema.parse(fact)).toThrow();
  });

  it("accepts missing support level", () => {
    const fact = {
      id: "f2",
      claim: "Company has 500 employees",
      support: "missing",
      sourceUrl: "https://example.com",
      sourceSnippet: "",
    };
    expect(FactSchema.parse(fact)).toEqual(fact);
  });
});

describe("BriefSectionSchema", () => {
  it("accepts valid brief section with factIds", () => {
    const section = {
      title: "What they do",
      content: "They manufacture plant-based protein products.",
      factIds: ["f1", "f3"],
    };
    expect(BriefSectionSchema.parse(section)).toEqual(section);
  });
});

describe("MessagingAngleSchema", () => {
  it("accepts valid messaging angle", () => {
    const angle = {
      label: "Cost Efficiency",
      hook: "Reduce ingredient costs by 20%",
      valueProp: "Our platform identifies cost-saving ingredient swaps.",
      suggestedCta: "Book a 15-min demo to see your savings potential.",
      factIds: ["f1", "f2"],
    };
    expect(MessagingAngleSchema.parse(angle)).toEqual(angle);
  });
});

describe("CrmNoteSchema", () => {
  it("accepts valid CRM note", () => {
    const note = {
      companyName: "Beyond Meat",
      accountType: "brand",
      summary: "Plant-based protein company targeting retail and foodservice.",
      keyInsights: ["Growing retail presence", "Expanding into foodservice"],
      suggestedNextSteps: ["Schedule intro call", "Send case study"],
      tags: ["plant-based", "retail", "foodservice"],
      factIds: ["f1", "f2", "f3"],
    };
    expect(CrmNoteSchema.parse(note)).toEqual(note);
  });

  it("rejects invalid account type", () => {
    const note = {
      companyName: "Test",
      accountType: "retailer",
      summary: "test",
      keyInsights: [],
      suggestedNextSteps: [],
      tags: [],
      factIds: [],
    };
    expect(() => CrmNoteSchema.parse(note)).toThrow();
  });
});

describe("VerificationResultSchema", () => {
  it("accepts valid verification result", () => {
    const result = {
      unsupportedClaims: [
        { claim: "Revenue of $500M", location: "brief" as const, reason: "No revenue data on site" },
      ],
      contradictions: [],
      evidenceCoverage: 85,
      warnings: ["1 claim in brief lacks direct evidence"],
    };
    expect(VerificationResultSchema.parse(result)).toEqual(result);
  });

  it("accepts any numeric evidenceCoverage", () => {
    const result = {
      unsupportedClaims: [],
      contradictions: [],
      evidenceCoverage: 150,
      warnings: [],
    };
    expect(VerificationResultSchema.parse(result)).toEqual(result);
  });
});

describe("AnalyzeRequestSchema", () => {
  it("accepts valid request", () => {
    const req = { url: "https://example.com", accountType: "brand" };
    expect(AnalyzeRequestSchema.parse(req)).toEqual(req);
  });

  it("rejects non-url string", () => {
    expect(() => AnalyzeRequestSchema.parse({ url: "not-a-url", accountType: "brand" })).toThrow();
  });
});
