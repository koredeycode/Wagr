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
      className="block glass p-6 card-hover group"
      href={`/wagers/${id}`}
    >
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {description}
        </h3>
        <p className="mt-2 text-sm text-text-muted flex-grow line-clamp-2">
          {description}
        </p>
        <div className="mt-4 border-t border-border pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-text-muted">
              Creator
            </span>
            <span className="text-xs font-mono text-foreground bg-surface-elevated px-2 py-1 rounded">
              {creator}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-text-muted">
              Counter
            </span>
            <span className="text-xs font-mono text-success">
              {allowedCounter}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm font-medium text-text-muted">
              Stake
            </span>
            <span className="text-xl font-bold text-primary">{stake} USDC</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WagerCard;
