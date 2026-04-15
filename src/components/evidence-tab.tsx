import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Fact } from "@/lib/schemas";

const supportColors: Record<string, string> = {
  direct: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inferred: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  missing: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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
              {fact.support !== "missing" && (
                <a
                  href={fact.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline shrink-0"
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
