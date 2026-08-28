/**
 * Hedera Consensus Service client for Proof of Intelligence
 * Registers SHA-256 hashes of AI responses as immutable proofs.
 *
 * Lazy initialization so the module does not crash at import/build time
 * when environment variables are missing.
 */

import {
  Client,
  TopicMessageSubmitTransaction,
  TopicId,
  AccountId,
  PrivateKey,
  Hbar,
} from "@hashgraph/sdk";
import { createHash } from "crypto";

export interface ProofPayload {
  v: number;
  hash: string;
  queryHash: string;
  model: string;
  tokens: number;
  ts: number;
}

export interface RegisterResult {
  transactionId: string;
  consensusTimestamp?: string;
  hash: string;
  queryHash: string;
  payload: ProofPayload;
}

export class HederaProofService {
  private client: Client | null = null;
  private topicId: TopicId | null = null;
  private initialized = false;

  private ensureInitialized() {
    if (this.initialized) return;

    const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
    const topicIdStr = process.env.HEDERA_TOPIC_ID;

    if (!accountIdStr || !privateKeyStr || !topicIdStr) {
      throw new Error(
        "Missing Hedera environment variables: HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY, HEDERA_TOPIC_ID"
      );
    }

    const network = process.env.HEDERA_NETWORK || "testnet";
    const accountId = AccountId.fromString(accountIdStr);
    // Supports both ED25519 and ECDSA private keys in DER / raw formats commonly used
    const privateKey = PrivateKey.fromString(privateKeyStr);

    this.client =
      network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    this.client.setOperator(accountId, privateKey);
    this.topicId = TopicId.fromString(topicIdStr);
    this.initialized = true;
  }

  /** Canonical SHA-256 of a UTF-8 string */
  static sha256(content: string): string {
    return createHash("sha256").update(content, "utf8").digest("hex");
  }

  async registerProof(payload: ProofPayload): Promise<{
    transactionId: string;
    consensusTimestamp?: string;
  }> {
    this.ensureInitialized();

    const message = JSON.stringify(payload);

    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(this.topicId!)
      .setMessage(message)
      .setMaxTransactionFee(new Hbar(2))
      .execute(this.client!);

    const record = await tx.getRecord(this.client!);

    return {
      transactionId: tx.transactionId!.toString(),
      consensusTimestamp: record.consensusTimestamp?.toDate().toISOString(),
    };
  }

  async createAndRegister(params: {
    response: string;
    query: string;
    model: string;
    tokens: number;
  }): Promise<RegisterResult> {
    const hash = HederaProofService.sha256(params.response);
    const queryHash = HederaProofService.sha256(
      params.query.trim().toLowerCase()
    );

    const payload: ProofPayload = {
      v: 1,
      hash,
      queryHash,
      model: params.model,
      tokens: params.tokens,
      ts: Date.now(),
    };

    const result = await this.registerProof(payload);

    return {
      ...result,
      hash,
      queryHash,
      payload,
    };
  }
}

// Singleton – safe because initialization is lazy
let _instance: HederaProofService | null = null;

export function getHederaProof(): HederaProofService {
  if (!_instance) {
    _instance = new HederaProofService();
  }
  return _instance;
}
