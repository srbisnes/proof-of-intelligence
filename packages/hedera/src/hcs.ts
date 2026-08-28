/**
 * Hedera Consensus Service client for Proof of Intelligence
 * Registers SHA-256 hashes of AI responses as immutable proofs.
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
  hash: string;          // SHA-256 of the response content
  queryHash: string;     // SHA-256 of normalized query
  model: string;
  tokens: number;
  ts: number;
}

export class HederaProofService {
  private client: Client;
  private topicId: TopicId;

  constructor() {
    const network = process.env.HEDERA_NETWORK || "testnet";
    const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!);
    const privateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!);

    this.client =
      network === "mainnet"
        ? Client.forMainnet()
        : Client.forTestnet();

    this.client.setOperator(accountId, privateKey);
    this.topicId = TopicId.fromString(process.env.HEDERA_TOPIC_ID!);
  }

  /** Canonical SHA-256 of a string (UTF-8) */
  static sha256(content: string): string {
    return createHash("sha256").update(content, "utf8").digest("hex");
  }

  /** Submit proof to HCS and return transaction ID + consensus timestamp */
  async registerProof(payload: ProofPayload): Promise<{
    transactionId: string;
    consensusTimestamp?: string;
  }> {
    const message = JSON.stringify(payload);

    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(this.topicId)
      .setMessage(message)
      .setMaxTransactionFee(new Hbar(2))
      .execute(this.client);

    const receipt = await tx.getReceipt(this.client);
    const record = await tx.getRecord(this.client);

    return {
      transactionId: tx.transactionId.toString(),
      consensusTimestamp: record.consensusTimestamp?.toDate().toISOString(),
    };
  }

  /** Helper to create a full proof from response */
  async createAndRegister(params: {
    response: string;
    query: string;
    model: string;
    tokens: number;
  }) {
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

export const hederaProof = new HederaProofService();
