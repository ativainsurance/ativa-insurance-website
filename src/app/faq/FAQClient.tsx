"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { FAQ_DATA, type FAQLang, type FAQSection } from "@/data/faqData";

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  highlight,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  highlight: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  function mark(text: string, term: string): React.ReactNode {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ backgroundColor: "#FEF08A", borderRadius: "2px", padding: "0 1px" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  return (
    <div
      style={{
        borderBottom: "1px solid var(--faq-border)",
        transition: "background-color 0.15s ease",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left flex items-start justify-between gap-4 py-5 px-1"
        style={{ color: "var(--text)" }}
      >
        <span
          className="text-base font-semibold leading-snug"
          style={{ color: isOpen ? "var(--accent)" : "var(--text)" }}
        >
          {mark(question, highlight)}
        </span>
        <span
          className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isOpen ? "var(--accent)" : "transparent",
            border: `1.5px solid ${isOpen ? "var(--accent)" : "var(--faq-border)"}`,
            transition: "all 0.2s ease",
          }}
        >
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke={isOpen ? "var(--accent-contrast)" : "var(--text-muted)"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
            style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </span>
      </button>

      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? (contentRef.current?.scrollHeight ?? 500) + "px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <p
          className="pb-5 px-1 text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {mark(answer, highlight)}
        </p>
      </div>
    </div>
  );
}

// ─── Section block ─────────────────────────────────────────────────────────────

function SectionBlock({
  section,
  openId,
  onToggle,
  search,
}: {
  section: FAQSection;
  openId: string | null;
  onToggle: (id: string) => void;
  search: string;
}) {
  const filteredItems = useMemo(() => {
    if (!search.trim()) return section.items;
    const term = search.toLowerCase();
    return section.items.filter(
      (item) =>
        item.q.toLowerCase().includes(term) ||
        item.a.toLowerCase().includes(term)
    );
  }, [section.items, search]);

  if (filteredItems.length === 0) return null;

  return (
    <div id={`section-${section.id}`} className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{section.icon}</span>
        <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          {section.title}
        </h2>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "var(--faq-pill-bg)",
            color: "var(--faq-pill-text)",
          }}
        >
          {filteredItems.length}
        </span>
      </div>

      <div
        className="rounded-2xl px-5"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--faq-border)",
        }}
      >
        {filteredItems.map((item, idx) => {
          const uid = `${section.id}-${idx}`;
          return (
            <AccordionItem
              key={uid}
              question={item.q}
              answer={item.a}
              isOpen={openId === uid}
              onToggle={() => onToggle(uid)}
              highlight={search}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Main FAQ content ─────────────────────────────────────────────────────────

function FAQContent() {
  const { lang, t } = useLanguage();
  const [search, setSearch]   = useState("");
  const [openId, setOpenId]   = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("general");
  const mainRef = useRef<HTMLDivElement>(null);

  const sections: FAQSection[] = FAQ_DATA[lang as FAQLang] ?? FAQ_DATA["en"];

  const totalFiltered = useMemo(() => {
    if (!search.trim()) return sections.reduce((n, s) => n + s.items.length, 0);
    const term = search.toLowerCase();
    return sections.reduce(
      (n, s) =>
        n +
        s.items.filter(
          (i) => i.q.toLowerCase().includes(term) || i.a.toLowerCase().includes(term)
        ).length,
      0
    );
  }, [sections, search]);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("section-", "");
            setActiveSection(id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  function scrollToSection(id: string) {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function toggleItem(uid: string) {
    setOpenId((prev) => (prev === uid ? null : uid));
  }

  // Reset open item when search changes
  useEffect(() => { setOpenId(null); }, [search]);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* CSS custom props for FAQ theming (personal mode) */}
      <style>{`
        :root {
          --faq-border: #E2E8F0;
          --faq-pill-bg: #EEF2FF;
          --faq-pill-text: #1B3A6B;
          --faq-search-ring: #1B3A6B33;
        }
      `}</style>

      <Header mode="personal" />
      <main className="flex-1">

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1B3A6B 0%, #2D5499 60%, #1B3A6B 100%)",
          padding: "3rem 1.5rem 2.5rem",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {t("faq.eyebrow") !== "faq.eyebrow" ? t("faq.eyebrow") : "Knowledge Center"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "#FFFFFF" }}>
            {t("faq.heading") !== "faq.heading" ? t("faq.heading") : "Frequently Asked Questions"}
          </h1>
          <p className="text-base mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
            {t("faq.sub") !== "faq.sub"
              ? t("faq.sub")
              : "Everything you need to know about insurance, explained simply."}
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.45)", width: "1.125rem", height: "1.125rem" }}
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                t("faq.searchPlaceholder") !== "faq.searchPlaceholder"
                  ? t("faq.searchPlaceholder")
                  : "Search all questions…"
              }
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                color: "#FFFFFF",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#FFFFFF" }}
              >
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
              </button>
            )}
          </div>

          {search && (
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              {totalFiltered}{" "}
              {totalFiltered === 1 ? "result" : "results"} for "{search}"
            </p>
          )}
        </div>
      </div>

      {/* ── Body: sidebar + content ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-8">

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div
              className="sticky top-24 rounded-2xl p-4"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--faq-border)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3 px-2"
                style={{ color: "var(--text-muted)" }}
              >
                {t("faq.sections") !== "faq.sections" ? t("faq.sections") : "Sections"}
              </p>
              {sections.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className="w-full text-left flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-sm transition-colors duration-100"
                    style={{
                      backgroundColor: isActive ? "var(--faq-pill-bg)" : "transparent",
                      color: isActive ? "var(--faq-pill-text)" : "var(--text-muted)",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <span>{s.icon}</span>
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Mobile section tabs */}
          <div className="lg:hidden -mx-4 sm:-mx-6 mb-6 px-4 sm:px-6 overflow-x-auto">
            <div className="flex gap-2 pb-1" style={{ width: "max-content" }}>
              {sections.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-100"
                    style={{
                      backgroundColor: isActive ? "var(--accent)" : "var(--card-bg)",
                      color: isActive ? "var(--accent-contrast)" : "var(--text-muted)",
                      border: `1px solid ${isActive ? "var(--accent)" : "var(--faq-border)"}`,
                    }}
                  >
                    {s.icon} {s.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <main ref={mainRef} className="flex-1 min-w-0">
            {search && totalFiltered === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-lg" style={{ color: "var(--text)" }}>
                  {t("faq.noResults") !== "faq.noResults"
                    ? t("faq.noResults")
                    : "No results found"}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {t("faq.noResultsSub") !== "faq.noResultsSub"
                    ? t("faq.noResultsSub")
                    : "Try different keywords or browse the sections."}
                </p>
              </div>
            ) : (
              sections.map((section) => (
                <SectionBlock
                  key={section.id}
                  section={section}
                  openId={openId}
                  onToggle={toggleItem}
                  search={search}
                />
              ))
            )}
          </main>
        </div>
      </div>

      {/* ── Sticky bottom CTA bar ───────────────────────────────────────── */}
      <div
        className="sticky bottom-0 z-20"
        style={{
          backgroundColor: "#1B3A6B",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <p className="text-sm font-medium hidden sm:block" style={{ color: "rgba(255,255,255,0.8)" }}>
            {t("faq.ctaText") !== "faq.ctaText"
              ? t("faq.ctaText")
              : "Still have questions? Talk to a licensed agent."}
          </p>
          <p className="text-sm font-medium sm:hidden" style={{ color: "rgba(255,255,255,0.8)" }}>
            {t("faq.ctaShort") !== "faq.ctaShort"
              ? t("faq.ctaShort")
              : "Still have questions?"}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:5619468261"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              Call Us
            </a>
            <a
              href="https://wa.me/15619468261"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold"
              style={{ backgroundColor: "#25D366", color: "#FFFFFF" }}
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t("faq.ctaWhatsApp") !== "faq.ctaWhatsApp"
                ? t("faq.ctaWhatsApp")
                : "Chat on WhatsApp"}
            </a>
          </div>
        </div>
      </div>
      </main>
      <Footer mode="personal" />
    </div>
  );
}

// ─── Wrapped export ───────────────────────────────────────────────────────────

export default function FAQClient() {
  return (
    <LanguageProvider>
      <FAQContent />
    </LanguageProvider>
  );
}
