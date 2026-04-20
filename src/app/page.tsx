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
    <div aria-hidden>
      <style>{`
        .pers-hero-section {
          padding: 40px 0 40px;
        }
        @media (max-width: 768px) {
          .pers-hero-section { padding: 40px 16px; }
        }
      `}</style>
    </div>
  );
}

function CommercialHeroBg() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <style>{`
        .comm-hero-section {
          min-height: 640px;
          padding: 60px 24px;
        }
        @media (max-width: 768px) {
          .comm-hero-section { min-height: 480px; padding: 40px 16px; }
        }
      `}</style>

      {/* Base gradient */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #F4F6F8 0%, #EDF2F7 50%, #E8EDF5 100%)",
      }} />

      {/* Dot pattern overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(15,42,68,0.035) 1px, transparent 0)",
        backgroundSize: "28px 28px",
      }} />

      {/* Subtle warm accent top-right */}
      <div style={{
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "480px",
        height: "480px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 65%)",
      }} />
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

// ─── Commercial quote widget ──────────────────────────────────────────────────

const WIDGET_PRODUCTS = [
  { id: "commercial-auto",  label: "Commercial Auto",           icon: "/icons/commercial-auto.png?v=2"        },
  { id: "gl",               label: "General Liability",         icon: "/icons/general-liability.png?v=2"      },
  { id: "workers-comp",     label: "Workers' Compensation",     icon: "/icons/workers-comp.png?v=2"           },
  { id: "builders-risk",    label: "Builders Risk",             icon: "/icons/builders-risk.png?v=2"          },
  { id: "professional",     label: "Professional Liability",    icon: "/icons/professional-liability.png?v=2" },
  { id: "cyber",            label: "Cyber Liability",           icon: "/icons/cyber-liability.png?v=2"        },
  { id: "inland-marine",    label: "Inland Marine",             icon: "/icons/inland-marine.png?v=2"          },
  { id: "umbrella",         label: "Umbrella / Excess Liability", icon: "/icons/umbrella.png?v=2"             },
  { id: "surety",           label: "Surety Bond",               icon: "/icons/surety-bond.png?v=2"            },
  { id: "do",               label: "Directors & Officers",      icon: "/icons/professional-liability.png?v=2" },
  { id: "liquor-liability", label: "Liquor Liability",          icon: "/icons/liquor-liability.png?v=2"       },
];

const WIDGET_CTA_LABELS: Record<string, string> = {
  "commercial-auto":  "Get My Commercial Auto Quote →",
  "gl":               "Get My GL Quote →",
  "workers-comp":     "Get My WC Quote →",
  "builders-risk":    "Get My Builders Quote →",
  "professional":     "Get My PL Quote →",
  "cyber":            "Get My Cyber Quote →",
  "inland-marine":    "Get My Inland Marine Quote →",
  "umbrella":         "Get My Umbrella Quote →",
  "surety":           "Get My Bond Quote →",
  "do":               "Get My D&O Quote →",
  "liquor-liability": "Get My Liquor Quote →",
};

// ─── Mobile hero card maps (icon path + CTA label per hero product) ────────────
const MOBILE_HERO_ICONS: Record<string, string> = {
  auto:              "/icons/auto-insurance.png?v=2",
  home:              "/icons/property-insurance.png?v=2",
  bundle:            "/icons/bundle-save.png?v=2",
  "commercial-auto": "/icons/commercial-auto.png?v=2",
  gl:                "/icons/general-liability.png?v=2",
  "workers-comp":    "/icons/workers-compensation.png?v=2",
};
const MOBILE_HERO_CTA: Record<string, string> = {
  auto:              "Get Covered Today →",
  home:              "Find My Best Rate →",
  bundle:            "Show My Savings →",
  "commercial-auto": "Cover My Fleet →",
  gl:                "See My Rate →",
  "workers-comp":    "Get WC Quote →",
};


// ─── Commercial quote widget component ───────────────────────────────────────

