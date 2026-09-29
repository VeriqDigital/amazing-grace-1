import { test } from "node:test";
import assert from "node:assert/strict";
import { formatEventTime, isCurrentEvent, lufkinDateTime, safeExternalUrl, upcomingEvents } from "../lib/events";
import type { StoreEvent } from "../lib/cms/types";

const event = (values: Partial<StoreEvent> = {}): StoreEvent => ({ _id: "event", _updatedAt: "2026-09-28T12:00:00Z", title: "Test event", slug: "test-event", type: "event", shortDescription: "Test description", date: "2026-09-28", endDate: null, startTime: null, endTime: null, featured: null, ...values });
test("dates use Central Time at midnight and across daylight saving seasons", () => {
  assert.deepEqual(lufkinDateTime(new Date("2026-09-29T04:30:00Z")), { date: "2026-09-28", time: "23:30" });
  assert.deepEqual(lufkinDateTime(new Date("2026-01-02T05:30:00Z")), { date: "2026-01-01", time: "23:30" });
});
test("past and ended events disappear, including featured ones; multi-day events remain", () => {
  const now = new Date("2026-09-28T20:00:00Z");
  assert.equal(isCurrentEvent(event({ date: "2026-09-27", featured: true }), now), false);
  assert.equal(isCurrentEvent(event({ endTime: "14:00" }), now), false);
  assert.equal(isCurrentEvent(event({ date: "2026-09-27", endDate: "2026-09-29" }), now), true);
  assert.equal(isCurrentEvent(event(), now), true);
  const entries = upcomingEvents([event({ _id: "old", date: "2026-09-27", featured: true }), event({ _id: "today" }), event({ _id: "featured", date: "2026-10-01", featured: true })], now, true);
  assert.deepEqual(entries.map((entry) => entry._id), ["featured", "today"]);
});
test("announcements respect start and expiry; future announcements are not called current", () => {
  const now = new Date("2026-09-28T20:00:00Z");
  assert.equal(isCurrentEvent(event({ type: "announcement", date: "2026-10-01" }), now), false);
  assert.equal(isCurrentEvent(event({ type: "announcement", date: "2026-09-01", endDate: "2026-09-27" }), now), false);
  assert.equal(isCurrentEvent(event({ type: "announcement", date: "2026-09-01" }), now), true);
  assert.equal(formatEventTime(event({ startTime: "14:00", endTime: "16:30" })), "2:00 PM – 4:30 PM Central Time");
  assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
  assert.equal(safeExternalUrl("https://example.com/event"), "https://example.com/event");
});
