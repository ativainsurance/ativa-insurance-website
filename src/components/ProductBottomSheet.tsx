"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// ─── Product definitions ───────────────────────────────────────────────────────

interface SheetProduct {
  id:       string;
  label:    string;
  icon:     string;
  imgIcon:  boolean; // true = /icons/ image, false = emoji
}

const PERSONAL_PRODUCTS: SheetProduct[] = [
  { id: "auto",       label: "Auto",           icon: "/icons/auto-insurance.png",      imgIcon: true  },
  { id: "property",   label: "Home / Property",icon: "/icons/home-insurance.png",      imgIcon: true  },
  { id: "renters",    label: "Renters",         icon: "/icons/renters-insurance.png",   imgIcon: true  },
  { id: "pet",        label: "Pet",             icon: "/icons/pet-insurance.png",       imgIcon: true  },
  { id: "flood",      label: "Flood",           icon: "/icons/flood-insurance.png",     imgIcon: true  },
  { id: "bundle",     label: "Bundle & Save",   icon: "/icons/bundle-save.png",         imgIcon: true  },
  { id: "umbrella",   label: "Umbrella",        icon: "☂️",                             imgIcon: false },
  { id: "vacant",     label: "Vacant Property", icon: "🏚️",                            imgIcon: false },
  { id: "boat",       label: "Boat",            icon: "⛵",                             imgIcon: false },
  { id: "motorcycle", label: "Motorcycle",      icon: "🏍️",                            imgIcon: false },
];

const COMMERCIAL_PRODUCTS: SheetProduct[] = [
  { id: "gl",              label: "General Liability",    icon: "/icons/general-liability.png",    imgIcon: true  },
  { id: "commercial-auto", label: "Commercial Auto",      icon: "/icons/commercial-auto.png",      imgIcon: true  },
  { id: "workers-comp",    label: "Workers' Comp",        icon: "/icons/workers-compensation.png", imgIcon: true  },
  { id: "professional",    label: "Professional Liab.",   icon: "/icons/professional-liability.png", imgIcon: true },
  { id: "cyber",           label: "Cyber Liability",      icon: "/icons/cyber-liability.png",      imgIcon: true  },
  { id: "builders-risk",   label: "Builders Risk",        icon: "/icons/builders-risk.png",        imgIcon: true  },
  { id: "inland-marine",   label: "Inland Marine",        icon: "📦",                              imgIcon: false },
  { id: "umbrella",        label: "Umbrella / Excess",    icon: "☂️",                              imgIcon: false },
  { id: "surety",          label: "Surety Bond",          icon: "📜",                              imgIcon: false },
  { id: "do",              label: "Directors & Officers", icon: "🤝",                              imgIcon: false },
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface ProductBottomSheetProps {
  mode:     "personal" | "commercial";
  onSelect: (productId: string) => void;
  onClose:  () => void;
}

export default function ProductBottomSheet({ mode, onSelect, onClose }: ProductBottomSheetProps) {
  const products = mode === "personal" ? PERSONAL_PRODUCTS : COMMERCIAL_PRODUCTS;
  const title    = mode === "personal"
    ? "All Personal Coverage Options"
    : "All Business Coverage Options";

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Swipe-down to close ──────────────────────────────────────────────────────
  const sheetRef    = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 80) onClose(); // swiped down ≥ 80px → dismiss
  };

  return (
    <>
      <style>{`
        @keyframes sheet-slide-up {
          from { transform: translateY(100%); opacity: 0.6; }
          to   { transform: translateY(0);    opacity: 1;   }
        }
        .sheet-enter {
          animation: sheet-slide-up 350ms ease-out both;
        }
        .sheet-product-btn {
          transition: background-color 150ms ease, transform 120ms ease;
        }
        .sheet-product-btn:active {
          background-color: #EEF2FF !important;
          transform: scale(0.97);
        }
      `}</style>

      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[60] md:hidden"
        style={{ backgroundColor: "rgba(0,0,0,0.50)" }}
        onClick={onClose}
      />

      {/* ── Sheet ─────────────────────────────────────────────────────────── */}
      <div
        ref={sheetRef}
        className="sheet-enter fixed bottom-0 left-0 right-0 z-[70] md:hidden"
        style={{
          height:          "85vh",
          backgroundColor: "#FFFFFF",
          borderRadius:    "20px 20px 0 0",
          overflowY:       "auto",
          WebkitOverflowScrolling: "touch",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Sticky header inside sheet */}
        <div
          style={{
            position:        "sticky",
            top:             0,
            backgroundColor: "#FFFFFF",
            paddingTop:      "12px",
            paddingBottom:   "12px",
            paddingLeft:     "16px",
            paddingRight:    "16px",
            zIndex:          1,
          }}
        >
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <div style={{
              width: "40px", height: "4px",
              borderRadius: "2px",
              backgroundColor: "#CBD5E1",
            }} />
          </div>

          {/* Title row + close button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                width:           "32px",
                height:          "32px",
                borderRadius:    "50%",
                backgroundColor: "#F1F5F9",
                border:          "none",
                cursor:          "pointer",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                flexShrink:      0,
              }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "14px", height: "14px", color: "#64748B" }}>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Product grid */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:                 "10px",
            padding:             "4px 16px 32px",
          }}
        >
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              className="sheet-product-btn"
              onClick={() => onSelect(product.id)}
              style={{
                backgroundColor: "#F7FAFC",
                borderRadius:    "12px",
                padding:         "16px 8px",
                textAlign:       "center",
                display:         "flex",
                flexDirection:   "column",
                alignItems:      "center",
                gap:             "8px",
                border:          "none",
                cursor:          "pointer",
                width:           "100%",
              }}
            >
              {product.imgIcon ? (
                <Image
                  src={product.icon}
                  alt={product.label}
                  width={48}
                  height={48}
                  style={{ width: "48px", height: "48px", objectFit: "contain" }}
                />
              ) : (
                <span style={{ fontSize: "36px", lineHeight: 1, display: "block" }}>
                  {product.icon}
                </span>
              )}
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A", lineHeight: 1.3 }}>
                {product.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
