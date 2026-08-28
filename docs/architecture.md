# Architecture - Proof of Intelligence

## High-Level Architecture

```
User (Browser / API Client)
        |
        v
+-------------------+     +------------------+
|  Next.js 15 App   |---->|  Auth Layer      |
|  (Vercel)         |     |  Google + Wallet |
+-------------------+     +------------------+
        |
        | 1. Query + embeddings
        v
+-------------------+     Similarity > 0.95?
|  Qdrant Vector DB |--------------------+
+-------------------+                    |
        |                                |
   Cache Miss                       Cache Hit
        |                                |
        v                                v
+-------------------+          Return response
|  LLM (OpenAI/Grok)|          + Hedera proof
+-------------------+
        |
        | Generate response
        v
+-------------------+     SHA-256(response)
|  Hash Service     |--------------------+
+-------------------+                    |
        |                                v
        |                     +-------------------+
        |                     | Hedera HCS Topic  |
        |                     | (Consensus)       |
        |                     +-------------------+
        |                                |
        v                                v
+-------------------+          Store txId + timestamp
|  PostgreSQL       |<-------------------+
|  (users, proofs,  |
|   usage, plans)   |
+-------------------+
        |
        v
   Dashboard metrics
```

## Components

### 1. Semantic Cache Layer (Qdrant)
- Collection: `responses`
- Payload: `{ query, response, hash, hederaTxId, userId, tokensUsed, createdAt, model }`
- Vector: embedding of the **query** (or query + context)
- Score threshold: 0.95 cosine similarity

### 2. Hedera Consensus Service Design
- One dedicated HCS Topic per environment (or per organization in multi-tenant).
- Message format (JSON, max ~1KB recommended):
```json
{
  "v": 1,
  "hash": "sha256hex",
  "queryHash": "sha256 of normalized query",
  "model": "gpt-4o-mini",
  "tokens": 1234,
  "ts": 1724...
}
```
- Consensus timestamp becomes the immutable proof of existence.
- Public verification via HashScan or Mirror Node.

### 3. Intelligent Cache Strategy
- Exact match first (normalized query hash).
- Then semantic search.
- Optional: cluster similar queries and keep the best response (highest user rating or lowest tokens).
- TTL or soft-delete for outdated knowledge (configurable).

### 4. Cost Reduction Engine
- Track every LLM call vs cache hit.
- Calculate estimated USD saved using current model pricing.
- Show real-time savings in the dashboard.

### 5. Multi-tenancy (Startup+)
- Organization-scoped collections or payload filters in Qdrant.
- Separate HCS topics or message prefixes for isolation.

## Scalability Notes (CTO view)
- Qdrant scales horizontally; start with Cloud, move to self-hosted clusters.
- Hedera HCS is extremely cheap (~$0.0001 per message) and high throughput.
- Next.js on Vercel + edge functions for low latency embedding lookups.
- Use Redis (Upstash) for rate limiting and short-term exact-match cache.
- Background workers (Inngest / Trigger.dev) for heavy embedding re-indexing.
