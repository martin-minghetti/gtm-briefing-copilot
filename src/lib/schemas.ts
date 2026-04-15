import { z } from "zod";

export const SupportLevel = z.enum(["direct", "inferred", "missing"]);
export const AccountType = z.enum(["brand", "distributor", "operator"]);

export const FactSchema = z.object({
  id: z.string(),
  claim: z.string(),
  support: SupportLevel,
  sourceUrl: z.string().url(),
  sourceSnippet: z.string(),
});

export const BriefSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  factIds: z.array(z.string()),
});

export const MessagingAngleSchema = z.object({
  label: z.string(),
  hook: z.string(),
  valueProp: z.string(),
  suggestedCta: z.string(),
  factIds: z.array(z.string()),
});

export const CrmNoteSchema = z.object({
  companyName: z.string(),
  accountType: AccountType,
  summary: z.string(),
  keyInsights: z.array(z.string()),
  suggestedNextSteps: z.array(z.string()),
  tags: z.array(z.string()),
  factIds: z.array(z.string()),
});

export const VerificationResultSchema = z.object({
  unsupportedClaims: z.array(
    z.object({
      claim: z.string(),
      location: z.enum(["brief", "messaging", "crm"]),
      reason: z.string(),
    })
  ),
  contradictions: z.array(
    z.object({
      claimA: z.string(),
      claimB: z.string(),
      explanation: z.string(),
    })
  ),
  evidenceCoverage: z.number().min(0).max(100),
  warnings: z.array(z.string()),
});

export const AnalysisResultSchema = z.object({
  facts: z.array(FactSchema),
  brief: z.array(BriefSectionSchema),
  messaging: z.array(MessagingAngleSchema),
  crmNote: CrmNoteSchema,
  verification: VerificationResultSchema,
});

export const AnalyzeRequestSchema = z.object({
  url: z.string().url(),
  accountType: AccountType,
});

// Type exports
export type Fact = z.infer<typeof FactSchema>;
export type BriefSection = z.infer<typeof BriefSectionSchema>;
export type MessagingAngle = z.infer<typeof MessagingAngleSchema>;
export type CrmNote = z.infer<typeof CrmNoteSchema>;
export type VerificationResult = z.infer<typeof VerificationResultSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AccountTypeValue = z.infer<typeof AccountType>;
