import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { VerificationResult } from "@/lib/schemas";

export function VerificationBar({ verification }: { verification: VerificationResult }) {
  const coverageColor =
    verification.evidenceCoverage >= 80
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : verification.evidenceCoverage >= 60
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-red-100 text-red-700 border-red-200";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className={coverageColor}>
          Evidence Coverage: {verification.evidenceCoverage}%
        </Badge>
        {verification.unsupportedClaims.length > 0 && (
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
            {verification.unsupportedClaims.length} unsupported claim{verification.unsupportedClaims.length !== 1 ? "s" : ""}
          </Badge>
        )}
        {verification.contradictions.length > 0 && (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
            {verification.contradictions.length} contradiction{verification.contradictions.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>
      {verification.warnings.map((warning, i) => (
        <Alert key={i} variant="default">
          <AlertDescription className="text-xs">{warning}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
