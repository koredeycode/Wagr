// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

console.log(process.env);

export default defineConfig({
  schema: "./lib/schema.ts", // Path to your schema file
  out: "./drizzle/migrations", // Directory for generated migration files
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true, // Enable detailed logs for debugging
  strict: true, // Enforce strict schema validation
});
