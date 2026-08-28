# Proof of Intelligence 🔥

> **Cryptographic Proof that an AI response was already generated, validated and can be safely reused.**

Reduce AI token costs by 40-90% through intelligent semantic caching + immutable proof on **Hedera Consensus Service**.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Hashgraph-purple)](https://hedera.com/)
[![Qdrant](https://img.shields.io/badge/Vector%20DB-Qdrant-red)](https://qdrant.tech/)

---

## 🚀 The Disruptive Concept: Proof of Intelligence

While traditional RAG **searches** for information, **Proof of Intelligence** demonstrates **cryptographically** that a high-quality response already exists, has been validated, and can be reused — dramatically reducing LLM API costs on every interaction.

### Why this matters
- Enterprises spend millions on LLM tokens for repetitive or similar queries.
- Current semantic caches lack **immutable, auditable proof**.
- Hedera HCS provides low-cost, high-throughput, publicly verifiable timestamps and hashes.

**Target markets**: Universities, legal firms, governments, enterprise knowledge bases, customer support platforms.

---

## ✨ Core Flow

1. User submits a query.
2. System embeds the query and searches **Qdrant** for semantic similarity (≥ 95%).
3. **Cache Hit** → Return stored response + Hedera transaction ID as proof. **Zero LLM cost**.
4. **Cache Miss** → Call OpenAI / Grok → Generate response → Compute SHA-256 → Submit to **Hedera Consensus Service** → Store in Qdrant + PostgreSQL → Return response + proof.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind |
| Backend | Node.js + TypeScript (API Routes) |
| Relational DB | PostgreSQL (Prisma) |
| Vector DB | Qdrant Cloud |
| Blockchain | Hedera Hashgraph (Consensus Service) |
| Auth | NextAuth.js (Google) + Wallet (planned) |
| Payments | USDC / Stripe (planned) |
| Deploy | Vercel |

---

## 📁 Project Structure (actual)

```
proof-of-intelligence/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts      # Health check
│   │   │   └── query/route.ts       # Main query endpoint
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Professional landing
│   └── lib/
│       ├── hedera.ts                # HCS + SHA-256 proofs (lazy)
│       ├── vector.ts                # Qdrant semantic cache (lazy)
│       └── query-engine.ts          # Orchestrator
├── prisma/
│   └── schema.prisma                # Users, Proofs, Usage
├── docs/
│   ├── architecture.md
│   └── api.md
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── LICENSE
└── README.md
```

---

## 🛠️ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/srbisnes/proof-of-intelligence.git
cd proof-of-intelligence
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill at minimum:
- `OPENAI_API_KEY`
- `QDRANT_URL` (+ optional `QDRANT_API_KEY`)
- `HEDERA_ACCOUNT_ID`, `HEDERA_PRIVATE_KEY`, `HEDERA_TOPIC_ID`
- `DATABASE_URL` (when using Prisma)

### 3. Database (optional for first run)

```bash
npx prisma generate
npx prisma db push
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test the API

```bash
# Health
curl http://localhost:3000/api/health

# Query (requires env vars configured)
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is Hedera Hashgraph?"}'
```

---

## 🔐 Authentication & Plans (roadmap)

- **Google OAuth** (NextAuth)
- **Wallet Login** (Hedera / EVM)
- **Free Plan**: 50 queries/day
- **Premium Plan**: Unlimited + full proof history + API access
- Payments: USDC on Hedera or Stripe

---

## 📊 Dashboard Metrics (planned)

- Total tokens saved
- Cache hit rate (%)
- Cost saved (USD)
- Hedera transactions registered
- Real-time proof verification on HashScan

---

## 🛡️ Security & Verifiability

Every cached response carries:
- SHA-256 of the canonical response
- Hedera Consensus Service transaction ID + consensus timestamp
- Publicly verifiable on [HashScan](https://hashscan.io)

This creates an auditable **Proof of Intelligence** trail.

---

## 📈 Roadmap

### MVP (Current)
- ✅ Semantic cache ≥ 95%
- ✅ Hedera HCS registration (lazy, production-safe)
- ✅ Professional landing page
- ✅ `/api/query` + `/api/health`
- ✅ Prisma schema (users, proofs, usage)

### Next
- Google + Wallet auth
- Dashboard de ahorro de tokens
- Free / Premium tiers
- USDC payments

### Enterprise
- Multi-tenant + private HCS topics
- SSO / SAML
- On-premise / VPC
- White-label

---

## 🌟 Competitive Advantages

| Feature | ChatGPT / Traditional | Classic RAG | **Proof of Intelligence** |
|---------|-----------------------|-------------|---------------------------|
| Token cost on repeat queries | High | Medium | **Near zero** |
| Cryptographic proof | No | No | **Yes (Hedera)** |
| Immutable audit trail | No | No | **Yes** |
| Real-time savings metrics | No | Limited | **Yes** |
| Enterprise compliance ready | Limited | Limited | **Strong** |

---

## 📝 Intellectual Property

1. File provisional patent (method for semantic cache + distributed ledger proof of AI response reuse).
2. Copyright the codebase and documentation.
3. Trademark "Proof of Intelligence".

Consult a qualified IP attorney in your jurisdiction.

---

## 🚀 Deployment on Vercel

1. Install the [Vercel GitHub App](https://github.com/apps/vercel) and authorize this repository.
2. Import the project in Vercel.
3. Add all environment variables from `.env.example`.
4. Deploy. Vercel auto-detects Next.js.

---

## 👤 Author

Built by [elcryptoboy](https://github.com/srbisnes) — Web3 & Omnichain Architect.

---

## License

MIT
