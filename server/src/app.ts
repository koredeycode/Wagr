// src/app.ts
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { eq } from "drizzle-orm";
import { db } from "./db";
import { startEventListeners } from "./listeners";
import { notification, user, walletAddress } from "./schema";
dotenv.config();

const port = Number(process.env.PORT);
const host = process.env.HOST;

async function main() {
  const app = express();
  app.use(express.json());

  const server = createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL },
  });

  io.on("connection", (socket) => {
    socket.on("join", (address: string) => {
      socket.join(address.toLowerCase());

      console.log(`User ${address} joined id - ${socket.id}}`);
    });
  });

  // health-check route
  app.get("/health", (req, res) => res.json({ ok: true }));

  // Proof upload notification route
  app.post("/proof", async (req, res) => {
    try {
      const { eventName, data } = req.body;
      if (eventName === "proofUploaded") {
        const { id, wagerId, userId, uploaderAddr, notifiedUserAddr, url, text } = data;
        
        // Find user by wallet address
        const [userToNotify] = await db
          .select({ id: user.id, email: user.email })
          .from(user)
          .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
          .where(eq(walletAddress.address, notifiedUserAddr));
        
        if (userToNotify) {
          const message = `New proof uploaded for wager #${wagerId}`;
          
          // Insert notification
          const [notif] = await db
            .insert(notification)
            .values({
              userId: userToNotify.id,
              type: "ProofUploaded",
              message,
              wagerId,
            })
            .returning();
          
          // Emit socket notification
          io.to(notifiedUserAddr.toLowerCase()).emit("notification", {
            id: notif.id,
            type: "ProofUploaded",
            message,
            wagerId,
            createdAt: notif.createdAt,
          });
          
          console.log(`Proof notification sent to ${notifiedUserAddr}`);
        }
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("proof route error", err);
      res.status(500).json({ error: "internal" });
    }
  });

  // start event listeners (websocket -> handlers)
  const unwatch = startEventListeners(io);

  server.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}`);
  });

  process.on("SIGTERM", () => {
    console.log("unwatching...");
    unwatch();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Fatal error starting app", err);
  process.exit(1);
});
