"use client";

import Link from "next/link";
import type { Mode } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface HeroArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
}

const PERSONAL_ARTICLES: HeroArticle[] = [
  {
    slug:     "florida-flood-insurance-homeowners",
    title:    "5 Things Florida Homeowners Must Know About Flood Insurance",
    excerpt:  "Flood damage is rarely covered by standard homeowners policies. Here's what every Florida property owner needs to understand.",
    category: "HOME",
    readTime: "3 min read",
  },
  {
    slug:     "lower-auto-insurance-premium",
    title:    "How to Lower Your Auto Insurance Premium This Year",
    excerpt:  "Bundling, safe driver discounts, and shopping carriers are just the start. Learn what actually moves the needle on your rate.",
    category: "AUTO",
    readTime: "3 min read",
  },
  {
    slug:     "renters-insurance-worth-it",
    title:    "Renters Insurance: Why It Costs Less Than Your Netflix",
    excerpt:  "Most renters skip it. Most regret it. Here's exactly what renters insurance covers and why it's a no-brainer in Florida.",
    category: "RENTERS",
    readTime: "2 min read",
  },
];

const COMMERCIAL_ARTICLES: HeroArticle[] = [
  {
    slug:     "when-small-business-needs-general-liability",
    title:    "When Does Your Small Business Need General Liability?",
    excerpt:  "From day one. If your business interacts with customers or the public, GL coverage is essential — and more affordable than you think.",
    category: "COMMERCIAL",
    readTime: "4 min read",
  },
  {
    slug:     "builders-risk-what-contractors-miss",
    title:    "Builders Risk Insurance: What Contractors Often Miss",
    excerpt:  "Most contractors think their GL covers the job site. It doesn't. Here's what Builders Risk actually protects — and when you need it.",
    category: "COMMERCIAL",
    readTime: "4 min read",
  },
  {
    slug:     "lower-commercial-auto-fleet-insurance",
    title:    "How to Lower Your Commercial Auto Insurance as a Fleet Owner",
    excerpt:  "Fleet size, driver records, and vehicle use all affect your rate. Here's how Florida fleet owners cut costs without cutting coverage.",
    category: "AUTO",
    readTime: "3 min read",
  },
];

interface BlogProps {
  mode: Mode;
}

export default function Blog({ mode }: BlogProps) {
  const { t } = useLanguage();
  const isPersonal = mode === "personal";

  const posts = isPersonal ? PERSONAL_ARTICLES : COMMERCIAL_ARTICLES;

  const accentColor = isPersonal ? "#1B3A6B" : "#F5C400";

  return (
    <section className="relative py-16 px-6 overflow-hidden"
      style={{
        backgroundColor: isPersonal ? "var(--bg)" : "#F4F6F8",
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Decorative ring — bottom-left, 4% opacity, clipped by overflow-hidden */}
      <svg
        aria-hidden
        viewBox="0 0 1 1"
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "380px",
          height: "380px",
          opacity: isPersonal ? 0.04 : 0.03,
          pointerEvents: "none",
        }}
      >
        <circle cx="0.5" cy="0.5" r="0.48" fill="none" stroke={isPersonal ? "#1E3A5F" : "#F5A623"} strokeWidth="0.04" />
        <circle cx="0.5" cy="0.5" r="0.38" fill="none" stroke={isPersonal ? "#1E3A5F" : "#F5A623"} strokeWidth="0.02" />
      </svg>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
            {t("blog.heading")}
          </h2>
          <p style={{ color: "var(--text-muted)" }}>{t("blog.sub")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="block" style={{ textDecoration: "none" }}>
            <article
              className="flex flex-col rounded-2xl overflow-hidden cursor-pointer group h-full"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--card-shadow)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow-hover)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--accent-light)",
                      color: "var(--accent)",
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-bold text-base leading-snug mb-2" style={{ color: "var(--text)" }}>
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>
                  {post.excerpt}
                </p>

                <div
                  className="mt-4 text-sm font-bold transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--accent)" }}
                >
                  Read: {post.title} →
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>
      </div>{/* end relative content */}
    </section>
  );
}
