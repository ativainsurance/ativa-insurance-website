import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import RCECalculator from "./RCECalculator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Home Replacement Cost Calculator | Ativa Insurance",
  description:
    "Free replacement cost estimator for homeowners in CT, FL, GA, MA, MD, NC, NJ, OH, PA, SC, and TN. Find out if you're underinsured in under 2 minutes.",
  alternates: { canonical: "https://ativainsurance.com/rce-calculator" },
  openGraph: {
    title: "Home Replacement Cost Calculator | Ativa Insurance",
    description:
      "Most homeowners are underinsured by 20–40%. Our free calculator shows you the real number in under 2 minutes.",
    url: "https://ativainsurance.com/rce-calculator",
    siteName: "Ativa Insurance",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Home Replacement Cost Calculator" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RCEPage() {
  return (
    <LanguageProvider>
      {/* Standalone page uses personal-mode header */}
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
        <Header mode="personal" />
        <main className="flex-1">
          <RCECalculator />
        </main>
        <Footer mode="personal" />
      </div>
    </LanguageProvider>
  );
}
