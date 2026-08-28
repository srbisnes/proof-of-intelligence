/**
 * Qdrant Vector Database client for semantic response cache
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
  private client: QdrantClient;
  private openai: OpenAI;

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY,
    });
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async ensureCollection() {
    const collections = await this.client.getCollections();
    const exists = collections.collections.some((c) => c.name === COLLECTION);

    if (!exists) {
      await this.client.createCollection(COLLECTION, {
        vectors: {
          size: Number(process.env.EMBEDDING_DIMENSIONS) || 1536,
          distance: "Cosine",
        },
      });
    }
  }

  async embed(text: string): Promise<number[]> {
    const res = await this.openai.embeddings.create({
      model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
      input: text,
    });
    return res.data[0].embedding;
  }

  /** Search for a similar previous response */
  async findSimilar(query: string): Promise<CachedResponse | null> {
    await this.ensureCollection();
    const vector = await this.embed(query);

    const results = await this.client.search(COLLECTION, {
      vector,
      limit: 1,
      score_threshold: SIMILARITY_THRESHOLD,
      with_payload: true,
    });

    if (results.length === 0) return null;

    const hit = results[0];
    const payload = hit.payload as any;

    return {
      id: String(hit.id),
      query: payload.query,
      response: payload.response,
      hash: payload.hash,
      hederaTxId: payload.hederaTxId,
      consensusTimestamp: payload.consensusTimestamp,
      model: payload.model,
      tokensUsed: payload.tokensUsed,
      score: hit.score,
    };
  }

  /** Store a new response + proof */
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

    await this.client.upsert(COLLECTION, {
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

export const vectorCache = new VectorCacheService();
