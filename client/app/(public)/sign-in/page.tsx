"use client";
import { authClient } from "@/lib/auth-client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi"; // Assuming wagmi for wallet integration

export default function SignInPage() {
  const { address, chainId } = useAccount();

  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!address) return;

      const response = await fetch(`/api/user?address=${address}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();

      console.log(data);

      if (data.email) {
        setEmail(data.email);
        setIsRegistered(true);
      }
    };
    fetchUserEmail();
  }, [address]);

  const handleSignIn = async () => {
    if (!address) return;

    // Step 1: Get nonce
    const { data: nonceData } = await authClient.siwe.nonce({
      walletAddress: address,
      chainId,
    });
    if (!nonceData) return;

    // Step 2: Create SIWE message (manually or using a library like siwe)
    const message = `example.com wants you to sign in with your Ethereum account:\n${address}\n\nSign in with Ethereum to the app.\n\nURI: https://example.com\nVersion: 1\nChain ID: ${
      chainId || 1
    }\nNonce: ${nonceData.nonce}\nIssued At: ${new Date().toISOString()}`;

    // Step 3: Sign message
    const signature = await signMessageAsync({ message });

    // Step 4: Verify and sign in
    const { data: verifyData } = await authClient.siwe.verify({
      message,
      signature,
      walletAddress: address,
      chainId,
      email, // Required if anonymous: false
    });

    if (verifyData) {
      console.log("Signed in:", verifyData.user);
      // Redirect or update UI
      router.push("/explore");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-8">
            <span className="material-symbols-outlined text-6xl text-primary">
              login
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Login to Wagr</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Connect your wallet and enter your email to access your account.
          </p>
          <div className="space-y-4">
            {address ? (
              <>
                <p>{address}</p>
                <button
                  className="w-full flex items-center justify-center gap-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
                  onClick={() => disconnect()}
                >
                  <span className="material-symbols-outlined">
                    account_balance_wallet
                  </span>
                  Disconnect Wallet
                </button>
              </>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
                onClick={openConnectModal}
              >
                <span className="material-symbols-outlined">
                  account_balance_wallet
                </span>
                Connect Wallet
              </button>
            )}

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                email
              </span>
              <input
                className="w-full bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isRegistered}
              />
            </div>
            <button
              className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
              onClick={handleSignIn}
            >
              <span className="material-symbols-outlined">login</span>
              Login
            </button>
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-base">
                shield
              </span>
              <span>Your information is secure and private.</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-12">
            By logging in, you agree to Wagr's{" "}
            <Link className="underline hover:text-primary" href="/tos">
              Terms of Service
            </Link>{" "}
            and acknowledge our{" "}
            <Link className="underline hover:text-primary" href="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-gray-400 dark:text-gray-500 border-t border-border">
        Powered by the Base Blockchain
      </footer>
    </div>
  );
}
