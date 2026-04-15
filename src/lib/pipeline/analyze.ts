import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { BriefSectionSchema, type Fact, type BriefSection, type AccountTypeValue } from "@/lib/schemas";
import { analyzePrompt } from "@/lib/prompts";

export async function analyzeFacts(
  facts: Fact[],
  accountType: AccountTypeValue
): Promise<BriefSection[]> {
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-20250514"),
    schema: z.array(BriefSectionSchema),
    prompt: analyzePrompt(JSON.stringify(facts), accountType),
  });

  return object;
}
