"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { BlogPost } from "../page";

const CATEGORY_COLORS: Record<string, string> = {
  Home:       "#DBEAFE",
  Auto:       "#D1FAE5",
  Commercial: "#FEF3C7",
  Condo:      "#EDE9FE",
  Renters:    "#FCE7F3",
  Cyber:      "#FEE2E2",
  Bundle:     "#ECFDF5",
  General:    "#F1F5F9",
};

/** Convert ## headings and newlines in body to styled HTML. */
function renderBody(body: string) {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="text-xl font-bold mt-8 mb-3"
          style={{ color: "#0F172A" }}
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-2xl font-black mt-8 mb-3" style={{ color: "#0F172A" }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
    } else {
      elements.push(
        <p key={key++} className="leading-relaxed mb-2" style={{ color: "#374151" }}>
          {line}
        </p>
      );
    }
  }

  return elements;
}

function PostContent({ post }: { post: BlogPost }) {
  const { lang } = useLanguage();
  const safeLang = (["en", "pt", "es"].includes(lang) ? lang : "en") as "en" | "pt" | "es";
  const content = post[safeLang];

  const date = new Date(post.date + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      <Header mode="personal" />
      <main className="flex-1">
      <article className="max-w-2xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 hover:underline"
          style={{ color: "#1B3A6B" }}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.72 13.03a.75.75 0 01-1.06 0L2.47 8.84a.75.75 0 010-1.06l4.19-4.19a.75.75 0 011.06 1.06L4.56 7.75h8.69a.75.75 0 010 1.5H4.56l3.16 3.1a.75.75 0 010 1.06z" clipRule="evenodd"/>
          </svg>
          Back to Home
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
            style={{ backgroundColor: CATEGORY_COLORS[post.category] ?? "#F1F5F9", color: "#1B3A6B" }}
          >
            {post.category}
          </span>
          <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>{date}</span>
          <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>{content.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4" style={{ color: "#0F172A" }}>
          {content.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg font-medium mb-8 leading-relaxed" style={{ color: "#475569" }}>
          {content.excerpt}
        </p>

        {/* Divider */}
        <hr style={{ borderColor: "#E2E8F0", marginBottom: "2rem" }} />

        {/* Body */}
        <div className="prose max-w-none">
          {renderBody(content.body)}
        </div>

        {/* CTA */}
        {(() => {
          const isCommercial = post.category === "Commercial";
          const quoteParam   = isCommercial ? "commercial" : "personal";
          return (
            <div
              className="mt-12 p-8 rounded-2xl text-center"
              style={{
                background: isCommercial
                  ? "linear-gradient(135deg, #0B1F33, #1E3A5F)"
                  : "linear-gradient(135deg, #1B3A6B, #2451A0)",
                color: "#FFFFFF",
              }}
            >
              <p className="font-bold text-xl mb-2">Ready to get covered?</p>
              <p className="text-sm mb-6 opacity-75">Get your free quote in minutes.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href={`/?openQuote=${quoteParam}`}
                  className="px-7 py-3 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: "#F5A623", color: "#0B1F33" }}
                >
                  See My Price →
                </Link>
                <a
                  href="https://wa.me/15619468261"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          );
        })()}
      </article>
      </main>
      <Footer mode="personal" />
    </div>
  );
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  return (
    <LanguageProvider>
      <PostContent post={post} />
    </LanguageProvider>
  );
}
