"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ChevronDown, KeyRound, Loader2, Search } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="url" className="text-sm font-medium text-foreground mb-1.5 block">
            Company URL
          </label>
          <Input
            id="url"
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className="h-10"
          />
        </div>
        <div className="sm:w-48">
          <label htmlFor="accountType" className="text-sm font-medium text-foreground mb-1.5 block">
            Account Type
          </label>
          <div className="relative">
            <select
              id="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountTypeValue)}
              disabled={isLoading}
              className="flex h-10 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {accountTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          size="lg"
          className="h-10 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/20 transition-all hover:brightness-110 hover:scale-[1.02] dark:from-indigo-500 dark:via-violet-500 dark:to-purple-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="size-4" />
              Generate Brief
            </>
          )}
        </Button>
      </div>

      {/* BYOK */}
      <div className="flex flex-col gap-2">
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowApiKey(!showApiKey)}
            className="gap-1.5"
          >
            <KeyRound className="size-3.5" />
            BYOK
          </Button>
        </div>
        <div
          className={`overflow-hidden transition-all duration-200 ease-out ${
            showApiKey ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1.5 pt-1">
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
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your key is sent directly to the Anthropic API and never stored, logged, or cached.
              Demo mode works without a key. Live mode requires your own API key.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
