"use client";
import { authClient } from "@/lib/auth-client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

type Step = 1 | 2 | 3;

export default function SignInPage() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  // Determine current step based on state
  const currentStep: Step = useMemo(() => {
    if (!address) return 1;
    if (!email || emailError) return 2;
    return 3;
  }, [address, email, emailError]);

  // Check if step is completed
  const isStepComplete = (step: Step) => {
    if (step === 1) return !!address;
    if (step === 2) return !!address && !!email && !emailError;
    return false;
  };

  // Validate email
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError(null);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
  };

  // Truncate address for display
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  // Copy address to clipboard
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!address) return;

      try {
        const response = await fetch(`/api/user?address=${address}`, {
          method: "GET",
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();

        if (data.email) {
          setEmail(data.email);
          setIsRegistered(true);
        }
      } catch {
        // User not found, that's okay
      }
    };
    fetchUserEmail();
  }, [address]);

  const handleSignIn = async () => {
    if (!address || !email) return;

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Get nonce
      const { data: nonceData } = await authClient.siwe.nonce({
        walletAddress: address,
        chainId,
      });
      if (!nonceData) {
        throw new Error("Failed to get nonce");
      }

      // Step 2: Create SIWE message
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
        email,
      });

      if (verifyData) {
        router.push("/explore");
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </div>

      <main className="relative flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Main Card */}
          <div className="glass p-8 md:p-10 shadow-elevated">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary">
                  handshake
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Welcome to Wagr
              </h1>
              <p className="text-text-muted">
                Connect your wallet to get started
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-10 px-4">
              {/* Step 1: Connect Wallet */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative
                    ${
                      isStepComplete(1)
                        ? "bg-success text-white shadow-lg shadow-success/25"
                        : currentStep === 1
                        ? "bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary/20"
                        : "bg-surface-elevated text-text-subtle border border-border"
                    }
                  `}
                >
                  {isStepComplete(1) ? (
                    <span className="material-symbols-outlined text-xl">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                  )}
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  isStepComplete(1) ? "text-success" : currentStep === 1 ? "text-primary" : "text-text-subtle"
                }`}>
                  Wallet
                </span>
              </div>

              {/* Connector 1-2 */}
              <div className="flex-1 mx-2 mb-6">
                <div className="h-1 rounded-full bg-surface-elevated overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isStepComplete(1) ? "w-full bg-success" : "w-0 bg-primary"
                    }`}
                  />
                </div>
              </div>

              {/* Step 2: Email */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                    ${
                      isStepComplete(2)
                        ? "bg-success text-white shadow-lg shadow-success/25"
                        : currentStep === 2
                        ? "bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary/20"
                        : "bg-surface-elevated text-text-subtle border border-border"
                    }
                  `}
                >
                  {isStepComplete(2) ? (
                    <span className="material-symbols-outlined text-xl">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-xl">mail</span>
                  )}
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  isStepComplete(2) ? "text-success" : currentStep === 2 ? "text-primary" : "text-text-subtle"
                }`}>
                  Email
                </span>
              </div>

              {/* Connector 2-3 */}
              <div className="flex-1 mx-2 mb-6">
                <div className="h-1 rounded-full bg-surface-elevated overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isStepComplete(2) ? "w-full bg-success" : "w-0 bg-primary"
                    }`}
                  />
                </div>
              </div>

              {/* Step 3: Sign */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                    ${
                      isStepComplete(3)
                        ? "bg-success text-white shadow-lg shadow-success/25"
                        : currentStep === 3
                        ? "bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary/20"
                        : "bg-surface-elevated text-text-subtle border border-border"
                    }
                  `}
                >
                  {isStepComplete(3) ? (
                    <span className="material-symbols-outlined text-xl">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-xl">key</span>
                  )}
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  isStepComplete(3) ? "text-success" : currentStep === 3 ? "text-primary" : "text-text-subtle"
                }`}>
                  Sign In
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-danger-muted border border-danger/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-danger">error</span>
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            {/* Step Content */}
            <div className="space-y-4">
              {/* Step 1: Wallet Connection */}
              {!address ? (
                <button
                  className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={openConnectModal}
                >
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  Connect Wallet
                </button>
              ) : (
                <>
                  {/* Connected Wallet Display */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-success">check_circle</span>
                      </div>
                      <div>
                        <p className="text-xs text-text-subtle">Connected</p>
                        <p className="font-mono text-sm text-foreground">{truncatedAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyAddress}
                        className="p-2 rounded-lg hover:bg-border transition-colors"
                        title="Copy address"
                      >
                        <span className="material-symbols-outlined text-text-muted text-lg">content_copy</span>
                      </button>
                      <button
                        onClick={() => disconnect()}
                        className="p-2 rounded-lg hover:bg-danger-muted transition-colors"
                        title="Disconnect"
                      >
                        <span className="material-symbols-outlined text-danger text-lg">logout</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Email Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                        email
                      </span>
                      <input
                        className={`
                          w-full bg-surface border rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-text-subtle transition-all duration-200
                          ${emailError 
                            ? "border-danger focus:ring-2 focus:ring-danger/20" 
                            : "border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          }
                        `}
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        onBlur={(e) => validateEmail(e.target.value)}
                        disabled={isRegistered || isLoading}
                      />
                      {email && !emailError && (
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-success">
                          check_circle
                        </span>
                      )}
                    </div>
                    {emailError && (
                      <p className="text-xs text-danger flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {emailError}
                      </p>
                    )}
                    {isRegistered && (
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Email associated with this wallet
                      </p>
                    )}
                  </div>

                  {/* Step 3: Sign In Button */}
                  <button
                    className={`
                      w-full flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-xl transition-all duration-200
                      ${
                        !email || emailError || isLoading
                          ? "bg-surface-elevated text-text-subtle cursor-not-allowed"
                          : "bg-primary hover:bg-primary-hover text-white hover:scale-[1.02] active:scale-[0.98]"
                      }
                    `}
                    onClick={handleSignIn}
                    disabled={!email || !!emailError || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">login</span>
                        Sign Message & Login
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Security Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-text-subtle">
              <span className="material-symbols-outlined text-base text-success">verified_user</span>
              <span>Secured by blockchain authentication</span>
            </div>
          </div>

          {/* Terms & Privacy */}
          <p className="text-center text-xs text-text-subtle mt-6 px-4">
            By signing in, you agree to Wagr&apos;s{" "}
            <Link className="underline hover:text-primary transition-colors" href="/tos">
              Terms of Service
            </Link>{" "}
            and acknowledge our{" "}
            <Link className="underline hover:text-primary transition-colors" href="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative text-center p-4 text-xs text-text-subtle border-t border-border">
        Powered by the Base Blockchain
      </footer>
    </div>
  );
}
