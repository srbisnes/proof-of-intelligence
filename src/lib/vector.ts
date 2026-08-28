/**
 * Qdrant Vector Database client for semantic response cache
 * Lazy initialization – does not crash at import time.
 */

import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";

const COLLECTION = process.env.QDRANT_COLLECTION || "responses";
const SIMILARITY_THRESHOLD = 0.95;

export interface CachedResponse {
  id: string;
  query: string;
  response: string;
  hash: string;
  hederaTxId: string;
  consensusTimestamp?: string;
  model: string;
  tokensUsed: number;
  score?: number;
}

export class VectorCacheService {
  private client: QdrantClient | null = null;
  private openai: OpenAI | null = null;
  private initialized = false;

  private ensureInitialized() {
    if (this.initialized) return;

    const url = process.env.QDRANT_URL;
    if (!url) {
      throw new Error("Missing QDRANT_URL environment variable");
    }

    this.client = new QdrantClient({
      url,
      apiKey: process.env.QDRANT_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY for embeddings");
    }

    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.initialized = true;
  }

  async ensureCollection() {
    this.ensureInitialized();
    const collections = await this.client!.getCollections();
    const exists = collections.collections.some((c) => c.name === COLLECTION);

    if (!exists) {
      await this.client!.createCollection(COLLECTION, {
        vectors: {
          size: Number(process.env.EMBEDDING_DIMENSIONS) || 1536,
          distance: "Cosine",
        },
      });
    }
  }

  async embed(text: string): Promise<number[]> {
    this.ensureInitialized();
    const res = await this.openai!.embeddings.create({
      model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
      input: text,
    });
    return res.data[0].embedding;
  }

  async findSimilar(query: string): Promise<CachedResponse | null> {
    await this.ensureCollection();
    const vector = await this.embed(query);

    const results = await this.client!.search(COLLECTION, {
      vector,
      limit: 1,
      score_threshold: SIMILARITY_THRESHOLD,
      with_payload: true,
    });

    if (results.length === 0) return null;

    const hit = results[0];
    const payload = hit.payload as Record<string, unknown>;

    return {
      id: String(hit.id),
      query: String(payload.query ?? ""),
      response: String(payload.response ?? ""),
      hash: String(payload.hash ?? ""),
      hederaTxId: String(payload.hederaTxId ?? ""),
      consensusTimestamp: payload.consensusTimestamp
        ? String(payload.consensusTimestamp)
        : undefined,
      model: String(payload.model ?? ""),
      tokensUsed: Number(payload.tokensUsed ?? 0),
      score: hit.score,
    };
  }

  async store(params: {
    id: string;
    query: string;
    response: string;
    hash: string;
    hederaTxId: string;
    consensusTimestamp?: string;
    model: string;
    tokensUsed: number;
  }) {
    await this.ensureCollection();
    const vector = await this.embed(params.query);

    await this.client!.upsert(COLLECTION, {
      wait: true,
      points: [
        {
          id: params.id,
          vector,
          payload: {
            query: params.query,
            response: params.response,
            hash: params.hash,
            hederaTxId: params.hederaTxId,
            consensusTimestamp: params.consensusTimestamp,
            model: params.model,
            tokensUsed: params.tokensUsed,
            createdAt: new Date().toISOString(),
          },
        },
      ],
    });
  }
}

let _instance: VectorCacheService | null = null;

export function getVectorCache(): VectorCacheService {
  if (!_instance) {
    _instance = new VectorCacheService();
  }
  return _instance;
}
