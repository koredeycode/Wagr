"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/lib/NotificationContext";
import Link from "next/link";

// Map notification type → icon + color theme
const ICON_MAP: Record<string, { icon: string; color: string; bg: string }> = {
  WagerCreated: { icon: "flag", color: "text-primary", bg: "bg-primary/10" },
  WagerCountered: { icon: "handshake", color: "text-success", bg: "bg-success-muted" },
  WagerResolved: { icon: "verified", color: "text-accent", bg: "bg-accent/10" },
  WagerCancelled: { icon: "cancel", color: "text-danger", bg: "bg-danger-muted" },
  ProofUploaded: { icon: "upload_file", color: "text-info", bg: "bg-info-muted" },
  // camelCase (from sync-db)
  wagerCreated: { icon: "flag", color: "text-primary", bg: "bg-primary/10" },
  wagerCountered: { icon: "handshake", color: "text-success", bg: "bg-success-muted" },
  wagerResolved: { icon: "verified", color: "text-accent", bg: "bg-accent/10" },
  wagerCancelled: { icon: "cancel", color: "text-danger", bg: "bg-danger-muted" },
  proofUploaded: { icon: "upload_file", color: "text-info", bg: "bg-info-muted" },
};

const DEFAULT_ICON = { icon: "notifications", color: "text-text-muted", bg: "bg-surface-elevated" };

// Format "time ago"
function formatTimeAgo(date: Date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function Notifications() {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center justify-center rounded-xl h-10 w-10 bg-surface-elevated border border-border text-text-muted hover:text-foreground hover:border-border-hover transition-all duration-200">
          <span className="material-symbols-outlined text-xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-lg shadow-primary/25">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 p-0 rounded-xl bg-surface border border-border shadow-elevated overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">notifications</span>
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[380px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-2xl text-text-subtle">
                  notifications_off
                </span>
              </div>
              <p className="text-sm text-text-muted">No notifications yet</p>
              <p className="text-xs text-text-subtle mt-1">
                We&apos;ll notify you when something happens
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notif, index) => {
                const { icon, color, bg } = ICON_MAP[notif.type] || DEFAULT_ICON;
                return (
                  <Link
                    key={notif.id}
                    href={`/wagers/${notif.wagerId}`}
                    className={`
                      flex items-start gap-3 px-4 py-3 transition-all duration-150 hover:bg-surface-elevated
                      ${index !== notifications.length - 1 ? "border-b border-border/50" : ""}
                      ${!notif.read ? "bg-primary/5" : ""}
                    `}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${bg} flex items-center justify-center mt-0.5`}>
                      <span className={`material-symbols-outlined text-lg ${color}`}>
                        {icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug line-clamp-2 ${!notif.read ? "text-foreground" : "text-text-muted"}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-subtle">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <span className="material-symbols-outlined text-text-subtle text-base mt-1">
                      chevron_right
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border">
            <Link
              href="/notifications"
              className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              View all
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}