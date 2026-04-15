import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPages } from "@/lib/scraper";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

const htmlWithLinks = `
<html><body>
  <h1>Acme Foods</h1>
  <p>We make plant-based snacks.</p>
  <a href="/about">About Us</a>
  <a href="/products">Our Products</a>
  <a href="/careers">Careers</a>
  <a href="https://external.com/link">External</a>
</body></html>
`;

const aboutHtml = `
<html><body>
  <h1>About Acme Foods</h1>
  <p>Founded in 2020, we serve retail and foodservice.</p>
</body></html>
`;

describe("fetchPages", () => {
  it("fetches homepage and discovers internal links by keyword", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWithLinks,
        url: "https://acmefoods.com/",
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => aboutHtml,
        url: "https://acmefoods.com/about",
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => "<html><body>Products page</body></html>",
        url: "https://acmefoods.com/products",
      });

    const pages = await fetchPages("https://acmefoods.com");

    expect(pages.length).toBeGreaterThanOrEqual(1);
    expect(pages[0].url).toBe("https://acmefoods.com/");
    expect(pages[0].content).toContain("plant-based snacks");
  });

  it("skips pages that 404", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWithLinks,
        url: "https://acmefoods.com/",
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        url: "https://acmefoods.com/about",
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        url: "https://acmefoods.com/products",
      });

    const pages = await fetchPages("https://acmefoods.com");
    expect(pages.length).toBe(1);
  });

  it("handles fetch timeout gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("timeout"));

    const pages = await fetchPages("https://acmefoods.com");
    expect(pages).toEqual([]);
  });

  it("truncates content to stay within token limits", async () => {
    const longContent = "<html><body>" + "a".repeat(50000) + "</body></html>";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => longContent,
      url: "https://acmefoods.com/",
    });

    const pages = await fetchPages("https://acmefoods.com");
    expect(pages[0].content.length).toBeLessThanOrEqual(16000);
  });
});
