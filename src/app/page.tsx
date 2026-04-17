"use client";

import { useState, useCallback } from "react";
import { AnalysisForm } from "@/components/analysis-form";
import { ResultsPanel, type AnalysisState } from "@/components/results-panel";
import { ArrowDown, ClipboardCopy, FileSearch, FileText, MessageSquare } from "lucide-react";
import type { AccountTypeValue } from "@/lib/schemas";

const initialState: AnalysisState = {
  facts: null,
  brief: null,
  messaging: null,
  crmNote: null,
  verification: null,
  mode: null,
  error: null,
  isComplete: false,
};

export default function Home() {
  const [state, setState] = useState<AnalysisState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (url: string, accountType: AccountTypeValue, apiKey?: string) => {
    setState(initialState);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers["x-api-key"] = apiKey;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ url, accountType }),
      });

      if (!response.ok) {
        const err = await response.json();
        setState((s) => ({ ...s, error: err.error || "Request failed" }));
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);

            if (event.type === "stage") {
              setState((s) => {
                const next = { ...s };
                if (event.stage === "evidence") next.facts = event.data.facts;
                if (event.stage === "brief") next.brief = event.data.sections;
                if (event.stage === "messaging") {
                  next.messaging = event.data.angles;
                  next.crmNote = event.data.crmNote;
                }
                if (event.stage === "verification") next.verification = event.data;
                return next;
              });
            } else if (event.type === "done") {
              setState((s) => ({ ...s, mode: event.mode, isComplete: true }));
            } else if (event.type === "error") {
              setState((s) => ({ ...s, error: event.message }));
            }
          } catch {
            // Skip malformed lines
          }
        }
      }
    } catch (error) {
      setState((s) => ({
        ...s,
        error: error instanceof Error ? error.message : "Something went wrong",
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
              GTM Briefing Copilot
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-base leading-relaxed sm:text-lg">
            Paste a URL. Get a full GTM brief powered by AI — with evidence.
          </p>

          {/* Feature cards */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={<FileSearch className="size-5 text-primary" />}
              title="Evidence"
              description="Raw facts extracted from the source, each with support level and source snippet."
            />
            <FeatureCard
              icon={<FileText className="size-5 text-primary" />}
              title="Brief"
              description="Structured analysis sections ready to present — company overview, market position, opportunities."
            />
            <FeatureCard
              icon={<MessageSquare className="size-5 text-primary" />}
              title="Messaging"
              description="Sales angles with hooks, value props, and suggested CTAs tailored to account type."
            />
            <FeatureCard
              icon={<ClipboardCopy className="size-5 text-primary" />}
              title="CRM Note"
              description="One-click copy — a formatted note with summary, insights, next steps, and tags for your CRM."
            />
          </div>

          {/* CTA */}
          <a
            href="#try-it"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-500/20 transition-all hover:brightness-110 hover:scale-[1.02] dark:from-indigo-500 dark:via-violet-500 dark:to-purple-500"
          >
            Try it now
            <ArrowDown className="size-4" />
          </a>
        </header>

        {/* Form */}
        <section id="try-it" className="mb-10 scroll-mt-20">
          <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
          <p className="text-xs text-muted-foreground mt-4">
            Try the demos:{" "}
            <button
              type="button"
              onClick={() => handleSubmit("https://www.oatly.com", "brand")}
              className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              disabled={isLoading}
            >
              oatly.com
            </button>
            {" (brand) or "}
            <button
              type="button"
              onClick={() => handleSubmit("https://www.sysco.com", "distributor")}
              className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              disabled={isLoading}
            >
              sysco.com
            </button>
            {" (distributor) — instant, no API key needed."}
          </p>
        </section>

        {/* Results */}
        <ResultsPanel state={state} />
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 p-5 text-left transition-colors hover:border-primary/30 dark:hover:border-primary/40">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
