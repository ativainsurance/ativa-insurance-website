"use client";

import type { Mode } from "@/types";

interface Props {
  mode: Mode;
}

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

export default function HowItWorks({ mode }: Props) {
  const isPersonal = mode === "personal";
  const steps = isPersonal ? STEPS_PERSONAL : STEPS_COMMERCIAL;

  return (
    <section
      style={{
        backgroundColor: "#F7FAFC",
        width: "100%",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

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

        {/* ── Steps ── */}
        <div
          style={{
            position: "relative",
          }}
        >
          {/* Connector line — desktop only, hidden on mobile via inline media trick */}
          <style>{`
            @media (min-width: 640px) {
              .hiw-connector { display: block !important; }
            }
          `}</style>
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

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
            className="hiw-grid"
          >
            <style>{`
              @media (max-width: 639px) {
                .hiw-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>

            {steps.map(({ num, Icon, title, desc }) => (
              <div
                key={num}
                style={{
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}
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
                    fontSize: "11px",
                    letterSpacing: "2px",
                    color: "#F5A623",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}
                >
                  {num}
                </p>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748B",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
