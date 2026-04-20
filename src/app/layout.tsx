import type { Metadata } from "next";
import "./globals.css";
import GoogleMapsScript from "@/components/GoogleMapsScript";

const BASE_URL = "https://ativainsurance.com";

export const metadata: Metadata = {
  title: {
    default: "Ativa Insurance | Best Insurance Quotes in Florida & East Coast",
    template: "%s | Ativa Insurance",
  },
  description:
    "Get free insurance quotes in minutes. Ativa Insurance shops 50+ top carriers for auto, home, flood, and business insurance. Bilingual agents. Same-day coverage.",
  keywords:
    "insurance quotes Florida, auto insurance, home insurance, bilingual insurance agent, independent insurance agency Florida, commercial insurance Florida",
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Ativa Insurance | Best Insurance Quotes in Florida & East Coast",
    description:
      "Get free insurance quotes in minutes. Ativa Insurance shops 50+ top carriers for auto, home, flood, and business insurance. Bilingual agents. Same-day coverage.",
    url: BASE_URL,
    siteName: "Ativa Insurance",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Ativa Insurance - Independent Insurance Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ativa Insurance | Best Insurance Quotes in Florida & East Coast",
    description: "Get free insurance quotes in minutes. Bilingual agents. 50+ carriers. Same-day coverage.",
    images: ["/images/og-image.jpg"],
  },
};

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "Ativa Insurance LLC",
  image: `${BASE_URL}/logos/Personal Logo.png`,
  url: BASE_URL,
  telephone: "+15619468261",
  email: "info@ativainsurance.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2412 Irwin St Ste 372",
    addressLocality: "Melbourne",
    addressRegion: "FL",
    postalCode: "32901",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.0836,
    longitude: -80.6081,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "74",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
        <GoogleMapsScript />
        {children}
      </body>
    </html>
  );
}
