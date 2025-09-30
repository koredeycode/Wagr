import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { user, walletAddress } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const body = await req.json();
  const { address, fcmToken } = body;

  if (!address || !fcmToken) {
    return NextResponse.json(
      { error: "Address and FCM token are required" },
      { status: 400 }
    );
  }

  try {
    const [userData] = await db
      .select({ id: user.id })
      .from(user)
      .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
      .where(eq(walletAddress.address, address.toLowerCase()));

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.update(user).set({ fcmToken }).where(eq(user.id, userData.id));
    return NextResponse.json({ message: "FCM token saved" });
  } catch (error) {
    console.error("Error saving FCM token:", error);

    return NextResponse.json(
      { error: "Failed to save FCM token" },
      { status: 500 }
    );
  }
}
