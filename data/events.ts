export type StoreEvent = {
  id: string;
  dateLabel: string;
  title: string;
  description: string;
  status: "confirmed" | "sample";
};

export const storeEvents: StoreEvent[] = [
  {
    id: "sample-holiday-event",
    dateLabel: "DATE TBA",
    title: "Sample Holiday Event",
    description:
      "A seasonal afternoon of festive displays, new arrivals, and a little extra holiday cheer around the shop.",
    status: "sample",
  },
  {
    id: "sample-store-event",
    dateLabel: "DATE TBA",
    title: "Sample Store Event",
    description:
      "A family-friendly store visit with photo opportunities and plenty of vintage Christmas charm.",
    status: "sample",
  },
  {
    id: "sample-announcement",
    dateLabel: "COMING SOON",
    title: "Announcement Example",
    description:
      "A first look at recently added furniture, collectibles, vintage pieces, and artisan goods.",
    status: "sample",
  },
];
