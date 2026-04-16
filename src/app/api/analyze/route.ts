import { NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/lib/schemas";
import { fetchPages } from "@/lib/scraper";
import { extractFacts } from "@/lib/pipeline/extract-facts";
import { analyzeFacts } from "@/lib/pipeline/analyze";
import { generateMessaging } from "@/lib/pipeline/messaging";
import { verifyAnalysis } from "@/lib/pipeline/verify";
import { getDemoFixture, isDemoUrl } from "@/lib/demo-fixtures";

export const maxDuration = 60;
export const runtime = "nodejs";

interface StreamEvent {
  type: "stage" | "done" | "error";
  stage?: string;
  data?: unknown;
  status?: string;
  mode?: string;
  message?: string;
}

function encodeEvent(event: StreamEvent): string {
  return JSON.stringify(event) + "\n";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AnalyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { url, accountType } = parsed.data;
  const apiKey = request.headers.get("x-api-key") || undefined;

  // Check for demo fixture
  if (isDemoUrl(url)) {
    const demoResult = getDemoFixture(url)!;
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(encodeEvent({ type: "stage", stage: "evidence", data: { facts: demoResult.facts }, status: "complete" })));
        controller.enqueue(encoder.encode(encodeEvent({ type: "stage", stage: "brief", data: { sections: demoResult.brief }, status: "complete" })));
        controller.enqueue(encoder.encode(encodeEvent({ type: "stage", stage: "messaging", data: { angles: demoResult.messaging, crmNote: demoResult.crmNote }, status: "complete" })));
        controller.enqueue(encoder.encode(encodeEvent({ type: "stage", stage: "verification", data: demoResult.verification, status: "complete" })));
        controller.enqueue(encoder.encode(encodeEvent({ type: "done", mode: "demo" })));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-cache" },
    });
  }

  // Live mode
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: StreamEvent) => {
        try {
          controller.enqueue(encoder.encode(encodeEvent(event)));
        } catch {
          // Stream may be closed
        }
      };

      try {
        // Stage 1: Fetch
        const pages = await fetchPages(url);
        if (pages.length === 0) {
          send({ type: "error", stage: "fetch", message: "Could not fetch any pages from this URL. The site may block server-side requests (Cloudflare, bot protection). Try a different company URL." });
          controller.close();
          return;
        }

        // Stage 2: Extract facts
        const facts = await extractFacts(pages, apiKey);
        send({ type: "stage", stage: "evidence", data: { facts }, status: "complete" });

        // Stage 3: Analyze
        const brief = await analyzeFacts(facts, accountType, apiKey);
        send({ type: "stage", stage: "brief", data: { sections: brief }, status: "complete" });

        // Stage 4: Messaging + CRM
        const { angles, crmNote } = await generateMessaging(facts, brief, accountType, apiKey);
        send({ type: "stage", stage: "messaging", data: { angles, crmNote }, status: "complete" });

        // Stage 5: Verify
        const verification = await verifyAnalysis(facts, brief, angles, crmNote, apiKey);
        send({ type: "stage", stage: "verification", data: verification, status: "complete" });

        send({ type: "done", mode: "live" });
      } catch (error) {
        send({
          type: "error",
          message: error instanceof Error ? error.message : "An unexpected error occurred.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-cache" },
  });
}
