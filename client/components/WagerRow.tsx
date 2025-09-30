// components/WagerRow.tsx
import Link from "next/link";
import React from "react";

type Status = "Pending" | "Countered" | "Resolved";

interface WagerRowProps {
  id: number;
  description: string;
  creator: string;
  allowedCounter: string;
  stake: string;
}

const statusStyles: Record<Status, string> = {
  Pending: "bg-amber-500/10 text-amber-400",
  Countered: "bg-green-500/10 text-green-400",
  Resolved: "bg-blue-500/10 text-blue-400",
};

const WagerRow: React.FC<WagerRowProps> = ({
  id,
  description,
  creator,
  allowedCounter,
  stake,
}) => {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text sm:pl-6">
        {description}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-text">
        {creator}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-text">
        {allowedCounter}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-text">{stake}</td>

      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Link
          className="text-primary hover:text-red-500"
          href={`/wagers/${id}`}
        >
          View
        </Link>
      </td>
    </tr>
  );
};

export default WagerRow;
