# DECISIONS.md

Architecture and design decisions for GTM Briefing Copilot.

## 1. Sequential Pipeline Over Parallel Agents

**Decision:** Pipeline stages run sequentially: Fetch → Extract → Analyze → Messaging → Verify.

**Why:** ICP analysis and messaging depend on correct facts. Running them in parallel would force each agent to independently scrape and interpret the same data, amplifying hallucination and duplication. Parallelizing I/O (page fetching) is fine; parallelizing dependent reasoning is not.

**Trade-off:** Slightly longer total latency (~20-30s) vs. significantly better output quality and grounding.

## 2. Fact IDs as Grounding Mechanism

**Decision:** Every fact gets an ID. Downstream stages (brief, messaging, CRM note) must reference fact IDs to justify their claims.

**Why:** This creates a traceable chain from scraped evidence → extracted fact → generated output. The verifier can check whether claims are actually supported. Without this, "evidence" is just another generation — not a check.

## 3. Separate Verification Stage with Haiku

**Decision:** A dedicated verification stage using Claude Haiku checks the full output against the original facts.

**Why:** Separating generation (Sonnet) from validation (Haiku) prevents the generator from grading its own work. Haiku is cheap and fast — adding ~2s and ~$0.001 to the pipeline. It checks for unsupported claims, contradictions, and evidence coverage.

**Alternative considered:** Deterministic grounding checks (string matching fact IDs). Rejected because semantic contradictions require language understanding.

## 4. Best-Effort Scraping with Keyword Discovery

**Decision:** Fetch the homepage, then discover 1-2 internal links by matching keywords (about, products, solutions, customers) in anchor tags.

**Why:** Hardcoding paths like `/about`, `/products` fails on most sites. Keyword discovery from actual links is more robust. Pages that 404 or timeout (5s) are skipped — the pipeline runs with what it gets.

**Trade-off:** Less content than a full crawl, but far more reliable for a stateless tool.

## 5. `direct / inferred / missing` Over `verified / inferred / unknown`

**Decision:** Facts are tagged as `direct` (explicitly on page), `inferred` (reasonable conclusion), or `missing` (cannot determine).

**Why:** "Verified" implies truth-checking against external sources, which we don't do. We check whether the page says it, not whether it's true. Honest labeling builds trust with users.

## 6. Fixed CRM Note Template

**Decision:** CRM note has exactly 5 fields: companyName, summary, keyInsights, suggestedNextSteps, tags.

**Why:** Consistency matters for workflow tools. A freeform note is harder to scan and paste into CRM fields. This template maps directly to HubSpot/Salesforce contact note fields.

## 7. Demo Mode / Live Mode (Visible, Not Hidden)

**Decision:** Demo results are cached as static JSON. The UI explicitly shows "Demo Mode" or "Live Mode" badges.

**Why:** Silently swapping cached data for live results destroys trust if discovered. Being explicit about the mode shows engineering integrity. Demo mode exists for reliability during presentations; live mode shows the real pipeline works.

## 8. Future: MCP Tool Exposure

**Not built.** Each pipeline stage could be exposed as an MCP tool, allowing CRM systems or Slack bots to call individual stages. The sequential architecture makes this straightforward — each stage has a clean input/output contract.

This is the natural next step for integrating into an existing GTM workflow.
