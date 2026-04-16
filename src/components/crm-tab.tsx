"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CrmNote } from "@/lib/schemas";

export function CrmTab({ crmNote }: { crmNote: CrmNote }) {
  const [copied, setCopied] = useState(false);

  const plainText = `Company: ${crmNote.companyName}
Type: ${crmNote.accountType}

Summary: ${crmNote.summary}

Key Insights:
${crmNote.keyInsights.map((i) => `• ${i}`).join("\n")}

Next Steps:
${crmNote.suggestedNextSteps.map((s) => `• ${s}`).join("\n")}

Tags: ${crmNote.tags.join(", ")}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">CRM Note — {crmNote.companyName}</CardTitle>
        <Button
          variant={copied ? "default" : "outline"}
          size="sm"
          onClick={handleCopy}
          className={copied ? "bg-emerald-600 hover:bg-emerald-600 text-white" : ""}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Type</p>
          <Badge variant="outline" className="mt-1.5">{crmNote.accountType}</Badge>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</p>
          <p className="text-sm mt-1 leading-relaxed">{crmNote.summary}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Insights</p>
          <ul className="list-disc list-inside text-sm mt-1.5 space-y-1">
            {crmNote.keyInsights.map((insight, i) => (
              <li key={i} className="leading-relaxed">{insight}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Next Steps</p>
          <ul className="list-disc list-inside text-sm mt-1.5 space-y-1">
            {crmNote.suggestedNextSteps.map((step, i) => (
              <li key={i} className="leading-relaxed">{step}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {crmNote.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
