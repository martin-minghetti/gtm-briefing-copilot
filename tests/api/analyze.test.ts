import { describe, it, expect, vi } from "vitest";

// Mock all pipeline modules
vi.mock("@/lib/scraper", () => ({
  fetchPages: vi.fn(),
}));
vi.mock("@/lib/pipeline/extract-facts", () => ({
  extractFacts: vi.fn(),
}));
vi.mock("@/lib/pipeline/analyze", () => ({
  analyzeFacts: vi.fn(),
}));
vi.mock("@/lib/pipeline/messaging", () => ({
  generateMessaging: vi.fn(),
}));
vi.mock("@/lib/pipeline/verify", () => ({
  verifyAnalysis: vi.fn(),
}));

import { fetchPages } from "@/lib/scraper";

const mockFetchPages = vi.mocked(fetchPages);

// Import POST after mocks
import { POST } from "@/app/api/analyze/route";

describe("POST /api/analyze", () => {
  it("rejects invalid request body", async () => {
    const request = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ url: "not-a-url", accountType: "brand" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns demo fixture for known demo URL", async () => {
    const request = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ url: "https://www.oatly.com", accountType: "brand" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    // Should not call any pipeline functions for demo URLs
    expect(mockFetchPages).not.toHaveBeenCalled();
  });
});