function CommercialQuoteWidget({ onOpen }: { onOpen: (productId: string) => void }) {
  const [product, setProduct]         = useState("commercial-auto");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [zip, setZip]                 = useState("");
  const [zipError, setZipError]       = useState("");
  const [zipShake, setZipShake]       = useState(false);
  const dropdownRef                   = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const selectedProduct = WIDGET_PRODUCTS.find(p => p.id === product) ?? WIDGET_PRODUCTS[0];

  const handleSubmit = () => {
    if (!/^\d{5}$/.test(zip)) {
      setZipError("Please enter a valid ZIP code");
      setZipShake(true);
      setTimeout(() => setZipShake(false), 500);
      return;
    }
    setZipError("");
    onOpen(product);
  };

  return (
    <>
      <style>{`
        @keyframes widget-entrance {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes widget-zip-shake {
          0%,100% { transform: translateX(0);  }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px);  }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px);  }
        }
        @keyframes dropdown-reveal {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .widget-zip-shake  { animation: widget-zip-shake 0.45s ease-in-out; }
        .widget-input:focus { border-color: #F5A623 !important; outline: none; box-shadow: 0 0 0 3px rgba(245,166,35,0.12) !important; }
        .widget-cta:hover   { background: #FFB84D !important; transform: translateY(-1px) !important; box-shadow: 0 6px 24px rgba(245,166,35,0.45) !important; }
        .widget-cta:active  { transform: translateY(0) !important; }
        .widget-dd-trigger:hover { border-color: #F5A623 !important; }
        .widget-dd-option:hover  { background: #F7FAFC !important; }
      `}</style>

      <div style={{
        background:    "#FFFFFF",
        borderRadius:  "20px",
        padding:       "32px",
        boxShadow:     "0 8px 40px rgba(15,42,68,0.12)",
        border:        "1px solid #E2E8F0",
        maxWidth:      "420px",
        width:         "100%",
        animation:     "widget-entrance 400ms ease-out both",
      }}>

        {/* Header */}
        <p style={{ fontSize: "18px", fontWeight: 700, color: "#0B1F33", marginBottom: "6px" }}>
          Get a Commercial Quote
        </p>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          Tell us what you need — we&apos;ll find your best rate
        </p>

        {/* Row 1 — Product custom dropdown */}
        <div style={{ marginBottom: "0" }}>
          <p style={{ fontSize: "11px", letterSpacing: "2px", color: "#64748B", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase" }}>
            Product
          </p>
          <div ref={dropdownRef} style={{ position: "relative" }}>

            {/* Trigger — selected state display */}
            <button
              type="button"
              className="widget-dd-trigger"
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "12px",
                width:          "100%",
                padding:        "12px 16px",
                background:     "#F7FAFC",
                border:         `1.5px solid ${dropdownOpen ? "#F5A623" : "#E2E8F0"}`,
                borderRadius:   "12px",
                cursor:         "pointer",
                transition:     "border-color 150ms ease, box-shadow 150ms ease",
                boxShadow:      dropdownOpen ? "0 0 0 3px rgba(245,166,35,0.12)" : "none",
                textAlign:      "left",
              }}
            >
              <Image
                src={selectedProduct.icon}
                alt={selectedProduct.label}
                width={40} height={40}
                style={{ width: "40px", height: "40px", objectFit: "contain", flexShrink: 0 }}
              />
              <span style={{ flex: 1, fontSize: "16px", fontWeight: 600, color: "#0B1F33", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {selectedProduct.label}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, transition: "transform 150ms ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path d="M4 6l4 4 4-4"/>
              </svg>
            </button>

            {/* Dropdown list */}
            {dropdownOpen && (
              <div style={{
                position:    "absolute",
                top:         "calc(100% + 6px)",
                left:        0,
                width:       "100%",
                background:  "#FFFFFF",
                border:      "1.5px solid #E2E8F0",
                borderRadius: "12px",
                boxShadow:   "0 8px 24px rgba(0,0,0,0.10)",
                zIndex:      50,
                maxHeight:   "320px",
                overflowY:   "auto",
                animation:   "dropdown-reveal 150ms ease-out both",
              }}>
                {WIDGET_PRODUCTS.map(p => {
                  const isSelected = p.id === product;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className="widget-dd-option"
                      onClick={() => { setProduct(p.id); setDropdownOpen(false); }}
                      style={{
                        display:         "flex",
                        alignItems:      "center",
                        gap:             "12px",
                        width:           "100%",
                        padding:         "12px 16px",
                        background:      isSelected ? "#FFFBF0" : "transparent",
                        border:          "none",
                        borderLeft:      isSelected ? "3px solid #F5A623" : "3px solid transparent",
                        cursor:          "pointer",
                        textAlign:       "left",
                        transition:      "background 100ms ease",
                      }}
                    >
                      <Image
                        src={p.icon}
                        alt={p.label}
                        width={32} height={32}
                        style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "15px", color: "#0B1F33", fontWeight: isSelected ? 600 : 400 }}>
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#F1F5F9", margin: "16px 0" }} />

        {/* Row 2 — ZIP */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "2px", color: "#64748B", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase" }}>
            Location
          </p>
          <div className={zipShake ? "widget-zip-shake" : ""}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              className="widget-input"
              placeholder="ZIP Code"
              value={zip}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 5);
                setZip(v);
                if (zipError) setZipError("");
              }}
              onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
              style={{
                width:        "100%",
                height:       "52px",
                padding:      "0 16px",
                fontSize:     "16px",
                fontWeight:   500,
                color:        "#0B1F33",
                background:   "#F7FAFC",
                border:       `1.5px solid ${zipError ? "#DC2626" : "#E2E8F0"}`,
                borderRadius: "12px",
                transition:   "border-color 150ms ease, box-shadow 150ms ease",
                outline:      "none",
              }}
            />
            {zipError && (
              <p style={{ fontSize: "13px", color: "#DC2626", marginTop: "6px" }}>{zipError}</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="widget-cta"
          onClick={handleSubmit}
          style={{
            width:        "100%",
            height:       "56px",
            background:   "#F5A623",
            color:        "#0B1F33",
            fontSize:     "17px",
            fontWeight:   700,
            borderRadius: "14px",
            border:       "none",
            cursor:       "pointer",
            transition:   "background 150ms ease, transform 150ms ease, box-shadow 150ms ease",
            boxShadow:    "0 4px 16px rgba(245,166,35,0.35)",
          }}
        >
          {WIDGET_CTA_LABELS[product] ?? "Get My Commercial Quote →"}
        </button>

        {/* Reassurance line */}
        <p style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", marginTop: "12px" }}>
          Free · No spam · Licensed agents · Same-day response
        </p>
      </div>
    </>
  );
}

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
  const [quoteInitialData, setQuoteInitialData]     = useState<Record<string, string>>({});
  const [commercialQuoteOpen, setCommercialQuoteOpen]   = useState(false);
  const [commercialQuoteProduct, setCommercialQuoteProduct] = useState<string | undefined>(undefined);
  // Mobile product-picker bottom sheets
  const [personalSheetOpen, setPersonalSheetOpen]     = useState(false);
  const [commercialSheetOpen, setCommercialSheetOpen] = useState(false);
  const [hoveredCard, setHoveredCard]               = useState<string | null>(null);
  const [userState,  setUserState]                  = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ZIP quick-start (personal)
  const [heroZip, setHeroZip]     = useState("");
  const [zipShake, setZipShake]   = useState(false);
  const [zipErrMsg, setZipErrMsg] = useState("");

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

  const handleZipSubmit = useCallback(() => {
    if (/^\d{5}$/.test(heroZip)) {
      setZipErrMsg("");
      setQuoteInitialData({ garageZip: heroZip });
      setQuoteProduct("auto");
      setQuoteOpen(true);
    } else {
      setZipErrMsg("Please enter a valid ZIP code");
      setZipShake(true);
      setTimeout(() => setZipShake(false), 500);
    }
  }, [heroZip]);

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
      <Header mode={mode} onGetQuote={openQuote} />

      {/* ── Hero — everything above the fold ────────────────────────────── */}
      <div style={{ position: "relative" }}>
      <section className={`relative ${isPersonal ? "hero-bg-personal pers-hero-section" : "hero-bg-commercial comm-hero-section"}`}>
        {/* Background illustration — hidden on mobile (performance) */}
        <div className="hidden md:block">
          {isPersonal ? <PersonalHeroBg /> : <CommercialHeroBg />}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          {/* ══════════════ MOBILE HERO (hidden md+) ══════════════════════ */}
          <div className="md:hidden" style={{ paddingTop: "24px", paddingBottom: "24px" }}>
          {isPersonal ? (

            /* ── PERSONAL MOBILE HERO ─────────────────────────────────── */
            <div key="mobile-personal" className="mode-fade-in">
              <style>{`
                .mob-zip-shake { animation: zip-shake 0.45s ease-in-out; }
                .mob-zip-input:focus  { outline: none; box-shadow: 0 0 0 3px rgba(245,166,35,0.15) !important; border-color: #F5A623 !important; }
                .mob-zip-btn:hover    { background: #1E3A5F !important; }
                .mob-prod-card:hover  { border-color: #F5A623 !important; box-shadow: 0 4px 12px rgba(245,166,35,0.12) !important; }
              `}</style>

              {/* 1 · Headline */}
              <h1 style={{
                fontSize: "clamp(1.8rem, 6vw, 2.2rem)",
                fontWeight: 800,
                textAlign: "center",
                color: "#0B1F33",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                padding: "0 16px",
                marginBottom: "8px",
              }}>
                Shop Insurance for All Your Needs
              </h1>

              {/* 2 · Subheadline */}
              <p style={{ textAlign: "center", fontSize: "15px", color: "#64748B", padding: "0 20px", marginBottom: "12px", lineHeight: 1.5 }}>
                We shop multiple top-rated carriers to find your best rate.
              </p>

              {/* 3 · Trust row */}
              <a
                href="https://maps.app.goo.gl/Zd8AptfZe46v9ntj8"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "center", alignItems: "center",
                  flexWrap: "wrap", gap: "6px", padding: "0 16px",
                  marginBottom: "20px", textDecoration: "none",
                  transition: "opacity 150ms ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="12" height="12" viewBox="0 0 20 20" fill="#F5A623">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
                <span style={{ fontSize: "12px", color: "#64748B" }}>5.0 · 74 Reviews</span>
                <span style={{ fontSize: "12px", color: "#CBD5E1" }}>·</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>✓ 11 States</span>
                <span style={{ fontSize: "12px", color: "#CBD5E1" }}>·</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>⚡ Same-Day</span>
              </a>

              {/* 4 · Auto Insurance widget */}
              <div style={{
                margin: "0 16px",
                background: "#FFFFFF",
                border: "2px solid #F5A623",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 4px 20px rgba(245,166,35,0.12)",
              }}>
                {/* Icon */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                  <Image
                    src="/icons/auto-insurance.png?v=2"
                    alt="Auto Insurance"
                    width={80} height={80}
                    style={{ width: "80px", height: "80px", objectFit: "contain" }}
                  />
                </div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#0B1F33", textAlign: "center", marginBottom: "4px" }}>
                  Auto Insurance
                </p>
                <p style={{ fontSize: "13px", color: "#64748B", textAlign: "center", marginBottom: "16px" }}>
                  Average savings of $800+ for drivers who switch
                </p>

                {/* ZIP input — stacked on mobile */}
                <div className={zipShake ? "mob-zip-shake" : ""}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    className="mob-zip-input"
                    placeholder="Enter your ZIP code"
                    value={heroZip}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 5);
                      setHeroZip(v);
                      if (zipErrMsg) setZipErrMsg("");
                    }}
                    onKeyDown={e => { if (e.key === "Enter") handleZipSubmit(); }}
                    style={{
                      width: "100%", height: "52px",
                      padding: "0 16px", fontSize: "16px",
                      border: `1.5px solid ${zipErrMsg ? "#DC2626" : "#E2E8F0"}`,
                      borderRadius: "10px", background: "#F7FAFC",
                      color: "#0B1F33", marginBottom: "10px", display: "block",
                      outline: "none",
                    }}
                  />
                  {zipErrMsg && (
                    <p style={{ fontSize: "13px", color: "#DC2626", marginBottom: "8px", marginTop: "-6px" }}>{zipErrMsg}</p>
                  )}
                  <button
                    type="button"
                    className="mob-zip-btn"
                    onClick={handleZipSubmit}
                    style={{
                      width: "100%", height: "52px",
                      background: "#0F2A44", color: "#FFFFFF",
                      fontSize: "16px", fontWeight: 700,
                      border: "none", borderRadius: "10px",
                      cursor: "pointer", transition: "background 150ms ease",
                    }}
                  >
                    Get a Quote →
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setQuoteProduct("auto"); setQuoteOpen(true); }}
                  style={{
                    display: "block", width: "100%", background: "none", border: "none",
                    cursor: "pointer", fontSize: "13px", color: "#64748B",
                    textAlign: "center", marginTop: "10px", padding: 0,
                  }}
                >
                  Want more info? Explore{" "}
                  <span style={{ color: "#F5A623", textDecoration: "underline" }}>Auto Insurance</span> →
                </button>
              </div>

              {/* 5 · 2×2 mini product grid */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: "10px", padding: "12px 16px 0",
              }}>
                {[
                  { id: "bundle", label: "Bundle & Save",     icon: "/icons/bundle-save.png?v=2"         },
                  { id: "home",   label: "Property Insurance", icon: "/icons/property-insurance.png?v=2"  },
                  { id: "flood",  label: "Flood Insurance",    icon: "/icons/flood-insurance.png?v=2"     },
                  { id: "all",    label: "See All Products →", icon: null                                 },
                ].map(card => (
                  <button
                    key={card.id}
                    type="button"
                    className="mob-prod-card"
                    onClick={() => {
                      if (card.id === "all") { setQuoteProduct(undefined); setQuoteOpen(true); }
                      else { setQuoteProduct(card.id); setQuoteOpen(true); }
                    }}
                    style={{
                      background: card.id === "all" ? "#F7FAFC" : "#FFFFFF",
                      border: "1px solid #E8EDF3",
                      borderRadius: "14px",
                      padding: "16px 12px",
                      textAlign: "center",
                      cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      transition: "border-color 150ms ease, box-shadow 150ms ease",
                    }}
                  >
                    {card.icon ? (
                      <Image
                        src={card.icon}
                        alt={card.label}
                        width={72} height={72}
                        style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "8px" }}
                      />
                    ) : (
                      <div style={{ width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "28px", color: "#CBD5E1" }}>＋</span>
                      </div>
                    )}
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0B1F33", lineHeight: 1.2 }}>
                      {card.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* 6 · Secondary link */}
              <div style={{ textAlign: "center", margin: "12px 0" }}>
                <a
                  href="sms:5619468261"
                  style={{ fontSize: "13px", color: "#94A3B8", textDecoration: "none", transition: "color 150ms ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748B"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#94A3B8"; }}
                >
                  Or prefer to talk? Send us a text →
                </a>
              </div>

              {/* 7 · Toggle block */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", paddingBottom: "8px" }}>
                <p style={{ fontSize: "14px", color: "#1E3A5F", fontWeight: 500, margin: 0 }}>
                  {t("toggle.headline")}
                </p>
                <div style={{ width: "100%", maxWidth: "300px" }}>
                  <Toggle mode={mode} onChange={handleModeChange} />
                </div>
                <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
                  {t("toggle.switchToCommercial")}
                </p>
              </div>
            </div>

          ) : (

            /* ── COMMERCIAL MOBILE HERO ───────────────────────────────── */
            <div key="mobile-commercial" className="mode-fade-in">

              {/* Toggle at top */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <Toggle mode={mode} onChange={handleModeChange} />
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: "clamp(1.6rem, 6vw, 2rem)",
                fontWeight: 800, textAlign: "center",
                color: "#1E3A5F", lineHeight: 1.08,
                letterSpacing: "-0.025em",
                marginBottom: "8px",
              }}>
                {t("hero.commercial.headline")}
              </h1>

              {/* Trust line */}
              <p style={{ fontSize: "12px", color: "#64748B", textAlign: "center", marginBottom: "16px" }}>
                ⭐ 5.0 Google Rating · 11 States · Same-Day
              </p>

              {/* Commercial product cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                {[...heroProducts]
                  .sort((a, b) => (a.id === "gl" ? -1 : b.id === "gl" ? 1 : 0))
                  .map(product => {
                    const isFeatured = product.id === "gl";
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductClick(product.id)}
                        style={{
                          gridColumn: isFeatured ? "span 2" : "span 1",
                          padding: "14px", borderRadius: "12px",
                          textAlign: "center", minHeight: "120px",
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center", gap: "6px",
                          border: isFeatured ? "2px solid #F5A623" : "1.5px solid #E2E8F0",
                          background: isFeatured ? "#FFFBF0" : "#FFFFFF",
                          cursor: "pointer", width: "100%",
                        }}
                      >
                        <Image
                          src={MOBILE_HERO_ICONS[product.id] ?? "/icons/general-liability.png?v=2"}
                          alt={product.title}
                          width={56} height={56}
                          style={{ width: "56px", height: "56px", objectFit: "contain" }}
                        />
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                          {product.title}
                        </span>
                        <span style={{ fontSize: "12px", color: "#F5A623", fontWeight: 600 }}>
                          {MOBILE_HERO_CTA[product.id] ?? "Get a quote →"}
                        </span>
                      </button>
                    );
                  })}
              </div>

              {/* More business policies */}
              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                <button
                  type="button"
                  onClick={() => setCommercialSheetOpen(true)}
                  style={{ fontSize: "13px", color: "#64748B", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
                >
                  More business policies →
                </button>
              </div>

              <p style={{ fontSize: "12px", textAlign: "center", color: "#94A3B8", marginBottom: "12px" }}>
                Quick quote · No commitment · Licensed agents
              </p>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#94A3B8" }}>
                {t("toggle.switchToPersonal")}
              </p>
            </div>

          )}
          </div>
          {/* ══════════════ END MOBILE HERO ════════════════════════════════ */}

          {/* ══════════════ DESKTOP HERO (hidden on mobile) ════════════════ */}
          <div className="hidden md:block">

          {/* ── PERSONAL: Centered headline + product grid ── */}
          {isPersonal ? (
            <div key="personal-hero" className="mode-fade-in">
              <style>{`
                @keyframes zip-shake {
                  0%,100% { transform: translateX(0);  }
                  20%     { transform: translateX(-6px); }
                  40%     { transform: translateX(6px);  }
                  60%     { transform: translateX(-4px); }
                  80%     { transform: translateX(4px);  }
                }
                .zip-shake { animation: zip-shake 0.45s ease-in-out; }
                .hero-zip-btn:hover  { background: #1E3A5F !important; }
                .hero-zip-in:focus   { outline: none; box-shadow: 0 0 0 3px rgba(245,166,35,0.15) !important; }
                .pers-prod-card:hover {
                  border-color: #F5A623 !important;
                  box-shadow: 0 4px 16px rgba(245,166,35,0.12) !important;
                  transform: translateY(-2px) !important;
                }
                @media (max-width: 900px) {
                  .pers-product-grid { grid-template-columns: 1fr !important; }
                  .pers-mini-grid    { grid-template-columns: 1fr 1fr !important; }
                }
              `}</style>

              {/* Part A — Headline + trust row */}
              <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto", padding: "0 24px 28px" }}>
                <h1 style={{
                  fontSize: "clamp(2.2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  color: "#0B1F33",
                  lineHeight: 1.15,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}>
                  Shop Insurance for All Your Needs
                </h1>
                <p style={{ fontSize: "18px", color: "#64748B", marginBottom: "20px", lineHeight: 1.55 }}>
                  We shop multiple top-rated carriers to find your best rate.
                </p>

                {/* Trust row */}
                <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
                  <a
                    href="https://maps.app.goo.gl/Zd8AptfZe46v9ntj8"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", transition: "opacity 150ms ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="14" height="14" viewBox="0 0 20 20" fill="#F5A623">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                    <span style={{ fontSize: "13px", color: "#64748B", marginLeft: "2px" }}>5.0 · 74 Google Reviews</span>
                  </a>
                  <span style={{ color: "#CBD5E1", fontSize: "13px" }}>·</span>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>✓ 11 Licensed States</span>
                  <span style={{ color: "#CBD5E1", fontSize: "13px" }}>·</span>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>⚡ Same-Day Response</span>
                  <span style={{ color: "#CBD5E1", fontSize: "13px" }}>·</span>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>🔒 No Spam · No Calls</span>
                </div>
              </div>

              {/* Part B — Product grid */}
              <div
                className="pers-product-grid"
                style={{
                  maxWidth: "1000px",
                  margin: "0 auto",
                  padding: "0 24px 40px",
                  display: "grid",
                  gridTemplateColumns: "55% 45%",
                  gap: "16px",
                  alignItems: "start",
                }}
              >
                {/* LEFT — Auto hero widget */}
                <div style={{
                  background:   "#FFFFFF",
                  border:       "2px solid #F5A623",
                  borderRadius: "20px",
                  padding:      "28px",
                  boxShadow:    "0 8px 32px rgba(245,166,35,0.15)",
                }}>
                  <div style={{ minHeight: "120px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <Image
                      src="/icons/auto-insurance.png?v=2"
                      alt="Auto Insurance"
                      width={110} height={110}
                      style={{ width: "110px", height: "110px", objectFit: "contain", display: "block" }}
                    />
                  </div>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "#0B1F33", marginBottom: "4px" }}>
                    Auto Insurance
                  </p>
                  <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "20px" }}>
                    Average savings of $800+ for drivers who switch
                  </p>

                  {/* ZIP row */}
                  <p style={{ fontSize: "11px", letterSpacing: "2px", color: "#94A3B8", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase" }}>
                    Location
                  </p>
                  <div className={zipShake ? "zip-shake" : ""} style={{ marginBottom: "12px" }}>
                    <div style={{
                      display:      "flex",
                      gap:          0,
                      borderRadius: "12px",
                      overflow:     "hidden",
                      border:       `1.5px solid ${zipErrMsg ? "#DC2626" : "#E2E8F0"}`,
                    }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        className="hero-zip-in"
                        placeholder="ZIP Code"
                        value={heroZip}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 5);
                          setHeroZip(v);
                          if (zipErrMsg) setZipErrMsg("");
                        }}
                        onKeyDown={e => { if (e.key === "Enter") handleZipSubmit(); }}
                        style={{
                          flex:       1,
                          height:     "52px",
                          padding:    "0 16px",
                          fontSize:   "16px",
                          border:     "none",
                          outline:    "none",
                          background: "#F7FAFC",
                          color:      "#0B1F33",
                          fontWeight: 500,
                        }}
                      />
                      <button
                        type="button"
                        className="hero-zip-btn"
                        onClick={handleZipSubmit}
                        style={{
                          width:       "160px",
                          height:      "52px",
                          background:  "#0F2A44",
                          color:       "#FFFFFF",
                          fontSize:    "15px",
                          fontWeight:  700,
                          border:      "none",
                          cursor:      "pointer",
                          whiteSpace:  "nowrap",
                          flexShrink:  0,
                          transition:  "background 150ms ease",
                        }}
                      >
                        Get a Quote →
                      </button>
                    </div>
                    {zipErrMsg && (
                      <p style={{ fontSize: "13px", color: "#DC2626", marginTop: "6px" }}>{zipErrMsg}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => { setQuoteProduct("auto"); setQuoteOpen(true); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "13px", color: "#64748B", textAlign: "left" }}
                  >
                    Want more info first? Explore:{" "}
                    <span style={{ color: "#F5A623", textDecoration: "underline" }}>Auto Insurance</span> →
                  </button>
                </div>

                {/* RIGHT — 2×2 mini product grid */}
                <div
                  className="pers-mini-grid"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
                >
                  {[
                    { id: "bundle", label: "Bundle & Save",       icon: "/icons/bundle-save.png?v=2"    },
                    { id: "home",   label: "Property Insurance",   icon: "/icons/property-insurance.png?v=2" },
                    { id: "flood",  label: "Flood Insurance",      icon: "/icons/flood-insurance.png?v=2" },
                    { id: "all",    label: "See All Products →",   icon: null },
                  ].map(card => (
                    <button
                      key={card.id}
                      type="button"
                      className="pers-prod-card"
                      onClick={() => {
                        if (card.id === "all") { setQuoteProduct(undefined); setQuoteOpen(true); }
                        else { setQuoteProduct(card.id); setQuoteOpen(true); }
                      }}
                      style={{
                        background:    card.id === "all" ? "#F7FAFC" : "#FFFFFF",
                        border:        "1px solid #E8EDF3",
                        borderRadius:  "16px",
                        padding:       "16px 12px",
                        textAlign:     "center",
                        cursor:        "pointer",
                        transition:    "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                        display:       "flex",
                        flexDirection: "column",
                        alignItems:    "center",
                      }}
                    >
                      {card.icon ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                          <Image
                            src={card.icon}
                            alt={card.label}
                            width={120} height={120}
                            style={{ width: "120px", height: "120px", objectFit: "contain" }}
                          />
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                          <span style={{ fontSize: "32px", color: "#CBD5E1" }}>＋</span>
                        </div>
                      )}
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "#0B1F33", lineHeight: 1.2 }}>
                        {card.label}
                      </span>
                      {card.id === "all" && (
                        <span style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
                          See renters, condo, umbrella & more
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Below grid */}
              <div style={{ textAlign: "center", paddingBottom: "16px" }}>
                <a
                  href="sms:5619468261"
                  style={{ fontSize: "14px", color: "#94A3B8", textDecoration: "none", transition: "color 150ms ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748B"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#94A3B8"; }}
                >
                  Or prefer to talk? Send us a text →
                </a>
              </div>

              {/* Toggle block — below product grid */}
              <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
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
            </div>

          ) : (

            /* ── COMMERCIAL: Split layout ── */
            <div style={{ display: "flex", flexDirection: "column" }}>

              {/* Split row: headline left + widget right */}
              <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-center">

                {/* LEFT — headline, sub, microcopy, trust */}
                <div className="lg:w-[50%] text-center lg:text-left">
                  <div key={mode} className="mode-fade-in">
                    <h1
                      className="font-black tracking-[-0.03em] mb-3"
                      style={{ color: "#1E3A5F", fontSize: "clamp(2.4rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15 }}
                    >
                      {t(`hero.${mode}.headline`)}
                    </h1>
                    <p className="leading-relaxed mb-2 max-w-md mx-auto lg:mx-0"
                      style={{ color: "#1A1A1A", fontSize: "18px", lineHeight: 1.65 }}>
                      {heroSub[mode]}
                    </p>
                    <p className="max-w-md mx-auto lg:mx-0" style={{ fontSize: "14px", color: "#4B5563", marginTop: "4px", marginBottom: "20px" }}>
                      ⚡ Quick quote · No commitment · Licensed local agents
                    </p>

                    {/* Trust block */}
                    <div className="flex flex-col items-center lg:items-start" style={{ marginBottom: "20px" }}>
                      <a
                        href="https://maps.app.goo.gl/Zd8AptfZe46v9ntj8"
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", textDecoration: "none", cursor: "pointer" }}
                        onMouseEnter={e => { const t = (e.currentTarget as HTMLAnchorElement).querySelector(".trust-rating-text") as HTMLElement | null; if (t) t.style.textDecoration = "underline"; }}
                        onMouseLeave={e => { const t = (e.currentTarget as HTMLAnchorElement).querySelector(".trust-rating-text") as HTMLElement | null; if (t) t.style.textDecoration = "none"; }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" aria-label="Google" style={{ flexShrink: 0 }}>
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <div style={{ display: "flex", gap: "1px" }}>
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="20" height="20" viewBox="0 0 20 20" fill="#F5A623">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                        <span style={{ fontSize: "13px", color: "#334155", fontWeight: 600 }}>5.0</span>
                        <span style={{ fontSize: "13px", color: "#64748B" }}>·</span>
                        <span className="trust-rating-text" style={{ fontSize: "13px", color: "#334155", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                          74 Google Reviews
                        </span>
                      </a>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {["✓ 11 Licensed States", "⚡ Same-Day Coverage", "🔒 No Spam · No Calls"].map(pill => (
                          <span key={pill} style={{ background: "transparent", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "4px 12px", fontSize: "14px", color: "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>
                            {pill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — commercial widget */}
                <div id="products" className="lg:w-[50%]" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <CommercialQuoteWidget
                    key="comm-widget"
                    onOpen={(productId) => {
                      setCommercialQuoteProduct(productId);
                      setCommercialQuoteOpen(true);
                    }}
                  />
                  <a
                    href="sms:5619468261"
                    style={{ display: "block", fontSize: "14px", color: "#64748B", textDecoration: "none", textAlign: "center", marginTop: "16px", width: "100%", maxWidth: "420px" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#0F2A44"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748B"; }}
                  >
                    Not sure what you need? Talk to an agent →
                  </a>
                </div>

              </div>{/* end split row */}

              {/* Toggle block — full width, centered, below split row */}
              <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <p style={{ fontSize: "13px", color: "#1E3A5F", fontWeight: 500 }}>
                  {t("toggle.headline")}
                </p>
                <Toggle mode={mode} onChange={handleModeChange} />
                <span style={{ fontSize: "12px", color: "#64748B", whiteSpace: "nowrap" }}>
                  {t("toggle.switchToPersonal")}
                </span>
              </div>

            </div>
          )}

          <div className="pb-8" />
          </div>{/* end desktop hero */}
        </div>

      </section>

      </div>{/* end hero wrapper */}

      {/* ── Commercial credibility bar ────────────────────────────────────── */}
      {!isPersonal && (
        <div
          style={{
            background: "#0F2A44",
            padding:    "20px 0",
            width:      "100%",
          }}
        >
          <div
            className="max-w-7xl mx-auto px-6"
            style={{
              display:     "flex",
              alignItems:  "center",
              gap:         "24px",
              flexWrap:    "wrap",
            }}
          >
            {/* Left — trust statement */}
            <p
              style={{
                fontSize:   "14px",
                color:      "rgba(255,255,255,0.85)",
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
                flex:       "0 0 auto",
              }}
            >
              Trusted by 500+ businesses across 11 states
            </p>

            {/* Divider */}
            <div
              className="hidden sm:block"
              style={{
                width:      "1px",
                height:     "28px",
                background: "rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            />

            {/* Right — badge pills */}
            <div
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        "10px",
                flexWrap:   "wrap",
              }}
            >
              {[
                { label: "A+ Rated Carriers",      mobileHide: false },
                { label: "Licensed in 11 States",  mobileHide: false },
                { label: "Independent Agent",       mobileHide: true  },
                { label: "Same-Day Certificates",   mobileHide: true  },
              ].map(badge => (
                <span
                  key={badge.label}
                  className={badge.mobileHide ? "hidden sm:inline-flex" : "inline-flex"}
                  style={{
                    alignItems:      "center",
                    background:      "rgba(255,255,255,0.08)",
                    border:          "1px solid rgba(255,255,255,0.15)",
                    borderRadius:    "8px",
                    padding:         "6px 14px",
                    fontSize:        "12px",
                    color:           "rgba(255,255,255,0.90)",
                    fontWeight:      500,
                    whiteSpace:      "nowrap",
                  }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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
          initialData={quoteInitialData}
          onClose={() => { setQuoteOpen(false); setQuoteProduct(undefined); setQuoteInitialData({}); }}
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
