export type NavItem = { label: string; href: string };

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Visit", href: "/#visit" },
  { label: "Events", href: "/#events" },
  { label: "Sell Your Antiques", href: "/sell" },
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
