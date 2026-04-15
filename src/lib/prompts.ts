import type { AccountTypeValue } from "./schemas";

export function extractFactsPrompt(pagesContent: string): string {
  return `You are a fact extraction engine for a GTM (go-to-market) briefing tool.

Given the following scraped web pages, extract concrete facts about this company.

RULES:
- Only extract facts that are directly stated or clearly inferable from the text.
- Each fact must include the source URL and the exact snippet from the page that supports it.
- Mark support level:
  - "direct": the fact is explicitly stated on the page
  - "inferred": the fact is a reasonable inference from what's on the page
  - "missing": you cannot determine this from the page content (use sparingly — only include if relevant to GTM)
- Do NOT guess company size, revenue, employee count, or partnerships unless explicitly stated.
- Do NOT hallucinate customers or markets not mentioned on the page.
- Assign sequential IDs: f1, f2, f3, etc.

PAGES:
${pagesContent}

Return a JSON array of facts.`;
}

export function analyzePrompt(factsJson: string, accountType: AccountTypeValue): string {
  return `You are a GTM analyst preparing an account brief for a ${accountType} account.

Given these extracted facts about a company, produce a structured account brief.

RULES:
- Every section must reference specific fact IDs that support it.
- If you cannot determine something from the facts, say so explicitly — do not fabricate.
- Focus on what matters for a ${accountType} account:
  ${accountType === "brand" ? "product positioning, distribution channels, competitive landscape" : ""}
  ${accountType === "distributor" ? "product categories, geographic reach, retailer relationships" : ""}
  ${accountType === "operator" ? "menu offerings, sourcing patterns, customer demographics" : ""}
- Include an "Assumptions to Validate" section with questions the sales team should ask on the next call.

FACTS:
${factsJson}

Return a JSON array of brief sections. Each section has: title, content, factIds.
Sections: "What They Do", "Who They Sell To", "Pain Points & Challenges", "Opportunities", "Assumptions to Validate"`;
}

export function messagingPrompt(
  factsJson: string,
  briefJson: string,
  accountType: AccountTypeValue
): string {
  return `You are a GTM messaging strategist. Given the facts and brief about a company, generate:

1. Three messaging angles personalized for a ${accountType} account
2. A CRM note ready to paste into HubSpot/Salesforce

MESSAGING RULES:
- Each angle must reference specific fact IDs that support it.
- Hook: one sentence that gets attention.
- Value prop: 2-3 sentences explaining the benefit.
- Suggested CTA: specific next step.
- Angles should be distinct — different value propositions, not rewording the same one.

CRM NOTE RULES:
- companyName: the company's name
- accountType: "${accountType}"
- summary: 2-3 sentences max
- keyInsights: 3-5 bullet points, the most important things for the sales team
- suggestedNextSteps: 2-3 concrete actions
- tags: relevant category tags for CRM filtering
- factIds: which facts back the summary

FACTS:
${factsJson}

BRIEF:
${briefJson}

Return JSON with two keys: "angles" (array of 3 messaging angles) and "crmNote" (single CRM note object).`;
}

export function verifyPrompt(analysisJson: string, factsJson: string): string {
  return `You are a verification engine. Your job is to check the quality and grounding of a GTM brief.

Given the original extracted facts and the generated analysis (brief, messaging, CRM note), check for:

1. UNSUPPORTED CLAIMS: Any claim in the brief, messaging, or CRM note that is NOT backed by a fact ID, or where the referenced fact doesn't actually support the claim. List each with: claim, location (brief/messaging/crm), reason.

2. CONTRADICTIONS: Any places where the brief says one thing but messaging says another, or facts contradict each other. List each with: claimA, claimB, explanation.

3. EVIDENCE COVERAGE: What percentage (0-100) of claims in the brief and messaging are backed by at least one "direct" fact? Be strict.

4. WARNINGS: Any other issues — vague claims, overreach, missing context that a sales team would need.

FACTS:
${factsJson}

ANALYSIS:
${analysisJson}

Return JSON with: unsupportedClaims[], contradictions[], evidenceCoverage (number), warnings[].`;
}
