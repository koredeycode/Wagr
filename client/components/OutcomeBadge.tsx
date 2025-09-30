"use client";

import { Outcome } from "@/types";

interface OutcomeBadgeProps {
  outcome: Outcome;
  isCreator: boolean; // true if this badge is for the creator’s address, false if for counter
}

export function OutcomeBadge({ outcome, isCreator }: OutcomeBadgeProps) {
  let label = "—";
  let className = "bg-gray-800 text-gray-400";
  let icon = "help";

  if (outcome === Outcome.None) {
    label = "Pending";
    className = "bg-gray-800 text-gray-400";
    icon = "hourglass_top";
  } else if (outcome === Outcome.Draw) {
    label = "Draw";
    className = "bg-purple-900/30 text-purple-400";
    icon = "sports_score";
  } else if (outcome === Outcome.CreatorWon) {
    if (isCreator) {
      label = "Won";
      className = "bg-green-900/30 text-green-400";
      icon = "military_tech";
    } else {
      label = "Lost";
      className = "bg-red-900/30 text-red-400";
      icon = "do_not_disturb_on";
    }
  } else if (outcome === Outcome.CounterWon) {
    if (!isCreator) {
      label = "Won";
      className = "bg-green-900/30 text-green-400";
      icon = "military_tech";
    } else {
      label = "Lost";
      className = "bg-red-900/30 text-red-400";
      icon = "do_not_disturb_on";
    }
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-full py-1 px-3 text-xs font-semibold ${className}`}
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
