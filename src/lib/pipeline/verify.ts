import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  VerificationResultSchema,
  type Fact,
  type BriefSection,
  type MessagingAngle,
  type CrmNote,
  type VerificationResult,
} from "@/lib/schemas";
import { verifyPrompt } from "@/lib/prompts";

export async function verifyAnalysis(
  facts: Fact[],
  brief: BriefSection[],
  messaging: MessagingAngle[],
  crmNote: CrmNote
): Promise<VerificationResult> {
  const analysisJson = JSON.stringify({ brief, messaging, crmNote });
  const factsJson = JSON.stringify(facts);

  const { object } = await generateObject({
    model: anthropic("claude-haiku-4-5-20251001"),
    schema: VerificationResultSchema,
    prompt: verifyPrompt(analysisJson, factsJson),
  });

  return object;
}
