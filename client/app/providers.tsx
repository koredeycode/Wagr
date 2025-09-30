"use client";

import { NotificationProvider } from "@/lib/NotificationContext";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "Wise Wager",
  projectId: "c88d8e2bf975518611a70fc18ec4b7f6",
  chains: [baseSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" showRecentTransactions={true}>
          <NotificationProvider>{props.children}</NotificationProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
