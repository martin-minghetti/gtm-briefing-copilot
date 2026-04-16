"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { AccountTypeValue } from "@/lib/schemas";

interface AnalysisFormProps {
  onSubmit: (url: string, accountType: AccountTypeValue, apiKey?: string) => void;
  isLoading: boolean;
}

const accountTypes: { value: AccountTypeValue; label: string }[] = [
  { value: "brand", label: "Brand" },
  { value: "distributor", label: "Distributor" },
  { value: "operator", label: "Foodservice Operator" },
];

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [url, setUrl] = useState("");
  const [accountType, setAccountType] = useState<AccountTypeValue>("brand");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    onSubmit(normalized, accountType, apiKey.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="url" className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Company URL
          </label>
          <Input
            id="url"
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="accountType" className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Account Type
          </label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as AccountTypeValue)}
            disabled={isLoading}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {accountTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={isLoading || !url.trim()}>
          {isLoading ? "Analyzing..." : "Generate Brief"}
        </Button>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowApiKey(!showApiKey)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showApiKey ? "Hide API key" : "Bring your own key (BYOK)"}
        </button>
        {showApiKey && (
          <div className="mt-2 space-y-1.5">
            <Input
              id="apiKey"
              type="password"
              autoComplete="off"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading}
              className="font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Your key is sent directly to the Anthropic API and never stored, logged, or cached.
              Demo mode works without a key. Live mode requires your own API key.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
