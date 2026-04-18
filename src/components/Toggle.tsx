"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Mode } from "@/types";

interface ToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export default function Toggle({ mode, onChange }: ToggleProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  // Measure button positions to drive the sliding pill
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll<HTMLButtonElement>("button");
    const btn = mode === "personal" ? buttons[0] : buttons[1];
    if (!btn) return;
    const cr = container.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({ left: br.left - cr.left, width: br.width, ready: true });
  }, [mode]);

  const pillBg = mode === "personal" ? "#1B3A6B" : "#F59E0B";

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center rounded-full p-1.5 bg-gray-900/90 backdrop-blur-sm border border-white/10 shadow-lg"
    >
      {/* Sliding background pill */}
      {pill.ready && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "6px",
            left: pill.left,
            width: pill.width,
            height: "calc(100% - 12px)",
            borderRadius: "9999px",
            backgroundColor: pillBg,
            transition: "left 250ms ease, width 250ms ease, background-color 250ms ease",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Fallback static backgrounds before first measurement */}
      {!pill.ready && (
        <>
          {mode === "personal" && (
            <div aria-hidden style={{
              position: "absolute", top: "6px", left: "6px",
              height: "calc(100% - 12px)", borderRadius: "9999px",
              backgroundColor: "#1B3A6B", pointerEvents: "none", zIndex: 0,
              right: "50%",
            }} />
          )}
          {mode === "commercial" && (
            <div aria-hidden style={{
              position: "absolute", top: "6px", right: "6px",
              height: "calc(100% - 12px)", borderRadius: "9999px",
              backgroundColor: "#F59E0B", pointerEvents: "none", zIndex: 0,
              left: "50%",
            }} />
          )}
        </>
      )}

      <button
        onClick={() => onChange("personal")}
        className="relative z-10 px-7 py-2.5 rounded-full text-sm font-bold tracking-wide"
        style={{
          color: mode === "personal" ? "#FFFFFF" : "rgba(255,255,255,0.5)",
          background: "transparent",
          transition: "color 250ms ease",
        }}
      >
        {t("nav.personal")}
      </button>

      {/* Animated arrow — pulses toward Commercial when Personal is active */}
      <span
        aria-hidden
        className={mode === "personal" ? "toggle-arrow" : ""}
        style={{
          position: "relative",
          zIndex: 10,
          fontSize: "14px",
          color: "#F59E0B",
          opacity: mode === "personal" ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
          userSelect: "none",
          margin: "0 2px",
          lineHeight: 1,
        }}
      >
        →
      </span>

      <button
        onClick={() => onChange("commercial")}
        className="relative z-10 px-7 py-2.5 rounded-full text-sm font-bold tracking-wide"
        style={{
          color: mode === "commercial" ? "#111827" : "rgba(255,255,255,0.5)",
          background: "transparent",
          transition: "color 250ms ease",
        }}
      >
        {t("nav.commercial")}
      </button>
    </div>
  );
}
