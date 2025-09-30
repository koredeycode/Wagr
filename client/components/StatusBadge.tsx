"use client";

import { Status } from "@/types";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<
  Status,
  { label: string; className: string; icon: string }
> = {
  [Status.Pending]: {
    label: "Pending",
    className: "border-yellow-400 bg-yellow-400 text-white",
    icon: "hourglass_top",
  },
  [Status.Countered]: {
    label: "Countered",
    className: "border-blue-400 bg-blue-400 text-white",
    icon: "swap_horiz",
  },
  [Status.Resolved]: {
    label: "Resolved",
    className: "border-green-400 bg-green-400 text-white",
    icon: "check_circle",
  },
  [Status.Cancelled]: {
    label: "Cancelled",
    className: "border-red-400 bg-red-400 text-white",
    icon: "cancel",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status];

  return (
    <div
      className={`flex items-center gap-2 rounded-full py-1 px-3 text-xs font-semibold ${cfg.className}`}
    >
      <span className="material-symbols-outlined text-base">{cfg.icon}</span>
      <span>{cfg.label}</span>
    </div>
  );
}
