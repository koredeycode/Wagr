// app/api/notifications/[id]/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notification } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = await import("next/headers").then((m) => m.headers());
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Update notification - only if it belongs to the user
  const [updated] = await db
    .update(notification)
    .set({ read: body.read ?? true })
    .where(
      and(
        eq(notification.id, id),
        eq(notification.userId, session.user.id)
      )
    )
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
