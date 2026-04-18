"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Toggle from "@/components/Toggle";
import ProductCard from "@/components/ProductCard";
import QuoteModal from "@/components/QuoteModal";
import CommercialQuoteModal from "@/components/CommercialQuoteModal";
import CarrierMarquee from "@/components/CarrierMarquee";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Blog from "@/components/Blog";
import ChatWidget from "@/components/ChatWidget";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import ProductBottomSheet from "@/components/ProductBottomSheet";
import MobileFAB from "@/components/MobileFAB";
import type { Mode } from "@/types";
import type { Language } from "@/types";

// ─── Sparkle stars ────────────────────────────────────────────────────────────

const SPARKLE_POS = [
  { top: "8%",  left: "3%",  size: 9,  delay: "0s",   dur: "2.1s" },
  { top: "18%", left: "49%", size: 7,  delay: "0.55s", dur: "1.9s" },
  { top: "5%",  left: "74%", size: 11, delay: "1.1s",  dur: "2.4s" },
  { top: "45%", left: "1%",  size: 6,  delay: "0.3s",  dur: "2.0s" },
  { top: "62%", left: "53%", size: 8,  delay: "1.65s", dur: "1.8s" },
  { top: "30%", left: "93%", size: 7,  delay: "0.85s", dur: "2.3s" },
  { top: "78%", left: "22%", size: 5,  delay: "2.2s",  dur: "2.0s" },
];

function SparkleStars({ color }: { color: string }) {
  return (
    <>
      {SPARKLE_POS.map((p, i) => (
        <div
          key={i}
          className="sparkle-star absolute pointer-events-none"
          style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: p.dur }}
        >
          <svg viewBox="0 0 10 10" width={p.size} height={p.size} fill={color}>
            <path d="M5 0 L5.9 3.8 L10 5 L5.9 6.2 L5 10 L4.1 6.2 L0 5 L4.1 3.8 Z" />
          </svg>
        </div>
      ))}
    </>
  );
}

// ─── Personal floating scene ──────────────────────────────────────────────────

