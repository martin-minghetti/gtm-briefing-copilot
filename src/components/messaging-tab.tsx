import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MessagingAngle } from "@/lib/schemas";

export function MessagingTab({ angles }: { angles: MessagingAngle[] }) {
  return (
    <div className="space-y-4">
      {angles.map((angle, i) => (
        <Card key={i} className="transition-colors hover:border-primary/30 dark:hover:border-primary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              <span className="text-primary">Angle {i + 1}:</span> {angle.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hook</p>
              <p className="text-sm font-medium mt-0.5">{angle.hook}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value Proposition</p>
              <p className="text-sm mt-0.5 leading-relaxed">{angle.valueProp}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested CTA</p>
              <p className="text-sm italic mt-0.5">{angle.suggestedCta}</p>
            </div>
            {angle.factIds.length > 0 && (
              <p className="text-xs text-muted-foreground font-mono pt-1 border-t border-border/50">
                Grounded in: {angle.factIds.join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
