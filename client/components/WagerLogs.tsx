"use client";

import { useNotifications } from "@/lib/NotificationContext";
import { useEffect } from "react";

export default function WagerLogs({ wagerId }: { wagerId: string }) {
  const { events, fetchEvents } = useNotifications();

  useEffect(() => {
    fetchEvents(wagerId);
  }, [wagerId, fetchEvents]);

  return (
    <div>
      <h2>Wager #{wagerId} Logs</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.type.toUpperCase()} -{" "}
            {event.data ? JSON.stringify(event.data) : ""} at{" "}
            {event.timestamp.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
