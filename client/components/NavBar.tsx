"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import LogoutBtn from "./LogoutBtn";
import NavLink from "./NavLink";
import Notifications from "./Notifications";

const navItems = [
  { name: "Explore", href: "/explore" },
  { name: "My Wagers", href: "/wagers" },
  { name: "Create Wager", href: "/wagers/create" },
];

const NavBar = () => {
  const router = useRouter();
  const { address } = useAccount();

  const fetchUserData = useCallback(async () => {
    try {
      const result = await authClient.getSession();

      if (!result.data?.user) {
        router.push("/sign-in");
        return;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-between whitespace-nowrap border-b border-border px-6 md:px-10 py-4">
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer">
          
          <h1 className="text-xl font-bold text-foreground">Wagr</h1>
        </div>
      </Link>

      <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => {
            return <NavLink key={index} name={item.name} href={item.href} />;
          })}
        </nav>
        <Notifications />
        <button className="md:hidden flex items-center justify-center rounded-full h-10 w-10 bg-surface text-foreground hover:bg-surface-elevated transition-colors border border-border">
          <span className="material-symbols-outlined"> menu </span>
        </button>
        <div
          className="hidden md:block bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-border hover:ring-primary transition-all"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDG9czS-h3bmNf00ReRyw3-xR-x6pDIQI8CYMJvu_T8QfD8i3LFsnCeSOWsDl7GGmp2ss3EyGopKjpvHkWZy64cCzmphIOPVCImCz7yBG4HOkt9DPNFmRdoBZR2XBb66Ii6WGNGkxqoSvXaUVou-KKYuTgBi3cI5SekcFt5tdw0TJ0nrMEjyifofrDx9lyxgdMRUwOsbD3DX2ALp6dC9RrCl2GFJxPRYJl91YOuaHJbULxjgG_2W7hu5i50eex8n-N63fxMuxY31Zts')",
          }}
        ></div>
        <LogoutBtn />
      </div>
    </header>
  );
};

export default NavBar;
