import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BriefSection } from "@/lib/schemas";

export function BriefTab({ sections }: { sections: BriefSection[] }) {
  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{section.content}</p>
            {section.factIds.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Based on: {section.factIds.join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
