// app/api/wagers/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { event } from "@/lib/schema";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const headers = await import("next/headers").then((m) => m.headers());
  const session = await auth.api.getSession({ headers });

  const { searchParams } = new URL(req.url);
  const wagerId = searchParams.get("wagerId") || "";

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // await db
  //     .select({
  //       id: notification.id,
  //   type: notification.type,
  //   createdAt: notification.createdAt,
  //   message: notification.message,
  //   wagerId: notification.wagerId,
  //   read: notification.read,
  // })
  // .from(notification)
  // .where(eq(notification.userId, session.user.id))
  // .orderBy(desc(notification.createdAt));

  const events = await db
    .select()
    .from(event)
    .where(eq(event.wagerId, wagerId));

  //   const events = await db
  //     .select()
  //     .from(event)
  //     .where(eq(event.wagerId, wagerId));

  return NextResponse.json(events);
}
