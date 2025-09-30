import Link from "next/link";
import React from "react";

interface WagerCardProps {
  id: number;
  description: string;
  creator: string;
  allowedCounter: string;
  stake: string;
}

const WagerCard: React.FC<WagerCardProps> = ({
  id,
  description,
  creator,
  allowedCounter,
  stake,
}) => {
  return (
    <Link
      className="block rounded-lg border border-border bg-background p-6 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
      href={`/wagers/${id}`}
    >
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-text truncate">
          {description}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] flex-grow">
          {description}
        </p>
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              Creator:
            </span>
            <span className="text-xs font-mono text-text">{creator}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              Allowed Counter:
            </span>
            <span className="text-xs font-mono text-green-500">
              {allowedCounter}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">
              Stake:
            </span>
            <span className="text-lg font-bold text-primary">{stake} USDC</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WagerCard;
