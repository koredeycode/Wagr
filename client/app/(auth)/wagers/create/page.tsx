"use client";

import { ApproveButton } from "@/components/ApproveButton";
import contract from "@/lib/wager";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { decodeEventLog } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

// Icons as inline SVGs for cleaner code
const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const MAX_DESCRIPTION_LENGTH = 200;

const CreateWager = () => {
  const [description, setDescription] = useState("");
  const [stake, setStake] = useState("");
  const [counter, setCounter] = useState("");
  const [touched, setTouched] = useState({ description: false, stake: false });

  const router = useRouter();

  const {
    writeContract: writeWagr,
    isPending: wagerIsPending,
    data: txHash,
    error,
  } = useWriteContract();

  const { data: receipt, isLoading: waitingReceipt } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: 1,
    });

  // Validation
  const validation = useMemo(() => {
    const errors: { description?: string; stake?: string; counter?: string } = {};
    
    if (!description.trim()) {
      errors.description = "Description is required";
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }
    
    if (!stake) {
      errors.stake = "Stake amount is required";
    } else if (Number(stake) <= 0) {
      errors.stake = "Stake must be greater than 0";
    } else if (Number(stake) < 1) {
      errors.stake = "Minimum stake is 1 USDC";
    }
    
    if (counter && !/^0x[a-fA-F0-9]{40}$/.test(counter)) {
      errors.counter = "Invalid wallet address format";
    }
    
    return errors;
  }, [description, stake, counter]);

  const isValid = Object.keys(validation).length === 0;

  useEffect(() => {
    if (error) {
      toast.error("Transaction failed. Please try again.", { duration: 5000 });
    }
  }, [error]);

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

      if (createdEvent && createdEvent.args) {
        const wagerId = (createdEvent.args as unknown as { id: bigint }).id;
        toast.success(`Wager #${wagerId} created successfully!`, {
          duration: 5000,
          icon: "🎉",
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
    if (!isValid) {
      setTouched({ description: true, stake: true });
      return;
    }
    
    try {
      writeWagr({
        abi: contract.abi,
        address: contract.address as `0x${string}`,
        functionName: "createWager",
        args: [
          description.trim(),
          BigInt(Number(stake) * 10 ** contract.decimals),
          counter ? counter : "0x0000000000000000000000000000000000000000",
        ],
      });
    } catch (err) {
      console.error("Transaction failed:", err);
      toast.error("An error occurred", { duration: 5000 });
    }
  };

  const isSubmitting = wagerIsPending || waitingReceipt;

  return (
    <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Breadcrumb */}
        <Link
          href="/wagers"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon />
          Back to Wagers
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create New Wager
          </h1>
          <p className="text-text-muted">
            Set terms and stake USDC to challenge someone on Base.
          </p>
        </div>

        {/* Form */}
        <div className="glass p-6 space-y-6">
          {/* Description Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground" htmlFor="description">
              <DocumentIcon />
              Wager Description
            </label>
            <textarea
              id="description"
              className={`form-input w-full min-h-[100px] resize-none ${
                touched.description && validation.description ? "border-danger" : ""
              }`}
              placeholder="e.g., ETH will surpass $4,000 by December 31st, 2026"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              maxLength={MAX_DESCRIPTION_LENGTH + 20}
            />
            <div className="flex justify-between items-center">
              {touched.description && validation.description ? (
                <p className="text-sm text-danger">{validation.description}</p>
              ) : (
                <p className="text-sm text-text-subtle">Be specific about the outcome and deadline</p>
              )}
              <span className={`text-sm ${description.length > MAX_DESCRIPTION_LENGTH ? "text-danger" : "text-text-subtle"}`}>
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>

          {/* Stake Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground" htmlFor="stake">
              <CurrencyIcon />
              Stake Amount
            </label>
            <div className="relative">
              <input
                id="stake"
                type="number"
                className={`form-input w-full pr-20 ${
                  touched.stake && validation.stake ? "border-danger" : ""
                }`}
                placeholder="100"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, stake: true }))}
                min="1"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="text-text-muted font-medium">USDC</span>
              </div>
            </div>
            {touched.stake && validation.stake ? (
              <p className="text-sm text-danger">{validation.stake}</p>
            ) : (
              <p className="text-sm text-text-subtle">The amount you&apos;re willing to bet</p>
            )}
          </div>

          {/* Counter Address Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground" htmlFor="counter">
                <WalletIcon />
                Allowed Counter
              </label>
              <span className="text-xs text-text-subtle bg-surface-elevated px-2 py-1 rounded-full">
                Optional
              </span>
            </div>
            <input
              id="counter"
              type="text"
              className={`form-input w-full font-mono text-sm ${
                validation.counter ? "border-danger" : ""
              }`}
              placeholder="0x..."
              value={counter}
              onChange={(e) => setCounter(e.target.value)}
            />
            {validation.counter ? (
              <p className="text-sm text-danger">{validation.counter}</p>
            ) : (
              <p className="text-sm text-text-subtle">
                Leave empty to allow anyone to counter this wager
              </p>
            )}
          </div>
        </div>

        {/* Preview Card */}
        {(description.trim() || stake) && (
          <div className="glass p-6 space-y-4 border-l-4 border-l-primary">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
              Wager Preview
            </h3>
            <div className="space-y-3">
              <p className="text-foreground font-medium">
                {description.trim() || <span className="text-text-subtle italic">No description yet</span>}
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-text-muted">Your stake: </span>
                  <span className="text-foreground font-semibold">
                    {stake ? `${stake} USDC` : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Total pot: </span>
                  <span className="text-success font-semibold">
                    {stake ? `${Number(stake) * 2} USDC` : "—"}
                  </span>
                </div>
              </div>
              {counter && (
                <div className="text-sm">
                  <span className="text-text-muted">Allowed counter: </span>
                  <span className="text-foreground font-mono text-xs">{counter}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <ApproveButton
          tokenAddress={contract.token}
          decimals={contract.decimals}
          spender={contract.address}
          amount={Number(stake) || 0}
        >
          <button
            disabled={isSubmitting || !isValid}
            className={`w-full flex items-center justify-center gap-2 btn-primary py-4 px-6 text-lg font-bold ${
              !isValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleCreateWager}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                {wagerIsPending ? "Confirm in Wallet..." : "Processing..."}
              </>
            ) : (
              <>
                <CheckIcon />
                Create Wager
              </>
            )}
          </button>
        </ApproveButton>

        {/* Info Footer */}
        <p className="text-center text-sm text-text-subtle">
          Creating a wager requires approval and a transaction on Base network.
        </p>
      </div>
    </main>
  );
};

export default CreateWager;
