<div align="center">

# GTM Briefing Copilot

**Paste a company URL. Get a verified GTM brief in 30 seconds.**\
**Evidence-grounded facts, account analysis, messaging angles, and a CRM-ready note.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-gtm--briefing--copilot.vercel.app-black?style=flat-square)](https://gtm-briefing-copilot.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Claude](https://img.shields.io/badge/Claude-Sonnet_+_Haiku-cc785c?style=flat-square)](https://anthropic.com)
[![Tests](https://img.shields.io/badge/Tests-21_passing-brightgreen?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)]()

<img src="screenshot.png" alt="GTM Briefing Copilot — Oatly demo with evidence tab" width="700">

[Live Demo](https://gtm-briefing-copilot.vercel.app) | [Run Locally](#run-locally) | [How It Works](#how-it-works) | [Contributing](#contributing)

</div>

---

## The Problem

SDRs and account executives spend 20-40 minutes researching a company before every call. They tab between the company's website, LinkedIn, and their CRM — manually copying notes, guessing at pain points, and writing outreach from scratch. The research is inconsistent, the notes are unstructured, and half the insights are assumptions dressed up as facts.

Existing AI research tools either dump a wall of unverified text or give you generic summaries with no connection to what the company actually says on its website. There's no evidence trail, so you can't tell what's real and what the model made up.

## The Solution

GTM Briefing Copilot takes a single URL and an account type (brand, distributor, or foodservice operator) and runs a 5-stage pipeline that produces a complete, verified brief. Every claim traces back to a specific fact extracted from the company's website, with the exact source snippet. A separate verification stage checks the entire output for unsupported claims and contradictions.

The output is four things an SDR actually needs: extracted evidence, an account brief, three messaging angles with CTAs, and a CRM note they can paste directly into HubSpot or Salesforce.

---

## The Pipeline

Each stage runs sequentially because downstream stages depend on correct facts. I/O (page fetching) is parallelized; reasoning is not.

| Stage | Model | Input | Output |
|-------|-------|-------|--------|
| **1. Fetch** | — | Company URL | Homepage + 1-2 internal pages discovered by keyword |
| **2. Extract Facts** | Claude Sonnet | Scraped page content | Structured facts with `direct` / `inferred` / `missing` support levels, source URLs, and exact snippets |
| **3. Analyze** | Claude Sonnet | Facts + account type | Account brief: what they do, who they sell to, pain points, opportunities, assumptions to validate |
| **4. Messaging** | Claude Sonnet | Facts + brief + account type | 3 messaging angles (hook + value prop + CTA) + CRM note |
| **5. Verify** | Claude Haiku | All of the above | Evidence coverage %, unsupported claims, contradictions, warnings |

Every output from stages 3-5 references specific fact IDs from stage 2. The verifier checks whether those references actually hold up.

---

## What a Fact Looks Like

Every fact the pipeline extracts includes:

- **ID** — sequential (`f1`, `f2`, ...) for reference by downstream stages
- **Claim** — what the fact states
- **Support level** — `direct` (explicitly on the page), `inferred` (reasonable conclusion), or `missing` (can't determine)
- **Source URL** — which page it came from
- **Source snippet** — the exact text from the page that supports the claim

If the model can't find something on the page, it marks it `missing` instead of guessing. No fabricated revenue numbers, employee counts, or partnerships.

---

## What a CRM Note Looks Like

Fixed 5-field template designed to paste directly into HubSpot/Salesforce:

- **Company name** and **account type**
- **Summary** — 2-3 sentences
- **Key insights** — 3-5 bullet points for the sales team
- **Suggested next steps** — 2-3 concrete actions
- **Tags** — for CRM filtering

One click to copy. Every field backed by fact IDs.

---

## Try It — No API Key Needed

Two precomputed demos load instantly from cached JSON:

| Demo | Account Type | What it shows |
|------|-------------|---------------|
| **Oatly** (`oatly.com`) | Brand | 7 facts extracted, 88% evidence coverage, 1 unsupported claim flagged in Pain Points (industry inference, not site evidence) |
| **Sysco** (`sysco.com`) | Distributor | 5 facts extracted, 92% evidence coverage, clean verification with one warning about industry inferences |

Enter either URL on the [live demo](https://gtm-briefing-copilot.vercel.app) to see the full output. The UI explicitly shows a "Demo Mode" badge — no pretending cached data is live.

---

## How It Works

```
URL + Account Type
  → Fetch (parallel: homepage + keyword-discovered internal pages)
  → Extract Facts (Sonnet) → structured JSON with evidence grounding
  → Analyze (Sonnet) → account brief with fact references
  → Messaging (Sonnet) → 3 angles + CRM note with fact references
  → Verify (Haiku) → evidence coverage, unsupported claims, contradictions
```

1. **Scrape** — Fetches the homepage, then discovers 1-2 internal links by matching keywords (`about`, `products`, `solutions`, `customers`) in anchor tags. Pages that 404 or timeout (5s) are skipped. Content is cleaned with cheerio (scripts, nav, footer removed) and truncated to ~4000 tokens per page.

2. **Extract** — Claude Sonnet receives all scraped content and extracts structured facts. Each fact gets a support level and source snippet. The model is instructed to use `missing` aggressively rather than fabricate.

3. **Analyze** — Facts and account type feed into an analysis prompt that produces 5 brief sections. Every section must reference fact IDs. The "Assumptions to Validate" section explicitly lists what the sales team should ask on the next call — not answers the model made up.

4. **Message** — Facts, brief, and account type produce 3 distinct messaging angles and a CRM note. Angles must reference different fact IDs and offer different value propositions, not rephrase the same one.

5. **Verify** — Claude Haiku receives the full output and original facts. It checks for unsupported claims (referenced fact doesn't actually support the claim), contradictions between stages, and computes evidence coverage. This separates generation from validation — the generator doesn't grade its own work.

Results stream per stage via NDJSON. The frontend fills tabs progressively as each stage completes.

---

## Run Locally

```bash
git clone https://github.com/martin-minghetti/gtm-briefing-copilot.git
cd gtm-briefing-copilot
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The two demo reviews work immediately with no configuration.

**To analyze real companies**, create a `.env.local` file:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | Server-side streaming endpoint, client components for interactive tabs |
| AI | Vercel AI SDK v6 + `@ai-sdk/anthropic` | Structured output with Zod schemas, clean model switching |
| Models | Claude Sonnet (extract, analyze, messaging) · Claude Haiku (verify) | Sonnet for precision extraction and reasoning, Haiku for cheap/fast validation |
| Scraping | cheerio | Lightweight HTML parsing, no browser needed |
| UI | shadcn/ui + Tailwind CSS v4 | Tabs, cards, badges, skeleton loaders |
| Validation | Zod v4 | Input validation, LLM output schemas, type inference |
| Testing | Vitest (21 tests) | Schema validation, scraper unit tests, pipeline stage tests, API route tests |

---

## Design Decisions

**Why sequential pipeline instead of parallel agents?**
ICP analysis and messaging depend on correct facts. Running them in parallel would force each agent to independently interpret the same data, amplifying hallucination and duplication. The pipeline ensures each stage builds on verified output from the previous one. I/O (fetching pages) is parallelized; reasoning is sequential.

**Why fact IDs as a grounding mechanism?**
Without traceable references, "evidence" is just another generation. Fact IDs create a chain: scraped text → extracted fact → generated claim. The verifier can check whether a claim's referenced fact actually supports it. This is the difference between "we found evidence" and "here's the evidence."

**Why a separate verification stage with Haiku?**
Separating generation (Sonnet) from validation (Haiku) prevents the generator from grading its own work. Haiku adds ~2s and ~$0.001 to the pipeline. It catches semantic contradictions that string-matching can't — like when the brief says "primarily retail" but messaging targets "foodservice expansion."

**Why `direct / inferred / missing` instead of `verified / inferred / unknown`?**
"Verified" implies truth-checking against external sources, which we don't do. We check whether the page says it, not whether it's true. Honest labeling builds trust.

**Why best-effort scraping instead of hardcoded paths?**
`/about` and `/products` don't exist on most websites. Keyword-matching actual anchor tags on the homepage is more robust. If a page fails, the pipeline runs with what it has — partial results are better than crashes.

**Why demo mode is visible, not hidden?**
Silently swapping cached data for live results destroys trust if discovered. The UI explicitly badges "Demo Mode" vs "Live Mode." Demo mode exists for reliability during presentations; live mode proves the real pipeline works.

See [DECISIONS.md](DECISIONS.md) for the complete list.

---

## Cost Per Run

| Model | Calls | Estimated Cost |
|-------|-------|---------------|
| Claude Sonnet | 3 (extract + analyze + messaging) | ~$0.06-0.12 |
| Claude Haiku | 1 (verify) | ~$0.001 |
| **Total** | **4** | **~$0.06-0.12** |

Demo mode is free — cached JSON, no API calls.

---

## Contributing

Contributions are welcome. Some areas where help would be useful:

- **Scraping improvements** — Better content extraction, handling SPAs, PDF/doc parsing
- **Industry templates** — Account type-specific prompts beyond food & beverage
- **CRM integrations** — Direct push to HubSpot/Salesforce via MCP tools
- **Batch mode** — Process a list of URLs from a CSV

To contribute:

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Open a PR

---

## License

MIT
