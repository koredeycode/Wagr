// app/api/proofs/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { proof } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const headers = await import("next/headers").then((m) => m.headers());
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const wagerId = searchParams.get("wagerId");

  if (!wagerId) {
    return NextResponse.json({ error: "wagerId is required" }, { status: 400 });
  }

  const proofs = await db
    .select({
      id: proof.id,
      wagerId: proof.wagerId,
      uploaderId: proof.uploaderId,
      text: proof.text,
      imageUrl: proof.imageUrl,
      createdAt: proof.createdAt,
    })
    .from(proof)
    .where(eq(proof.wagerId, wagerId))
    .orderBy(asc(proof.createdAt));

  return NextResponse.json(proofs);
}
