"use client";

import WagerCard from "@/components/WagerCard";
import shortenAddress from "@/lib/address";
import contract from "@/lib/wager";
import { Status, Wager } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

interface WagerWithId extends Wager {
  id: number;
}

function transformWagerData(
  data: readonly [
    `0x${string}`,
    `0x${string}`,
    `0x${string}`,
    bigint,
    bigint,
    bigint,
    string,
    number,
    number
  ],
  id: number
): WagerWithId {
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

function WagerCardSkeleton() {
  return (
    <div className="glass p-6 animate-pulse">
      <div className="h-5 bg-surface-elevated rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-surface-elevated rounded w-full mb-4"></div>
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-surface-elevated rounded w-16"></div>
          <div className="h-4 bg-surface-elevated rounded w-24"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-surface-elevated rounded w-16"></div>
          <div className="h-4 bg-surface-elevated rounded w-20"></div>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <div className="h-4 bg-surface-elevated rounded w-12"></div>
          <div className="h-6 bg-surface-elevated rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 9;

const Explore = () => {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Transform wagers data
  const allWagers = useMemo(() => {
    if (!wagersData) return [];

    return wagersData
      .map((result, index) => {
        if (result.status !== "success" || !result.result) return null;
        return transformWagerData(result.result as any, index);
      })
      .filter((w): w is WagerWithId => w !== null)
      .filter((w) => w.status === Status.Pending); // Only pending wagers
  }, [wagersData]);

  // Filter wagers based on user input
  const filteredWagers = useMemo(() => {
    let filtered = allWagers;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((w) =>
        w.description.toLowerCase().includes(query)
      );
    }

    // Amount filters
    if (minAmount) {
      const min = Number(minAmount);
      filtered = filtered.filter((w) => {
        const stake = Number(formatUnits(w.creatorStake, contract.decimals));
        return stake >= min;
      });
    }

    if (maxAmount) {
      const max = Number(maxAmount);
      filtered = filtered.filter((w) => {
        const stake = Number(formatUnits(w.creatorStake, contract.decimals));
        return stake <= max;
      });
    }

    // Open to everyone filter
    if (openOnly) {
      filtered = filtered.filter(
        (w) =>
          w.allowedCounter.toLowerCase() ===
          "0x0000000000000000000000000000000000000000"
      );
    }

    return filtered;
  }, [allWagers, searchQuery, minAmount, maxAmount, openOnly]);

  // Pagination
  const totalPages = Math.ceil(filteredWagers.length / ITEMS_PER_PAGE);
  const paginatedWagers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWagers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWagers, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, minAmount, maxAmount, openOnly]);

  const isLoading = isLoadingCount || isLoadingWagers;

  return (
    <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 px-4">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Explore Pending Wagers
          </h2>
          <p className="mt-3 text-lg text-text-muted">
            Browse and filter through uncountered wagers on the Base blockchain.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 px-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-md">
            <input
              className="form-input w-full rounded-lg"
              placeholder="Search wagers..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Amount filters */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-muted">
                Amount
              </label>
              <input
                className="form-input w-20 rounded-lg"
                placeholder="Min"
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
              <span className="text-text-muted">-</span>
              <input
                className="form-input w-20 rounded-lg"
                placeholder="Max"
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>

            {/* Open to everyone checkbox */}
            <div className="flex items-center">
              <input
                className="form-checkbox h-4 w-4"
                id="counter-available"
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
              />
              <label
                className="ml-2 text-sm font-medium text-text-muted"
                htmlFor="counter-available"
              >
                Open to everyone
              </label>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <div className="px-4 mb-4">
            <p className="text-sm text-text-muted">
              {filteredWagers.length} wager{filteredWagers.length !== 1 && "s"}{" "}
              found
            </p>
          </div>
        )}

        {/* Wager Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <WagerCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedWagers.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center mx-4">
            <p className="text-text-muted text-lg">
              {allWagers.length === 0
                ? "No pending wagers available."
                : "No wagers match your filters."}
            </p>
            {filteredWagers.length === 0 && allWagers.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setMinAmount("");
                  setMaxAmount("");
                  setOpenOnly(false);
                }}
                className="btn-secondary mt-4 px-6 py-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedWagers.map((wager) => {
              const stake = formatUnits(wager.creatorStake, contract.decimals);
              const isOpen =
                wager.allowedCounter.toLowerCase() ===
                "0x0000000000000000000000000000000000000000";

              return (
                <WagerCard
                  key={wager.id}
                  id={wager.id}
                  description={wager.description}
                  creator={shortenAddress(wager.creator)}
                  allowedCounter={
                    isOpen ? "Anyone" : shortenAddress(wager.allowedCounter)
                  }
                  stake={stake}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-text-muted hover:text-foreground hover:border-border-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    currentPage === pageNum
                      ? "btn-primary"
                      : "bg-surface border border-border text-text-muted hover:text-foreground"
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-text-muted hover:text-foreground hover:border-border-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Explore;
