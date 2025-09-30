"use client";

import { ApproveButton } from "@/components/ApproveButton";
import contract from "@/lib/wager";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { decodeEventLog } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const CreateWager = () => {
  const [description, setDescription] = useState("");
  const [stake, setStake] = useState("");
  const [counter, setCounter] = useState("");

  const router = useRouter();

  const {
    writeContract: writeWagr,
    isPending: wagerIsPending,
    data: txHash,
    error,
  } = useWriteContract();

  // Wait for receipt once txHash exists
  const { data: receipt, isLoading: waitingReceipt } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: 1, // wait for 1 block confirmation
    });

  // Handle transaction error or success toast
  useEffect(() => {
    if (error) {
      toast.error("A write to contract error occurred", { duration: 5000 });
    }
  }, [error]);

  // Once receipt is available, decode event and redirect
  useEffect(() => {
    if (!receipt) return;

    try {
      const logs = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({
              abi: contract.abi,
              data: log.data,
              topics: log.topics,
            });
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const createdEvent = logs.find(
        (log) => log?.eventName === "WagerCreated"
      );

      console.log("CreatedEvent", createdEvent);

      // event WagerCreated(uint256 indexed id, address creator, uint256 stake, string description, address allowedCounter);

      if (createdEvent && createdEvent.args) {
        const wagerId = (createdEvent.args as { id: bigint }).id;
        toast.success(`Wager #${wagerId} created successfully`, {
          duration: 5000,
        });
        router.push(`/wagers/${wagerId}`);
      } else {
        toast.error("Could not find WagerCreated event in logs");
      }
    } catch (err) {
      console.error("Failed to decode logs:", err);
      toast.error("Failed to process wager creation");
    }
  }, [receipt, router]);

  const handleCreateWager = () => {
    try {
      writeWagr({
        abi: contract.abi,
        address: contract.address as `0x${string}`,
        functionName: "createWager",
        args: [
          description,
          BigInt(Number(stake) * 10 ** contract.decimals),
          counter ? counter : "0x0000000000000000000000000000000000000000",
        ],
      });
    } catch (err) {
      console.error("Transaction failed:", err);
      toast.error("An error occurred", { duration: 5000 });
    }
  };

  return (
    <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-center">
            Create a New Wager
          </h1>
          <p className="mt-3 text-center text-lg text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
            Set the terms, amounts, and participants for your new wager on Base.
          </p>
        </div>
        <div className="space-y-8 rounded-2xl bg-[var(--surface-light)] dark:bg-[var(--surface-dark)] p-8 border border-[var(--border-light)] dark:border-[var(--border-dark)]">
          <div className="space-y-6">
            <div>
              <label
                className="block text-lg font-medium"
                htmlFor="wager-title"
              >
                Wager Description
              </label>
              <p className="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] mb-2">
                What is the wager about?
              </p>
              <input
                className="form-input mt-1 block w-full rounded-xl border-[var(--border-light)] dark:border-[var(--border-dark)] bg-transparent focus:border-primary focus:ring-primary h-14 p-4"
                id="wager-description"
                placeholder="e.g., ETH to surpass $4k by EOY"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-lg font-medium"
                htmlFor="wager-amount"
              >
                Wager Stake
              </label>
              <p className="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] mb-2">
                How much USDC are you betting?
              </p>
              <div className="relative">
                <input
                  className="form-input block w-full rounded-xl border-[var(--border-light)] dark:border-[var(--border-dark)] bg-transparent focus:border-primary focus:ring-primary h-14 pl-4 pr-20"
                  id="wager-amount"
                  placeholder="100.00"
                  type="number"
                  onChange={(e) => setStake(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] font-medium">
                    USDC
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  className="block text-lg font-medium"
                  htmlFor="allowedCounter"
                >
                  Allowed Counter
                </label>
                <span className="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                  Optional
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] mb-2">
                Specify a wallet address that is allowed to counter this wager.
              </p>
              <input
                className="form-input mt-1 block w-full rounded-xl border-[var(--border-light)] dark:border-[var(--border-dark)] bg-transparent focus:border-primary focus:ring-primary h-14 p-4"
                id="allowedCounter"
                placeholder="0x..."
                type="text"
                onChange={(e) => setCounter(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <ApproveButton
              tokenAddress={contract.token}
              decimals={contract.decimals}
              spender={contract.address}
              amount={Number(stake)}
            >
              <button
                disabled={wagerIsPending || waitingReceipt}
                className="w-full flex items-center justify-center rounded-full bg-primary text-white py-4 px-4 text-lg font-bold hover:opacity-90 transition-opacity"
                onClick={handleCreateWager}
              >
                {wagerIsPending || waitingReceipt
                  ? "Submitting..."
                  : "Create Wager"}
              </button>
            </ApproveButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateWager;
