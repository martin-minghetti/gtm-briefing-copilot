import { generateObject } from "ai";
import { z } from "zod";
import { FactSchema, type Fact } from "@/lib/schemas";
import { extractFactsPrompt } from "@/lib/prompts";
import { createProvider } from "@/lib/ai-provider";
import type { ScrapedPage } from "@/lib/scraper";

export async function extractFacts(pages: ScrapedPage[], apiKey?: string): Promise<Fact[]> {
  const provider = createProvider(apiKey);
  const pagesContent = pages
    .map((p) => `--- PAGE: ${p.url} ---\n${p.content}`)
    .join("\n\n");

  const { object } = await generateObject({
    model: provider("claude-sonnet-4-20250514"),
    schema: z.object({ facts: z.array(FactSchema) }),
    prompt: extractFactsPrompt(pagesContent),
  });

  return object.facts;
}
