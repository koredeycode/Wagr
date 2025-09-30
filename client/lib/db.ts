// lib/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import { DATABASE_URL } from "@/lib/env"; // Import from your env file

const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient);
