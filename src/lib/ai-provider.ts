import { createAnthropic } from "@ai-sdk/anthropic";

export function createProvider(apiKey?: string) {
  return createAnthropic(apiKey ? { apiKey } : {});
}
