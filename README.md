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
2. System embeds the query and searches **Qdrant** for semantic similarity (> 95%).
3. **Cache Hit** → Return stored response + Hedera transaction ID as proof. **Zero LLM cost**.
4. **Cache Miss** → Call OpenAI / Grok → Generate response → Compute SHA-256 → Submit to **Hedera Consensus Service** → Store in Qdrant + PostgreSQL → Return response + proof.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui |
| Backend | Node.js + TypeScript (API Routes / Server Actions) |
| Relational DB | PostgreSQL (Neon / Supabase / Railway) |
| Vector DB | Qdrant Cloud |
| Blockchain | Hedera Hashgraph (Consensus Service) |
| Storage | IPFS (optional for large payloads) |
| Auth | NextAuth.js (Google) + WalletConnect / RainbowKit |
| Payments | USDC on Hedera or Stripe + crypto |
| Deploy | Vercel |
| Monitoring | Vercel Analytics + custom token-savings dashboard |

---

## 📁 Project Structure

```
proof-of-intelligence/
├── apps/
│   └── web/                    # Next.js 15 frontend + API routes
├── packages/
│   ├── core/                   # Shared business logic
│   ├── hedera/                 # HCS client + hashing
│   ├── vector/                 # Qdrant client + embeddings
│   └── db/                     # Prisma / Drizzle schema
├── docs/
│   ├── architecture.md
│   ├── hedera-design.md
│   └── api.md
├── .env.example
├── package.json
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

Copy `.env.example` → `.env.local` and fill the values.

### 3. Database & Vector Store

```bash
npx prisma migrate dev
# or drizzle-kit push
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Authentication & Plans

- **Google OAuth** (NextAuth)
- **Wallet Login** (Hedera / EVM via WalletConnect)
- **Free Plan**: 50 queries/day, limited cache hits shown
- **Premium Plan**: Unlimited + full proof history + API access
- Payments: USDC on Hedera or Stripe

---

## 📊 Dashboard Metrics

- Total tokens saved
- Cache hit rate (%)
- Cost saved (USD)
- Hedera transactions registered
- Real-time proof verification

---

## 🛡️ Security & Verifiability

Every cached response carries:
- SHA-256 of the canonical response
- Hedera Consensus Service transaction ID + consensus timestamp
- Publicly verifiable on HashScan

This creates an auditable **Proof of Intelligence** trail.

---

## 📈 Roadmap

### MVP (Current)
- Semantic cache >95%
- Hedera HCS registration
- Basic dashboard
- Google + Wallet auth
- Free / Premium tiers

### Startup Phase
- Multi-tenant organizations
- API keys for developers
- Advanced RAG hybrid
- Fine-tuned embedding models
- USDC payments on Hedera

### Enterprise
- Private HCS topics / Mirror nodes
- SSO / SAML
- On-premise / VPC deployment
- Custom SLA & audit reports
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

We recommend:
1. File provisional patent (method for semantic cache + distributed ledger proof of AI response reuse).
2. Copyright the codebase and documentation.
3. Trademark "Proof of Intelligence".

Consult a qualified IP attorney in your jurisdiction.

---

## 🚀 Deployment on Vercel

1. Push to `main`.
2. Import the repo in Vercel.
3. Add all environment variables.
4. Deploy. Vercel auto-detects Next.js.

See `docs/deployment.md` for detailed guide.

---

## 👤 Author

Built with 💖 by [elcryptoboy](https://github.com/srbisnes) — Web3 & Omnichain Architect.

---

## License

MIT
