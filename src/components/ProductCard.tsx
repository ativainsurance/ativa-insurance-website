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
  auto:              "/icons/auto-insurance.png",
  home:              "/icons/home-insurance.png",
  renters:           "/icons/renters-insurance.png",
  condo:             "/icons/pet-insurance.png",
  flood:             "/icons/flood-insurance.png",
  bundle:            "/icons/bundle-save.png",
  bop:               "/icons/builders-risk.png",
  gl:                "/icons/general-liability.png",
  "commercial-auto": "/icons/commercial-auto.png",
  "workers-comp":    "/icons/workers-compensation.png",
  professional:      "/icons/professional-liability.png",
  cyber:             "/icons/cyber-liability.png",
};

// ─── Tier visual config ───────────────────────────────────────────────────────

const TIER_STYLES = {
  1: {
    padding:    "26px",
    border:     "2px solid #F5A623",
    shadow:     "0 8px 32px rgba(15,42,68,0.15)",
    hoverShadow:"0 14px 44px rgba(15,42,68,0.20)",
    opacity:    1,
  },
  2: {
    padding:    "24px",
    border:     "1px solid rgba(0,0,0,0.08)",
    shadow:     "0 4px 16px rgba(0,0,0,0.08)",
    hoverShadow:"0 10px 28px rgba(0,0,0,0.13)",
    opacity:    1,
  },
  3: {
    padding:    "24px",
    border:     "1px solid rgba(0,0,0,0.06)",
    shadow:     "0 2px 8px rgba(0,0,0,0.05)",
    hoverShadow:"0 8px 24px rgba(0,0,0,0.10)",
    opacity:    0.92,
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

  const iconSrc  = ICON_IMAGES[id] ?? "/icons/home-insurance.png";
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
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.boxShadow = ts.hoverShadow;
        el.style.transform = "translateY(-4px)";
        onCardHoverEnter?.(id);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.boxShadow = ts.shadow;
        el.style.transform = "translateY(0)";
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
        className="font-bold text-sm leading-snug mb-1"
        style={{ color: "#0F172A" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="hidden sm:block text-xs leading-snug mb-1"
        style={{ color: "#64748B" }}
      >
        {description}
      </p>

      {/* Trust line */}
      {TRUST_LINES[id] && (
        <p
          className="hidden sm:block text-xs mb-3"
          style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", marginBottom: "8px" }}
        >
          {TRUST_LINES[id]}
        </p>
      )}

      {/* CTA */}
      <div
        className="card-cta flex items-center text-xs font-bold transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: "#F5A623" }}
      >
        {ctaLabel}
      </div>
    </button>
  );
}
