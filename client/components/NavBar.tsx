"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutBtn from "./LogoutBtn";
import NavLink from "./NavLink";
import Notifications from "./Notifications";

const navItems = [
  { name: "Explore", href: "/explore" },
  { name: "My Wagers", href: "/wagers", exact: true },
  { name: "Create Wager", href: "/wagers/create" },
];

const NavBar = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Truncate address for display
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const fetchUserData = useCallback(async () => {
    try {
      const result = await authClient.getSession();

      if (!result.data?.user) {
        router.push("/sign-in");
        return;
      }
      
      setUserEmail(result.data.user.email || null);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      disconnect();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-between whitespace-nowrap border-b border-border px-6 md:px-10 py-4">
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer">
          <h1 className="text-xl font-bold text-foreground">Wagr</h1>
        </div>
      </Link>

      <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => {
            return <NavLink key={index} name={item.name} href={item.href} exact={item.exact} />;
          })}
        </nav>
        
        <Notifications />
        
        {/* Mobile menu button */}
        <button className="md:hidden flex items-center justify-center rounded-xl h-10 w-10 bg-surface-elevated text-foreground hover:bg-border transition-colors border border-border">
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-elevated border border-border hover:border-border-hover transition-all duration-200">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg text-primary">
                  account_balance_wallet
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{truncatedAddress}</p>
              </div>
              <span className="material-symbols-outlined text-text-muted text-lg">
                expand_more
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 p-2 rounded-xl bg-surface border border-border shadow-elevated"
            align="end"
            sideOffset={8}
          >
            {/* User Info */}
            <div className="px-3 py-2 mb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl text-primary">
                    person
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {userEmail || "User"}
                  </p>
                  <p className="text-xs text-text-muted font-mono">{truncatedAddress}</p>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-border" />

            {/* Copy Address */}
            <DropdownMenuItem
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated"
              onClick={copyAddress}
            >
              <span className="material-symbols-outlined text-lg text-text-muted">content_copy</span>
              <span className="text-sm text-foreground">Copy Address</span>
            </DropdownMenuItem>

            {/* View on Explorer */}
            <DropdownMenuItem
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated"
              asChild
            >
              <a
                href={`https://sepolia.basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-lg text-text-muted">open_in_new</span>
                <span className="text-sm text-foreground">View on Explorer</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            {/* Logout */}
            <DropdownMenuItem
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-danger-muted"
              onClick={handleLogout}
            >
              <span className="material-symbols-outlined text-lg text-danger">logout</span>
              <span className="text-sm text-danger">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile logout (fallback) */}
        <div className="md:hidden">
          <LogoutBtn />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
