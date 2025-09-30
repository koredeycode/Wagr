import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { user, walletAddress } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address || typeof address !== "string") {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  try {
    const [userData] = await db
      .select({ id: user.id, email: user.email })
      .from(user)
      .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
      .where(eq(walletAddress.address, address));

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);

    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
