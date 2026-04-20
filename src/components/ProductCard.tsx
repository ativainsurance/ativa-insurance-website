"use client";

import Image from "next/image";
import type { Mode } from "@/types";

// ─── Tier assignment ──────────────────────────────────────────────────────────

const PERSONAL_TIERS: Record<string, 1 | 2 | 3> = {
  auto:    1,
  home:    2,  condo:        2,
  renters: 3,  flood:        3,  bundle: 3,
};

const COMMERCIAL_TIERS: Record<string, 1 | 2 | 3> = {
  gl:               1,
  "commercial-auto": 2, bop:          2,
  "workers-comp":   3,  professional: 3,  cyber: 3,
};

// ─── Per-card trust lines ─────────────────────────────────────────────────────

const TRUST_LINES: Record<string, string> = {
  auto:              "⚡ Same-day coverage available",
  home:              "🔒 Compare 50+ carriers instantly",
  bundle:            "💰 Most clients save 18%+",
  gl:                "⚡ Certificate ready same day",
  "commercial-auto": "🔒 Fleet rates from top carriers",
  "workers-comp":    "✓ Stay compliant — fast",
};

// ─── Per-card CTA labels ──────────────────────────────────────────────────────

const CTA_LABELS: Record<string, string> = {
  auto:              "Get Covered Today →",
  home:              "Find My Best Rate →",
  renters:           "Protect My Stuff →",
  condo:             "Cover My Pet →",
  flood:             "Check Flood Risk →",
  bundle:            "Show My Savings →",
  gl:                "See My Business Rate →",
  bop:               "Protect My Project →",
  "commercial-auto": "Cover My Fleet →",
  "workers-comp":    "Get WC Coverage →",
  professional:      "See My Business Rate →",
  cyber:             "See My Business Rate →",
};

// ─── Icon image map ───────────────────────────────────────────────────────────

const ICON_IMAGES: Record<string, string> = {
  auto:              "/icons/auto-insurance.png?v=2",
  home:              "/icons/property-insurance.png?v=2",
  renters:           "/icons/renters-insurance.png?v=2",
  condo:             "/icons/pet-insurance.png?v=2",
  flood:             "/icons/flood-insurance.png?v=2",
  bundle:            "/icons/bundle-save.png?v=2",
  bop:               "/icons/builders-risk.png?v=2",
  gl:                "/icons/general-liability.png?v=2",
  "commercial-auto": "/icons/commercial-auto.png?v=2",
  "workers-comp":    "/icons/workers-compensation.png?v=2",
  professional:      "/icons/professional-liability.png?v=2",
  cyber:             "/icons/cyber-liability.png?v=2",
};

// ─── Tier visual config ───────────────────────────────────────────────────────

const TIER_STYLES = {
  1: {
    padding:          "26px",
    border:           "2px solid #F5A623",
    shadow:           "0 8px 32px rgba(245,166,35,0.20)",
    hoverShadow:      "0 14px 44px rgba(245,166,35,0.28)",
    opacity:          1,
    defaultTransform: "translateY(-4px)",
    hoverTransform:   "translateY(-6px)",
  },
  2: {
    padding:          "24px",
    border:           "1px solid #E2E8F0",
    shadow:           "0 2px 12px rgba(0,0,0,0.06)",
    hoverShadow:      "0 10px 28px rgba(0,0,0,0.12)",
    opacity:          1,
    defaultTransform: "translateY(0)",
    hoverTransform:   "translateY(-4px)",
  },
  3: {
    padding:          "24px",
    border:           "1px solid #E2E8F0",
    shadow:           "0 2px 12px rgba(0,0,0,0.06)",
    hoverShadow:      "0 8px 24px rgba(0,0,0,0.12)",
    opacity:          1,
    defaultTransform: "translateY(0)",
    hoverTransform:   "translateY(-4px)",
  },
} as const;

// ─── Card component ───────────────────────────────────────────────────────────

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  mode: Mode;
  onClick: (id: string) => void;
  onCardHoverEnter?: (id: string) => void;
  onCardHoverLeave?: () => void;
}

export default function ProductCard({ id, title, description, mode, onClick, onCardHoverEnter, onCardHoverLeave }: ProductCardProps) {
  const isPersonal = mode === "personal";
  const tierMap    = isPersonal ? PERSONAL_TIERS : COMMERCIAL_TIERS;
  const tier       = tierMap[id] ?? 2;
  const ts         = TIER_STYLES[tier];

  const iconSrc  = ICON_IMAGES[id] ?? "/icons/property-insurance.png?v=2";
  const ctaLabel = CTA_LABELS[id]  ?? "Find My Best Rate →";

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className="product-card group relative w-full text-left rounded-2xl cursor-pointer"
      style={{
        backgroundColor: "#FFFFFF",
        border:     ts.border,
        boxShadow:  ts.shadow,
        padding:    ts.padding,
        opacity:    ts.opacity,
        transition: "box-shadow 250ms ease, transform 250ms ease",
        transform:  ts.defaultTransform,
        minWidth:        0,
        height:          "100%",
        display:         "flex",
        flexDirection:   "column",
        justifyContent:  "space-between",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.boxShadow = ts.hoverShadow;
        el.style.transform = ts.hoverTransform;
        onCardHoverEnter?.(id);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.boxShadow = ts.shadow;
        el.style.transform = ts.defaultTransform;
        onCardHoverLeave?.();
      }}
    >
      {/* Most Popular badge — tier 1 only */}
      {tier === 1 && (
        <div
          className="inline-flex items-center gap-1 mb-3"
          style={{
            backgroundColor: "#F5A623",
            color: "#0B1F33",
            fontSize: "11px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "20px",
          }}
        >
          <svg viewBox="0 0 12 12" fill="currentColor" style={{ width: "10px", height: "10px" }}>
            <path d="M6 0l1.5 4H12L8.5 6.5l1.2 4L6 8.5l-3.7 2 1.2-4L0 4h4.5z"/>
          </svg>
          Most Popular
        </div>
      )}

      {/* Icon container */}
      <div
        className="inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        style={{
          backgroundColor: "#F4F6F8",
          padding: "16px",
          borderRadius: "20px",
          marginBottom: "16px",
        }}
      >
        <Image
          src={iconSrc}
          alt={title}
          width={144}
          height={144}
          style={{ width: "144px", height: "144px", objectFit: "contain" }}
        />
      </div>

      {/* Title */}
      <h3
        className="font-bold leading-snug mb-1"
        style={{ color: "#0F172A", fontSize: "17px" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="hidden sm:block leading-snug mb-1"
        style={{ color: "#374151", fontSize: "15px", lineHeight: 1.65 }}
      >
        {description}
      </p>

      {/* Trust line */}
      {TRUST_LINES[id] && (
        <p
          className="hidden sm:block mb-3"
          style={{ fontSize: "13px", color: "#374151", marginTop: "4px", marginBottom: "8px" }}
        >
          {TRUST_LINES[id]}
        </p>
      )}

      {/* CTA */}
      <div
        className="card-cta flex items-center font-semibold transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: "#B45309", fontSize: "15px", minHeight: "44px", paddingTop: "8px", paddingBottom: "8px" }}
      >
        {ctaLabel}
      </div>
    </button>
  );
}
