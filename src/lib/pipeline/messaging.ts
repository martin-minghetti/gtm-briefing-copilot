import { generateObject } from "ai";
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
import { createProvider } from "@/lib/ai-provider";

const MessagingResultSchema = z.object({
  angles: z.array(MessagingAngleSchema),
  crmNote: CrmNoteSchema,
});

export async function generateMessaging(
  facts: Fact[],
  brief: BriefSection[],
  accountType: AccountTypeValue,
  apiKey?: string
): Promise<{ angles: MessagingAngle[]; crmNote: CrmNote }> {
  const provider = createProvider(apiKey);
  const { object } = await generateObject({
    model: provider("claude-sonnet-4-20250514"),
    schema: MessagingResultSchema,
    prompt: messagingPrompt(JSON.stringify(facts), JSON.stringify(brief), accountType),
  });

  return object;
}
