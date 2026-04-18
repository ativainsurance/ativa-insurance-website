"use client";

import { useState } from "react";
import type { Mode } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

// ─── Carrier definitions ─────────────────────────────────────────────────────
// Source of truth: CLAUDE.md carrier list
// file: exact filename in /public/carriers/ (may contain spaces / mixed case)

interface Carrier {
  name: string; // display name / alt text
  file: string; // actual filename on disk
}

const PERSONAL_CARRIERS: Carrier[] = [
  { name: "Geico",             file: "Geico.png" },
  { name: "Progressive",       file: "Progressive.png" },
  { name: "Bristol West",      file: "Bristol West.png" },
  { name: "Assurance America", file: "AssuranceAmerica.png" },
  { name: "Citizens",          file: "Citizens.png" },
  { name: "Cabrillo Coastal",  file: "Cabrillo Coastal.png" },
  { name: "Foremost",          file: "Foremost.png" },
  { name: "Green Shield",      file: "Green Shield.png" },
  { name: "RLI",               file: "RLI.png" },
  { name: "VacantExpress",     file: "VacantExpress.png" },
  { name: "Burns & Wilcox",    file: "Burns & Wilcox.png" },
  { name: "Wright Flood",      file: "Wright Flood.png" },
  { name: "Unique Insurance",  file: "Unique.png" },
  { name: "Tend",              file: "tend.png" },
  { name: "Sterling",          file: "sterling.png" },
  { name: "Rainwalk",          file: "RAINWALK.png" },
  { name: "Propeller",         file: "PROPELLER.png" },
  { name: "Kanguro",           file: "Kanguro.png" },
  { name: "ePremium",          file: "epremium.png" },
  { name: "Neptune",           file: "neptune.png" },
  { name: "Collectibles",      file: "COLLECTIBLES.png" },
  { name: "Ahoy",              file: "Ahoy.png" },
  { name: "AonEdge",           file: "AONEDGE.png" },
  { name: "Annex Risk",        file: "Annex Risk.png" },
];

const COMMERCIAL_CARRIERS: Carrier[] = [
  { name: "Geico",           file: "Geico.png" },
  { name: "Bristol West",    file: "Bristol West.png" },
  { name: "Forge",           file: "FORGE.png" },
  { name: "Hiscox",          file: "HISCOX.png" },
  { name: "RLI",             file: "RLI.png" },
  { name: "Normandy",        file: "NORMANDY.png" },
  { name: "Burns & Wilcox",  file: "Burns & Wilcox.png" },
  { name: "Great American",  file: "Great American.png" },
  { name: "Three",           file: "Three.png" },
  { name: "Berxi",           file: "BERXI.png" },
  { name: "First Insurance", file: "FIRST.png" },
  { name: "biBerk",          file: "Biberk.png" },
  { name: "AmTrust",         file: "AMTRUST.png" },
  { name: "Chubb",           file: "CHUBB.png" },
  { name: "Green Shield",    file: "Green Shield.png" },
  { name: "Next",            file: "NEXT.png" },
  { name: "Progressive",     file: "Progressive.png" },
  { name: "Attune",          file: "ATTUNE.png" },
  { name: "Blitz",           file: "BLITZ.png" },
  { name: "Cover Whale",     file: "COVER WHALE.png" },
  { name: "Propeller",       file: "PROPELLER.png" },
  { name: "BTIS",            file: "btis.png" },
];

// Encode spaces in filename for use as a URL path segment
function logoSrc(file: string): string {
  return `/carriers/${file.replace(/ /g, "%20")}`;
}

// ─── Single carrier logo item ─────────────────────────────────────────────────

function CarrierItem({
  carrier,
  isPersonal,
}: {
  carrier: Carrier;
  isPersonal: boolean;
}) {
  const [failed, setFailed]   = useState(false);
  const [hovered, setHovered] = useState(false);

  // Filter: greyscale + dimmed by default, full color on hover
  const imgFilter = hovered
    ? "grayscale(0%) opacity(1)"
    : "grayscale(100%) opacity(0.55)";

  if (failed) {
    // Text fallback — same pill style as the old marquee
    return (
      <span
        className="text-sm font-semibold whitespace-nowrap px-5 py-2 rounded-full border"
        style={{
          color:           "#1B3A6B",
          borderColor:     "#C7D7FD",
          backgroundColor: "#EEF2FF",
        }}
      >
        {carrier.name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc(carrier.file)}
      alt={carrier.name}
      height={52}
      style={{
        height:      "52px",
        width:       "auto",
        maxWidth:    "156px",
        objectFit:   "contain",
        display:     "block",
        filter:      imgFilter,
        transition:  "filter 300ms ease, opacity 300ms ease",
        userSelect:  "none",
        cursor:      "pointer",
      }}
      onError={() => setFailed(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      draggable={false}
    />
  );
}

// ─── Marquee section ──────────────────────────────────────────────────────────

interface CarrierMarqueeProps {
  mode: Mode;
}

export default function CarrierMarquee({ mode }: CarrierMarqueeProps) {
  const { t } = useLanguage();
  const isPersonal = mode === "personal";
  const carriers   = isPersonal ? PERSONAL_CARRIERS : COMMERCIAL_CARRIERS;

  // Duplicate list for seamless infinite scroll
  const doubled = [...carriers, ...carriers];

  const bgColor   = isPersonal ? "#F8FAFF" : "#FFFFFF";
  const fadeColor = bgColor;

  return (
    <section
      className="py-14 overflow-hidden"
      style={{
        backgroundColor: bgColor,
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Heading */}
      <div className="max-w-5xl mx-auto px-6 text-center mb-8">
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
          {t("carriers.heading")}
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {t("carriers.sub")}
        </p>
      </div>

      {/* Scrolling track */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${fadeColor}, transparent)`,
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${fadeColor}, transparent)`,
          }}
        />

        <div className="flex overflow-hidden">
          <div className="flex items-center shrink-0 animate-marquee">
            {doubled.map((carrier, i) => (
              <div
                key={`${carrier.file}-${i}`}
                className="flex items-center justify-center shrink-0 mx-8"
                style={{ height: "68px" }}
              >
                <CarrierItem
                  carrier={carrier}
                  isPersonal={isPersonal}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
