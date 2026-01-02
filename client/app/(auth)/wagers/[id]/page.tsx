import { StatusBadge } from "@/components/StatusBadge";
import WagerActions from "@/components/WagerActions";
import shortenAddress from "@/lib/address";
import contract from "@/lib/wager";
import wagmiConfig from "@/lib/wagmi";
import type { Wager } from "@/types";
import { Status } from "@/types";
import { readContract } from "@wagmi/core";
import { notFound } from "next/navigation";
import { formatUnits } from "viem";

import WagerDetailSidebar from "./WagerDetailSidebar";

const ADMIN_ADDRESS = "0x6453DBB7148d30a517E2E16AE5b11B3b7d2cEC29";

function transformWagerData(data: unknown): Wager {
  const wagerArray = data as [
    `0x${string}`,
    `0x${string}`,
    `0x${string}`,
    bigint,
    bigint,
    bigint,
    string,
    number,
    number
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

export default async function WagerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let wager: Wager | null = null;

  try {
    const data = await readContract(wagmiConfig, {
      address: contract.address as `0x${string}`,
      abi: contract.abi,
      functionName: "wagers",
      args: [Number(id)],
    });

    wager = transformWagerData(data);
  } catch (err) {
    console.error("Error fetching wager:", err);
    return notFound();
  }

  if (!wager) return notFound();

  const creatorStakeFormatted = formatUnits(wager.creatorStake, contract.decimals);
  const counterStakeFormatted = formatUnits(wager.counterStake, contract.decimals);
  const totalPot = Number(creatorStakeFormatted) + Number(counterStakeFormatted);

  // Determine who should receive proof notification
  // If current user is creator, notify counter; if counter, notify creator
  const isActive = wager.status === Status.Pending || wager.status === Status.Countered;

  return (
    <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <a className="text-text-muted hover:text-primary transition-colors" href="/wagers">
            Wagers
          </a>
          <span className="text-text-subtle">/</span>
          <span className="text-foreground">{id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-end items-center">
                  <StatusBadge status={wager.status} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {wager.description}
                </h1>
                <div className="border-t border-border pt-4">
                  <h3 className="text-lg font-bold text-foreground mb-3">Wager Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-muted">Amount</p>
                      <p className="font-medium text-foreground">{creatorStakeFormatted} USDC</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Total Pot</p>
                      <p className="font-medium text-foreground">
                        {totalPot} USDC
                      </p>
                    </div>
                    <div>
                      <p className="text-text-muted">Creator</p>
                      <p className="font-medium text-foreground truncate">
                        {shortenAddress(wager.creator)}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-muted">Counter</p>
                      <p className="font-medium text-foreground truncate">
                        {wager.counter === "0x0000000000000000000000000000000000000000"
                          ? "Awaiting..."
                          : shortenAddress(wager.counter)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <WagerActions wager={wager} id={id} adminAddress={ADMIN_ADDRESS} />
          </div>

          {/* Sidebar - Action Log */}
          <WagerDetailSidebar
            wagerId={id}
            walletMapping={{
              creator: wager.creator,
              counter: wager.counter,
            }}
            isActive={isActive}
          />
        </div>
      </div>
    </main>
  );
}
