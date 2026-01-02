"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import shortenAddress from "@/lib/address";
import { useQuery } from "@tanstack/react-query";

interface Event {
  id: string;
  wagerId: string;
  type: string;
  createdAt: string;
}

interface Proof {
  id: string;
  wagerId: string;
  uploaderId: string;
  text: string | null;
  imageUrl: string | null;
  createdAt: string;
}

interface WalletMapping {
  creator: string;
  counter: string;
}

interface ActionLogProps {
  wagerId: string;
  walletMapping: WalletMapping;
}

function formatTimeAgo(date: Date | string) {
  const now = new Date();
  const then = new Date(date);
  const diff = (now.getTime() - then.getTime()) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const EVENT_CONFIG: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  WagerCreated: {
    icon: "add",
    color: "bg-primary",
    label: "created the wager",
  },
  WagerCountered: {
    icon: "swap_horiz",
    color: "bg-success",
    label: "countered the wager",
  },
  WagerResolved: {
    icon: "gavel",
    color: "bg-warning",
    label: "resolved the wager",
  },
  WagerCancelled: {
    icon: "cancel",
    color: "bg-danger",
    label: "cancelled the wager",
  },
};

export default function ActionLog({ wagerId, walletMapping }: ActionLogProps) {
  // Fetch events
  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["events", wagerId],
    queryFn: async () => {
      const res = await fetch(`/api/events?wagerId=${wagerId}`);
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  // Fetch proofs
  const { data: proofs = [], isLoading: proofsLoading } = useQuery<Proof[]>({
    queryKey: ["proofs", wagerId],
    queryFn: async () => {
      const res = await fetch(`/api/proofs?wagerId=${wagerId}`);
      if (!res.ok) throw new Error("Failed to fetch proofs");
      return res.json();
    },
  });

  const isLoading = eventsLoading || proofsLoading;

  // Combine and sort by date
  type LogItem =
    | { type: "event"; data: Event; timestamp: Date }
    | { type: "proof"; data: Proof; timestamp: Date };

  const logItems: LogItem[] = [
    ...events.map((e) => ({
      type: "event" as const,
      data: e,
      timestamp: new Date(e.createdAt),
    })),
    ...proofs.map((p) => ({
      type: "proof" as const,
      data: p,
      timestamp: new Date(p.createdAt),
    })),
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 items-start animate-pulse">
            <div className="flex-shrink-0 size-8 rounded-full bg-surface-elevated" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-elevated rounded w-3/4" />
              <div className="h-3 bg-surface-elevated rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logItems.length === 0) {
    return (
      <p className="text-sm text-text-muted text-center py-4">
        No activity yet
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {logItems.map((item, index) => {
        if (item.type === "event") {
          const config = EVENT_CONFIG[item.data.type] || {
            icon: "info",
            color: "bg-surface-elevated",
            label: item.data.type,
          };

          // Determine who triggered the event based on event type
          let actorAddress = walletMapping.creator;
          if (item.data.type === "WagerCountered") {
            actorAddress = walletMapping.counter;
          }

          return (
            <div key={`event-${item.data.id}`} className="flex gap-3 items-start">
              <div
                className={`flex-shrink-0 size-8 rounded-full ${config.color} flex items-center justify-center text-white`}
              >
                <span className="material-symbols-outlined text-lg">
                  {config.icon}
                </span>
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-bold">
                    {shortenAddress(actorAddress)}
                  </span>{" "}
                  {config.label}.
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {formatTimeAgo(item.timestamp)}
                </p>
              </div>
            </div>
          );
        }

        // Proof item
        const proof = item.data;
        return (
          <div key={`proof-${proof.id}`} className="flex gap-3 items-start">
            <div className="flex-shrink-0 size-8 rounded-full bg-info flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg">upload</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">
                Proof uploaded:
              </p>
              <div className="bg-surface-elevated rounded-lg p-3 mt-1">
                {proof.text && (
                  <p className="text-sm italic text-text-muted">
                    "{proof.text}"
                  </p>
                )}
                {proof.imageUrl && (
                  <Dialog>
                    <DialogTrigger>
                      <button className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
                        <span className="material-symbols-outlined text-lg">
                          image
                        </span>
                        View attached image
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="relative bg-surface rounded-2xl shadow-lg w-full max-w-2xl">
                        <img
                          alt="Proof"
                          className="rounded-2xl max-h-[80vh] w-auto"
                          src={proof.imageUrl}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <p className="text-xs text-text-muted mt-1">
                {formatTimeAgo(item.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
