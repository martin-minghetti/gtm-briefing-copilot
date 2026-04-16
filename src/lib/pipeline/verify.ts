import { generateObject } from "ai";
import {
  VerificationResultSchema,
  type Fact,
  type BriefSection,
  type MessagingAngle,
  type CrmNote,
  type VerificationResult,
} from "@/lib/schemas";
import { verifyPrompt } from "@/lib/prompts";
import { createProvider } from "@/lib/ai-provider";

export async function verifyAnalysis(
  facts: Fact[],
  brief: BriefSection[],
  messaging: MessagingAngle[],
  crmNote: CrmNote,
  apiKey?: string
): Promise<VerificationResult> {
  const provider = createProvider(apiKey);
  const analysisJson = JSON.stringify({ brief, messaging, crmNote });
  const factsJson = JSON.stringify(facts);

  const { object } = await generateObject({
    model: provider("claude-haiku-4-5-20251001"),
    schema: VerificationResultSchema,
    prompt: verifyPrompt(analysisJson, factsJson),
  });

  return object;
}
