export const businessHours = [
  { day: "Monday", hours: "10am–5pm", schema: "Mo 10:00-17:00" },
  { day: "Tuesday", hours: "10am–5pm", schema: "Tu 10:00-17:00" },
  { day: "Wednesday", hours: "10am–5pm", schema: "We 10:00-17:00" },
  { day: "Thursday", hours: "10am–5pm", schema: "Th 10:00-17:00" },
  { day: "Friday", hours: "10am–5pm", schema: "Fr 10:00-17:00" },
  { day: "Saturday", hours: "10am–5pm", schema: "Sa 10:00-17:00" },
  { day: "Sunday", hours: "Closed", schema: null },
] as const;

export const siteConfig = {
  name: "Amazing Grace Antiques",
  shortName: "Amazing Grace Antiques",
  description:
    "Explore antiques, collectibles, jewelry, home décor, vintage clothing, artisan pieces, and one-of-a-kind finds in downtown Lufkin, Texas.",
  locale: "en_US",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amazinggraceantiques.com",
  announcement: {
    message: "Open Monday–Saturday, 10am–5pm · Downtown Lufkin",
    actionLabel: "Plan your visit",
    href: "/#visit",
  },
  contact: {
    phone: "(936) 634-7223",
    phoneHref: "tel:+19366347223",
    email: "sherri@amazinggraceantiques.com",
    emailHref: "mailto:sherri@amazinggraceantiques.com",
    addressLine1: "205 E. Frank Ave., Suite A",
    city: "Lufkin",
    state: "TX",
    postalCode: "75901",
    address: "205 E. Frank Ave., Suite A, Lufkin, TX 75901",
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
  { label: "Sell an Antique", href: "/#sell" },
  { label: "Visit the Store", href: "/#visit" },
];

export const primaryCta = {
  label: "Visit the Shop",
  href: "/#visit",
} as const;
