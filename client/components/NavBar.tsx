"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useState } from "react";
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
  const [session, setSession] = useState(null);

  const fetchUserData = useCallback(async () => {
    // setLoading(true);
    // setError(null);

    try {
      const result = await authClient.getSession();

      if (!result.data?.user) {
        router.push("/sign-in");
        return;
      }

      // setUserInfo(result.data?.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // setError("Failed to load user profile. Please try refreshing the page.");
    } finally {
      // setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // useEffect(() => {
  //   const getSession = async () => {
  //     const {
  //       data,
  //       // isPending, //loading state
  //       error, //error object
  //       // refetch, //refetch the session
  //     } = await authClient.getSession();

  //     if (!result.data?.user) {
  //       router.push("/sign-in");
  //       return;
  //     }
  //     setSession(data);
  //   };
  //   getSession();
  // }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-between whitespace-nowrap border-b border-border px-6 md:px-10 py-4">
      <div className="flex items-center gap-3">
        <svg
          className="h-8 w-8 text-primary"
          fill="none"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
            fill="currentColor"
          ></path>
          <path
            clip-rule="evenodd"
            d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
            fill="currentColor"
            fill-rule="evenodd"
          ></path>
        </svg>
        <h1 className="text-xl font-bold">Wagr</h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => {
            return <NavLink key={index} name={item.name} href={item.href} />;
          })}
        </nav>
        {/* <div className="relative"> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex items-center justify-center rounded-full h-10 w-10 bg-surface-color text-text-color hover:bg-border-color transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                5
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="right-2 mr-50 w-80 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none"
            align="start"
          >
            <DropdownMenuLabel>
              <div className="">
                <p className="text-sm font-medium text-text-color">
                  Notifications
                </p>
              </div>
            </DropdownMenuLabel>
            <div className="py-1">
              <div className="border-t border-border-color"></div>
              <DropdownMenuGroup>
                <a
                  className="block px-4 py-3 text-sm text-text-color hover:bg-border-color"
                  href="#"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border-color">
                      <span className="material-symbols-outlined text-xl">
                        paid
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">Wager Countered</p>
                      <p className="text-xs text-secondary-text-color">
                        Your wager against Alex has been countered.
                      </p>
                      <p className="text-xs text-secondary-text-color mt-1">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                </a>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <a
                  className="block px-4 py-3 text-sm text-text-color hover:bg-border-color"
                  href="#"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border-color">
                      <span className="material-symbols-outlined text-xl">
                        done_all
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        Allowed Counter Invitation
                      </p>
                      <p className="text-xs text-secondary-text-color">
                        Your counter invitation to Chris has been accepted.
                      </p>
                      <p className="text-xs text-secondary-text-color mt-1">
                        1 day ago
                      </p>
                    </div>
                  </div>
                </a>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <a
                  className="block px-4 py-3 text-sm text-text-color hover:bg-border-color"
                  href="#"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border-color">
                      <span className="material-symbols-outlined text-xl">
                        flag
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">Conceding Notification</p>
                      <p className="text-xs text-secondary-text-color">
                        Sarah has conceded the wager.
                      </p>
                      <p className="text-xs text-secondary-text-color mt-1">
                        2 days ago
                      </p>
                    </div>
                  </div>
                </a>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <a
                  className="block px-4 py-3 text-sm text-text-color hover:bg-border-color"
                  href="#"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border-color">
                      <span className="material-symbols-outlined text-xl">
                        verified_user
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">Admin Resolution</p>
                      <p className="text-xs text-secondary-text-color">
                        An admin has resolved your wager with David.
                      </p>
                      <p className="text-xs text-secondary-text-color mt-1">
                        3 days ago
                      </p>
                    </div>
                  </div>
                </a>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <a
                  className="block px-4 py-3 text-sm text-text-color hover:bg-border-color"
                  href="#"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border-color">
                      <span className="material-symbols-outlined text-xl">
                        upload
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">Proof Upload</p>
                      <p className="text-xs text-secondary-text-color">
                        Proof has been uploaded for your wager against Emily.
                      </p>
                      <p className="text-xs text-secondary-text-color mt-1">
                        4 days ago
                      </p>
                    </div>
                  </div>
                </a>
              </DropdownMenuGroup>
              <div className="border-t border-border-color"></div>
              <DropdownMenuGroup>
                <a
                  className="block py-2 text-center text-sm font-medium text-primary hover:bg-border-color"
                  href="#"
                >
                  View all notifications
                </a>
              </DropdownMenuGroup>
            </div>
          </DropdownMenuContent>
        </DropdownMenu> */}
        {/* </div> */}
        <Notifications />
        <button className="md:hidden flex items-center justify-center rounded-full h-10 w-10 bg-surface-color text-text-color hover:bg-border-color transition-colors">
          <span className="material-symbols-outlined"> menu </span>
        </button>
        <div
          className="hidden md:block bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
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
