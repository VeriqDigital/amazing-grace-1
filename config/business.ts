const regularStoreHours = "10am–5pm";

// TODO(production): These demo hours are provisional; confirm them with the client before launch.
const businessHours = [
  { day: "Monday", hours: regularStoreHours, schema: "Mo 10:00-17:00" },
  { day: "Tuesday", hours: regularStoreHours, schema: "Tu 10:00-17:00" },
  { day: "Wednesday", hours: regularStoreHours, schema: "We 10:00-17:00" },
  { day: "Thursday", hours: regularStoreHours, schema: "Th 10:00-17:00" },
  { day: "Friday", hours: regularStoreHours, schema: "Fr 10:00-17:00" },
  { day: "Saturday", hours: regularStoreHours, schema: "Sa 10:00-17:00" },
  { day: "Sunday", hours: "Closed", schema: null },
] as const;

const businessHoursSummary = [
  { days: "Monday–Saturday", hours: regularStoreHours },
  { days: "Sunday", hours: "Closed" },
] as const;

export const businessConfig = {
  announcement: {
    message: "Antiques & vintage finds · Downtown Lufkin",
    shortMessage: "Downtown Lufkin",
    actionLabel: "Plan your visit",
    href: "/#visit",
  },
  contact: {
    phone: "(936) 634-7223",
    phoneHref: "tel:+19366347223",
    // TODO(production): Confirm this public inbox and the matching delivery recipient.
    email: "sherri@amazinggraceantiques.com",
    emailHref: "mailto:sherri@amazinggraceantiques.com",
    addressLine1: "205 E. Frank Ave, Suite A",
    city: "Lufkin",
    state: "TX",
    postalCode: "75901",
    address: "205 E. Frank Ave, Suite A, Lufkin, TX 75901",
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&destination=205+E+Frank+Ave+Suite+A%2C+Lufkin%2C+TX+75901",
  },
  socialLinks: [
    {
      label: "Facebook",
      // TODO(production): Confirm this is the client's preferred public Facebook page.
      href: "https://www.facebook.com/p/Amazing-Grace-Antiques-100057132022610/",
    },
  ],
  hours: businessHours,
  hoursSummary: businessHoursSummary,
} as const;
