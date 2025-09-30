/// app/wager/[id]/WagerActions.tsx
"use client";

import contract from "@/lib/wager";
import { Wager } from "@/types";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import { ApproveButton } from "./ApproveButton";

export default function CounterWagerAction({
  wager,
  id,
}: {
  wager: Wager;
  id: string;
}) {
  const { writeContract } = useWriteContract();

  const { address: userAddress } = useAccount();
  const router = useRouter();

  const handleCounterWager = () => {
    writeContract({
      abi: contract.abi,
      address: contract.address as `0x${string}`,
      functionName: "counterWager",
      args: [Number(id as string)],
    });
    router.push(`/wagers/${id}`);
  };

  return (
    <div>
      <ApproveButton
        tokenAddress={contract.token}
        decimals={contract.decimals}
        spender={contract.address}
        amount={Number(wager?.creatorStake) / 10 ** contract.decimals}
      >
        <button
          className="flex items-center justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-bold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
          type="submit"
          onClick={handleCounterWager}
          disabled={
            wager.creator == userAddress ||
            (wager.allowedCounter != userAddress &&
              wager.allowedCounter !=
                "0x0000000000000000000000000000000000000000")
          }
        >
          Counter Wager
        </button>
      </ApproveButton>
    </div>
  );
}
