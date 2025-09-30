// lib/auth.ts
import { db } from "@/lib/db";
import { schema } from "@/lib/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { generateRandomString } from "better-auth/crypto";
import { siwe } from "better-auth/plugins";
import { createPublicClient, http, verifyMessage } from "viem";
import { baseSepolia } from "viem/chains";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQLb
    schema, // Extended schema with custom tables
  }),
  plugins: [
    siwe({
      domain: process.env.DOMAIN || "localhost:3000",
      emailDomainName: process.env.DOMAIN || "localhost:3000",
      anonymous: false, // Require email for non-anonymous sign-ins
      getNonce: async () => generateRandomString(32), // Secure nonce
      verifyMessage: async ({ message, signature, address }) => {
        "Verifying message";
        try {
          return await verifyMessage({
            address: address as `0x${string}`,
            message,
            signature: signature as `0x${string}`,
          });
        } catch (error) {
          console.error("SIWE verification failed:", error);
          return false;
        }
      },
      ensLookup: async ({ walletAddress }) => {
        try {
          const client = createPublicClient({
            chain: baseSepolia,
            transport: http(),
          });
          const ensName = await client.getEnsName({
            address: walletAddress as `0x${string}`,
          });
          const ensAvatar = ensName
            ? await client.getEnsAvatar({ name: ensName })
            : null;
          return {
            name: ensName || walletAddress,
            avatar: ensAvatar || "",
          };
        } catch {
          return { name: walletAddress, avatar: "" };
        }
      },
    }),
  ],
  // Other config (e.g., email for non-anonymous mode)
  emailAndPassword: { enabled: false }, // Disable if only using SIWE
});
