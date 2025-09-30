"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // adjust import path
import { useNotifications } from "@/lib/NotificationContext";
import Link from "next/link";

// Map notification type → material-symbol icon + title
// const ICON_MAP: Record<Notification["type"], { icon: string; title: string }> =
const ICON_MAP = {
  WagerCreated: { icon: "flag", title: "Wager Created" },
  WagerCountered: { icon: "paid", title: "Wager Countered" },
  WagerResolved: { icon: "verified_user", title: "Wager Resolved" },
  WagerCancelled: { icon: "cancel", title: "Wager Cancelled" },
  ProofUploaded: { icon: "upload", title: "Proof Uploaded" },
};

// Format "time ago"
function formatTimeAgo(date: Date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Notifications() {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center justify-center rounded-full h-10 w-10 bg-surface-color text-text-color hover:bg-border-color transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="right-2 mr-50 w-80 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none"
        align="start"
      >
        <DropdownMenuLabel>
          <p className="text-sm font-medium text-text-color">Notifications</p>
        </DropdownMenuLabel>

        <div className="py-1">
          <div className="border-t border-border-color" />

          {notifications.length === 0 && (
            <p className="px-4 py-3 text-sm text-secondary-text-color">
              No notifications yet.
            </p>
          )}
          <div className="space-y-4">
            {notifications.map((notif) => {
              const { icon, title } = ICON_MAP[notif.type];
              return (
                <DropdownMenuGroup key={notif.id}>
                  <Link
                    href={`/wagers/${notif.wagerId}`}
                    className={`block px-4 py-3 text-sm text-text-color hover:bg-border ${
                      notif.read ? "bg-transparent" : "bg-primary/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border-color">
                        <span className="material-symbols-outlined text-xl">
                          {icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-xs text-secondary-text-color">
                          {notif.message}
                        </p>
                        <p className="text-xs text-secondary-text-color mt-1">
                          {formatTimeAgo(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuGroup>
              );
            })}
          </div>

          <div className="border-t border-border-color" />
          <DropdownMenuGroup>
            <a
              className="block py-2 text-center text-sm font-medium text-primary hover:bg-border-color"
              href="/notifications"
            >
              View all notifications
            </a>
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
