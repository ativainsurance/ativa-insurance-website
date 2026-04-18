"use client";

import Script from "next/script";

export default function GoogleMapsScript() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    if (typeof window !== "undefined") {
      console.error("[Ativa] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Address autocomplete will not work.");
    }
    return null;
  }

  return (
    <Script
      id="google-maps"
      src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
      strategy="afterInteractive"
    />
  );
}
