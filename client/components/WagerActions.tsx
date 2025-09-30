// app/wager/[id]/WagerActions.tsx
"use client";

import contract from "@/lib/wager";
import { Outcome, Status, Wager } from "@/types";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

function ActionButton({
  onClick,
  disabled,
  children,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 flex items-center justify-center rounded-lg h-12 px-6 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export default function WagerActions({
  wager,
  id,
  adminAddress,
}: {
  wager: Wager;
  id: string;
  adminAddress: string;
}) {
  const { address: userAddress } = useAccount();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const [error, setError] = useState<string | null>(null);

  const handleTx = async (fn: () => void) => {
    try {
      setError(null);
      fn();
    } catch (err: any) {
      setError(err.message ?? "Transaction failed");
    }
  };

  const handleConcede = () =>
    handleTx(() =>
      writeContract({
        abi: contract.abi,
        address: contract.address as `0x${string}`,
        functionName: "concedeWager",
        args: [Number(id)],
      })
    );

  const handleCancel = () =>
    handleTx(() =>
      writeContract({
        abi: contract.abi,
        address: contract.address as `0x${string}`,
        functionName: "cancelWager",
        args: [Number(id)],
      })
    );

  const handleCounter = () =>
    handleTx(() => {
      writeContract({
        abi: contract.abi,
        address: contract.address as `0x${string}`,
        functionName: "counterWager",
        args: [Number(id)],
      });
    });

  const handleResolve = (outcome: number) =>
    handleTx(() =>
      writeContract({
        abi: contract.abi,
        address: contract.address as `0x${string}`,
        functionName: "resolveWager",
        args: [Number(id), outcome],
      })
    );

  const isCreator =
    userAddress?.toLowerCase() === wager?.creator?.toLowerCase();
  const isCounter =
    userAddress?.toLowerCase() === wager?.counter?.toLowerCase();
  const isAdmin = userAddress?.toLowerCase() === adminAddress.toLowerCase();
  const userCanCounter =
    (userAddress?.toLowerCase() === wager?.allowedCounter.toLowerCase() ||
      wager?.allowedCounter.toLowerCase() ==
        "0x0000000000000000000000000000000000000000") &&
    userAddress?.toLowerCase() !== wager?.creator.toLowerCase();

  const isBusy = isPending || isConfirming;

  return (
    <div className="space-y-6">
      {wager.status === Status.Pending && userCanCounter && (
        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Counter Wager</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Counter */}
            <ActionButton
              onClick={handleCounter}
              disabled={wager.status !== Status.Pending || isBusy}
              className="bg-gray-100 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-100 hover:bg-secondary-300 dark:hover:bg-secondary-700"
            >
              {isBusy ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Counter"
              )}
            </ActionButton>
          </div>
        </div>
      )}

      {/* User Actions */}
      {(isCreator || isCounter) && (
        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Your Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Concede */}
            <ActionButton
              onClick={handleConcede}
              disabled={wager.status !== Status.Countered || isBusy}
              className="bg-gray-100 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-100 hover:bg-secondary-300 dark:hover:bg-secondary-700"
            >
              {isBusy ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Concede"
              )}
            </ActionButton>

            {/* Cancel (creator only) */}
            {isCreator && (
              <ActionButton
                onClick={handleCancel}
                disabled={wager.status !== Status.Pending || isBusy}
                className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-800"
              >
                {isBusy ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Cancel Wager"
                )}
              </ActionButton>
            )}
          </div>
        </div>
      )}

      {/* Admin Actions */}
      {isAdmin && wager.status === Status.Countered && (
        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionButton
              onClick={() => handleResolve(Outcome.CreatorWon)}
              disabled={isBusy}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isBusy ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Creator Win"
              )}
            </ActionButton>
            <ActionButton
              onClick={() => handleResolve(Outcome.Draw)}
              disabled={isBusy}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isBusy ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Declare Draw"
              )}
            </ActionButton>
            <ActionButton
              onClick={() => handleResolve(Outcome.CounterWon)}
              disabled={isBusy}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              {isBusy ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Counter Win"
              )}
            </ActionButton>
          </div>
        </div>
      )}
      {/* Resolved State */}
      {wager.status === Status.Resolved && (
        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-md text-gray-500">Wager already resolved.</p>
        </div>
      )}
      {/* Cancelled State */}
      {wager.status === Status.Cancelled && (
        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-md text-gray-500">Wager already cancelled.</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
