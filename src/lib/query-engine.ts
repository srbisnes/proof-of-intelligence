/**
 * Core Query Engine – Proof of Intelligence
 * Orchestrates: semantic cache → LLM → SHA-256 → Hedera HCS → store
 */

import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { getVectorCache } from "./vector";
import { getHederaProof } from "./hedera";

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

// Approximate average price (update with current pricing)
const PRICE_PER_TOKEN = 0.00015 / 1000; // example

function resolveModel(preferred?: string): string {
  if (preferred) return preferred;
  if (process.env.DEFAULT_LLM === "grok") return "grok-beta";
  return "gpt-4o-mini";
}

export async function processQuery(
  query: string,
  options: { model?: string; userId?: string } = {}
): Promise<QueryResult> {
  const model = resolveModel(options.model);
  const vectorCache = getVectorCache();
  const hedera = getHederaProof();

  // 1. Semantic search
  const cached = await vectorCache.findSimilar(query);

  if (cached && cached.score !== undefined && cached.score >= 0.95) {
    const tokensSaved = cached.tokensUsed || 400;
    return {
      source: "cache",
      response: cached.response,
      hash: cached.hash,
      hederaTxId: cached.hederaTxId,
      consensusTimestamp: cached.consensusTimestamp,
      score: cached.score,
      tokensSaved,
      costSavedUsd: Number((tokensSaved * PRICE_PER_TOKEN).toFixed(6)),
      model: cached.model,
    };
  }

  // 2. Call LLM (OpenAI compatible)
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for LLM calls");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful, accurate and concise assistant. Answer clearly.",
      },
      { role: "user", content: query },
    ],
  });

  const response = completion.choices[0]?.message?.content?.trim() || "";
  const tokensUsed = completion.usage?.total_tokens || 0;

  if (!response) {
    throw new Error("LLM returned an empty response");
  }

  // 3. Cryptographic proof on Hedera
  const proof = await hedera.createAndRegister({
    response,
    query,
    model,
    tokens: tokensUsed,
  });

  // 4. Persist in vector store
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
