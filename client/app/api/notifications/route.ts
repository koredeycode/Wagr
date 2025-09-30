// app/api/notifications/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notification } from "@/lib/schema"; // <-- import both tables
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Grab the session from request headers
  const headers = await import("next/headers").then((m) => m.headers());
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Query notifications and join wagers
  const userNotifications = await db
    .select({
      id: notification.id,
      type: notification.type,
      createdAt: notification.createdAt,
      message: notification.message,
      wagerId: notification.wagerId,
      read: notification.read,
    })
    .from(notification)
    .where(eq(notification.userId, session.user.id))
    .orderBy(desc(notification.createdAt));

  return NextResponse.json(userNotifications);
}
