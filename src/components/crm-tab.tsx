"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Account Type</p>
          <Badge variant="outline" className="mt-1">{crmNote.accountType}</Badge>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Summary</p>
          <p className="text-sm mt-1">{crmNote.summary}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Key Insights</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            {crmNote.keyInsights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Suggested Next Steps</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            {crmNote.suggestedNextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Tags</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {crmNote.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
