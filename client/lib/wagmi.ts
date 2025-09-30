import { baseSepolia } from "wagmi/chains";

// const config = getDefaultConfig({
//   appName: "Wise Wager",
//   projectId: "c88d8e2bf975518611a70fc18ec4b7f6",
//   chains: [baseSepolia],
//   ssr: true, // If your dApp uses server side rendering (SSR)
// });

import { createConfig, http } from "wagmi";

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

export default config;
