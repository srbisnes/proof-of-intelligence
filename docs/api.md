# API Endpoints - Proof of Intelligence

Base URL: `/api`

## Authentication
All protected routes require a valid NextAuth session or API key (Premium).

## Core Endpoints

### POST /api/query
Main entry point.

**Body**
```json
{
  "query": "What is the capital of France?",
  "model": "gpt-4o-mini" // optional
}
```

**Response (Cache Hit)**
```json
{
  "source": "cache",
  "response": "...",
  "score": 0.97,
  "hash": "sha256...",
  "hederaTxId": "0.0.xxx@...",
  "consensusTimestamp": "2026-...",
  "tokensSaved": 450,
  "costSavedUsd": 0.0045
}
```

**Response (Cache Miss)**
```json
{
  "source": "llm",
  "response": "...",
  "hash": "sha256...",
  "hederaTxId": "0.0.xxx@...",
  "consensusTimestamp": "2026-...",
  "tokensUsed": 512,
  "model": "gpt-4o-mini"
}
```

### GET /api/proofs/:hash
Verify a proof.

### GET /api/stats
Dashboard metrics for the authenticated user/organization.

### POST /api/admin/reindex
Admin only - rebuild embeddings.

## Webhooks
- Stripe / USDC payment confirmation
- Hedera Mirror Node events (optional)
