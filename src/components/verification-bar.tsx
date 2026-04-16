import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, XCircle, Info } from "lucide-react";
import type { VerificationResult } from "@/lib/schemas";

export function VerificationBar({ verification }: { verification: VerificationResult }) {
  const coverageColor =
    verification.evidenceCoverage >= 80
      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
      : verification.evidenceCoverage >= 60
        ? "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30"
        : "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 dark:border-red-500/30";

  const CoverageIcon = verification.evidenceCoverage >= 80 ? ShieldCheck : verification.evidenceCoverage >= 60 ? AlertTriangle : XCircle;

  return (
    <div className="space-y-2 pt-2 border-t border-border/50">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className={`${coverageColor} gap-1`}>
          <CoverageIcon className="size-3" />
          Evidence Coverage: {verification.evidenceCoverage}%
        </Badge>
        {verification.unsupportedClaims.length > 0 && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 gap-1">
            <AlertTriangle className="size-3" />
            {verification.unsupportedClaims.length} unsupported claim{verification.unsupportedClaims.length !== 1 ? "s" : ""}
          </Badge>
        )}
        {verification.contradictions.length > 0 && (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 dark:border-red-500/30 gap-1">
            <XCircle className="size-3" />
            {verification.contradictions.length} contradiction{verification.contradictions.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>
      {verification.warnings.map((warning, i) => (
        <Alert key={i} variant="default" className="py-2.5">
          <Info className="size-4" />
          <AlertDescription className="text-xs">{warning}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
