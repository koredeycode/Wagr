// src/app.ts
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { startEventListeners } from "./listeners";

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

  // Optional proof route kept from original
  app.post("/proof", async (req, res) => {
    try {
      const { eventName, data } = req.body;
      if (eventName === "proofUploaded") {
        // Reuse same approach as webhook: look up user by wallet and send notifications
        // Implementation left for you to fill if you need.
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
