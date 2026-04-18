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
  mode: Mode;
}

export default function Header({ mode }: HeaderProps) {
  const { lang, setLang, t } = useLanguage();
  const isPersonal = mode === "personal";
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const accentColor = "#F5A623";

  // Navbar is always white — links are always dark
  const navLinkStyle = {
    color: "#0F2A44",
    fontSize: "0.875rem",
    fontWeight: 500,
  };

  return (
    <>
      <header
        className="w-full sticky top-0 z-40 mode-transition"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.10)" : "0 1px 8px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-28 flex items-center justify-between gap-4">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              key={mode}
              src={isPersonal ? "/logos/Personal Logo.png" : "/logos/Commercial logo.png"}
              alt="Ativa Insurance - Independent Insurance Agency"
              width={120}
              height={64}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">

            {/* Home link */}
            <Link
              href="/?tab=personal"
              className="px-3 hover:bg-black/5 transition-colors duration-150"
              style={{
                ...navLinkStyle,
                fontWeight: isPersonal ? 600 : 500,
                borderBottom: isPersonal ? "2px solid #F5A623" : "2px solid transparent",
                borderRadius: "0",
                paddingTop: "8px",
                paddingBottom: "6px",
                display: "inline-block",
              }}
            >
              Home
            </Link>

            {/* Commercial link */}
            <Link
              href="/?tab=commercial"
              className="px-3 hover:bg-black/5 transition-colors duration-150"
              style={{
                ...navLinkStyle,
                fontWeight: !isPersonal ? 600 : 500,
                borderBottom: !isPersonal ? "2px solid #F5A623" : "2px solid transparent",
                borderRadius: "0",
                paddingTop: "8px",
                paddingBottom: "6px",
                display: "inline-block",
              }}
            >
              Commercial
            </Link>

            {/* Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors duration-150"
                style={navLinkStyle}
              >
                {t("nav.tools")}
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3.5 h-3.5 opacity-60"
                  style={{ transform: toolsOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {toolsOpen && (
                <div
                  className="absolute top-full left-0 mt-1.5 w-52 rounded-xl border py-1.5 shadow-xl"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E2E8F0",
                  }}
                >
                  <Link
                    href="/rce-calculator"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-black/5 transition-colors duration-100"
                    style={{ color: "#0F2A44" }}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: accentColor }}>
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    {t("nav.rceCalculator")}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/faq"
              className="px-3 py-2 rounded-lg hover:bg-black/5 transition-colors duration-150"
              style={navLinkStyle}
            >
              {t("nav.faq")}
            </Link>

            <Link
              href="/blog"
              className="px-3 py-2 rounded-lg hover:bg-black/5 transition-colors duration-150"
              style={navLinkStyle}
            >
              {t("nav.blog")}
            </Link>

            <a
              href="tel:5619468261"
              className="px-3 py-2 rounded-lg hover:bg-black/5 transition-colors duration-150 flex items-center gap-1.5"
              style={navLinkStyle}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              561-946-8261
            </a>
          </nav>

          {/* ── Right cluster ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Social icons — desktop only */}
            <div className="hidden md:flex items-center" style={{ gap: "12px", marginRight: "4px" }}>
              {/* Facebook */}
              <a href="https://www.facebook.com/ativainsurance/" target="_blank" rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: "#64748B", transition: "color 200ms ease, transform 200ms ease", display: "flex" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#F5A623"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#64748B"; el.style.transform = "translateY(0)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/ativainsurance" target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "#64748B", transition: "color 200ms ease, transform 200ms ease", display: "flex" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#F5A623"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#64748B"; el.style.transform = "translateY(0)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* Google Reviews */}
              <a href="https://maps.app.goo.gl/Zd8AptfZe46v9ntj8" target="_blank" rel="noopener noreferrer"
                aria-label="Google Reviews"
                style={{ color: "#64748B", transition: "color 200ms ease, transform 200ms ease", display: "flex" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#F5A623"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#64748B"; el.style.transform = "translateY(0)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </a>
            </div>

            {/* Language switcher */}
            <div
              className="flex items-center gap-0.5 p-1 rounded-full"
              style={{ background: "#F1F5F9" }}
            >
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className="px-2.5 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors duration-150"
                  style={
                    lang === code
                      ? { backgroundColor: "var(--accent)", color: "var(--accent-contrast)" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "var(--text)" }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ─────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className="fixed top-28 left-0 right-0 z-30 md:hidden overflow-hidden"
        style={{
          maxHeight: menuOpen ? "420px" : "0",
          transition: "max-height 0.3s ease",
          backgroundColor: "#FFFFFF",
          borderBottom: menuOpen ? "1px solid #E2E8F0" : "none",
        }}
      >
        <nav className="px-4 py-4 flex flex-col gap-1">
          {/* Home / Commercial tab links */}
          <Link
            href="/?tab=personal"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-3 py-3 text-sm rounded-xl"
            style={{ color: "var(--text)", fontWeight: isPersonal ? 600 : 500, backgroundColor: isPersonal ? "#F1F5F9" : "transparent" }}
          >
            Home
            {isPersonal && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F5A623" }} />}
          </Link>
          <Link
            href="/?tab=commercial"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-3 py-3 text-sm rounded-xl"
            style={{ color: "var(--text)", fontWeight: !isPersonal ? 600 : 500, backgroundColor: !isPersonal ? "#F1F5F9" : "transparent" }}
          >
            Commercial
            {!isPersonal && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F5A623" }} />}
          </Link>

          <div className="my-1 border-t" style={{ borderColor: "#E2E8F0" }} />

          {/* Tools group */}
          <p className="px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {t("nav.tools")}
          </p>
          <Link
            href="/rce-calculator"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ color: "var(--text)" }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: accentColor }}>
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span className="text-sm font-medium">{t("nav.rceCalculator")}</span>
          </Link>

          <div className="my-1 border-t" style={{ borderColor: "#E2E8F0" }} />

          <Link
            href="/faq"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-3 text-sm font-medium rounded-xl"
            style={{ color: "var(--text)" }}
          >
            {t("nav.faq")}
          </Link>
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-3 text-sm font-medium rounded-xl"
            style={{ color: "var(--text)" }}
          >
            {t("nav.blog")}
          </Link>
          <a
            href="tel:5619468261"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-3 text-sm font-semibold rounded-xl"
            style={{ color: accentColor }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            561-946-8261
          </a>
        </nav>
      </div>
    </>
  );
}
