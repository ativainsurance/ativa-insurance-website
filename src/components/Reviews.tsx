"use client";

import { useState } from "react";
import type { Mode } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

function StarRating({ count, size = "w-4 h-4", color = "#F59E0B" }: { count: number; size?: string; color?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={color} className={size}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

interface ReviewItem {
  name: string;
  stars: number;
  text: string;
}

interface ReviewsProps {
  mode: Mode;
}

function ReviewCard({ review }: { review: ReviewItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: hovered
          ? "0 8px 28px rgba(0,0,0,0.13)"
          : "var(--card-shadow)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "box-shadow 250ms ease, transform 250ms ease",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StarRating count={review.stars} />
      <p className="mt-3 mb-4 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
        >
          {review.name.charAt(0)}
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          {review.name}
        </span>
        {/* Google G */}
        <svg viewBox="0 0 24 24" className="w-4 h-4 ml-auto shrink-0 opacity-50">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>
    </div>
  );
}

export default function Reviews({ mode }: ReviewsProps) {
  const { t, tRaw } = useLanguage();
  const isPersonal = mode === "personal";

  const items = (tRaw("reviews.items") as ReviewItem[] | undefined) ?? [];

  return (
    <section
      className="relative py-16 px-6 overflow-hidden"
      style={{
        backgroundColor: isPersonal ? "#F8F9FB" : "#F4F6F8",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Decorative circle — top-right, outside text area */}
      <svg
        aria-hidden
        viewBox="0 0 1 1"
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "340px",
          height: "340px",
          opacity: isPersonal ? 0.05 : 0.04,
          pointerEvents: "none",
        }}
      >
        <circle cx="0.5" cy="0.5" r="0.5" fill={isPersonal ? "#1E3A5F" : "#F5A623"} />
      </svg>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
            {t("reviews.heading")}
          </h2>
          <p style={{ color: "var(--text-muted)" }}>{t("reviews.sub")}</p>
        </div>

        {/* Featured review — full width, dark anchor */}
        <div
          style={{
            backgroundColor: "#0F2A44",
            borderRadius: "16px",
            padding: "40px",
            marginBottom: "24px",
          }}
        >
          {/* Stars */}
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <StarRating count={5} size="w-5 h-5" color="#F5A623" />
          </div>

          {/* Quote headline */}
          <p
            style={{
              color: "#FFFFFF",
              fontSize: "1.2rem",
              fontWeight: 700,
              lineHeight: 1.4,
              marginBottom: "14px",
            }}
          >
            &ldquo;They saved me over $800 on my auto policy&rdquo;
          </p>

          {/* Full quote */}
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            &ldquo;I was paying way too much with my old insurance. Ana helped me compare multiple options and found me a much better rate in the same day. The process was fast, easy, and they actually speak Portuguese — which made everything so much easier for my family.&rdquo;
          </p>

          {/* Attribution */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "0.9375rem", marginBottom: "2px" }}>
                Carlos M.
              </p>
              <p style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.8125rem" }}>
                Melbourne, FL
              </p>
            </div>

            {/* Verified badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.60)", fontSize: "11px" }}>
              {/* Google G icon */}
              <svg viewBox="0 0 24 24" width="12" height="12" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Verified Google Review
            </div>
          </div>
        </div>

        {/* Regular review grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
