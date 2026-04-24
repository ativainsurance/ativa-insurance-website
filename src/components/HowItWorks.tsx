"use client";

import { useRef, useEffect } from "react";
import type { Mode } from "@/types";

interface Props {
  mode: Mode;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconForm() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
      <line x1="8" y1="10.5" x2="13" y2="10.5" />
      <line x1="10.5" y1="8" x2="10.5" y2="13" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6v6c0 4.418 3.354 8.56 8 9.93C16.646 20.56 20 16.418 20 12V6L12 2z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS_PERSONAL = [
  {
    num: "01",
    Icon: IconForm,
    title: "Tell us about you",
    desc: "Answer a few quick questions about what you need — takes less than 2 minutes.",
  },
  {
    num: "02",
    Icon: IconSearch,
    title: "We shop 50+ carriers",
    desc: "Our licensed agents compare top-rated carriers to find your best rate and coverage match.",
  },
  {
    num: "03",
    Icon: IconShield,
    title: "Get your best rate",
    desc: "Receive your personalized quote and get covered — same day, no pressure.",
  },
];

const STEPS_COMMERCIAL = [
  {
    num: "01",
    Icon: IconForm,
    title: "Describe your business",
    desc: "Tell us your industry, size, and coverage needs — we'll take it from there.",
  },
  {
    num: "02",
    Icon: IconSearch,
    title: "We compare business carriers",
    desc: "Our agents shop specialized commercial markets to find the right fit for your operation.",
  },
  {
    num: "03",
    Icon: IconShield,
    title: "Get covered fast",
    desc: "Receive a tailored business quote and bind coverage — often the same day.",
  },
];

// ─── Phone mockup ─────────────────────────────────────────────────────────────

const FLOW_STEPS = [
  { icon: "📋", label: "Share your details"     },
  { icon: "🔍", label: "We shop all carriers"   },
  { icon: "📬", label: "Receive your quote"     },
  { icon: "✅", label: "Get covered today"      },
];

function PhoneMockupHiW() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
          obs.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position:      "relative",
        margin:        "0 auto",
        width:         "180px",
        height:        "320px",
        opacity:       0,
        transform:     "translateY(20px)",
        transition:    "opacity 500ms ease-out, transform 500ms ease-out",
        pointerEvents: "none",
      }}
    >
      {/* Frame */}
      <div style={{
        width:           "100%",
        height:          "100%",
        backgroundColor: "#0F2A44",
        borderRadius:    "30px",
        border:          "6px solid #1E3A5F",
        boxShadow:       "0 20px 60px rgba(15,42,68,0.20), 0 4px 16px rgba(15,42,68,0.12)",
        padding:         "12px 11px 10px",
        display:         "flex",
        flexDirection:   "column",
        overflow:        "hidden",
        position:        "relative",
      }}>

        {/* Notch */}
        <div style={{
          width:           "48px",
          height:          "4px",
          backgroundColor: "#1E3A5F",
          borderRadius:    "2px",
          margin:          "0 auto 10px",
          flexShrink:      0,
        }} />

        {/* Screen */}
        <div style={{
          flex:            1,
          backgroundColor: "#F7FAFC",
          borderRadius:    "18px",
          padding:         "12px 10px 10px",
          display:         "flex",
          flexDirection:   "column",
          overflow:        "hidden",
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "18px", marginBottom: "3px" }}>🛡️</div>
            <span style={{ color: "#0F2A44", fontSize: "10px", fontWeight: 700, letterSpacing: "-0.01em", display: "block" }}>
              Your Personalized Quote
            </span>
            <span style={{ color: "#64748B", fontSize: "8px" }}>
              Multiple top-rated carriers
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#E2E8F0", marginBottom: "8px", flexShrink: 0 }} />

          {/* Flow steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
            {FLOW_STEPS.map((s, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius:    "7px",
                  padding:         "6px 8px",
                  display:         "flex",
                  alignItems:      "center",
                  gap:             "7px",
                  border:          "1px solid #E2E8F0",
                }}
              >
                <span style={{ fontSize: "13px", flexShrink: 0 }}>{s.icon}</span>
                <span style={{ color: "#0F172A", fontSize: "9.5px", fontWeight: 500 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Microcopy */}
          <div style={{ textAlign: "center", margin: "7px 0 4px", fontSize: "7.5px", color: "#94A3B8" }}>
            Free · No spam · Licensed agents
          </div>

          {/* CTA */}
          <div style={{
            width:           "100%",
            height:          "26px",
            borderRadius:    "7px",
            backgroundColor: "#F5A623",
            color:           "#0B1F33",
            fontSize:        "9.5px",
            fontWeight:      700,
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            flexShrink:      0,
          }}>
            Get My Quote →
          </div>

        </div>{/* end screen */}

        {/* Home bar */}
        <div style={{
          width:           "36px",
          height:          "3px",
          backgroundColor: "rgba(255,255,255,0.20)",
          borderRadius:    "2px",
          margin:          "6px auto 0",
          flexShrink:      0,
        }} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HowItWorks({ mode }: Props) {
  const isPersonal = mode === "personal";
  const steps = isPersonal ? STEPS_PERSONAL : STEPS_COMMERCIAL;

  return (
    <section
      style={{
        backgroundColor: "#F7FAFC",
        width: "100%",
        padding: "80px 24px",
        position: "relative",
        overflow: "visible",
      }}
    >
      <style>{`
        @media (min-width: 1200px) {
          .hiw-section-inner { padding-right: 260px !important; }
          .hiw-phone-abs     { display: block !important; }
        }
        @media (min-width: 640px) {
          .hiw-connector { display: block !important; }
        }
        @media (max-width: 639px) {
          .hiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="hiw-section-inner"
        style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}
      >

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#F5A623",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Simple Process
          </p>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#64748B",
              margin: 0,
            }}
          >
            No calls required. No spam. Just your best rate.
          </p>
        </div>

        {/* ── Steps — always full-width centered ── */}
        <div style={{ position: "relative" }}>

          {/* Connector line */}
          <div
            className="hiw-connector"
            style={{
              display: "none",
              position: "absolute",
              top: "28px",
              left: "calc(100% / 6)",
              right: "calc(100% / 6)",
              borderTop: "1px dashed #E2E8F0",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div
            className="hiw-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            {steps.map(({ num, Icon, title, desc }) => (
              <div
                key={num}
                style={{ textAlign: "center", position: "relative", zIndex: 1 }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    color: "#F5A623",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <Icon />
                </div>

                {/* Step number */}
                <p
                  style={{
                    fontSize:      "13px",
                    letterSpacing: "0.08em",
                    color:         "#F5A623",
                    fontWeight:    600,
                    textTransform: "uppercase",
                    margin:        "0 0 8px",
                  }}
                >
                  {num}
                </p>

                {/* Title */}
                <h3
                  style={{
                    fontSize:   "18px",
                    fontWeight: 600,
                    color:      "#0F172A",
                    margin:     "0 0 10px",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize:   "16px",
                    color:      "#4B5563",
                    lineHeight: 1.75,
                    margin:     0,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phone mockup — absolute, ≥1200px only ── */}
        <div
          className="hiw-phone-abs"
          style={{
            display:   "none",
            position:  "absolute",
            right:     "-220px",
            top:       "50%",
            transform: "translateY(-50%)",
            zIndex:    5,
          }}
        >
          <PhoneMockupHiW />
        </div>

      </div>
    </section>
  );
}
