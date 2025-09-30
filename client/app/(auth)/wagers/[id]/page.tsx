import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import WagerActions from "@/components/WagerActions";
import shortenAddress from "@/lib/address";
import contract from "@/lib/wager";
import wagmiConfig from "@/lib/wagmi";
import type { Wager } from "@/types";
import { readContract } from "@wagmi/core";
import { notFound } from "next/navigation";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ADMIN_ADDRESS = "0x6453DBB7148d30a517E2E16AE5b11B3b7d2cEC29";

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

  return (
    <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl space-y-8">
        <div className="flex items-center gap-2 text-sm font-medium">
          <a
            className="text-secondary-500 dark:text-secondary-400 hover:text-primary-500"
            href="#"
          >
            Wagers
          </a>
          <span className="text-secondary-400 dark:text-secondary-500">/</span>
          <span className="text-secondary-900 dark:text-secondary-100">
            {id}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-sm p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-end items-center">
                  <StatusBadge status={wager.status} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {wager.description}
                </h1>
                <div className="border-t border-secondary-200 dark:border-secondary-800 pt-4">
                  <h3 className="text-lg font-bold mb-2">Wager Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-500 dark:text-secondary-400">
                        Amount
                      </p>
                      <p className="font-medium">{wager.creatorStake}</p>
                    </div>
                    <div>
                      <p className="text-secondary-500 dark:text-secondary-400">
                        Total Pot
                      </p>
                      <p className="font-medium">
                        {wager.counterStake + wager.creatorStake}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-500 dark:text-secondary-400">
                        Creator
                      </p>
                      <p className="font-medium truncate">
                        {shortenAddress(wager.creator)}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-500 dark:text-secondary-400">
                        Counter
                      </p>
                      <p className="font-medium truncate">
                        {shortenAddress(wager.counter)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <WagerActions wager={wager} id={id} adminAddress={ADMIN_ADDRESS} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-sm p-6 sticky top-10 flex flex-col h-[calc(100vh-8rem)]">
              <h2 className="text-xl font-bold mb-4">Action Log</h2>
              <div className="flex-1 overflow-y-auto space-y-6">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">
                      add
                    </span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-bold">
                        {shortenAddress(wager.creator)}
                      </span>{" "}
                      created the wager.
                    </p>
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">
                      10:25 AM
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">
                      swap_horiz
                    </span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-bold">
                        {shortenAddress(wager.counter)}
                      </span>{" "}
                      countered the wager.
                    </p>
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">
                      10:31 AM
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">
                      upload
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">
                      {shortenAddress(wager.creator)} uploaded proof:
                    </p>
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-3 mt-1">
                      <p className="text-sm italic">
                        "Here's the proof of my winning ticket."
                      </p>

                      <Dialog>
                        <DialogTrigger>
                          <label className="mt-2 flex items-center gap-2 text-sm text-blue-500 hover:underline cursor-pointer">
                            <span className="material-symbols-outlined text-lg">
                              image
                            </span>
                            View attached image
                          </label>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="relative bg-white dark:bg-secondary-900 rounded-2xl shadow-lg w-full max-w-2xl">
                            <img
                              alt="Proof"
                              className="rounded-2xl max-h-[80vh] w-auto"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SreC80-hyCoSvV3a5NRMKcKugpCNSKKOMq4sQE2xLzcMjAKbqLC-Qg2Y_UKbMfjkIjGzXUNbQ041W147c8VJSA2cspqzmbhkRNMb7n-zQKd892btq-BFgKGrlViIH7K9DUcF75-9cIs6ivggnXnpI-ZkOYhjQWVAcPvEy48CWFXyDzekMrIYfbhyHl4CoMKTCo308udPFhghyz5X8vteTKYBdcZF7zN-3abG7UePhymUoHeze23xTOW3zS6dcZIG6bwdodsdOxQw"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                      Yesterday, 9:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">
                      upload
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">
                      {shortenAddress(wager.counter)} uploaded proof:
                    </p>
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-3 mt-1">
                      <p className="text-sm italic">
                        "Here's the proof of my winning ticket."
                      </p>

                      <Dialog>
                        <DialogTrigger>
                          <label className="mt-2 flex items-center gap-2 text-sm text-blue-500 hover:underline cursor-pointer">
                            <span className="material-symbols-outlined text-lg">
                              image
                            </span>
                            View attached image
                          </label>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="relative bg-white dark:bg-secondary-900 rounded-2xl shadow-lg w-full max-w-2xl">
                            <img
                              alt="Proof"
                              className="rounded-2xl max-h-[80vh] w-auto"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SreC80-hyCoSvV3a5NRMKcKugpCNSKKOMq4sQE2xLzcMjAKbqLC-Qg2Y_UKbMfjkIjGzXUNbQ041W147c8VJSA2cspqzmbhkRNMb7n-zQKd892btq-BFgKGrlViIH7K9DUcF75-9cIs6ivggnXnpI-ZkOYhjQWVAcPvEy48CWFXyDzekMrIYfbhyHl4CoMKTCo308udPFhghyz5X8vteTKYBdcZF7zN-3abG7UePhymUoHeze23xTOW3zS6dcZIG6bwdodsdOxQw"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                      Yesterday, 9:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">
                      gavel
                    </span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-bold">Admin</span> resolved the
                      wager:
                      <span className="font-bold text-blue-500">
                        Creator Win
                      </span>
                      .
                    </p>
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">
                      Today, 11:45 AM
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="mt-auto pt-4 border-t border-border">
                <div className="space-y-2">
                  <textarea
                    className="w-full bg-secondary-100 rounded-lg p-3 text-sm focus:ring-primary-500 resize-none"
                    placeholder="Add a descriptive message for your proof..."
                    rows={2}
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <button className="flex items-center gap-2 rounded-md h-9 px-3 bg-secondary-200 text-secondary-900 text-sm font-bold hover:bg-secondary-300 dark:hover:bg-secondary-700 transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        attach_file
                      </span>
                      <span>Upload Proof</span>
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-full text-white bg-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        send
                      </span>
                    </button>
                  </div>
                </div>
              </div> */}
              <div className="mt-auto pt-4 border-t border-secondary-200 dark:border-secondary-800">
                <div className="space-y-4">
                  <div className="bg-secondary-100 dark:bg-secondary-800/50 rounded-lg p-3 space-y-3">
                    <Textarea
                      placeholder="Add a descriptive message..."
                      rows={3}
                      className="w-full bg-white border-border rounded-md p-2 text-sm focus:ring-primary focus:border-primary resize-none"
                    />
                    <div className="flex items-center gap-3">
                      <Label htmlFor="picture">Proof</Label>
                      <Input id="picture" type="file" />
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      upload
                    </span>
                    <span>Upload Proof</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  // return (
  //   <main className="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
  //     <div className="w-full max-w-3xl">
  //       <div className="mb-8 flex items-center gap-2">
  //         <a
  //           className="text-sm font-medium text-text-secondary hover:text-white"
  //           href="#"
  //         >
  //           Wagers
  //         </a>
  //         <span className="text-sm text-text-secondary">/</span>
  //         <span className="text-sm font-medium text-white">#{id}</span>
  //       </div>

  //       <div className="rounded-xl bg-surface p-6 shadow-lg sm:p-8">
  //         <div className="mb-6 flex flex-row items-end justify-between">
  //           <div className="flex flex-col items-start gap-2 text-sm text-text-secondary">
  //             <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
  //               Wager Details
  //             </h2>
  //             <div className="flex items-end text-sm gap-2">
  //               <span className="material-symbols-outlined">schedule</span>
  //               <span>Created: {formatTimestamp(wager.createdAt)}</span>
  //             </div>
  //           </div>
  //           <StatusBadge status={wager.status} />
  //         </div>

  //         {/* Creator */}
  //         <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
  //           <div className="rounded-lg bg-background p-4 flex justify-around">
  //             <div className="flex items-center gap-4">
  //               <img
  //                 alt="Creator Avatar"
  //                 className="h-12 w-12 rounded-full"
  //                 src={`https://api.dicebear.com/7.x/identicon/svg?seed=${wager.creator}`}
  //               />
  //               <div>
  //                 <p className="text-sm font-medium text-text-secondary">
  //                   Creator
  //                 </p>
  //                 <p className="font-bold text-white">
  //                   {shortenAddress(wager.creator)}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Counter */}
  //           <div className="rounded-lg bg-background p-4 flex justify-around">
  //             <div className="flex items-center gap-4">
  //               <img
  //                 alt="Counter Avatar"
  //                 className="h-12 w-12 rounded-full"
  //                 src={`https://api.dicebear.com/7.x/identicon/svg?seed=${wager.counter}`}
  //               />
  //               <div>
  //                 <p className="text-sm font-medium text-text-secondary">
  //                   Counter
  //                 </p>
  //                 <p className="font-bold text-white">
  //                   {shortenAddress(wager.counter)}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Stake */}
  //         <div className="mb-8 border-y border-border py-6">
  //           <p className="mb-2 text-sm font-medium text-text-secondary">
  //             Stake
  //           </p>
  //           <p className="text-3xl font-bold text-primary">
  //             {Number(wager.creatorStake) / 10 ** contract.decimals} USDC
  //           </p>
  //         </div>

  //         {/* Description */}
  //         <div className="mb-8 border-b border-border">
  //           <p className="mb-2 text-sm font-medium text-text-secondary">
  //             Description
  //           </p>
  //           <p className="text-3xl font-bold text-primary">
  //             {wager.description}
  //           </p>
  //         </div>

  //         {/* Client-only actions */}
  //         <WagerActions wager={wager} id={id} adminAddress={ADMIN_ADDRESS} />
  //       </div>
  //     </div>
  //   </main>
  // );
}
