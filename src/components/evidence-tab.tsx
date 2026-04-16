import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { Fact } from "@/lib/schemas";

const supportStyles: Record<string, string> = {
  direct: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  inferred: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
  missing: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 dark:border-red-500/30",
};

export function EvidenceTab({ facts }: { facts: Fact[] }) {
  return (
    <div className="space-y-3">
      {facts.map((fact) => (
        <Card key={fact.id} className="transition-colors hover:border-primary/30 dark:hover:border-primary/40">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-muted-foreground">{fact.id}</span>
                  <Badge variant="outline" className={supportStyles[fact.support]}>
                    {fact.support}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed">{fact.claim}</p>
                {fact.sourceSnippet && fact.support !== "missing" && (
                  <blockquote className="mt-2.5 border-l-2 border-primary/20 dark:border-primary/30 pl-3 text-xs text-muted-foreground italic leading-relaxed">
                    &ldquo;{fact.sourceSnippet}&rdquo;
                  </blockquote>
                )}
              </div>
              {fact.support !== "missing" && fact.sourceUrl?.startsWith("https://") && (
                <a
                  href={fact.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 hover:underline shrink-0 font-medium transition-colors"
                >
                  source
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
