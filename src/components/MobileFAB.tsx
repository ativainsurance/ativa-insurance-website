"use client";

import { useState, useEffect, useRef } from "react";
import type { Mode } from "@/types";

interface MobileFABProps {
  mode:         Mode;
  onGetQuote:   () => void;
  anyModalOpen: boolean;
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

function IconShield() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
      <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd"/>
    </svg>
  );
}

function IconMessage() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
      <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd"/>
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
    </svg>
  );
}

// ─── Option definitions ────────────────────────────────────────────────────────

interface FABOption {
  id:         string;
  label:      string;
  bg:         string;
  color:      string;
  border?:    string;
  href?:      string;
  hrefTarget?: string;
  icon:       React.ReactNode;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function MobileFAB({ mode, onGetQuote, anyModalOpen }: MobileFABProps) {
  const [expanded,  setExpanded]  = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  // ── Badge: show once per session after 3 s ───────────────────────────────────
  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("fabBadgeSeen")) return;
    const show = setTimeout(() => {
      setShowBadge(true);
      sessionStorage.setItem("fabBadgeSeen", "1");
      setTimeout(() => setShowBadge(false), 4000);
    }, 3000);
    return () => clearTimeout(show);
  }, []);

  // ── Auto-collapse on scroll > 100 px ────────────────────────────────────────
  useEffect(() => {
    if (!expanded) return;
    const onScroll = () => { if (window.scrollY > 100) setExpanded(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [expanded]);

  // ── Auto-collapse when any modal/sheet opens ─────────────────────────────────
  useEffect(() => {
    if (anyModalOpen) setExpanded(false);
  }, [anyModalOpen]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const collapse = () => setExpanded(false);

  const handleQuote = () => {
    collapse();
    onGetQuote();
  };

  const handleChat = () => {
    collapse();
    window.dispatchEvent(new CustomEvent("ativa:openChat"));
  };

  // ── Option list (index 0 = bottom / closest to FAB, index 3 = top) ───────────
  const OPTIONS: FABOption[] = [
    {
      id:    "quote",
      label: "See My Price",
      bg:    "#F5A623",
      color: "#0B1F33",
      icon:  <IconShield />,
    },
    {
      id:         "sms",
      label:      "Send a Text",
      bg:         "#0F2A44",
      color:      "#FFFFFF",
      href:       "sms:5619468261",
      icon:       <IconMessage />,
    },
    {
      id:         "whatsapp",
      label:      "WhatsApp",
      bg:         "#25D366",
      color:      "#FFFFFF",
      href:       "https://wa.me/15619468261",
      hrefTarget: "_blank",
      icon:       <IconWhatsApp />,
    },
    {
      id:     "chat",
      label:  "Chat with Flow",
      bg:     "#FFFFFF",
      color:  "#0F2A44",
      border: "1px solid #E2E8F0",
      icon:   <IconChat />,
    },
  ];

  // ── Hide entirely when a modal/sheet is open ──────────────────────────────────
  if (anyModalOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fab-option-in {
          from { opacity: 0; transform: translateY(10px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes fab-badge-in {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0);   }
        }
        @keyframes fab-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
          50%       { box-shadow: 0 4px 28px rgba(15,42,68,0.45); }
        }
        .fab-main {
          animation: fab-pulse 2.5s ease-in-out 3.5s 2;
        }
        .fab-option-pill {
          animation: fab-option-in 200ms ease-out both;
          white-space: nowrap;
        }
        .fab-option-pill:active {
          opacity: 0.85;
          transform: scale(0.97);
        }
        .fab-badge {
          animation: fab-badge-in 300ms ease-out both;
        }
      `}</style>

      {/* Only visible on mobile */}
      <div className="md:hidden">

        {/* ── Backdrop ──────────────────────────────────────────────────────── */}
        {expanded && (
          <div
            className="fixed inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.30)", zIndex: 999 }}
            onClick={collapse}
          />
        )}

        {/* ── FAB stack ─────────────────────────────────────────────────────── */}
        <div
          className="fixed flex flex-col items-end"
          style={{ bottom: "24px", right: "20px", zIndex: 1000, gap: "12px" }}
        >
          {/* Option pills — fan upward; rendered bottom→top via column-reverse */}
          {expanded && (
            <div style={{ display: "flex", flexDirection: "column-reverse", gap: "12px", alignItems: "flex-end" }}>
              {OPTIONS.map((opt, i) => {
                const pillStyle: React.CSSProperties = {
                  height:          "44px",
                  borderRadius:    "22px",
                  padding:         "0 16px",
                  display:         "flex",
                  alignItems:      "center",
                  gap:             "8px",
                  backgroundColor: opt.bg,
                  color:           opt.color,
                  border:          opt.border ?? "none",
                  boxShadow:       "0 2px 12px rgba(0,0,0,0.15)",
                  fontSize:        "13px",
                  fontWeight:      600,
                  cursor:          "pointer",
                  textDecoration:  "none",
                  animationDelay:  `${i * 60}ms`,
                };

                return opt.href ? (
                  <a
                    key={opt.id}
                    href={opt.href}
                    target={opt.hrefTarget}
                    rel={opt.hrefTarget === "_blank" ? "noopener noreferrer" : undefined}
                    className="fab-option-pill"
                    style={pillStyle}
                    onClick={collapse}
                  >
                    {opt.icon}
                    {opt.label}
                  </a>
                ) : (
                  <button
                    key={opt.id}
                    type="button"
                    className="fab-option-pill"
                    style={pillStyle}
                    onClick={opt.id === "quote" ? handleQuote : handleChat}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Main FAB row: badge + button ───────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* "Get Quote" badge */}
            {showBadge && !expanded && (
              <div
                className="fab-badge"
                style={{
                  backgroundColor: "#F5A623",
                  color:           "#0B1F33",
                  borderRadius:    "12px",
                  padding:         "4px 10px",
                  fontSize:        "11px",
                  fontWeight:      700,
                  whiteSpace:      "nowrap",
                  boxShadow:       "0 2px 8px rgba(245,166,35,0.35)",
                }}
              >
                Get Quote
              </div>
            )}

            {/* Main FAB button */}
            <button
              type="button"
              className="fab-main"
              onClick={() => { setExpanded((e) => !e); setShowBadge(false); }}
              aria-label={expanded ? "Close menu" : "Open actions"}
              style={{
                width:        "56px",
                height:       "56px",
                borderRadius: "50%",
                backgroundColor: "#0F2A44",
                color:        "#FFFFFF",
                border:       "none",
                cursor:       "pointer",
                boxShadow:    "0 4px 20px rgba(0,0,0,0.25)",
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                flexShrink:   0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width:      "22px",
                  height:     "22px",
                  transition: "transform 300ms ease",
                  transform:  expanded ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                {/* "+" that rotates to "×" */}
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5"  y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
