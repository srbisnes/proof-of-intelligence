# Deployment Guide – Proof of Intelligence

## Vercel (recommended)

1. Install the Vercel GitHub App: https://github.com/apps/vercel  
   Authorize the repository `srbisnes/proof-of-intelligence`.
2. In Vercel Dashboard → **Add New Project** → Import the repo.
3. Framework Preset: **Next.js** (auto-detected).
4. Environment Variables – copy every key from `.env.example` and set real values.
5. Click **Deploy**.

### Required variables for production

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Embeddings + LLM |
| `QDRANT_URL` | Vector DB endpoint |
| `QDRANT_API_KEY` | If your cluster requires it |
| `HEDERA_NETWORK` | `testnet` or `mainnet` |
| `HEDERA_ACCOUNT_ID` | Operator account |
| `HEDERA_PRIVATE_KEY` | Operator private key |
| `HEDERA_TOPIC_ID` | HCS Topic for proofs |
| `DATABASE_URL` | PostgreSQL (Neon recommended) |
| `NEXTAUTH_SECRET` | Random 32+ char string |
| `NEXTAUTH_URL` | Your production URL |

## Creating the Hedera Topic (one-time)

Use the Hedera Portal or a simple script with `@hashgraph/sdk`:

```ts
import { Client, TopicCreateTransaction, PrivateKey, AccountId } from "@hashgraph/sdk";

const client = Client.forTestnet();
client.setOperator(AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!), PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!));

const tx = await new TopicCreateTransaction().execute(client);
const receipt = await tx.getReceipt(client);
console.log("Topic ID:", receipt.topicId!.toString());
```

Save the Topic ID into `HEDERA_TOPIC_ID`.

## Local production build test

```bash
npm run build
npm start
```

If the build succeeds, the project is ready for Vercel.
