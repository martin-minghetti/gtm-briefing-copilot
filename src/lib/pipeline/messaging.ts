import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import {
  MessagingAngleSchema,
  CrmNoteSchema,
  type Fact,
  type BriefSection,
  type MessagingAngle,
  type CrmNote,
  type AccountTypeValue,
} from "@/lib/schemas";
import { messagingPrompt } from "@/lib/prompts";

const MessagingResultSchema = z.object({
  angles: z.array(MessagingAngleSchema),
  crmNote: CrmNoteSchema,
});

export async function generateMessaging(
  facts: Fact[],
  brief: BriefSection[],
  accountType: AccountTypeValue
): Promise<{ angles: MessagingAngle[]; crmNote: CrmNote }> {
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-20250514"),
    schema: MessagingResultSchema,
    prompt: messagingPrompt(JSON.stringify(facts), JSON.stringify(brief), accountType),
  });

  return object;
}
