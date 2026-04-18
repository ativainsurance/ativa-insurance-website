import type { Metadata } from "next";
import FAQClient from "./FAQClient";
import { FAQ_DATA } from "@/data/faqData";

export const metadata: Metadata = {
  title: "Insurance FAQ | Ativa Insurance",
  description:
    "Common questions about insurance in Florida. Learn about coverage options, quotes, and working with an independent insurance agent. Licensed in CT, FL, GA, MA, MD, NC, NJ, OH, PA, SC, TN.",
  keywords: [
    "insurance FAQ",
    "insurance questions Florida",
    "auto insurance Florida",
    "home insurance Florida",
    "renters insurance",
    "commercial insurance",
    "flood insurance",
    "independent insurance agent Melbourne FL",
  ],
  alternates: { canonical: "https://ativainsurance.com/faq" },
  openGraph: {
    title: "Insurance FAQ | Ativa Insurance",
    description:
      "Common questions about insurance in Florida. Learn about coverage options, quotes, and working with an independent insurance agent.",
    url: "https://ativainsurance.com/faq",
    siteName: "Ativa Insurance",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Insurance FAQ - Ativa Insurance" }],
  },
  twitter: { card: "summary_large_image" },
};

// Build JSON-LD FAQPage schema from English data
function buildFAQSchema() {
  const sections = FAQ_DATA["en"];
  const mainEntity = sections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export default function FAQPage() {
  const schema = buildFAQSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <FAQClient />
    </>
  );
}
