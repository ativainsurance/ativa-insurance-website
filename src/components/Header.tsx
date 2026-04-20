"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { Mode, Language } from "@/types";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
];

interface HeaderProps {
  mode:        Mode;
  onGetQuote?: () => void;
}

export default function Header({ mode, onGetQuote }: HeaderProps) {
  // On pages without a quote modal, navigate to homepage with modal trigger
  const handleGetQuote = onGetQuote ?? (() => { window.location.href = "/?openQuote=personal"; });
  const { lang, setLang, t } = useLanguage();
  const isPersonal = mode === "personal";
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Sticky scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close tools dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const accentColor = "#F5A623";
  const logoSrc     = isPersonal ? "/logos/Personal Logo.png" : "/logos/Commercial logo.png";

  // ── Shared desktop nav link style ──────────────────────────────────────────
  const navLink = (active: boolean) => ({
    color:        active ? "#0F2A44" : "#0F2A44",
    fontSize:     "15px",
    fontWeight:   active ? 600 : 500,
    paddingTop:   "12px",
    paddingBottom:"12px",
    paddingLeft:  "10px",
    paddingRight: "10px",
    borderBottom: active ? `2px solid ${accentColor}` : "2px solid transparent",
    display:      "inline-block" as const,
    textDecoration: "none" as const,
    transition:   "color 150ms ease",
  });

  return (
    <>
      <style>{`
        @keyframes menu-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .mobile-menu-enter { animation: menu-fade-in 0.18s ease; }

        /* Desktop nav hover — gold text, no bg flash */
        .nav-link-desk:hover { color: #F5A623 !important; }

        /* Phone link */
        .nav-phone:hover { color: #F5A623 !important; }

        /* Get a Quote CTA */
        .nav-cta-btn {
          background:    #F5A623;
          color:         #0B1F33;
          border:        none;
          border-radius: 8px;
          padding:       8px 16px;
          font-size:     14px;
          font-weight:   600;
          cursor:        pointer;
          transition:    background 150ms ease, transform 150ms ease;
          white-space:   nowrap;
        }
        .nav-cta-btn:hover {
          background:  #FFB84D;
          transform:   translateY(-1px);
        }

        /* Mobile menu items */
        .mobile-menu-link {
          display:         flex;
          align-items:     center;
          justify-content: space-between;
          min-height:      52px;
          padding:         0 12px;
          border-radius:   12px;
          font-size:       15px;
          font-weight:     500;
          color:           #0F2A44;
          text-decoration: none;
          transition:      background-color 150ms ease;
        }
        .mobile-menu-link:active { background-color: #F1F5F9; }
        .mobile-menu-contact {
          display:         flex;
          align-items:     center;
          gap:             10px;
          min-height:      52px;
          padding:         0 12px;
          border-radius:   12px;
          font-size:       15px;
          font-weight:     600;
          color:           #0F2A44;
          text-decoration: none;
          transition:      background-color 150ms ease;
        }
        .mobile-menu-contact:active { background-color: #FFF8EC; }
      `}</style>

      {/* ── Main header bar ──────────────────────────────────────────────── */}
      <header
        className="w-full sticky top-0 z-40"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom:    "1px solid #E2E8F0",
          boxShadow:       scrolled ? "0 2px 20px rgba(0,0,0,0.10)" : "0 1px 8px rgba(0,0,0,0.06)",
          transition:      "box-shadow 0.2s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">

          {/* ── Logo ────────────────────────────────────────────────────── */}
          <Link href="/?tab=personal" className="flex items-center shrink-0" style={{ minWidth: "160px" }}>
            {isPersonal ? (
              <Image
                key="logo-personal"
                src="/logos/personal-logo-v2.png"
                alt="Ativa Insurance"
                width={160}
                height={40}
                quality={100}
                priority
                style={{ width: "auto", height: "40px", objectFit: "contain", objectPosition: "left center" }}
              />
            ) : (
              <Image
                key="logo-commercial"
                src="/logos/commercial-logo-v2.png"
                alt="Ativa Insurance"
                width={160}
                height={40}
                quality={100}
                priority
                style={{ width: "auto", height: "40px", objectFit: "contain", objectPosition: "left center" }}
              />
            )}
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────────────── */}
          {/* Order: Home · Commercial · Tools · FAQ · Blog | Phone | Lang | CTA */}
          <nav className="hidden md:flex items-center gap-0.5">

            <Link
              href="/?tab=personal"
              className="nav-link-desk"
              style={navLink(isPersonal)}
            >
              Home
            </Link>

            <Link
              href="/?tab=commercial"
              className="nav-link-desk"
              style={navLink(!isPersonal)}
            >
              Commercial
            </Link>

            {/* Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen((o) => !o)}
                className="nav-link-desk flex items-center gap-1"
                style={{
                  ...navLink(false),
                  display:    "flex",
                  background: "none",
                  border:     "none",
                  cursor:     "pointer",
                }}
              >
                {t("nav.tools")}
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  style={{
                    width:      "12px",
                    height:     "12px",
                    opacity:    0.5,
                    transform:  toolsOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.15s",
                    flexShrink: 0,
                  }}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {toolsOpen && (
                <div
                  className="absolute top-full left-0 mt-1.5 w-52 rounded-xl border py-1.5 shadow-xl"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", zIndex: 60 }}
                >
                  <Link
                    href="/rce-calculator"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-black/5 transition-colors duration-100"
                    style={{ color: "#0F2A44" }}
                  >
                    <svg viewBox="0 0 20 20" fill={accentColor} style={{ width: "16px", height: "16px", flexShrink: 0 }}>
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    {t("nav.rceCalculator")}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/faq"
              className="nav-link-desk"
              style={navLink(false)}
            >
              {t("nav.faq")}
            </Link>

            <Link
              href="/blog"
              className="nav-link-desk"
              style={navLink(false)}
            >
              {t("nav.blog")}
            </Link>

          </nav>

          {/* ── Right cluster ──────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">

            {/* Phone number */}
            <a
              href="tel:5619468261"
              className="nav-phone flex items-center gap-1.5"
              style={{
                color:          "#0F2A44",
                fontSize:       "15px",
                fontWeight:     500,
                textDecoration: "none",
                transition:     "color 150ms ease",
              }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "15px", height: "15px", flexShrink: 0 }}>
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              561-946-8261
            </a>

            {/* Separator */}
            <span style={{ width: "1px", height: "20px", backgroundColor: "#E2E8F0", flexShrink: 0 }} />

            {/* Language switcher */}
            <div
              className="flex items-center gap-0.5 p-1 rounded-full"
              style={{ background: "#F1F5F9" }}
            >
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className="rounded-full font-bold tracking-wider transition-colors duration-150"
                  style={{
                    fontSize: "12px",
                    minWidth: "44px",
                    minHeight: "36px",
                    padding: "6px 10px",
                    ...(lang === code
                      ? { backgroundColor: accentColor, color: "#0B1F33" }
                      : { color: "#64748B" }),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Get a Quote CTA */}
            <button
              type="button"
              className="nav-cta-btn"
              onClick={handleGetQuote}
            >
              Get a Quote
            </button>

          </div>

          {/* ── Mobile hamburger ──────────────────────────────────────── */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "#0F2A44" }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "24px", height: "24px" }}>
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

        </div>
      </header>

      {/* ── Full-screen mobile menu overlay ──────────────────────────────── */}
      {menuOpen && (
        <div
          className="mobile-menu-enter fixed inset-0 z-50 md:hidden flex flex-col"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 shrink-0"
            style={{ height: "64px", borderBottom: "1px solid #E2E8F0" }}
          >
            <Link href="/?tab=personal" onClick={() => setMenuOpen(false)} className="flex items-center" style={{ minWidth: "140px" }}>
              {isPersonal ? (
                <Image
                  src="/logos/personal-logo-v2.png"
                  alt="Ativa Insurance"
                  width={160}
                  height={40}
                  quality={100}
                  priority
                  style={{ width: "auto", height: "40px", objectFit: "contain", objectPosition: "left center" }}
                />
              ) : (
                <Image
                  src="/logos/commercial-logo-v2.png"
                  alt="Ativa Insurance"
                  width={160}
                  height={40}
                  quality={100}
                  priority
                  style={{ width: "auto", height: "40px", objectFit: "contain", objectPosition: "left center" }}
                />
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex items-center justify-center rounded-full"
              style={{ backgroundColor: "#F1F5F9", color: "#0F2A44", width: "44px", height: "44px", flexShrink: 0 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px" }}>
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Scrollable nav area */}
          <div className="flex-1 overflow-y-auto px-4 py-3">

            <Link
              href="/?tab=personal"
              onClick={() => setMenuOpen(false)}
              className="mobile-menu-link"
              style={{ fontWeight: isPersonal ? 700 : 500, backgroundColor: isPersonal ? "#F8FAFF" : "transparent" }}
            >
              <span>Home</span>
              {isPersonal && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: accentColor, color: "#0B1F33" }}>
                  Active
                </span>
              )}
            </Link>

            <Link
              href="/?tab=commercial"
              onClick={() => setMenuOpen(false)}
              className="mobile-menu-link"
              style={{ fontWeight: !isPersonal ? 700 : 500, backgroundColor: !isPersonal ? "#FFFBF0" : "transparent" }}
            >
              <span>Commercial</span>
              {!isPersonal && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: accentColor, color: "#0B1F33" }}>
                  Active
                </span>
              )}
            </Link>

            <Link href="/rce-calculator" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
              <span>Tools</span>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "16px", height: "16px", opacity: 0.3 }}>
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </Link>

            <Link href="/faq" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
              <span>{t("nav.faq")}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "16px", height: "16px", opacity: 0.3 }}>
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </Link>

            <Link href="/blog" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
              <span>{t("nav.blog")}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "16px", height: "16px", opacity: 0.3 }}>
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </Link>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#E2E8F0", margin: "8px 0" }} />

            {/* Contact links */}
            <a href="tel:5619468261" onClick={() => setMenuOpen(false)} className="mobile-menu-contact" style={{ color: "#0F2A44" }}>
              <span className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ backgroundColor: "#FFF8EC" }}>
                <svg viewBox="0 0 20 20" fill={accentColor} style={{ width: "16px", height: "16px" }}>
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </span>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 600 }}>Call Us</p>
                <p style={{ fontSize: "13px", color: "#64748B", fontWeight: 400 }}>561-946-8261</p>
              </div>
            </a>

            <a href="sms:5619468261" onClick={() => setMenuOpen(false)} className="mobile-menu-contact" style={{ color: "#0F2A44" }}>
              <span className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ backgroundColor: "#FFF8EC" }}>
                <svg viewBox="0 0 20 20" fill={accentColor} style={{ width: "16px", height: "16px" }}>
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd"/>
                </svg>
              </span>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 600 }}>Send Us a Text</p>
                <p style={{ fontSize: "13px", color: "#64748B", fontWeight: 400 }}>Quick response guaranteed</p>
              </div>
            </a>

            {/* Get a Quote — mobile */}
            <div style={{ marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); handleGetQuote(); }}
                style={{
                  width:        "100%",
                  height:       "48px",
                  background:   accentColor,
                  color:        "#0B1F33",
                  border:       "none",
                  borderRadius: "12px",
                  fontSize:     "15px",
                  fontWeight:   700,
                  cursor:       "pointer",
                }}
              >
                Get a Quote
              </button>
            </div>

          </div>

          {/* Bottom dock: language + social */}
          <div className="shrink-0 px-5 py-5" style={{ borderTop: "1px solid #E2E8F0" }}>

            {/* Language toggle */}
            <div className="flex items-center justify-center gap-1 mb-5">
              <span style={{ fontSize: "12px", color: "#94A3B8", marginRight: "8px", fontWeight: 500 }}>Language:</span>
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className="px-4 py-2 rounded-full text-sm font-bold tracking-wider transition-colors duration-150"
                  style={
                    lang === code
                      ? { backgroundColor: accentColor, color: "#0B1F33" }
                      : { backgroundColor: "#F1F5F9", color: "#64748B" }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center justify-center gap-6">
              <a href="https://www.facebook.com/ativainsurance/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: "#64748B", display: "flex" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/ativainsurance" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: "#64748B", display: "flex" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://maps.app.goo.gl/Zd8AptfZe46v9ntj8" target="_blank" rel="noopener noreferrer" aria-label="Google Reviews" style={{ color: "#64748B", display: "flex" }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
