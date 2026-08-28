/**
 * Core Query Engine - Proof of Intelligence
 * Orchestrates semantic cache + LLM + Hedera proof registration
 */

import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { vectorCache } from "../../packages/vector/src/qdrant";
import { hederaProof } from "../../packages/hedera/src/hcs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface QueryResult {
  source: "cache" | "llm";
  response: string;
  hash: string;
  hederaTxId?: string;
  consensusTimestamp?: string;
  score?: number;
  tokensUsed?: number;
  tokensSaved?: number;
  costSavedUsd?: number;
  model: string;
}

// Rough pricing (update with real values)
const PRICE_PER_1K_TOKENS = 0.15 / 1000; // example for gpt-4o-mini input+output avg

export async function processQuery(
  query: string,
  options: { model?: string; userId?: string } = {}
): Promise<QueryResult> {
  const model = options.model || process.env.DEFAULT_LLM === "grok" ? "grok-beta" : "gpt-4o-mini";

  // 1. Semantic search
  const cached = await vectorCache.findSimilar(query);

  if (cached && cached.score && cached.score >= 0.95) {
    const tokensSaved = cached.tokensUsed || 400; // estimate
    return {
      source: "cache",
      response: cached.response,
      hash: cached.hash,
      hederaTxId: cached.hederaTxId,
      consensusTimestamp: cached.consensusTimestamp,
      score: cached.score,
      tokensSaved,
      costSavedUsd: tokensSaved * PRICE_PER_1K_TOKENS,
      model: cached.model,
    };
  }

  // 2. Call LLM
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are a helpful, accurate assistant." },
      { role: "user", content: query },
    ],
  });

  const response = completion.choices[0]?.message?.content || "";
  const tokensUsed = completion.usage?.total_tokens || 0;

  // 3. Create cryptographic proof on Hedera
  const proof = await hederaProof.createAndRegister({
    response,
    query,
    model,
    tokens: tokensUsed,
  });

  // 4. Store in vector DB
  const id = uuidv4();
  await vectorCache.store({
    id,
    query,
    response,
    hash: proof.hash,
    hederaTxId: proof.transactionId,
    consensusTimestamp: proof.consensusTimestamp,
    model,
    tokensUsed,
  });

  return {
    source: "llm",
    response,
    hash: proof.hash,
    hederaTxId: proof.transactionId,
    consensusTimestamp: proof.consensusTimestamp,
    tokensUsed,
    model,
  };
}