function PersonalScene() {
  return (
    <svg viewBox="0 0 380 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ground shadow */}
      <ellipse cx="190" cy="310" rx="150" ry="18" fill="#0F2E5E" opacity="0.25" />

      {/* House — back wall shadow */}
      <rect x="88" y="144" width="200" height="148" rx="3" fill="#0A2248" />
      {/* House — main wall */}
      <rect x="84" y="140" width="200" height="148" rx="3" fill="#E8F0FE" />
      {/* House — siding lines */}
      {[160,180,200,220,240,260].map(y => (
        <line key={y} x1="84" y1={y} x2="284" y2={y} stroke="#C7D2FE" strokeWidth="0.8" />
      ))}

      {/* Roof shadow */}
      <polygon points="72,148 192,68 312,148" fill="#0A2248" />
      {/* Roof main */}
      <polygon points="68,144 188,64 308,144" fill="#1B3A6B" />
      {/* Roof highlight ridge */}
      <line x1="188" y1="64" x2="188" y2="144" stroke="#2451A0" strokeWidth="2" strokeOpacity="0.4" />
      {/* Roof left face (depth) */}
      <polygon points="68,144 188,64 188,144" fill="#1B3A6B" opacity="0.6" />

      {/* Chimney */}
      <rect x="230" y="78" width="18" height="32" rx="2" fill="#12306B" />
      <rect x="228" y="74" width="22" height="8" rx="1" fill="#1B3A6B" />

      {/* Door */}
      <rect x="163" y="220" width="42" height="68" rx="3" fill="#1B3A6B" />
      <rect x="165" y="222" width="38" height="64" rx="2" fill="#1D4ED8" opacity="0.4" />
      {/* Door knob */}
      <circle cx="200" cy="256" r="3" fill="#E8F0FE" />
      {/* Door arch */}
      <path d="M163 232 Q184 216 205 232" stroke="#E8F0FE" strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Windows */}
      <rect x="100" y="168" width="52" height="42" rx="3" fill="#1D4ED8" opacity="0.35" />
      <line x1="126" y1="168" x2="126" y2="210" stroke="#E8F0FE" strokeWidth="1.2" opacity="0.5" />
      <line x1="100" y1="189" x2="152" y2="189" stroke="#E8F0FE" strokeWidth="1.2" opacity="0.5" />

      <rect x="216" y="168" width="52" height="42" rx="3" fill="#1D4ED8" opacity="0.35" />
      <line x1="242" y1="168" x2="242" y2="210" stroke="#E8F0FE" strokeWidth="1.2" opacity="0.5" />
      <line x1="216" y1="189" x2="268" y2="189" stroke="#E8F0FE" strokeWidth="1.2" opacity="0.5" />

      {/* Garage door */}
      <rect x="98" y="232" width="52" height="56" rx="2" fill="#C7D2FE" opacity="0.35" />
      {[242,252,262,278].map(y => (
        <line key={y} x1="98" y1={y} x2="150" y2={y} stroke="#E8F0FE" strokeWidth="1" opacity="0.4" />
      ))}

      {/* Car */}
      <rect x="40" y="274" width="120" height="32" rx="8" fill="#1D4ED8" />
      <path d="M56 274 L72 252 L128 252 L144 274" fill="#1B3A6B" />
      <rect x="76" y="254" width="24" height="18" rx="2" fill="#93C5FD" opacity="0.6" />
      <rect x="106" y="254" width="24" height="18" rx="2" fill="#93C5FD" opacity="0.6" />
      <circle cx="70"  cy="308" r="12" fill="#0F172A" />
      <circle cx="70"  cy="308" r="5"  fill="#374151" />
      <circle cx="138" cy="308" r="12" fill="#0F172A" />
      <circle cx="138" cy="308" r="5"  fill="#374151" />

      {/* Family silhouettes */}
      {/* Adult */}
      <circle cx="310" cy="248" r="14" fill="#0F2E5E" />
      <path d="M296 288 Q296 268 310 268 Q324 268 324 288 L324 310 L296 310 Z" fill="#0F2E5E" />
      {/* Adult 2 */}
      <circle cx="340" cy="256" r="11" fill="#1B3A6B" />
      <path d="M329 290 Q329 272 340 272 Q351 272 351 290 L351 310 L329 310 Z" fill="#1B3A6B" />
      {/* Child */}
      <circle cx="291" cy="268" r="8"  fill="#0F2E5E" opacity="0.8" />
      <path d="M283 292 Q283 278 291 278 Q299 278 299 292 L299 310 L283 310 Z" fill="#0F2E5E" opacity="0.8" />

      {/* Palm trees */}
      <rect x="16" y="220" width="8" height="84" rx="3" fill="#14532D" opacity="0.7" />
      <ellipse cx="20" cy="220" rx="24" ry="14" fill="#15803D" opacity="0.7" />
      <ellipse cx="20" cy="216" rx="18" ry="10" fill="#16A34A" opacity="0.6" />
      <ellipse cx="20" cy="212" rx="13" ry="8"  fill="#22C55E" opacity="0.5" />

      <rect x="357" y="236" width="7" height="68" rx="3" fill="#14532D" opacity="0.6" />
      <ellipse cx="360" cy="236" rx="20" ry="12" fill="#15803D" opacity="0.6" />
      <ellipse cx="360" cy="232" rx="15" ry="9"  fill="#16A34A" opacity="0.5" />

      {/* Gold shield floating above */}
      <g className="hero-float">
        {/* Glow ring */}
        <circle cx="188" cy="38" r="22" fill="#F59E0B" opacity="0.12" />
        <circle cx="188" cy="38" r="16" fill="#F59E0B" opacity="0.16" />
        {/* Shield */}
        <path d="M188 18 C188 18 204 24 204 36 C204 46 196 54 188 58 C180 54 172 46 172 36 C172 24 188 18 188 18Z" fill="#F59E0B" />
        <path d="M188 22 C188 22 200 27 200 37 C200 45 194 52 188 56 C182 52 176 45 176 37 C176 27 188 22 188 22Z" fill="#FCD34D" />
        {/* Check */}
        <path d="M181 38 L185 43 L196 32" stroke="#1B3A6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

// ─── Commercial floating scene ────────────────────────────────────────────────

function CommercialScene() {
  return (
    <svg viewBox="0 0 380 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ground shadow */}
      <ellipse cx="190" cy="312" rx="155" ry="16" fill="#F59E0B" opacity="0.12" />

      {/* Warehouse/building back */}
      <rect x="30"  y="100" width="110" height="200" rx="2" fill="#1F2937" />
      <rect x="28"  y="96"  width="110" height="200" rx="2" stroke="#374151" strokeWidth="1.5" fill="#1E2940" />
      {/* Building windows */}
      {[112,136,160,184,208,232].map(y =>
        [40,62,84,106].map(x => (
          <rect key={`${x}-${y}`} x={x} y={y} width="16" height="14" rx="1" fill="#F59E0B" opacity="0.15" />
        ))
      )}
      {/* Rollup doors */}
      <rect x="38" y="256" width="44" height="44" rx="1" fill="#374151" />
      {[260,268,276,284,292].map(y => (
        <line key={y} x1="38" y1={y} x2="82" y2={y} stroke="#4B5563" strokeWidth="1" />
      ))}
      <rect x="88" y="256" width="44" height="44" rx="1" fill="#374151" />

      {/* Warehouse roof overhang */}
      <rect x="22" y="92" width="126" height="10" rx="1" fill="#374151" />

      {/* Truck trailer */}
      <rect x="62"  y="226" width="188" height="56" rx="4" fill="#1F2937" />
      <rect x="64"  y="228" width="184" height="52" rx="3" stroke="#374151" strokeWidth="1.5" fill="#243040" />
      {/* Trailer side stripe */}
      <rect x="64" y="250" width="184" height="4" fill="#F59E0B" opacity="0.4" />
      {/* Trailer ventilation lines */}
      {[80,100,120,140,160,180,200,220].map(x => (
        <line key={x} x1={x} y1="228" x2={x} y2="282" stroke="#374151" strokeWidth="1" />
      ))}

      {/* Truck cab */}
      <path d="M250 282 L250 218 L296 218 L326 248 L326 282 Z" fill="#1F2937" />
      <path d="M252 282 L252 220 L294 220 L322 248 L322 280 Z" stroke="#374151" strokeWidth="1.5" fill="#243040" />
      {/* Cab window */}
      <path d="M258 220 L290 220 L316 246 L258 246 Z" fill="#F59E0B" opacity="0.2" />
      {/* Cab window divider */}
      <line x1="274" y1="220" x2="287" y2="246" stroke="#374151" strokeWidth="1.2" />
      {/* Cab door line */}
      <line x1="258" y1="248" x2="316" y2="248" stroke="#374151" strokeWidth="1" />
      {/* Cab exhaust */}
      <rect x="318" y="200" width="7" height="48" rx="3" fill="#374151" />
      <rect x="316" y="197" width="11" height="6" rx="2" fill="#4B5563" />

      {/* Wheels */}
      {[
        { cx: 94, big: true },
        { cx: 148, big: true },
        { cx: 208, big: true },
        { cx: 268, big: false },
        { cx: 308, big: false },
      ].map(({ cx, big }) => (
        <g key={cx}>
          <circle cx={cx} cy={296} r={big ? 18 : 16} fill="#111827" />
          <circle cx={cx} cy={296} r={big ? 12 : 10} fill="#1F2937" />
          <circle cx={cx} cy={296} r={big ? 5  : 4}  fill="#374151" />
          <circle cx={cx} cy={296} r={big ? 18 : 16} fill="none" stroke="#374151" strokeWidth="1.5" />
        </g>
      ))}

      {/* Gold shield + glow */}
      <g className="hero-float">
        <circle cx="188" cy="42" r="26" fill="#F59E0B" opacity="0.10" />
        <circle cx="188" cy="42" r="18" fill="#F59E0B" opacity="0.14" />
        <path d="M188 18 C188 18 208 26 208 42 C208 56 198 66 188 72 C178 66 168 56 168 42 C168 26 188 18 188 18Z" fill="#F59E0B" />
        <path d="M188 24 C188 24 204 30 204 43 C204 55 196 63 188 68 C180 63 172 55 172 43 C172 30 188 24 188 24Z" fill="#FCD34D" />
        <path d="M180 44 L185 50 L198 36" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

// ─── Hero background layers ───────────────────────────────────────────────────

function PersonalHeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Responsive rules — scoped to personal hero */}
      <style>{`
        .pers-hero-section {
          min-height: 680px;
          padding: 60px 24px;
        }
        @media (max-width: 768px) {
          .pers-hero-section { min-height: 500px; padding: 40px 16px; }
          .pers-hero-bg-img  { object-position: center center !important; }
          .pers-hero-overlay {
            background: rgba(247,250,252,0.95) !important;
          }
        }
      `}</style>

      {/* Background photo — z-index 0 */}
      <Image
        src="/images/personal-hero-bg.png"
        alt=""
        fill
        priority
        className="pers-hero-bg-img"
        style={{ objectFit: "cover", objectPosition: "right center", zIndex: 0 }}
      />

      {/* Left-to-right gradient — protects text on left, reveals image on right — z-index 1 */}
      <div
        className="pers-hero-overlay"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(to right, rgba(247,250,252,0.97) 0%, rgba(247,250,252,0.92) 30%, rgba(247,250,252,0.70) 50%, rgba(247,250,252,0.25) 70%, rgba(247,250,252,0.05) 100%)",
        }}
      />
    </div>
  );
}

function CommercialHeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Responsive rules — scoped to commercial hero */}
      <style>{`
        .comm-hero-section {
          min-height: 720px;
          padding: 60px 24px;
        }
        @media (max-width: 768px) {
          .comm-hero-section { min-height: 500px; padding: 40px 16px; }
          .comm-hero-bg-img  { object-position: center center !important; }
          .comm-hero-overlay {
            background: rgba(244,246,248,0.90) !important;
          }
        }
      `}</style>

      {/* Background photo — z-index 0 */}
      <Image
        src="/images/commercial-hero-bg.jpg"
        alt=""
        fill
        priority
        className="comm-hero-bg-img"
        style={{ objectFit: "cover", objectPosition: "center center", zIndex: 0 }}
      />

      {/* Light overlay — lets image texture show subtly — z-index 1 */}
      <div
        className="comm-hero-overlay"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "rgba(244,246,248,0.82)",
        }}
      />

      {/* Subtle warm accent — z-index 2 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
        <div className="absolute" style={{
          top: "-10%", right: "-5%", width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 65%)",
        }} />
      </div>
    </div>
  );
}

// ─── Stats bar ─────────────────────────────────────────────────────────────────

const STAT_ICONS = [
  <svg key="fam" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>,
  <svg key="star" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>,
  <svg key="map" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
  </svg>,
  <svg key="bolt" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
  </svg>,
];

function StatsBar({ mode }: { mode: Mode }) {
  const { tRaw } = useLanguage();
  const isPersonal = mode === "personal";
  const stats = (tRaw("stats") ?? []) as Array<{ value: string; label: string }>;

  return (
    <div className={isPersonal ? "stats-band-personal" : "stats-band-commercial"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {stats.map(({ value, label }, i) => {
            const isGoogleStat = label.toLowerCase().includes("google");
            const inner = (
              <>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: isPersonal ? "rgba(255,255,255,0.08)" : "rgba(245,158,11,0.12)",
                    color: isPersonal ? "#93C5FD" : "#F59E0B",
                  }}>
                  {STAT_ICONS[i]}
                </div>
                <div>
                  <p className="text-xl font-black leading-none mb-0.5"
                    style={{ color: isPersonal ? "#FFFFFF" : "#F59E0B" }}>
                    {value}
                  </p>
                  <p className="text-xs font-medium leading-tight" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {label}
                  </p>
                </div>
              </>
            );
            return isGoogleStat ? (
              <a
                key={i}
                href="https://maps.app.goo.gl/Zd8AptfZe46v9ntj8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
                style={{ textDecoration: "none" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              >
                {inner}
              </a>
            ) : (
              <div key={i} className="flex items-center gap-3">{inner}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Comparison section ───────────────────────────────────────────────────────

const COMPARISON_COPY: Record<Language, {
  eyebrow: string; heading: string; sub: string;
  colDirect: string; colAtiva: string; cta: string;
  rows: { feature: string; direct: string; ativa: string }[];
}> = {
  en: {
    eyebrow: "The Ativa Advantage",
    heading: "Why independent beats going direct",
    sub: "A captive agent works for one carrier. We work for you — comparing 50+ top-rated carriers so you always get the best rate.",
    colDirect: "Direct / Captive Agent", colAtiva: "Ativa Insurance", cta: "See My Price",
    rows: [
      { feature: "Carrier options",   direct: "1 carrier only",           ativa: "50+ carriers compared"          },
      { feature: "Your rate",         direct: "Fixed — take it or leave", ativa: "Best rate, guaranteed"          },
      { feature: "Languages",         direct: "English only",             ativa: "English · Portuguese · Spanish" },
      { feature: "Your advisor",      direct: "Call center / chatbot",    ativa: "Licensed local agent"           },
      { feature: "Policy changes",    direct: "Locked in for the year",   ativa: "Adjust anytime, no fees"        },
    ],
  },
  pt: {
    eyebrow: "A Vantagem Ativa",
    heading: "Por que independente supera o direto",
    sub: "Um agente cativo trabalha para uma seguradora. Nós trabalhamos para você — comparando mais de 20 seguradoras.",
    colDirect: "Agente Cativo / Direto", colAtiva: "Ativa Insurance", cta: "Obter Cotação Gratuita",
    rows: [
      { feature: "Opções de seguradora", direct: "Apenas 1 seguradora",         ativa: "Mais de 20 seguradoras"        },
      { feature: "Sua tarifa",           direct: "Fixa — pegar ou largar",       ativa: "Melhor tarifa, garantida"      },
      { feature: "Idiomas",              direct: "Somente inglês",               ativa: "Inglês · Português · Espanhol" },
      { feature: "Seu consultor",        direct: "Central de atendimento / bot", ativa: "Agente local licenciado"       },
      { feature: "Alterações",           direct: "Trancado por um ano",          ativa: "Flexível, sem taxas"           },
    ],
  },
  es: {
    eyebrow: "La Ventaja Ativa",
    heading: "Por qué independiente supera al directo",
    sub: "Un agente cautivo trabaja para una aseguradora. Nosotros trabajamos para usted — comparando más de 20 aseguradoras.",
    colDirect: "Agente Cautivo / Directo", colAtiva: "Ativa Insurance", cta: "Obtener Cotización Gratis",
    rows: [
      { feature: "Opciones de aseguradora", direct: "Solo 1 aseguradora",          ativa: "Más de 20 aseguradoras"         },
      { feature: "Su tarifa",               direct: "Fija — lo tomas o lo dejas",   ativa: "Mejor tarifa, garantizada"      },
      { feature: "Idiomas",                 direct: "Solo inglés",                  ativa: "Inglés · Portugués · Español"   },
      { feature: "Su asesor",               direct: "Centro de llamadas / chatbot", ativa: "Agente local licenciado"        },
      { feature: "Cambios de póliza",       direct: "Bloqueado por un año",         ativa: "Flexible, sin cargos"           },
    ],
  },
};

function ComparisonSection({ mode, onGetQuote }: { mode: Mode; onGetQuote: () => void }) {
  const { lang } = useLanguage();
  const copy = COMPARISON_COPY[lang] ?? COMPARISON_COPY["en"];
  const isPersonal = mode === "personal";
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowsRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-row-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("reveal-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item) => obs.observe(item));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6"
      style={{
        backgroundColor: isPersonal ? "#F8FAFF" : "#F4F6F8",
        borderTop:    "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
            style={{
              backgroundColor: isPersonal ? "#EEF2FF" : "rgba(245,158,11,0.12)",
              color: isPersonal ? "#1B3A6B" : "#F59E0B",
            }}>
            {copy.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3"
            style={{ color: "var(--text)" }}>
            {copy.heading}
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            {copy.sub}
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: isPersonal ? "0 4px 32px rgba(27,58,107,0.08)" : "0 4px 32px rgba(0,0,0,0.08)",
          }}>
          <div className="grid grid-cols-3">
            <div className="p-4 text-xs font-bold uppercase tracking-widest"
              style={{
                backgroundColor: isPersonal ? "#F8FAFC" : "#F0F4F8",
                color: "var(--text-muted)",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
              }} />
            <div className="p-4 text-center text-sm font-bold"
              style={{
                backgroundColor: "#FFF1F2",
                color: "#EF4444",
                borderBottom: "1px solid #FFE4E6",
                borderLeft:   "1px solid rgba(0,0,0,0.06)",
              }}>
              <span className="mr-1">✗</span>{copy.colDirect}
            </div>
            <div className="p-4 text-center text-sm font-bold"
              style={{
                backgroundColor: "#F0FDF4",
                color: "#10B981",
                borderBottom: "1px solid #D1FAE5",
                borderLeft:   "1px solid rgba(0,0,0,0.06)",
              }}>
              <span className="mr-1">✓</span>{copy.colAtiva}
            </div>
          </div>
          <div ref={rowsRef}>
            {copy.rows.map((row, i) => (
              <div key={i} data-row-reveal className="grid grid-cols-3"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                  backgroundColor: i % 2 === 0
                    ? "#FFFFFF"
                    : (isPersonal ? "#F8FAFC" : "#F8FAFC"),
                }}>
                <div className="p-4 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>{row.feature}</div>
                <div className="p-4 text-sm text-center" style={{ color: "#EF4444", borderLeft: "1px solid rgba(0,0,0,0.06)" }}>{row.direct}</div>
                <div className="p-4 text-sm text-center font-semibold" style={{ color: "#10B981", borderLeft: "1px solid rgba(0,0,0,0.06)" }}>{row.ativa}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button type="button" onClick={onGetQuote}
            className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm"
            style={{
              backgroundColor: "var(--accent)", color: "var(--accent-contrast)",
              boxShadow: isPersonal ? "0 4px 20px rgba(27,58,107,0.28)" : "0 4px 20px rgba(245,158,11,0.22)",
            }}>
            {copy.cta}
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          <p style={{ fontSize: "11px", color: "#94A3B8", textAlign: "center", marginTop: "6px" }}>
            Free · No spam · No obligation
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Trust badges ─────────────────────────────────────────────────────────────

const TRUST_BADGES: Record<Language, Array<{ icon: string; text: string }>> = {
  en: [
    { icon: "⭐", text: "5.0 Google Rating" },
    { icon: "🏛️", text: "11 Licensed States" },
    { icon: "⚡", text: "Same-Day Response"  },
  ],
  pt: [
    { icon: "⭐", text: "5.0 no Google"       },
    { icon: "🏛️", text: "11 Estados Licenciados" },
    { icon: "⚡", text: "Resposta no Mesmo Dia" },
  ],
  es: [
    { icon: "⭐", text: "5.0 en Google"        },
    { icon: "🏛️", text: "11 Estados con Licencia" },
    { icon: "⚡", text: "Respuesta el Mismo Día" },
  ],
};

// ─── Mobile card carousel ────────────────────────────────────────────────────

interface MobileCardCarouselProps {
  products: Array<{ id: string; title: string; description: string }>;
  mode: Mode;
  onClick: (id: string) => void;
  onCardHoverEnter: (id: string) => void;
  onCardHoverLeave: () => void;
}

function MobileCardCarousel({ products, mode, onClick, onCardHoverEnter, onCardHoverLeave }: MobileCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // card min-width (240) + gap (12) = 252
    const index = Math.round(el.scrollLeft / 252);
    setActiveIndex(Math.max(0, Math.min(index, products.length - 1)));
  };

  return (
    <div className="md:hidden">
      <div
        ref={scrollRef}
        className="mobile-card-scroll"
        onScroll={handleScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          gap: "12px",
          paddingBottom: "8px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{ scrollSnapAlign: "start", minWidth: "240px", flexShrink: 0 }}
          >
            <ProductCard
              id={product.id}
              title={product.title}
              description={product.description}
              mode={mode}
              onClick={onClick}
              onCardHoverEnter={onCardHoverEnter}
              onCardHoverLeave={onCardHoverLeave}
            />
          </div>
        ))}
      </div>

      {/* Scroll indicator dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
        {products.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? "18px" : "6px",
              height: "6px",
              borderRadius: "3px",
              backgroundColor: i === activeIndex ? "#0F2A44" : "#CBD5E1",
              transition: "width 200ms ease, background-color 200ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Sticky bottom bar (mobile only) ─────────────────────────────────────────

function StickyBottomBar({ onGetQuote }: { onGetQuote: () => void }) {
  return (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E2E8F0",
        padding: "12px 16px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        display: "flex",
        gap: "10px",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        <button
          type="button"
          onClick={onGetQuote}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            backgroundColor: "#0F2A44",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
          }}
        >
          See My Price — Free &amp; Fast
        </button>
        <span style={{ fontSize: "11px", color: "#94A3B8", textAlign: "center" }}>
          Free · No spam · No obligation
        </span>
      </div>
      <a
        href="sms:5619468261"
        style={{
          flex: 1,
          padding: "14px",
          borderRadius: "12px",
          backgroundColor: "#F5A623",
          color: "#0B1F33",
          fontWeight: 700,
          fontSize: "14px",
          textDecoration: "none",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Text Us
      </a>
    </div>
  );
}

// ─── Main site ────────────────────────────────────────────────────────────────

// ─── Hero CTA hover-label maps ────────────────────────────────────────────────

const HERO_CTA_HOVER: Record<string, Record<string, string>> = {
  personal: {
    auto:    "Get Covered Today →",
    home:    "Find My Best Rate →",
    renters: "Protect My Stuff →",
    condo:   "Cover My Pet →",
    flood:   "Check Flood Risk →",
    bundle:  "Show My Savings →",
  },
  commercial: {
    gl:                "See My Business Rate →",
    bop:               "Protect My Project →",
    "commercial-auto": "Cover My Fleet →",
    "workers-comp":    "Get WC Coverage →",
    professional:      "See My Business Rate →",
    cyber:             "See My Business Rate →",
  },
};

// ─── Hero product IDs (trimmed to 3 per mode) ─────────────────────────────────
const HERO_PERSONAL_IDS   = ["auto", "home", "bundle"];
const HERO_COMMERCIAL_IDS = ["commercial-auto", "gl", "workers-comp"];

// ─── Mobile hero card maps (icon path + CTA label per hero product) ────────────
const MOBILE_HERO_ICONS: Record<string, string> = {
  auto:              "/icons/auto-insurance.png",
  home:              "/icons/home-insurance.png",
  bundle:            "/icons/bundle-save.png",
  "commercial-auto": "/icons/commercial-auto.png",
  gl:                "/icons/general-liability.png",
  "workers-comp":    "/icons/workers-compensation.png",
};
const MOBILE_HERO_CTA: Record<string, string> = {
  auto:              "Get Covered Today →",
  home:              "Find My Best Rate →",
  bundle:            "Show My Savings →",
  "commercial-auto": "Cover My Fleet →",
  gl:                "See My Rate →",
  "workers-comp":    "Get WC Quote →",
};

function AtivaSite() {
  const { t, tProducts, lang } = useLanguage();
  const searchParams = useSearchParams();
  const [mode, setMode]                             = useState<Mode>(() => {
    // SSR-safe: initialise from URL if available
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("tab") === "commercial") return "commercial";
    }
    return "personal";
  });
  const [quoteOpen, setQuoteOpen]                   = useState(false);
  const [quoteProduct, setQuoteProduct]             = useState<string | undefined>(undefined);
  const [commercialQuoteOpen, setCommercialQuoteOpen]   = useState(false);
  const [commercialQuoteProduct, setCommercialQuoteProduct] = useState<string | undefined>(undefined);
  // Mobile product-picker bottom sheets
  const [personalSheetOpen, setPersonalSheetOpen]     = useState(false);
  const [commercialSheetOpen, setCommercialSheetOpen] = useState(false);
  const [hoveredCard, setHoveredCard]               = useState<string | null>(null);
  const [userState,  setUserState]                  = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const products   = tProducts(mode);
  const isPersonal = mode === "personal";

  // ── Geo-detection: personalise hero sub with user's state ─────────────────
  const LICENSED_STATES = [
    "Connecticut",
    "Florida",
    "Georgia",
    "Maryland",
    "Massachusetts",
    "New Jersey",
    "North Carolina",
    "Ohio",
    "Pennsylvania",
    "South Carolina",
    "Tennessee",
  ];
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data: { region?: string }) => {
        const state = data?.region ?? "";
        if (state && LICENSED_STATES.includes(state)) {
          setUserState(state);
        }
      })
      .catch(() => {}); // silent fail — neutral copy stays
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heroSub: Record<Mode, string> = {
    personal:   userState
      ? `Coverage built for ${userState} families — we shop 50+ carriers to get you the best rate.`
      : t("hero.personal.sub"),
    commercial: userState
      ? `Coverage built for ${userState} businesses — fleets, contractors, and growing companies trust Ativa.`
      : t("hero.commercial.sub"),
  };

  const heroProductIds = isPersonal ? HERO_PERSONAL_IDS : HERO_COMMERCIAL_IDS;
  const heroProducts   = products.filter(p => heroProductIds.includes(p.id));

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);

  const handleProductClick = useCallback((id: string) => {
    if (isPersonal) {
      setQuoteProduct(id);
      setQuoteOpen(true);
    } else {
      setCommercialQuoteProduct(id);
      setCommercialQuoteOpen(true);
    }
  }, [isPersonal]);

  const openQuote = useCallback(() => {
    if (isPersonal) { setQuoteProduct(undefined); setQuoteOpen(true); }
    else             { setCommercialQuoteProduct(undefined); setCommercialQuoteOpen(true); }
  }, [isPersonal]);

  const handleCardHoverEnter = useCallback((id: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredCard(id);
  }, []);

  const handleCardHoverLeave = useCallback(() => {
    hoverTimer.current = setTimeout(() => setHoveredCard(null), 800);
  }, []);

  // Reactively sync tab + quote modals from URL search params.
  // Runs on mount AND whenever the URL changes (e.g. clicking nav Home/Commercial links).
  useEffect(() => {
    const openQuote = searchParams.get("openQuote");
    const tab       = searchParams.get("tab");
    if (openQuote === "personal") {
      setMode("personal");
      setQuoteOpen(true);
    } else if (openQuote === "commercial") {
      setMode("commercial");
      setCommercialQuoteOpen(true);
    } else if (tab === "commercial") {
      setMode("commercial");
    } else if (tab === "personal") {
      setMode("personal");
    }
  }, [searchParams]);

  // Listen for ativa:openQuote custom event dispatched by the Flow chat widget
  useEffect(() => {
    function handleChatQuote(e: Event) {
      const detail = (e as CustomEvent<string | { tab: string; productId?: string }>).detail;
      // Support both legacy string detail and new object detail { tab, productId }
      const tab       = typeof detail === "string" ? detail : detail.tab;
      const productId = typeof detail === "object" ? detail.productId : undefined;
      if (tab === "commercial") {
        setMode("commercial");
        setCommercialQuoteProduct(productId);
        setCommercialQuoteOpen(true);
      } else {
        setMode("personal");
        setQuoteProduct(productId);
        setQuoteOpen(true);
      }
    }
    window.addEventListener("ativa:openQuote", handleChatQuote);
    return () => window.removeEventListener("ativa:openQuote", handleChatQuote);
  }, []);

  // Reset hover state on mode switch and clean up on unmount
  useEffect(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredCard(null);
  }, [mode]);
  useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); }, []);

  const trustBadges = TRUST_BADGES[lang] ?? TRUST_BADGES["en"];

  // Derive dynamic CTA text from hovered card
  const defaultCtaText = t(`hero.${mode}.cta1`);
  const heroCta = (hoveredCard && HERO_CTA_HOVER[mode]?.[hoveredCard]) ?? defaultCtaText;

  // Comparison section row reveal
  useEffect(() => {
    const rows = document.querySelectorAll("[data-row-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("reveal-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    rows.forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, [mode]);

  // Scroll-reveal for sections and card grids
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("reveal-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div data-mode={mode} className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg)", transition: "background-color 0.35s ease" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Header mode={mode} />

      {/* ── Hero — everything above the fold ────────────────────────────── */}
      <section className={`relative overflow-hidden ${isPersonal ? "hero-bg-personal pers-hero-section" : "hero-bg-commercial comm-hero-section"}`}>
        {/* Background illustration — hidden on mobile (performance) */}
        <div className="hidden md:block">
          {isPersonal ? <PersonalHeroBg /> : <CommercialHeroBg />}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          {/* ══════════════ MOBILE HERO (hidden md+) ══════════════════════ */}
          <div className="md:hidden" style={{ paddingBottom: "24px" }}>

            {/* Compact mode toggle */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px", marginBottom: "20px" }}>
              <Toggle mode={mode} onChange={handleModeChange} />
            </div>

            {/* 1 · Headline */}
            <div key={`mh-${mode}`} className="mode-fade-in">
              <h1
                style={{
                  fontSize: "clamp(1.6rem, 6vw, 2rem)",
                  fontWeight: 800,
                  textAlign: "center",
                  marginBottom: "8px",
                  color: isPersonal ? "#0F172A" : "#1E3A5F",
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                }}
              >
                {t(`hero.${mode}.headline`)}
              </h1>
            </div>

            {/* 2 · Trust line (replaces badge pills on mobile) */}
            <p style={{ fontSize: "12px", color: "#64748B", textAlign: "center", marginBottom: "16px" }}>
              ⭐ 5.0 Google Rating · 11 States · Same-Day
            </p>

            {/* 3 · Product cards — 2-column grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              {[...heroProducts]
                .sort((a, b) => {
                  // Featured card must appear first so it spans full-width at the top
                  const featuredId = isPersonal ? "auto" : "gl";
                  if (a.id === featuredId) return -1;
                  if (b.id === featuredId) return 1;
                  return 0;
                })
                .map((product) => {
                const isFeatured = isPersonal ? product.id === "auto" : product.id === "gl";
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductClick(product.id)}
                    style={{
                      gridColumn: isFeatured ? "span 2" : "span 1",
                      padding: "14px",
                      borderRadius: "12px",
                      textAlign: "center",
                      minHeight: "140px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      border: isFeatured ? "2px solid #F5A623" : "1.5px solid #E2E8F0",
                      background: isFeatured ? "#FFFBF0" : "#FFFFFF",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    <Image
                      src={MOBILE_HERO_ICONS[product.id] ?? "/icons/home-insurance.png"}
                      alt={product.title}
                      width={64}
                      height={64}
                      style={{ width: "64px", height: "64px", objectFit: "contain" }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                      {product.title}
                    </span>
                    <span style={{ fontSize: "11px", color: "#64748B", lineHeight: 1.3 }}>
                      {product.description}
                    </span>
                    <span style={{ fontSize: "12px", color: "#F5A623", fontWeight: 600 }}>
                      {MOBILE_HERO_CTA[product.id] ?? "Get a quote →"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 4 · Secondary link — opens bottom sheet on mobile */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => isPersonal ? setPersonalSheetOpen(true) : setCommercialSheetOpen(true)}
                style={{
                  fontSize: "13px",
                  color: "#64748B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 0",
                }}
              >
                {isPersonal ? "More coverage options →" : "More business policies →"}
              </button>
            </div>

            {/* 5 · Subheadline + microcopy */}
            <p style={{ fontSize: "13px", textAlign: "center", color: "#64748B", lineHeight: 1.5, marginBottom: "4px" }}>
              {isPersonal ? heroSub[mode] : "Coverage built for businesses like yours."}
            </p>
            <p style={{ fontSize: "12px", textAlign: "center", color: "#94A3B8", marginBottom: "12px" }}>
              {isPersonal
                ? "Free · No spam · No obligation"
                : "Quick quote · No commitment · Licensed agents"}
            </p>

            {/* Toggle prompt — moved below cards on mobile */}
            <p style={{ textAlign: "center", fontSize: "12px", color: "#94A3B8" }}>
              {isPersonal ? t("toggle.switchToCommercial") : t("toggle.switchToPersonal")}
            </p>
          </div>
          {/* ══════════════ END MOBILE HERO ════════════════════════════════ */}

          {/* ══════════════ DESKTOP HERO (hidden on mobile) ════════════════ */}
          <div className="hidden md:block">

          {/* Toggle block — centered */}
          <div className="pt-7 sm:pt-8 flex flex-col items-center mb-8 gap-2.5">

            {/* Headline above toggle */}
            <p style={{
              fontSize: "13px",
              color: "#1E3A5F",
              fontWeight: 500,
              opacity: isPersonal ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: isPersonal ? "auto" : "none",
            }}>
              {t("toggle.headline")}
            </p>

            <Toggle mode={mode} onChange={handleModeChange} />

            {/* Microcopy below toggle — crossfades on mode switch */}
            <div style={{ position: "relative", height: "18px", width: "100%", display: "flex", justifyContent: "center" }}>
              <span style={{
                position: "absolute",
                fontSize: "12px",
                color: isPersonal ? "#64748B" : "#475569",
                opacity: isPersonal ? 1 : 0,
                transition: "opacity 0.35s ease",
                whiteSpace: "nowrap",
                pointerEvents: isPersonal ? "auto" : "none",
              }}>
                {t("toggle.switchToCommercial")}
              </span>
              <span style={{
                position: "absolute",
                fontSize: "12px",
                color: "#64748B",
                opacity: isPersonal ? 0 : 1,
                transition: "opacity 0.35s ease",
                whiteSpace: "nowrap",
                pointerEvents: isPersonal ? "none" : "auto",
              }}>
                {t("toggle.switchToPersonal")}
              </span>
            </div>

          </div>

          {/* ── Unified split layout: left 45% text | right 55% grid ── */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">

            {/* LEFT — headline, sub, badge pills, CTAs (desktop) */}
            <div className="lg:w-[45%] text-center lg:text-left">
              {/* key re-mounts on tab switch, triggering the fade-in animation */}
              <div key={mode} className="mode-fade-in">
              <h1
                className="font-black leading-[1.06] tracking-[-0.03em] mb-3"
                style={{
                  color: isPersonal ? "#0F172A" : "#1E3A5F",
                  fontSize: "clamp(1.875rem, 3.5vw, 3rem)",
                }}
              >
                {t(`hero.${mode}.headline`)}
              </h1>
              <p className="text-base leading-relaxed mb-2 max-w-md mx-auto lg:mx-0"
                style={{ color: isPersonal ? "#475569" : "#1A1A1A" }}>
                {heroSub[mode]}
              </p>
              <p className="mb-4 max-w-md mx-auto lg:mx-0" style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>
                {isPersonal
                  ? "⚡ Takes less than 2 minutes · No calls · No spam · No pressure"
                  : "⚡ Quick quote · No commitment · Licensed local agents"}
              </p>

              {/* Badge pills */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-5">
                {trustBadges.map((badge, i) => {
                  const isGoogleRating = badge.text.includes("Google");
                  const sharedStyle = {
                    backgroundColor: isPersonal ? "rgba(27,58,107,0.08)"   : "rgba(245,166,35,0.12)",
                    color:           isPersonal ? "#1B3A6B"                 : "#1E3A5F",
                    border:          isPersonal ? "1px solid rgba(27,58,107,0.12)" : "1px solid rgba(245,166,35,0.28)",
                  };
                  const sharedClass = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold";
                  return isGoogleRating ? (
                    <a
                      key={i}
                      href="https://maps.app.goo.gl/Zd8AptfZe46v9ntj8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={sharedClass}
                      style={{
                        ...sharedStyle,
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
                    >
                      {badge.icon} {badge.text}
                    </a>
                  ) : (
                    <span key={i} className={sharedClass} style={sharedStyle}>
                      {badge.icon} {badge.text}
                    </span>
                  );
                })}
              </div>

              {/* Send Us a Text — desktop only */}
              <div className="hidden lg:flex mb-6">
                {lang === "en" ? (
                  <a href="sms:5619468261"
                    className="btn-ghost inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2"
                    style={{
                      backgroundColor: "transparent",
                      color:       isPersonal ? "#1B3A6B" : "#1E3A5F",
                      borderColor: isPersonal ? "rgba(27,58,107,0.22)" : "rgba(30,58,95,0.25)",
                    }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                      <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd"/>
                    </svg>
                    {t(`hero.${mode}.cta2`)}
                  </a>
                ) : (
                  <a href="https://wa.me/15619468261" target="_blank" rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2"
                    style={{
                      backgroundColor: "transparent",
                      color:       isPersonal ? "#1B3A6B" : "#1E3A5F",
                      borderColor: isPersonal ? "rgba(27,58,107,0.22)" : "rgba(30,58,95,0.25)",
                    }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: "#25D366" }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t(`hero.${mode}.cta2`)}
                  </a>
                )}
              </div>
              </div>{/* end mode-fade-in */}
            </div>

            {/* RIGHT — 55% — 3-card product grid */}
            <div id="products" className="lg:w-[55%]">
              {/* Unified responsive grid — 1 col on mobile, 3 cols on sm+ */}
              <div
                data-reveal
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}
              >
                {heroProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    mode={mode}
                    onClick={handleProductClick}
                    onCardHoverEnter={handleCardHoverEnter}
                    onCardHoverLeave={handleCardHoverLeave}
                  />
                ))}
              </div>

              {/* Secondary CTA — explore all coverages */}
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={openQuote}
                  className="secondary-explore-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#0F2A44",
                    textDecoration: "none",
                    border: "1px solid #E2E8F0",
                    borderRadius: "24px",
                    padding: "10px 20px",
                    background: "none",
                    cursor: "pointer",
                    transition: "background 200ms ease, border-color 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "#F4F6F8";
                    el.style.borderColor = "#0F2A44";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "none";
                    el.style.borderColor = "#E2E8F0";
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#F5A623" }}>+</span>
                  {isPersonal
                    ? "Looking for something else? Explore all personal coverages →"
                    : "Looking for something else? Explore all business coverages →"}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom padding */}
          <div className="pb-8" />
          </div>{/* end desktop hero */}
        </div>
      </section>

      {/* ── Carriers ──────────────────────────────────────────────────────── */}
      <div data-reveal><CarrierMarquee mode={mode} /></div>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <div data-reveal><HowItWorks mode={mode} /></div>

      {/* ── Comparison ────────────────────────────────────────────────────── */}
      <div data-reveal><ComparisonSection mode={mode} onGetQuote={openQuote} /></div>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <div data-reveal><StatsBar mode={mode} /></div>

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      <div data-reveal><Reviews mode={mode} /></div>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <div data-reveal><FAQ mode={mode} /></div>

      {/* ── Blog ──────────────────────────────────────────────────────────── */}
      <div data-reveal><Blog mode={mode} /></div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      {/* Spacer so FAB doesn't overlap footer content on mobile */}
      <div className="md:hidden" style={{ height: "96px" }} />
      <Footer mode={mode} />

      {/* ── Chat widget (desktop floating buttons live here) ─────────────── */}
      <ChatWidget mode={mode} />

      {/* ── Mobile FAB (replaces sticky bar + floating buttons on mobile) ── */}
      <MobileFAB
        mode={mode}
        onGetQuote={openQuote}
        anyModalOpen={quoteOpen || commercialQuoteOpen || personalSheetOpen || commercialSheetOpen}
      />

      {/* ── Mobile product-picker bottom sheets ──────────────────────────── */}
      {personalSheetOpen && (
        <ProductBottomSheet
          mode="personal"
          onSelect={(id) => {
            setPersonalSheetOpen(false);
            setQuoteProduct(id);
            setMode("personal");
            setQuoteOpen(true);
          }}
          onClose={() => setPersonalSheetOpen(false)}
        />
      )}
      {commercialSheetOpen && (
        <ProductBottomSheet
          mode="commercial"
          onSelect={(id) => {
            setCommercialSheetOpen(false);
            setCommercialQuoteProduct(id);
            setMode("commercial");
            setCommercialQuoteOpen(true);
          }}
          onClose={() => setCommercialSheetOpen(false)}
        />
      )}

      {/* ── Personal quote modal ─────────────────────────────────────────── */}
      {quoteOpen && isPersonal && (
        <QuoteModal
          mode={mode}
          initialProduct={quoteProduct}
          onClose={() => { setQuoteOpen(false); setQuoteProduct(undefined); }}
        />
      )}

      {/* ── Commercial quote modal ────────────────────────────────────────── */}
      {commercialQuoteOpen && !isPersonal && (
        <CommercialQuoteModal
          mode={mode}
          initialProduct={commercialQuoteProduct}
          onClose={() => { setCommercialQuoteOpen(false); setCommercialQuoteProduct(undefined); }}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <LanguageProvider>
      <Suspense fallback={null}>
        <AtivaSite />
      </Suspense>
    </LanguageProvider>
  );
}
