import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Fact } from "@/lib/schemas";

const supportColors: Record<string, string> = {
  direct: "bg-emerald-100 text-emerald-700 border-emerald-200",
  inferred: "bg-amber-100 text-amber-700 border-amber-200",
  missing: "bg-red-100 text-red-700 border-red-200",
};

export function EvidenceTab({ facts }: { facts: Fact[] }) {
  return (
    <div className="space-y-3">
      {facts.map((fact) => (
        <Card key={fact.id}>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{fact.id}</span>
                  <Badge variant="outline" className={supportColors[fact.support]}>
                    {fact.support}
                  </Badge>
                </div>
                <p className="text-sm">{fact.claim}</p>
                {fact.sourceSnippet && fact.support !== "missing" && (
                  <blockquote className="mt-2 border-l-2 border-muted pl-3 text-xs text-muted-foreground italic">
                    &ldquo;{fact.sourceSnippet}&rdquo;
                  </blockquote>
                )}
              </div>
              {fact.support !== "missing" && fact.sourceUrl?.startsWith("https://") && (
                <a
                  href={fact.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline shrink-0 font-medium"
                >
                  source
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
