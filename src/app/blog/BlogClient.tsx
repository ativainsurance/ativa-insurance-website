"use client";

import { useState } from "react";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { BlogPost } from "./page";

const CATEGORIES = ["All", "Home", "Auto", "Commercial", "Condo", "Renters", "Cyber", "Bundle", "General"];

function CategoryBadge({ cat }: { cat: string }) {
  const colors: Record<string, string> = {
    Home:       "#DBEAFE",
    Auto:       "#D1FAE5",
    Commercial: "#FEF3C7",
    Condo:      "#EDE9FE",
    Renters:    "#FCE7F3",
    Cyber:      "#FEE2E2",
    Bundle:     "#ECFDF5",
    General:    "#F1F5F9",
  };
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
      style={{ backgroundColor: colors[cat] ?? "#F1F5F9", color: "#1B3A6B" }}
    >
      {cat}
    </span>
  );
}

function PostCard({ post, lang }: { post: BlogPost; lang: "en" | "pt" | "es" }) {
  const content = post[lang];
  const date = new Date(post.date + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="h-full rounded-2xl border p-6 flex flex-col gap-4 hover:shadow-lg"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E2E8F0",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
      >
        <div className="flex items-center justify-between">
          <CategoryBadge cat={post.category} />
          <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>{date}</span>
        </div>
        <div>
          <h2
            className="font-bold text-lg leading-snug mb-2 group-hover:underline"
            style={{ color: "#0F172A" }}
          >
            {content.title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            {content.excerpt}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>{content.readTime}</span>
          <span className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Read →</span>
        </div>
      </article>
    </Link>
  );
}

function GenerateButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (typeof window === "undefined") return null;
  if (!window.location.hostname.startsWith("localhost") && !window.location.hostname.startsWith("127.")) return null;

  async function generate() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/generate-blog-post");
      const data = (await res.json()) as { success?: boolean; slug?: string; error?: string };
      setMsg(data.success ? `✓ Post generated: ${data.slug}. Reload to see it.` : `Error: ${data.error}`);
    } catch (e) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: "#CBD5E1" }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#94A3B8" }}>
        DEV ONLY — localhost
      </p>
      <button
        onClick={generate}
        disabled={loading}
        className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
        style={{ backgroundColor: "#1B3A6B", opacity: loading ? 0.6 : 1 }}
      >
        {loading ? "Generating…" : "Generate Today's Post"}
      </button>
      {msg && <p className="mt-2 text-sm" style={{ color: "#475569" }}>{msg}</p>}
    </div>
  );
}

function BlogContent({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");

  const safeLang = (["en", "pt", "es"].includes(lang) ? lang : "en") as "en" | "pt" | "es";

  const filtered = activeCategory === "All"
    ? initialPosts
    : initialPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      <Header mode="personal" />
      <main className="flex-1">

      {/* Hero */}
      <section
        className="px-4 py-16 text-center"
        style={{
          background: "linear-gradient(135deg, #E8F0FE 0%, #EEF2FF 50%, #DBEAFE 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-black mb-3" style={{ color: "#0F172A" }}>
            {t("blog.heading")}
          </h1>
          <p className="text-lg font-medium" style={{ color: "#475569" }}>
            {t("blog.sub")}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <GenerateButton />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-150"
              style={{
                backgroundColor: activeCategory === cat ? "#1B3A6B" : "#FFFFFF",
                color:           activeCategory === cat ? "#FFFFFF"  : "#475569",
                borderColor:     activeCategory === cat ? "#1B3A6B"  : "#E2E8F0",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium" style={{ color: "#9CA3AF" }}>
              No posts in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} lang={safeLang} />
            ))}
          </div>
        )}
      </div>
      </main>
      <Footer mode="personal" />
    </div>
  );
}

export default function BlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  return (
    <LanguageProvider>
      <BlogContent initialPosts={initialPosts} />
    </LanguageProvider>
  );
}
