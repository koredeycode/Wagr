/**
 * Database Sync Script
 *
 * Drops and recreates wager-related tables, then populates with on-chain data
 * from the Wagr smart contract on Base Sepolia.
 *
 * Usage: npx ts-node src/scripts/sync-db.ts
 */

import crypto from "crypto";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createPublicClient, formatUnits, http } from "viem";
import { baseSepolia } from "viem/chains";

import contract from "../contract";
import * as schema from "../schema";

// Load environment variables
dotenv.config();

// Status enum matching the contract
enum Status {
  Pending = 0,
  Countered = 1,
  Resolved = 2,
  Cancelled = 3,
}

// Outcome enum matching the contract
enum Outcome {
  None = 0,
  CreatorWins = 1,
  CounterWins = 2,
  Draw = 3,
}

// Database connection
const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient, { schema });

// Viem client for reading blockchain data
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const DECIMALS = 6; // USDC decimals

// Generate random ID like better-auth (base62, 32 chars)
function generateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(32);
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

interface OnChainWager {
  id: number;
  creator: string;
  counter: string;
  allowedCounter: string;
  creatorStake: bigint;
  counterStake: bigint;
  createdAt: bigint;
  description: string;
  status: number;
  outcome: number;
}

function statusToString(status: number): string {
  switch (status) {
    case Status.Pending:
      return "pending";
    case Status.Countered:
      return "countered";
    case Status.Resolved:
      return "resolved";
    case Status.Cancelled:
      return "cancelled";
    default:
      return "pending";
  }
}

function outcomeToString(outcome: number): string | null {
  switch (outcome) {
    case Outcome.CreatorWins:
      return "creator_wins";
    case Outcome.CounterWins:
      return "counter_wins";
    case Outcome.Draw:
      return "draw";
    default:
      return null;
  }
}

async function getNextId(): Promise<number> {
  const nextId = await client.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "nextId",
  });
  return Number(nextId);
}

async function getWager(id: number): Promise<OnChainWager> {
  const result = await client.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "wagers",
    args: [BigInt(id)],
  });

  const [
    creator,
    counter,
    allowedCounter,
    creatorStake,
    counterStake,
    createdAt,
    description,
    status,
    outcome,
  ] = result as [string, string, string, bigint, bigint, bigint, string, number, number];

  return {
    id,
    creator,
    counter,
    allowedCounter,
    creatorStake,
    counterStake,
    createdAt,
    description,
    status,
    outcome,
  };
}

async function dropTables() {
  console.log("🗑️  Dropping tables...");

  // Drop tables in correct order (respecting FK constraints)
  await db.execute(sql`DROP TABLE IF EXISTS proof CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS notification CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS event CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS wager CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS wallet_address CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS verification CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS account CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS session CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "user" CASCADE`);

  console.log("✅ All tables dropped");
}

