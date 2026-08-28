import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processQuery } from "@/lib/query-engine";

const bodySchema = z.object({
  query: z.string().min(1).max(8000),
  model: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, model } = parsed.data;
    const result = await processQuery(query, { model });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    // Do not leak sensitive details in production
    console.error("[/api/query]", error);

    return NextResponse.json(
      {
        error: message,
        hint: "Check environment variables (OPENAI_API_KEY, QDRANT_*, HEDERA_*)",
      },
      { status: 500 }
    );
  }
}
