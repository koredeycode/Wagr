// app/api/notifications/mark-all-read/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notification } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headers = await import("next/headers").then((m) => m.headers());
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mark all user's notifications as read
  await db
    .update(notification)
    .set({ read: true })
    .where(
      and(
        eq(notification.userId, session.user.id),
        eq(notification.read, false)
      )
    );

  return NextResponse.json({ ok: true });
}