async function createTables() {
  console.log("📝 Creating tables...");

  // Create user table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "user" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      image TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      fcm_token TEXT
    )
  `);

  // Create session table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      expires_at TIMESTAMP NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    )
  `);

  // Create account table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      access_token TEXT,
      refresh_token TEXT,
      id_token TEXT,
      access_token_expires_at TIMESTAMP,
      refresh_token_expires_at TIMESTAMP,
      scope TEXT,
      password TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `);

  // Create verification table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Create wallet_address table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS wallet_address (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      address TEXT NOT NULL,
      chain_id INTEGER NOT NULL,
      is_primary BOOLEAN,
      created_at TIMESTAMP NOT NULL
    )
  `);

  // Create wager table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS wager (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      "creatorId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "counterId" TEXT REFERENCES "user"(id),
      stake INTEGER NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      outcome TEXT,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `);

  // Create event table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS event (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      wager_id TEXT NOT NULL REFERENCES wager(id),
      type TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Create notification table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS notification (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      message TEXT,
      wager_id TEXT NOT NULL REFERENCES wager(id),
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Create proof table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS proof (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      wager_id TEXT NOT NULL REFERENCES wager(id) ON DELETE CASCADE,
      uploader_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      text TEXT,
      image_url TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  console.log("✅ All tables created");
}

// Map to track wallet address -> user ID mapping
const userIdMap = new Map<string, string>();

// Create users for wallet addresses
async function ensureUserExists(walletAddress: string): Promise<string> {
  const normalizedAddress = walletAddress.toLowerCase();
  
  // Check if we already created this user
  if (userIdMap.has(normalizedAddress)) {
    return userIdMap.get(normalizedAddress)!;
  }
  
  // Generate a random ID like better-auth
  const userId = generateId();
  const shortAddress = `${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`;
  const now = new Date();
  
  // Create user
  await db.insert(schema.user).values({
    id: userId,
    name: shortAddress,
    email: `${normalizedAddress}@wallet.local`,
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  });

  // Create wallet_address entry
  await db.insert(schema.walletAddress).values({
    id: generateId(),
    userId: userId,
    address: normalizedAddress,
    chainId: 84532, // Base Sepolia chain ID
    isPrimary: true,
    createdAt: now,
  });

  // Create account entry for SIWE authentication
  await db.insert(schema.account).values({
    id: generateId(),
    accountId: normalizedAddress,
    providerId: "siwe",
    userId: userId,
    createdAt: now,
    updatedAt: now,
  });
  
  userIdMap.set(normalizedAddress, userId);
  console.log(`  👤 Created user ${userId.slice(0, 8)}... for ${shortAddress} (with wallet & account)`);
  return userId;
}

async function syncWagers() {
  const nextId = await getNextId();
  console.log(`📊 Found ${nextId} wagers on-chain`);

  if (nextId === 0) {
    console.log("No wagers to sync.");
    return;
  }

  // First pass: collect all unique wallet addresses
  console.log("\n📥 Fetching wager data from blockchain...");
  const wagers: OnChainWager[] = [];
  const walletAddresses = new Set<string>();

  for (let i = 0; i < nextId; i++) {
    try {
      const wager = await getWager(i);
      wagers.push(wager);
      walletAddresses.add(wager.creator.toLowerCase());
      if (wager.counter !== ZERO_ADDRESS) {
        walletAddresses.add(wager.counter.toLowerCase());
      }
    } catch (error) {
      console.error(`  ❌ Error fetching wager #${i}:`, error);
    }
  }

  // Second pass: ensure all users exist
  console.log(`\n👥 Creating ${walletAddresses.size} users...`);
  for (const address of walletAddresses) {
    await ensureUserExists(address);
  }

  // Third pass: insert wagers
  console.log("\n📝 Inserting wagers into database...");
  for (const wager of wagers) {
    try {
      const stakeFormatted = Number(formatUnits(wager.creatorStake, DECIMALS));
      const createdAtDate = new Date(Number(wager.createdAt) * 1000);
      
      // Use on-chain wager number as the ID
      const wagerId = String(wager.id);

      const creatorId = userIdMap.get(wager.creator.toLowerCase())!;
      const counterId = wager.counter === ZERO_ADDRESS 
        ? null 
        : userIdMap.get(wager.counter.toLowerCase())!;

      await db.insert(schema.wager).values({
        id: wagerId,
        creatorId,
        counterId,
        stake: Math.round(stakeFormatted),
        description: wager.description,
        status: statusToString(wager.status),
        outcome: outcomeToString(wager.outcome),
        createdAt: createdAtDate,
        updatedAt: createdAtDate,
      });

      // Create "created" event
      await db.insert(schema.event).values({
        id: generateId(),
        wagerId: wagerId,
        type: "WagerCreated",
        createdAt: createdAtDate,
      });

      // Notification: Wager created - notify creator
      await db.insert(schema.notification).values({
        id: generateId(),
        userId: creatorId,
        type: "wagerCreated",
        message: `Your wager "${wager.description.substring(0, 50)}${wager.description.length > 50 ? "..." : ""}" has been created with ${Math.round(stakeFormatted)} USDC stake.`,
        wagerId: wagerId,
        read: false,
        createdAt: createdAtDate,
      });

      // If countered, add that event too
      if (wager.status >= Status.Countered && wager.counter !== ZERO_ADDRESS) {
        await db.insert(schema.event).values({
          id: generateId(),
          wagerId: wagerId,
          type: "WagerCountered",
          createdAt: createdAtDate,
        });

        // Notification: Wager countered - notify creator that someone accepted
        await db.insert(schema.notification).values({
          id: generateId(),
          userId: creatorId,
          type: "wagerCountered",
          message: `Your wager has been accepted! The challenge is on.`,
          wagerId: wagerId,
          read: false,
          createdAt: createdAtDate,
        });

        // Notification: Wager countered - notify counter that they joined
        if (counterId) {
          await db.insert(schema.notification).values({
            id: generateId(),
            userId: counterId,
            type: "wagerCountered",
            message: `You joined the wager "${wager.description.substring(0, 50)}${wager.description.length > 50 ? "..." : ""}" with ${Math.round(stakeFormatted)} USDC stake.`,
            wagerId: wagerId,
            read: false,
            createdAt: createdAtDate,
          });
        }
      }

      // If resolved, add that event
      if (wager.status === Status.Resolved) {
        const resolvedAt = new Date();
        
        await db.insert(schema.event).values({
          id: generateId(),
          wagerId: wagerId,
          type: "WagerResolved",
          createdAt: resolvedAt,
        });

        // Determine winner message
        let outcomeMessage = "The wager has been resolved.";
        if (wager.outcome === Outcome.CreatorWins) {
          outcomeMessage = "The wager has been resolved. Creator wins!";
        } else if (wager.outcome === Outcome.CounterWins) {
          outcomeMessage = "The wager has been resolved. Challenger wins!";
        } else if (wager.outcome === Outcome.Draw) {
          outcomeMessage = "The wager has been resolved as a draw.";
        }

        // Notification: Wager resolved - notify creator
        await db.insert(schema.notification).values({
          id: generateId(),
          userId: creatorId,
          type: "wagerResolved",
          message: outcomeMessage,
          wagerId: wagerId,
          read: false,
          createdAt: resolvedAt,
        });

        // Notification: Wager resolved - notify counter if exists
        if (counterId) {
          await db.insert(schema.notification).values({
            id: generateId(),
            userId: counterId,
            type: "wagerResolved",
            message: outcomeMessage,
            wagerId: wagerId,
            read: false,
            createdAt: resolvedAt,
          });
        }
      }

      // If cancelled, add that event
      if (wager.status === Status.Cancelled) {
        const cancelledAt = new Date();
        
        await db.insert(schema.event).values({
          id: generateId(),
          wagerId: wagerId,
          type: "WagerCancelled",
          createdAt: cancelledAt,
        });

        // Notification: Wager cancelled - notify creator
        await db.insert(schema.notification).values({
          id: generateId(),
          userId: creatorId,
          type: "wagerCancelled",
          message: `Your wager "${wager.description.substring(0, 50)}${wager.description.length > 50 ? "..." : ""}" has been cancelled.`,
          wagerId: wagerId,
          read: false,
          createdAt: cancelledAt,
        });

        // Notification: Wager cancelled - notify counter if exists
        if (counterId) {
          await db.insert(schema.notification).values({
            id: generateId(),
            userId: counterId,
            type: "wagerCancelled",
            message: `A wager you joined has been cancelled. Funds have been returned.`,
            wagerId: wagerId,
            read: false,
            createdAt: cancelledAt,
          });
        }
      }

      console.log(
        `  ✅ Wager #${wager.id}: "${wager.description.substring(0, 35)}${wager.description.length > 35 ? "..." : ""}" - ${statusToString(wager.status)}`
      );
    } catch (error) {
      console.error(`  ❌ Error syncing wager #${wager.id}:`, error);
    }
  }
}

async function main() {
  console.log("🚀 Starting database reset and sync...\n");
  console.log(`📍 Contract: ${contract.address}`);
  console.log(`🔗 Chain: Base Sepolia\n`);

  try {
    await dropTables();
    console.log("");
    await createTables();
    console.log("");
    await syncWagers();
    console.log("\n✅ Database sync complete!");
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }

  // Close the database connection
  await queryClient.end();
  process.exit(0);
}

main();
