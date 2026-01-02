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
                      <p className="font-medium text-foreground">{wager.creatorStake.toString()}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Total Pot</p>
                      <p className="font-medium text-foreground">
                        {(wager.counterStake + wager.creatorStake).toString()}
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
                        {shortenAddress(wager.counter)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <WagerActions wager={wager} id={id} adminAddress={ADMIN_ADDRESS} />
          </div>

          {/* Sidebar - Action Log */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass rounded-2xl p-6 sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
              <h2 className="text-xl font-bold text-foreground mb-4">Action Log</h2>
              <div className="flex-1 overflow-y-auto space-y-6">
                {/* Created */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">add</span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-bold">{shortenAddress(wager.creator)}</span>{" "}
                      created the wager.
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">10:25 AM</p>
                  </div>
                </div>

                {/* Countered */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-success flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">swap_horiz</span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-bold">{shortenAddress(wager.counter)}</span>{" "}
                      countered the wager.
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">10:31 AM</p>
                  </div>
                </div>

                {/* Proof Upload 1 */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-info flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">upload</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {shortenAddress(wager.creator)} uploaded proof:
                    </p>
                    <div className="bg-surface-elevated rounded-lg p-3 mt-1">
                      <p className="text-sm italic text-text-muted">
                        "Here's the proof of my winning ticket."
                      </p>
                      <Dialog>
                        <DialogTrigger>
                          <label className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
                            <span className="material-symbols-outlined text-lg">image</span>
                            View attached image
                          </label>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="relative bg-surface rounded-2xl shadow-lg w-full max-w-2xl">
                            <img
                              alt="Proof"
                              className="rounded-2xl max-h-[80vh] w-auto"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SreC80-hyCoSvV3a5NRMKcKugpCNSKKOMq4sQE2xLzcMjAKbqLC-Qg2Y_UKbMfjkIjGzXUNbQ041W147c8VJSA2cspqzmbhkRNMb7n-zQKd892btq-BFgKGrlViIH7K9DUcF75-9cIs6ivggnXnpI-ZkOYhjQWVAcPvEy48CWFXyDzekMrIYfbhyHl4CoMKTCo308udPFhghyz5X8vteTKYBdcZF7zN-3abG7UePhymUoHeze23xTOW3zS6dcZIG6bwdodsdOxQw"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Yesterday, 9:00 PM</p>
                  </div>
                </div>

                {/* Proof Upload 2 */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-info flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">upload</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {shortenAddress(wager.counter)} uploaded proof:
                    </p>
                    <div className="bg-surface-elevated rounded-lg p-3 mt-1">
                      <p className="text-sm italic text-text-muted">
                        "Here's the proof of my winning ticket."
                      </p>
                      <Dialog>
                        <DialogTrigger>
                          <label className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
                            <span className="material-symbols-outlined text-lg">image</span>
                            View attached image
                          </label>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="relative bg-surface rounded-2xl shadow-lg w-full max-w-2xl">
                            <img
                              alt="Proof"
                              className="rounded-2xl max-h-[80vh] w-auto"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SreC80-hyCoSvV3a5NRMKcKugpCNSKKOMq4sQE2xLzcMjAKbqLC-Qg2Y_UKbMfjkIjGzXUNbQ041W147c8VJSA2cspqzmbhkRNMb7n-zQKd892btq-BFgKGrlViIH7K9DUcF75-9cIs6ivggnXnpI-ZkOYhjQWVAcPvEy48CWFXyDzekMrIYfbhyHl4CoMKTCo308udPFhghyz5X8vteTKYBdcZF7zN-3abG7UePhymUoHeze23xTOW3zS6dcZIG6bwdodsdOxQw"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Yesterday, 9:00 PM</p>
                  </div>
                </div>

                {/* Admin Resolution */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 size-8 rounded-full bg-warning flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-lg">gavel</span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-bold">Admin</span> resolved the wager:{" "}
                      <span className="font-bold text-primary">Creator Win</span>.
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">Today, 11:45 AM</p>
                  </div>
                </div>
              </div>

              {/* Upload Proof Form */}
              <div className="mt-auto pt-4 border-t border-border">
                <div className="space-y-4">
                  <div className="bg-surface-elevated rounded-lg p-3 space-y-3">
                    <Textarea
                      placeholder="Add a descriptive message..."
                      rows={3}
                      className="w-full bg-surface border-border rounded-md p-2 text-sm text-foreground placeholder:text-text-subtle focus:ring-primary focus:border-primary resize-none"
                    />
                    <div className="flex items-center gap-3">
                      <Label htmlFor="picture" className="text-foreground">Proof</Label>
                      <Input id="picture" type="file" className="text-foreground" />
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors">
                    <span className="material-symbols-outlined text-xl">upload</span>
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
}
