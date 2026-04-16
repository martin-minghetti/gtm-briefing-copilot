import * as cheerio from "cheerio";

export interface ScrapedPage {
  url: string;
  content: string;
}

const LINK_KEYWORDS = ["about", "product", "solution", "customer", "team", "company", "service"];
const MAX_INTERNAL_PAGES = 2;
const CONTENT_MAX_CHARS = 16000; // ~4000 tokens
const FETCH_TIMEOUT_MS = 5000;

async function safeFetch(url: string): Promise<{ ok: boolean; text: string; url: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;
    const text = await response.text();
    return { ok: true, text, url: response.url };
  } catch {
    return null;
  }
}

function extractText(html: string): string {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, noscript, iframe").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return text.slice(0, CONTENT_MAX_CHARS);
}

function discoverInternalLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const links: string[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      const resolved = new URL(href, baseUrl);
      if (resolved.hostname !== base.hostname) return;

      const path = resolved.pathname.toLowerCase();
      const linkText = $(el).text().toLowerCase();

      const matches = LINK_KEYWORDS.some(
        (kw) => path.includes(kw) || linkText.includes(kw)
      );
      if (matches && !links.includes(resolved.href)) {
        links.push(resolved.href);
      }
    } catch {
      // invalid URL, skip
    }
  });

  return links.slice(0, MAX_INTERNAL_PAGES);
}

export async function fetchPages(url: string): Promise<ScrapedPage[]> {
  const pages: ScrapedPage[] = [];

  // Fetch homepage
  const homepage = await safeFetch(url);
  if (!homepage) return pages;

  pages.push({
    url: homepage.url,
    content: extractText(homepage.text),
  });

  // Discover and fetch internal pages
  const internalLinks = discoverInternalLinks(homepage.text, homepage.url);
  const internalResults = await Promise.allSettled(
    internalLinks.map((link) => safeFetch(link))
  );

  for (const result of internalResults) {
    if (result.status === "fulfilled" && result.value) {
      pages.push({
        url: result.value.url,
        content: extractText(result.value.text),
      });
    }
  }

  return pages;
}
