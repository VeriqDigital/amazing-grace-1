import type { StoreEvent } from "./cms/types";

export function lufkinDateTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const value = (key: string) => parts.find((part) => part.type === key)?.value;
  return { date: `${value("year")}-${value("month")}-${value("day")}`, time: `${value("hour")}:${value("minute")}` };
}
export function isCurrentEvent(event: StoreEvent, now = new Date()) {
  const { date, time } = lufkinDateTime(now);
  if (event.type === "announcement") return event.date <= date && (!event.endDate || event.endDate >= date);
  const lastDay = event.endDate || event.date;
  return lastDay > date || (lastDay === date && (!event.endTime || event.endTime >= time));
}
export function upcomingEvents(events: StoreEvent[], now = new Date(), featuredFirst = false) {
  return events.filter((event) => isCurrentEvent(event, now)).sort((a, b) =>
    (featuredFirst ? Number(Boolean(b.featured)) - Number(Boolean(a.featured)) : 0) || a.date.localeCompare(b.date) || a._id.localeCompare(b._id));
}
export function formatEventDate(event: StoreEvent) {
  const format = (date: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
  return `${format(event.date)}${event.endDate && event.endDate !== event.date ? ` – ${format(event.endDate)}` : ""}`;
}
export function formatEventTime(event: StoreEvent) {
  if (!event.startTime || event.type !== "event") return "";
  const format = (time: string) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(`2000-01-01T${time}:00Z`));
  return `${format(event.startTime)}${event.endTime ? ` – ${format(event.endTime)}` : ""} Central Time`;
}
export function safeExternalUrl(url?: string) {
  try { return url && new URL(url).protocol === "https:" ? url : undefined; } catch { return undefined; }
}
