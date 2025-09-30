// lib/schema.ts
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),

  fcmToken: text("fcm_token"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const walletAddress = pgTable("wallet_address", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  chainId: integer("chain_id").notNull(),
  isPrimary: boolean("is_primary"),
  createdAt: timestamp("created_at").notNull(),
});

// Custom wagers table
export const wager = pgTable("wager", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  creatorId: text("creatorId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  counterId: text("counterId").references(() => user.id),
  stake: integer("stake").notNull(),
  description: text("description").notNull(),
  status: text("status").default("pending").notNull(),
  outcome: text("outcome"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const event = pgTable("event", {
  // id: text("id").primaryKey().default(),
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  wagerId: text("wager_id")
    .notNull()
    .references(() => wager.id),
  type: text("type").notNull(), // e.g., 'created', 'countered', 'resolved', 'cancelled'
  // data: jsonb("data"), // Optional JSON for extra details (e.g., { outcome: 'Creator Wins' })

  createdAt: timestamp("created_at").defaultNow().notNull(),

  // userId: text("user_id").references(() => user.id), // For targeted queries/notifications
});

export const notification = pgTable("notification", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  type: text("type").notNull(),
  // 'wagerCreated', 'wagerCountered', 'proofUploaded', 'wagerResolved', etc.

  message: text("message"), // Extra details: "Alice challenged you with 5 USDC"

  wagerId: text("wager_id")
    .notNull()
    .references(() => wager.id),

  read: boolean("read").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const proof = pgTable("proof", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  wagerId: text("wager_id")
    .notNull()
    .references(() => wager.id, { onDelete: "cascade" }),

  uploaderId: text("uploader_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  text: text("text"),
  imageUrl: text("image_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  wagers: many(wager),
  walletAddresses: many(walletAddress),
  verifications: many(verification),
}));

export const wagersRelations = relations(wager, ({ one }) => ({
  creator: one(user, { fields: [wager.creatorId], references: [user.id] }),
  counter: one(user, { fields: [wager.counterId], references: [user.id] }),
}));

export const walletAddressRelations = relations(walletAddress, ({ one }) => ({
  user: one(user, { fields: [walletAddress.userId], references: [user.id] }),
}));

// Export schema for Better Auth
export const schema = {
  user,
  session,
  account,
  verification,
  walletAddress,
  wager,
  event,
  notification,
  proof,
};
