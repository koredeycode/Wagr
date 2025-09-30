// src/listeners.ts
import { Server } from "socket.io";
import {
  Log,
  createPublicClient,
  decodeEventLog,
  getContract,
  http,
  webSocket,
} from "viem";
import { baseSepolia } from "viem/chains";
import contract from "./contract";

import dotenv from "dotenv";
dotenv.config();

import {
  handleWagerCancelled,
  handleWagerCountered,
  handleWagerCreated,
  handleWagerResolved,
} from "./handlers/wagerHandlers";

// two clients: WS for subscriptions, HTTP for read calls when needed
export function startEventListeners(io: Server) {
  const wssUrl = process.env.ALCHEMY_WSS_URL;
  const httpUrl = process.env.ALCHEMY_HTTP_URL;

  const wsClient = createPublicClient({
    chain: baseSepolia,
    transport: webSocket(wssUrl),
  });

  const httpClient = createPublicClient({
    chain: baseSepolia,
    transport: http(httpUrl),
  });

  const wagrWS = getContract({
    address: contract.address,
    abi: contract.abi,
    client: wsClient,
  });

  const wagrHTTP = getContract({
    address: contract.address,
    abi: contract.abi,
    client: httpClient,
  });

  console.log("Starting contract event listeners (WS)...");

  // standalone
  const unwatch = wsClient.watchContractEvent({
    address: contract.address,
    abi: contract.abi,

    // you can also set 'args' filter if needed
    onLogs: async (logs: Log[]) => {
      const log = logs[0];

      // const eventName = log.eventName;
      // const data = log.args;

      const eventId = `${log.transactionHash}:${log.logIndex}`;
      const decoded = decodeEventLog({
        abi: contract.abi,
        data: log.data,
        topics: log.topics,
      });

      console.log(decoded);
      const { eventName, args: data } = decoded;

      console.log("New Event: ", eventName);

      switch (eventName as unknown) {
        case "WagerCreated":
          await handleWagerCreated(io, data, eventId, String(eventName));
          break;
        case "WagerCountered":
          await handleWagerCountered(io, data, eventId, String(eventName));
          break;
        case "WagerResolved":
          await handleWagerResolved(io, data, eventId, String(eventName));
          break;
        case "WagerCancelled":
          await handleWagerCancelled(io, data, eventId, String(eventName));
          break;
        default:
          console.log("Unknown event: ", eventName);
      }
    },
    onError: (error) => {
      console.error("Error on wager handler:", error);
    },
  });
  // Note: watchContractEvent returns an unsubscribe function; if you need to stop listeners keep references.
  return unwatch;
}
