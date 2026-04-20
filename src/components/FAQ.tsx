"use client";

import { useState } from "react";
import type { Mode } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  mode: Mode;
}

// SVG icons mapped by question index
const FAQ_ICONS = [
  // 0 — "What states are you licensed in?" — map pin
  <svg key="pin" viewBox="0 0 20 20" fill="#F5A623" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
  </svg>,
  // 1 — "How long does it take?" — bolt
  <svg key="bolt" viewBox="0 0 20 20" fill="#F5A623" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
  </svg>,
  // 2 — "Do you work with multiple carriers?" — refresh arrows
  <svg key="arrows" viewBox="0 0 20 20" fill="#F5A623" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
  </svg>,
  // 3 — "Can I bundle?" — collection/stack
  <svg key="bundle" viewBox="0 0 20 20" fill="#F5A623" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
  </svg>,
  // 4 — "What is BOP?" — office building
  <svg key="building" viewBox="0 0 20 20" fill="#F5A623" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
  </svg>,
  // 5 — "Is flood insurance required?" — water drop
  <svg key="water" viewBox="0 0 20 20" fill="#F5A623" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <path fillRule="evenodd" d="M7.293 1.293a1 1 0 011.414 0l5 5A7 7 0 1110 17.93V1a1 1 0 01.707.293zM10 3.414L6.061 7.354a5 5 0 107.879 0L10 3.414z" clipRule="evenodd"/>
  </svg>,
];

interface FAQRowProps {
  item: FAQItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}

function FAQRow({ item, index, open, onToggle }: FAQRowProps) {
  const [hovered, setHovered] = useState(false);
  const icon = FAQ_ICONS[index] ?? FAQ_ICONS[0];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: hovered && !open ? "#F4F6F8" : "var(--surface)",
        border: hovered || open ? "1px solid rgba(245,166,35,0.4)" : "1px solid var(--border)",
        borderLeft: hovered || open ? "3px solid #F5A623" : "1px solid var(--border)",
        transition: "background-color 200ms ease, border-color 200ms ease, border-left 200ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between text-left"
        aria-expanded={open}
        style={{
          padding:   hovered || open ? "14px 20px 14px 22px" : "14px 20px",
          transition: "padding 200ms ease",
          minHeight: "52px",
        }}
        onClick={onToggle}
      >
        <span className="flex items-center gap-3 pr-4">
          {icon}
          <span className="font-semibold" style={{ color: "var(--text)", fontSize: "16px" }}>
            {item.q}
          </span>
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--accent-light)",
            color: "var(--accent)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
        </span>
      </button>

      {open && (
        <div
          className="animate-fade-in"
          style={{
            color:      "var(--text-muted)",
            padding:    "0 20px 16px 49px",
            fontSize:   "16px",
            lineHeight: 1.8,
          }}
        >
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQ({ mode }: FAQProps) {
  const { t, tRaw } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const isPersonal = mode === "personal";

  const items = (tRaw("faq.items") as FAQItem[] | undefined) ?? [];

  return (
    <section
      className="relative py-16 px-6 overflow-hidden"
      style={{
        background: isPersonal
          ? "radial-gradient(ellipse at 30% 50%, #EEF2F7 0%, #F8F9FB 55%, #FFFFFF 100%)"
          : "#FFFFFF",
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Decorative blobs — both modes */}
      <>
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: "-40px",
            right: "-60px",
            width: "320px",
            height: "320px",
            opacity: isPersonal ? 0.04 : 0.03,
            pointerEvents: "none",
            color: isPersonal ? "#1E3A5F" : "#F5A623",
          }}
        >
          <path
            fill="currentColor"
            d="M45.3,-62.1C58.2,-54.4,68,-40.5,72.4,-25.1C76.8,-9.7,75.8,7.2,69.4,21.5C63,35.8,51.2,47.5,37.5,55.6C23.8,63.7,8.2,68.2,-6.6,66.3C-21.4,64.4,-35.4,56.1,-47.2,45.2C-59,34.3,-68.6,20.8,-70.3,5.9C-72,-9,-65.8,-25.3,-55.8,-37.2C-45.8,-49.1,-32,-56.6,-17.6,-62.5C-3.2,-68.4,11.8,-72.7,25.9,-70.3C40,-67.9,53.1,-58.8,45.3,-62.1Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-70px",
            width: "280px",
            height: "280px",
            opacity: isPersonal ? 0.04 : 0.03,
            pointerEvents: "none",
            color: isPersonal ? "#1E3A5F" : "#F5A623",
          }}
        >
          <path
            fill="currentColor"
            d="M38.9,-52.3C50.4,-45.2,59.5,-33.3,63.8,-19.6C68.1,-5.9,67.6,9.6,61.9,22.4C56.2,35.2,45.3,45.3,32.6,51.8C19.9,58.3,5.4,61.2,-9.4,59.5C-24.2,57.8,-39.3,51.5,-49.8,40.8C-60.3,30.1,-66.2,15,-66.1,0C-66,-15,-60,-30,-50.3,-40.5C-40.6,-51,-27.2,-57,-13.4,-59.5C0.4,-62,14.8,-61.1,27.5,-57.1C40.2,-53.1,51.2,-46,38.9,-52.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </>

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
            {t("faq.heading")}
          </h2>
          <p style={{ color: "var(--text-muted)" }}>{t("faq.sub")}</p>
        </div>

        <div className="space-y-2.5">
          {items.map((item, i) => (
            <FAQRow
              key={i}
              item={item}
              index={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        {/* Section CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Still have questions? Talk to a licensed agent.
          </p>
          <a
            href="sms:5619468261"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2"
            style={{
              color: "#0F2A44",
              borderColor: "#0F2A44",
              backgroundColor: "transparent",
              transition: "background-color 200ms ease, color 200ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0F2A44";
              (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#0F2A44";
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd"/>
            </svg>
            Send Us a Text →
          </a>
        </div>
      </div>
    </section>
  );
}
