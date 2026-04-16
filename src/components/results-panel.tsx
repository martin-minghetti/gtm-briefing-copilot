"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EvidenceTab } from "./evidence-tab";
import { BriefTab } from "./brief-tab";
import { MessagingTab } from "./messaging-tab";
import { CrmTab } from "./crm-tab";
import { VerificationBar } from "./verification-bar";
import type { Fact, BriefSection, MessagingAngle, CrmNote, VerificationResult } from "@/lib/schemas";

export interface AnalysisState {
  facts: Fact[] | null;
  brief: BriefSection[] | null;
  messaging: MessagingAngle[] | null;
  crmNote: CrmNote | null;
  verification: VerificationResult | null;
  mode: "live" | "demo" | null;
  error: string | null;
  isComplete: boolean;
}

function TabSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function ResultsPanel({ state }: { state: AnalysisState }) {
  if (state.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {state.error}
      </div>
    );
  }

  if (!state.facts && !state.brief && !state.messaging && !state.verification) {
    return null;
  }

  return (
    <div className="space-y-5">
      {state.mode && (
        <Badge className={state.mode === "demo" ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}>
          {state.mode === "demo" ? "Demo Mode" : "Live Mode"}
        </Badge>
      )}

      <Tabs defaultValue="evidence">
        <TabsList className="bg-muted/80 p-1 gap-1">
          <TabsTrigger value="evidence" disabled={!state.facts} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium">
            Evidence {state.facts ? `(${state.facts.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="brief" disabled={!state.brief} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium">
            Account Brief
          </TabsTrigger>
          <TabsTrigger value="messaging" disabled={!state.messaging} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium">
            Messaging
          </TabsTrigger>
          <TabsTrigger value="crm" disabled={!state.crmNote} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium">
            CRM Note
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evidence" className="mt-4">
          {state.facts ? <EvidenceTab facts={state.facts} /> : <TabSkeleton />}
        </TabsContent>
        <TabsContent value="brief" className="mt-4">
          {state.brief ? <BriefTab sections={state.brief} /> : <TabSkeleton />}
        </TabsContent>
        <TabsContent value="messaging" className="mt-4">
          {state.messaging ? <MessagingTab angles={state.messaging} /> : <TabSkeleton />}
        </TabsContent>
        <TabsContent value="crm" className="mt-4">
          {state.crmNote ? <CrmTab crmNote={state.crmNote} /> : <TabSkeleton />}
        </TabsContent>
      </Tabs>

      {state.verification && <VerificationBar verification={state.verification} />}
    </div>
  );
}
