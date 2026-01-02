"use client";

import { useNotifications } from "@/lib/NotificationContext";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const ICON_MAP: Record<string, { icon: string; title: string }> = {
  WagerCreated: { icon: "flag", title: "Wager Created" },
  WagerCountered: { icon: "paid", title: "Wager Countered" },
  WagerResolved: { icon: "verified_user", title: "Wager Resolved" },
  WagerCancelled: { icon: "cancel", title: "Wager Cancelled" },
  ProofUploaded: { icon: "upload", title: "Proof Uploaded" },
};

function formatTimeAgo(date: Date | string) {
  const now = new Date();
  const then = new Date(date);
  const diff = (now.getTime() - then.getTime()) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const { notifications } = useNotifications();
  const [markingRead, setMarkingRead] = useState<Set<string>>(new Set());
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    if (markingRead.has(id)) return;
    
    setMarkingRead((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      
      if (!res.ok) throw new Error("Failed to mark as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    } finally {
      setMarkingRead((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleMarkAllRead = async () => {
    if (markingAllRead || unreadCount === 0) return;
    
    setMarkingAllRead(true);
    try {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      
      if (!res.ok) throw new Error("Failed to mark all as read");
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    } finally {
      setMarkingAllRead(false);
    }
  };

  return (
    <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-8">
      <div className="flex flex-col w-full max-w-[960px]">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 p-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-text-muted mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAllRead}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
            >
              {markingAllRead ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        {/* Notifications List */}
        <section className="py-6 px-4">
          {notifications.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-text-muted mb-4">
                notifications_off
              </span>
              <p className="text-text-muted text-lg">No notifications yet</p>
              <p className="text-text-subtle text-sm mt-2">
                When you create or participate in wagers, you'll see notifications here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((notif) => {
                const config = ICON_MAP[notif.type] || {
                  icon: "info",
                  title: notif.type,
                };
                const isMarking = markingRead.has(notif.id);

                return (
                  <Link
                    key={notif.id}
                    href={`/wagers/${notif.wagerId}`}
                    onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                    className={`glass rounded-xl p-5 card-hover flex items-start gap-4 ${
                      notif.read ? "opacity-70" : "border-l-4 border-primary"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 size-12 rounded-full flex items-center justify-center ${
                        notif.read
                          ? "bg-surface-elevated text-text-muted"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {config.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-foreground">
                          {config.title}
                        </p>
                        <span className="text-xs text-text-muted whitespace-nowrap">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      {!notif.read && (
                        <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          New
                        </span>
                      )}
                    </div>
                    {isMarking && (
                      <span className="material-symbols-outlined animate-spin text-primary">
                        progress_activity
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
