"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EvidenceTab } from "./evidence-tab";
import { BriefTab } from "./brief-tab";
import { MessagingTab } from "./messaging-tab";
import { CrmTab } from "./crm-tab";
import { VerificationBar } from "./verification-bar";
import { FileSearch, FileText, MessageSquare, ClipboardList, AlertCircle } from "lucide-react";
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
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  );
}

export function ResultsPanel({ state }: { state: AnalysisState }) {
  if (state.error) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive dark:border-destructive/40 dark:bg-destructive/10">
        <AlertCircle className="size-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Something went wrong</p>
          <p className="mt-1 opacity-80">{state.error}</p>
        </div>
      </div>
    );
  }

  if (!state.facts && !state.brief && !state.messaging && !state.verification) {
    return null;
  }

  return (
    <div className="space-y-6">
      {state.mode && (
        <Badge
          variant="outline"
          className={
            state.mode === "demo"
              ? "bg-primary/10 text-primary border-primary/20 dark:bg-primary/15 dark:border-primary/30"
              : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
          }
        >
          {state.mode === "demo" ? "Demo Mode" : "Live Mode"}
        </Badge>
      )}

      <Tabs defaultValue="evidence">
        <TabsList className="bg-muted/60 dark:bg-muted/40 p-1 gap-1 w-full sm:w-auto">
          <TabsTrigger
            value="evidence"
            disabled={!state.facts}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium gap-1.5"
          >
            <FileSearch className="size-3.5 hidden sm:block" />
            Evidence {state.facts ? `(${state.facts.length})` : ""}
          </TabsTrigger>
          <TabsTrigger
            value="brief"
            disabled={!state.brief}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium gap-1.5"
          >
            <FileText className="size-3.5 hidden sm:block" />
            Brief
          </TabsTrigger>
          <TabsTrigger
            value="messaging"
            disabled={!state.messaging}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium gap-1.5"
          >
            <MessageSquare className="size-3.5 hidden sm:block" />
            Messaging
          </TabsTrigger>
          <TabsTrigger
            value="crm"
            disabled={!state.crmNote}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium gap-1.5"
          >
            <ClipboardList className="size-3.5 hidden sm:block" />
            CRM Note
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evidence" className="mt-5">
          {state.facts ? <EvidenceTab facts={state.facts} /> : <TabSkeleton />}
        </TabsContent>
        <TabsContent value="brief" className="mt-5">
          {state.brief ? <BriefTab sections={state.brief} /> : <TabSkeleton />}
        </TabsContent>
        <TabsContent value="messaging" className="mt-5">
          {state.messaging ? <MessagingTab angles={state.messaging} /> : <TabSkeleton />}
        </TabsContent>
        <TabsContent value="crm" className="mt-5">
          {state.crmNote ? <CrmTab crmNote={state.crmNote} /> : <TabSkeleton />}
        </TabsContent>
      </Tabs>

      {state.verification && <VerificationBar verification={state.verification} />}
    </div>
  );
}
