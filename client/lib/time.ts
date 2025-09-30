export default function formatTimestamp(ms: bigint): string {
  const date = new Date(Number(ms));

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Friday
    month: "short", // Aug
    day: "numeric", // 29
    hour: "numeric", // 9
    minute: "2-digit", // 36
    hour12: true, // AM/PM
  };

  return date.toLocaleString("en-US", options);
}
