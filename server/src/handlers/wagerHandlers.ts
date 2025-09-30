// src/handlers/wagerHandlers.ts
import { eq } from "drizzle-orm";
import { Server } from "socket.io";
import { createPublicClient, formatUnits, getContract, http } from "viem";
import { baseSepolia } from "viem/chains";

import contract from "../contract";
import { db } from "../db";
// import { getRequiredEnvVar } from "../envHelpers";
import { event, notification, user, wager, walletAddress } from "../schema";
import { ResolutionType, Wager } from "../types";
// const httpUrl = getRequiredEnvVar("ALCHEMY_HTTP_URL");

const httpUrl = process.env.ALCHEMY_HTTP_URL;

function outcomeTextFor(userAddr: string, winnerAddr: string) {
  if (
    !winnerAddr ||
    winnerAddr === "0x0000000000000000000000000000000000000000"
  ) {
    return "It's a draw";
  }
  return userAddr.toLowerCase() === winnerAddr.toLowerCase()
    ? "Congrats, you won"
    : "Sorry, you lost";
}

function transformWagerData(data: unknown): Wager {
  console.log(data);
  const wagerArray = data as [
    `0x${string}`,
    `0x${string}`,
    `0x${string}`,
    bigint,
    bigint,
    bigint,
    string,
    number,
    number,
  ];

  return {
    creator: wagerArray[0],
    counter: wagerArray[1],
    allowedCounter: wagerArray[2],
    creatorStake: wagerArray[3],
    counterStake: wagerArray[4],
    createdAt: wagerArray[5] * BigInt(1000),
    description: wagerArray[6],
    status: wagerArray[7],
    outcome: wagerArray[8],
  };
}

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(httpUrl),
});

const wagr = getContract({
  address: contract.address,
  abi: contract.abi,
  client,
});

export async function handleWagerCreated(
  io: Server,
  data: any,
  eventId: string,
  eventName: string
) {
  const { id, creator, stake, description, allowedCounter } = data as any;
  const creatorAddr = creator;
  const counterAddr =
    allowedCounter !== "0x0000000000000000000000000000000000000000"
      ? allowedCounter
      : null;

  const [creatorUser] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
    .where(eq(walletAddress.address, creatorAddr));

  if (!creatorUser) {
    // res.status(404).json({ error: "Creator not found" });
    // return;
    throw new Error("Creator not found");
  }

  console.log(creatorUser);

  const [counterUser] = counterAddr
    ? await db
        .select({ id: user.id, email: user.email })
        .from(user)
        .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
        .where(eq(walletAddress.address, counterAddr))
    : [];

  await db.insert(wager).values({
    id: id.toString(),
    creatorId: creatorUser.id,
    counterId: counterUser?.id || null,
    description,
    stake: stake.toString(),
    status: "Pending",
  });

  await db.insert(event).values({
    id: eventId,
    wagerId: id.toString(),
    type: eventName,
  });

  if (counterUser) {
    const [notif] = await db
      .insert(notification)
      .values({
        userId: counterUser.id,
        type: eventName,
        message: `You have been challenged with a stake of ${formatUnits(
          BigInt(stake),
          6
        )} USDC on wager #${id}`,
        wagerId: id.toString(),
      })
      .returning();

    io.to(counterAddr.toLowerCase()).emit("notification", {
      id: notif.id,
      type: eventName,
      message: `You have been challenged with a stake of ${formatUnits(
        BigInt(stake),
        6
      )} USDC on wager #${id}`,
      wagerId: id.toString(),
      createdAt: notif.createdAt,
    });

    // if (counterUser?.email) {
    //   await sendEmailNotification(
    //     counterUser.email,
    //     "Invitation To A New Wager",
    //     `Wager #${id} available to counter. Stake: ${formatUnits(
    //       BigInt(stake),
    //       6
    //     )} USDC.`
    //   );
    // }
  }
}

