"use client";

import erc20Abi from "@/IERC20.json";
import { ReactNode, useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

export function ApproveButton({
  tokenAddress,
  spender,
  amount,
  decimals,
  children,
}: {
  tokenAddress: `0x${string}`;
  spender: `0x${string}`;
  amount: number;
  decimals: number;
  children: ReactNode;
}) {
  const { address } = useAccount();
  const {
    writeContract,
    isPending,
    data: txHash,
    error,
    isSuccess,
  } = useWriteContract();

  const [needsApproval, setNeedsApproval] = useState(false);

  // 1. Read current allowance
  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: loadingAllowance,
  } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: address ? [address, spender] : undefined,
  });

  // 2. Compare allowance vs amount
  useEffect(() => {
    if (allowance !== undefined) {
      const required = BigInt(Math.floor(amount * 10 ** decimals));
      setNeedsApproval((allowance as bigint) < required);
    }
  }, [allowance, amount, decimals]);

  // 3. After approval success, refresh allowance
  useEffect(() => {
    if (isSuccess) {
      refetchAllowance();
    }
  }, [isSuccess, refetchAllowance]);

  const handleApprove = () => {
    try {
      writeContract({
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "approve",
        args: [spender, BigInt(Math.floor(amount * 10 ** decimals))],
      });
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  if (loadingAllowance) return <p>Checking allowance...</p>;
  if (needsApproval)
    return (
      <div className="pt-4">
        <button
          onClick={handleApprove}
          disabled={isPending}
          className="w-full flex items-center justify-center rounded-full bg-blue-600 text-white py-4 px-4 text-lg font-bold hover:bg-blue-700 transition-colors-"
        >
          {isPending ? "Approving..." : `Approve ${amount} USDC`}
        </button>

        {error && <p className="text-red-500">{error.message}</p>}
        {txHash && <p className="text-green-500">Tx Sent: {String(txHash)}</p>}
      </div>
    ); // auto-hide button when allowance is enough

  return <>{children}</>;
}
