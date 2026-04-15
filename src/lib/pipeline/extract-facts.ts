import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { FactSchema, type Fact } from "@/lib/schemas";
import { extractFactsPrompt } from "@/lib/prompts";
import type { ScrapedPage } from "@/lib/scraper";

export async function extractFacts(pages: ScrapedPage[]): Promise<Fact[]> {
  const pagesContent = pages
    .map((p) => `--- PAGE: ${p.url} ---\n${p.content}`)
    .join("\n\n");

  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-20250514"),
    schema: z.array(FactSchema),
    prompt: extractFactsPrompt(pagesContent),
  });

  return object;
}
