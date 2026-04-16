"use client";

import { useState, useCallback } from "react";
import { AnalysisForm } from "@/components/analysis-form";
import { ResultsPanel, type AnalysisState } from "@/components/results-panel";
import { ThemeToggle } from "@/components/theme-toggle";
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
        {/* Header */}
        <header className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
                GTM Briefing Copilot
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-lg text-[15px] leading-relaxed">
              Paste a company URL — get a verified brief with evidence, account analysis, messaging angles, and a CRM-ready note.
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Form */}
        <section className="mb-10">
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
