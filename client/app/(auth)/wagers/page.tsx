"use client";

import contract from "@/lib/wager";
import { Status, Wager } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

interface WagerWithId extends Wager {
  id: number;
}

function transformWagerData(data: readonly [
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  bigint,
  bigint,
  bigint,
  string,
  number,
  number
], id: number): WagerWithId {
  return {
    id,
    creator: data[0],
    counter: data[1],
    allowedCounter: data[2],
    creatorStake: data[3],
    counterStake: data[4],
    createdAt: data[5] * BigInt(1000),
    description: data[6],
    status: data[7],
    outcome: data[8],
  };
}

function StatusBadge({ status }: { status: number }) {
  const statusConfig = {
    [Status.Pending]: { label: "Pending", className: "status-pending" },
    [Status.Countered]: { label: "Countered", className: "status-countered" },
    [Status.Resolved]: { label: "Resolved", className: "status-won" },
    [Status.Cancelled]: { label: "Cancelled", className: "status-pending" },
  };
  
  const config = statusConfig[status as Status] || { label: "Unknown", className: "" };
  
  return (
    <span className={`${config.className} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold`}>
      {config.label}
    </span>
  );
}

function WagerCardSkeleton() {
  return (
    <div className="glass rounded-xl p-5 flex justify-between items-center animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-surface-elevated rounded w-3/4"></div>
        <div className="h-4 bg-surface-elevated rounded w-1/4"></div>
      </div>
      <div className="h-6 bg-surface-elevated rounded w-20"></div>
    </div>
  );
}

const Wagers = () => {
  const [tab, setTab] = useState<"active" | "past">("active");
  const { address } = useAccount();

  // Get total wager count
  const { data: nextId, isLoading: isLoadingCount } = useReadContract({
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    functionName: "nextId",
  });

  const wagerCount = nextId ? Number(nextId) : 0;

  // Create array of contract read configs for all wagers
  const wagerReadConfigs = Array.from({ length: wagerCount }, (_, i) => ({
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    functionName: "wagers" as const,
    args: [i],
  }));

  const { data: wagersData, isLoading: isLoadingWagers } = useReadContracts({
    contracts: wagerReadConfigs,
    query: {
      enabled: wagerCount > 0,
    },
  });

  // Transform and filter wagers for current user
  const [userWagers, setUserWagers] = useState<WagerWithId[]>([]);

  useEffect(() => {
    if (!wagersData || !address) return;

    const transformed = wagersData
      .map((result, index) => {
        if (result.status !== "success" || !result.result) return null;
        return transformWagerData(result.result as any, index);
      })
      .filter((w): w is WagerWithId => w !== null)
      .filter(
        (w) =>
          w.creator.toLowerCase() === address.toLowerCase() ||
          w.counter.toLowerCase() === address.toLowerCase()
      );

    setUserWagers(transformed);
  }, [wagersData, address]);

  const activeWagers = userWagers.filter(
    (w) => w.status === Status.Pending || w.status === Status.Countered
  );
  const pastWagers = userWagers.filter(
    (w) => w.status === Status.Resolved || w.status === Status.Cancelled
  );

  const displayedWagers = tab === "active" ? activeWagers : pastWagers;
  const isLoading = isLoadingCount || isLoadingWagers;

  const getOutcomeInfo = (wager: WagerWithId) => {
    if (!address) return null;
    
    const isCreator = wager.creator.toLowerCase() === address.toLowerCase();
    const creatorWon = wager.outcome === 1;
    const counterWon = wager.outcome === 2;
    const isDraw = wager.outcome === 3;
    
    const stake = formatUnits(wager.creatorStake, contract.decimals);
    
    if (isDraw) {
      return { type: "draw", label: "Draw", amount: `${stake} USDC` };
    }
    
    const userWon = (isCreator && creatorWon) || (!isCreator && counterWon);
    
    if (userWon) {
      return { type: "win", label: "Win", amount: `+${Number(stake) * 2} USDC` };
    } else {
      return { type: "loss", label: "Lost", amount: `-${stake} USDC` };
    }
  };

  return (
    <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-8">
      <div className="flex flex-col w-full max-w-[960px]">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 p-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            My Personal Wagers
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex px-4 gap-8">
            <button
              className={`text-sm font-bold pb-3 pt-4 border-b-2 transition-colors ${
                tab === "active"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-foreground"
              }`}
              onClick={() => setTab("active")}
            >
              Active ({activeWagers.length})
            </button>
            <button
              className={`text-sm font-bold pb-3 pt-4 border-b-2 transition-colors ${
                tab === "past"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-foreground"
              }`}
              onClick={() => setTab("past")}
            >
              Past ({pastWagers.length})
            </button>
          </div>
        </div>

        {/* Wagers List */}
        <section className="py-6 px-4">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {tab === "active" ? "Active Wagers" : "Past Wagers"}
          </h2>

          {!address ? (
            <div className="glass rounded-xl p-8 text-center">
              <p className="text-text-muted">
                Connect your wallet to view your wagers.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col gap-4">
              <WagerCardSkeleton />
              <WagerCardSkeleton />
              <WagerCardSkeleton />
            </div>
          ) : displayedWagers.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <p className="text-text-muted">
                {tab === "active"
                  ? "You have no active wagers."
                  : "You have no past wagers."}
              </p>
              {tab === "active" && (
                <Link
                  href="/wagers/create"
                  className="btn-primary inline-flex items-center mt-4 px-6 py-2"
                >
                  Create a Wager
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {displayedWagers.map((wager) => {
                const outcomeInfo = tab === "past" ? getOutcomeInfo(wager) : null;
                const stake = formatUnits(wager.creatorStake, contract.decimals);

                return (
                  <Link
                    key={wager.id}
                    href={`/wagers/${wager.id}`}
                    className={`glass rounded-xl p-5 card-hover flex justify-between items-center ${
                      tab === "past" ? "opacity-80 hover:opacity-100" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-foreground font-semibold line-clamp-1">
                        {wager.description}
                      </p>
                      {tab === "active" ? (
                        <p className="text-text-muted text-sm mt-1">
                          {stake} USDC
                        </p>
                      ) : (
                        outcomeInfo && (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                              outcomeInfo.type === "win"
                                ? "status-won"
                                : outcomeInfo.type === "loss"
                                ? "status-lost"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {outcomeInfo.label}
                          </span>
                        )
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {tab === "active" ? (
                        <StatusBadge status={wager.status} />
                      ) : (
                        outcomeInfo && (
                          <p
                            className={`text-sm font-bold ${
                              outcomeInfo.type === "win"
                                ? "text-success"
                                : outcomeInfo.type === "loss"
                                ? "text-danger"
                                : "text-text-muted"
                            }`}
                          >
                            {outcomeInfo.amount}
                          </p>
                        )
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Wagers;
