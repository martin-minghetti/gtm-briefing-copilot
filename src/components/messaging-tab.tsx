import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MessagingAngle } from "@/lib/schemas";

export function MessagingTab({ angles }: { angles: MessagingAngle[] }) {
  return (
    <div className="space-y-4">
      {angles.map((angle, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base"><span className="text-indigo-600">Angle {i + 1}:</span> {angle.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Hook</p>
              <p className="text-sm font-medium">{angle.hook}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Value Proposition</p>
              <p className="text-sm">{angle.valueProp}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Suggested CTA</p>
              <p className="text-sm italic">{angle.suggestedCta}</p>
            </div>
            {angle.factIds.length > 0 && (
              <p className="text-xs text-muted-foreground pt-1">
                Grounded in: {angle.factIds.join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
