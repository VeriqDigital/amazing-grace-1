import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { siteConfig, socialImage } from "@/config/site";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const bodyFont = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Amazing Grace Antiques | Antiques & Vintage Finds in Lufkin, TX",
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  category: "shopping",
  keywords: [
    "antiques Lufkin Texas",
    "vintage shop Lufkin",
    "collectibles Lufkin",
    "Amazing Grace Antiques",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Amazing Grace Antiques | Antiques & Vintage Finds in Lufkin, TX",
    description: siteConfig.description,
    siteName: siteConfig.shortName,
    locale: siteConfig.locale,
    type: "website",
    url: "/",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazing Grace Antiques | Antiques & Vintage Finds in Lufkin, TX",
    description: siteConfig.description,
    images: [socialImage.url],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  description: siteConfig.description,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  sameAs: siteConfig.socialLinks.map(({ href }) => href),
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.addressLine1,
    addressLocality: siteConfig.contact.city,
    addressRegion: siteConfig.contact.state,
    postalCode: siteConfig.contact.postalCode,
    addressCountry: "US",
  },
  openingHours: siteConfig.hours.flatMap(({ schema }) => (schema ? [schema] : [])),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <ScrollToTop />
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
