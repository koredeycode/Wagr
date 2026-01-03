"use client";

import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import { io } from "socket.io-client";
import { useAccount } from "wagmi";

export interface Notification {
  type:
    | "WagerCreated"
    | "WagerCountered"
    | "WagerResolved"
    | "WagerCancelled"
    | "ProofUploaded";
  message: string;
  wagerId: string;
  id: string;
  createdAt: Date;
  read: boolean;
}

interface Event {
  id: number;
  wagerId: string;
  type:
    | "WagerCreated"
    | "WagerCountered"
    | "WagerResolved"
    | "WagerCancelled"
    | "ProofUploaded";
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  events: Event[];
  fetchEvents: (wagerId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { address } = useAccount();
  const [selectedWagerId, setSelectedWagerId] = useState<string | null>(null);

  const [socket] = useState(() => io(process.env.NEXT_PUBLIC_BACKEND_URL));

  // Join socket room when address is available
  useEffect(() => {
    if (!address) return;
    socket.emit("join", address.toLowerCase());
  }, [address, socket]);

  // Listen for real-time notifications
  useEffect(() => {
    const handler = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]); // prepend new notif
      toast(data.message);
    };

    socket.on("notification", handler);
    return () => {
      socket.off("notification", handler);
    };
  }, [socket]);

  // Fetch notifications from DB on load
  const { data: dbNotifications, error: notifError } = useQuery({
    queryKey: ["notifications", address],
    queryFn: async (): Promise<Notification[]> => {
      console.log("[NotificationContext] Fetching notifications...");
      
      const response = await fetch(`/api/notifications`, {
        method: "GET",
      });
      
      console.log("[NotificationContext] Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[NotificationContext] Fetch failed:", response.status, errorText);
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("[NotificationContext] Fetched notifications:", data);
      return data;
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
  });

  // Log any query errors
  useEffect(() => {
    if (notifError) {
      console.error("[NotificationContext] Query error:", notifError);
    }
  }, [notifError]);

  // Keep state in sync with DB notifications
  useEffect(() => {
    if (dbNotifications) {
      setNotifications(dbNotifications);
    }
  }, [dbNotifications]);

  // Fetch wager events
  const { data: events } = useQuery({
    queryKey: ["logs", selectedWagerId],
    queryFn: async () => {
      const response = await fetch(`/api/events?wagerId=${selectedWagerId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch wager events");
      }
      return response.json();
    },
    enabled: !!selectedWagerId,
  });

  const fetchEvents = (wagerId: string) => setSelectedWagerId(wagerId);

  return (
    <NotificationContext.Provider
      value={{ notifications, events: events || [], fetchEvents }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotifications must be inside NotificationProvider");
  return context;
};
