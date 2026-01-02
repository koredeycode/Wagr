"use client";

import ActionLog from "@/components/ActionLog";
import UploadProofForm from "@/components/UploadProofForm";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";

interface WagerDetailSidebarProps {
  wagerId: string;
  walletMapping: {
    creator: string;
    counter: string;
  };
  isActive: boolean;
}

export default function WagerDetailSidebar({
  wagerId,
  walletMapping,
  isActive,
}: WagerDetailSidebarProps) {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  // Determine who should receive the notification when proof is uploaded
  const getCounterAddress = () => {
    if (!address) return walletMapping.counter;
    
    if (address.toLowerCase() === walletMapping.creator.toLowerCase()) {
      return walletMapping.counter;
    }
    return walletMapping.creator;
  };

  const handleProofUploadSuccess = () => {
    // Refresh proofs list
    queryClient.invalidateQueries({ queryKey: ["proofs", wagerId] });
    queryClient.invalidateQueries({ queryKey: ["events", wagerId] });
  };

  const isParticipant =
    address &&
    (address.toLowerCase() === walletMapping.creator.toLowerCase() ||
      address.toLowerCase() === walletMapping.counter.toLowerCase());

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="glass rounded-2xl p-6 sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
        <h2 className="text-xl font-bold text-foreground mb-4">Action Log</h2>
        
        <div className="flex-1 overflow-y-auto">
          <ActionLog wagerId={wagerId} walletMapping={walletMapping} />
        </div>

        {/* Upload Proof Form - only show for participants of active wagers */}
        {isActive && isParticipant && (
          <div className="mt-auto pt-4 border-t border-border">
            <UploadProofForm
              wagerId={wagerId}
              counterAddress={getCounterAddress()}
              onSuccess={handleProofUploadSuccess}
            />
          </div>
        )}
        
        {isActive && !isParticipant && address && (
          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-sm text-text-muted text-center">
              Only wager participants can upload proofs.
            </p>
          </div>
        )}
        
        {!address && (
          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-sm text-text-muted text-center">
              Connect your wallet to upload proofs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
