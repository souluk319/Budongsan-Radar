import "server-only";

import OpenAI from "openai";
import { getOpenAIConfig } from "@/lib/env";

let client: OpenAI | null = null;

export function getOpenAIClient() {
  const config = getOpenAIConfig();

  if (!config.apiKey) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey: config.apiKey });
  }

  return client;
}
