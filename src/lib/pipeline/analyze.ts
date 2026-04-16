import { generateObject } from "ai";
import { z } from "zod";
import { BriefSectionSchema, type Fact, type BriefSection, type AccountTypeValue } from "@/lib/schemas";
import { analyzePrompt } from "@/lib/prompts";
import { createProvider } from "@/lib/ai-provider";

export async function analyzeFacts(
  facts: Fact[],
  accountType: AccountTypeValue,
  apiKey?: string
): Promise<BriefSection[]> {
  const provider = createProvider(apiKey);
  const { object } = await generateObject({
    model: provider("claude-sonnet-4-20250514"),
    schema: z.object({ sections: z.array(BriefSectionSchema) }),
    prompt: analyzePrompt(JSON.stringify(facts), accountType),
  });

  return object.sections;
}
