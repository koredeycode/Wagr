// app/api/wagers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wager } from "@/lib/schema";

export async function GET(req: NextRequest) {
  const headers = await import("next/headers").then((m) => m.headers());
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userWagers = await db.query.wager.findMany({
    where: (wager, { eq }) => eq(wager.userId, session.user.id),
  });

  return NextResponse.json(userWagers);
}

export async function POST(req: NextRequest) {
  const headers = await import("next/headers").then((m) => m.headers());
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, description, counterId } = body;

  const [newWager] = await db
    .insert(wager)
    .values({
      creatorId: session.user.id,
      counterId,
      amount,
      description,
      status: "pending",
    })
    .returning();

  return NextResponse.json(newWager, { status: 201 });
}
