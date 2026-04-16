"use client";

import { useState, useCallback } from "react";
import { AnalysisForm } from "@/components/analysis-form";
import { ResultsPanel, type AnalysisState } from "@/components/results-panel";
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">GTM Briefing Copilot</h1>
          <p className="text-muted-foreground mt-2">
            Paste a company URL — get a verified brief with evidence, account analysis, messaging angles, and a CRM-ready note.
          </p>
        </div>

        <div className="mb-8">
          <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <ResultsPanel state={state} />
      </div>
    </main>
  );
}