export async function handleWagerCountered(
  io: Server,
  data: any,
  eventId: string,
  eventName: string
) {
  const { id, counter } = data as any;
  const wagerData = await wagr.read.wagers!([BigInt(id)]);
  const wagerObj = transformWagerData(wagerData);

  const creatorAddr = wagerObj.creator;
  const counterAddr = counter;

  const [creatorUser] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
    .where(eq(walletAddress.address, creatorAddr));

  if (!creatorUser) {
    throw new Error("Creator not found");
  }

  const [counterUser] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
    .where(eq(walletAddress.address, counterAddr));

  if (!counterUser) {
    throw new Error("Counter not found");
  }

  await db
    .update(wager)
    .set({ counterId: counterUser.id, status: "Countered" })
    .where(eq(wager.id, id.toString()));

  await db.insert(event).values({
    id: eventId,
    wagerId: id.toString(),
    type: eventName,
  });

  const [notif] = await db
    .insert(notification)
    .values({
      userId: creatorUser.id,
      type: eventName,
      message: `Your wager #${id} has been countered by ${counterAddr}`,
      wagerId: id.toString(),
    })
    .returning();

  io.to(creatorAddr.toLowerCase()).emit("notification", {
    id: notif.id,
    type: eventName,
    message: `Your wager #${id} has been countered by ${counterAddr}`,
    wagerId: id.toString(),
  });

  // if (creatorUser.email) {
  //   await sendEmailNotification(
  //     creatorUser.email,
  //     "Wager Countered",
  //     `Your Wager ${id} countered by ${counterAddr}.`
  //   );
  // }
}

export async function handleWagerResolved(
  io: Server,
  data: any,
  eventId: string,
  eventName: string
) {
  const { id, outcome, winnerOrZero, resolutionType } = data as any;
  const wagerData = await wagr.read.wagers!([BigInt(id)]);
  const wagerObj = transformWagerData(wagerData);
  const creatorAddr = wagerObj.creator;
  const counterAddr = wagerObj.counter;

  const [creatorUser] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
    .where(eq(walletAddress.address, creatorAddr));

  if (!creatorUser) {
    throw new Error("Creator not found");
  }

  const [counterUser] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
    .where(eq(walletAddress.address, counterAddr));

  if (!counterUser) {
    throw new Error("Counter not found");
  }

  await db
    .update(wager)
    .set({ status: "Resolved" })
    .where(eq(wager.id, id.toString()));

  await db.insert(event).values({
    id: eventId,
    wagerId: id.toString(),
    type: eventName,
  });

  for (const [addr, uid] of [
    [creatorAddr, creatorUser.id],
    [counterAddr, counterUser.id],
  ]) {
    const outcomeText = outcomeTextFor(addr, winnerOrZero);
    const reason =
      resolutionType === ResolutionType.Conceded
        ? "A party conceded"
        : "Admin resolved";
    const [notif] = await db
      .insert(notification)
      .values({
        userId: uid,
        type: eventName,
        message: `Wager #${id} resolved: ${reason} ${outcomeText}!`,
        wagerId: id.toString(),
      })
      .returning();

    io.to(addr.toLowerCase()).emit("notification", {
      id: notif.id,
      type: eventName,
      message: `Wager #${id} resolved: ${reason} ${outcomeText}!`,
      wagerId: id.toString(),
    });
  }

  // if (creatorUser.email) {
  //   await sendEmailNotification(
  //     creatorUser.email,
  //     "Wager Resolved",
  //     `Wager ${id} resolved: ${outcomeText}.`
  //   );
  // }
  // if (counterUser.email) {
  //   await sendEmailNotification(
  //     counterUser.email,
  //     "Wager Resolved",
  //     `Wager ${id} resolved: ${outcomeText}.`
  //   );
  // }
}

export async function handleWagerCancelled(
  io: Server,
  data: any,
  eventId: string,
  eventName: string
) {
  // Ensure 'data' is an object with the expected properties
  const { id, creator: creatorAddr, amount } = data as any;

  const [creatorUser] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .innerJoin(walletAddress, eq(walletAddress.userId, user.id))
    .where(eq(walletAddress.address, creatorAddr));

  if (!creatorUser) {
    // res.status(404).json({ error: "Creator not found" });
    // return;
    throw new Error("Creator not found");
  }

  await db
    .update(wager)
    .set({ status: "Cancelled" })
    .where(eq(wager.id, id.toString()));

  await db.insert(event).values({
    id: eventId,
    wagerId: id.toString(),
    type: eventName,
  });
}
