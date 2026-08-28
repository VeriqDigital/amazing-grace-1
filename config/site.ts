const regularStoreHours = "10am–5pm";

export const businessHours = [
  { day: "Monday", hours: regularStoreHours, schema: "Mo 10:00-17:00" },
  { day: "Tuesday", hours: regularStoreHours, schema: "Tu 10:00-17:00" },
  { day: "Wednesday", hours: regularStoreHours, schema: "We 10:00-17:00" },
  { day: "Thursday", hours: regularStoreHours, schema: "Th 10:00-17:00" },
  { day: "Friday", hours: regularStoreHours, schema: "Fr 10:00-17:00" },
  { day: "Saturday", hours: regularStoreHours, schema: "Sa 10:00-17:00" },
  { day: "Sunday", hours: "Closed", schema: null },
] as const;

export const businessHoursSummary = [
  { days: "Monday–Saturday", hours: regularStoreHours },
  { days: "Sunday", hours: "Closed" },
] as const;

export const socialImage = {
  url: "/opengraph-image.jpg",
  width: 1440,
  height: 1080,
  alt: "Amazing Grace Antiques in Lufkin, Texas",
} as const;

export const siteConfig = {
  name: "Amazing Grace Antiques",
  shortName: "Amazing Grace Antiques",
  description:
    "Explore antiques, collectibles, jewelry, home décor, vintage clothing, artisan pieces, and one-of-a-kind finds in downtown Lufkin, Texas.",
  locale: "en_US",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amazinggraceantiques.com").replace(/\/+$/, ""),
  announcement: {
    message: "Antiques & vintage finds · Downtown Lufkin",
    shortMessage: "Downtown Lufkin",
    actionLabel: "Plan your visit",
    href: "/#visit",
  },
  contact: {
    phone: "(936) 634-7223",
    phoneHref: "tel:+19366347223",
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
      href: "https://www.facebook.com/p/Amazing-Grace-Antiques-100057132022610/",
    },
  ],
  hours: businessHours,
  hoursSummary: businessHoursSummary,
} as const;

export type NavItem = { label: string; href: string };

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Visit", href: "/#visit" },
  { label: "Events", href: "/#events" },
  { label: "Sell Your Antiques", href: "/#sell" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks: NavItem[] = [
  { label: "Our Story", href: "/#about" },
  { label: "Around the Shop", href: "/#shop" },
  { label: "Happenings", href: "/#events" },
  { label: "Sell an Antique", href: "/sell" },
  { label: "Visit the Store", href: "/#visit" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta = {
  label: "Visit the Shop",
  href: "/#visit",
} as const;
