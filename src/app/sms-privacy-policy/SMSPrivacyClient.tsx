"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

const CONTACT_EMAIL = "info@ativainsurance.com";

const UI_COPY = {
  en: { home: "Home", title: "SMS Privacy Policy",    updated: "Last Updated: April 2026", breadcrumb: "SMS Privacy Policy" },
  pt: { home: "Início", title: "Política de Privacidade SMS", updated: "Última Atualização: Abril de 2026", breadcrumb: "Política de Privacidade SMS" },
  es: { home: "Inicio", title: "Política de Privacidad SMS",  updated: "Última Actualización: Abril 2026",  breadcrumb: "Política de Privacidad SMS" },
};

function SMSContent() {
  const { lang } = useLanguage();
  const ui = UI_COPY[lang as keyof typeof UI_COPY] ?? UI_COPY.en;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Header mode="personal" />

      {/* ── Hero band ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#1B3A6B", padding: "2.5rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <nav className="flex items-center gap-1.5 mb-4" aria-label="Breadcrumb">
            <Link href="/"
              style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.813rem", textDecoration: "none" }}
              className="hover:text-white transition-colors duration-150">
              {ui.home}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.30)", fontSize: "0.813rem" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.813rem", fontWeight: 500 }}>
              {ui.breadcrumb}
            </span>
          </nav>
          <h1 className="font-black tracking-tight" style={{ color: "#FFFFFF", fontSize: "clamp(1.5rem,3vw,2.25rem)", letterSpacing: "-0.02em" }}>
            {ui.title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: "0.813rem", marginTop: "0.5rem" }}>
            {ui.updated}
          </p>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* Intro */}
        <p className="legal-intro">
          ATIVA INSURANCE LLC may disclose Personal Data and other information as follows:
        </p>

        {/* Bullet items */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>

          {/* Item 1 */}
          <li className="sms-item">
            <div className="sms-item-bullet" />
            <div>
              <p className="sms-item-heading">
                Third Parties that Help Provide the Messaging Service
              </p>
              <p className="legal-body">
                We will not share your opt-in to an SMS short code campaign with a third party for purposes unrelated to
                supporting you in connection with that campaign. We may share your Personal Data with third parties that help
                us provide the messaging service, including, but not limited to, platform providers, phone companies, and
                other vendors who assist us in the delivery of text messages.
              </p>
            </div>
          </li>

          {/* Item 2 */}
          <li className="sms-item">
            <div className="sms-item-bullet" />
            <div>
              <p className="sms-item-heading">
                Additional Disclosures — Affiliates
              </p>
              <p className="legal-body">
                We may disclose the Personal Data to our affiliates or subsidiaries; however, if we do so, their use and
                disclosure of your Personal Data will be subject to this Policy. All the above categories exclude text
                messaging originator opt-in data and consent; this information will not be shared with any third parties.
              </p>
            </div>
          </li>
        </ul>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", margin: "3rem 0 2rem" }} />

        {/* Contact */}
        <p className="legal-body">
          Questions about this SMS Privacy Policy?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline", fontWeight: 600 }}>
            {CONTACT_EMAIL}
          </a>
        </p>

        {/* Related link */}
        <p className="legal-body" style={{ marginTop: "0.5rem" }}>
          Also see our{" "}
          <Link href="/privacy-policy" style={{ color: "var(--accent)", textDecoration: "underline" }}>
            full Privacy Policy
          </Link>.
        </p>

        {/* Back link */}
        <div style={{ marginTop: "2.5rem" }}>
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150"
            style={{ color: "var(--accent)" }}>
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7.5h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z" clipRule="evenodd"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* ── Minimal footer ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", textAlign: "center" }}>
          © {new Date().getFullYear()} Ativa Insurance LLC. All rights reserved.
        </p>
      </div>

      {/* ── Scoped styles ──────────────────────────────────────────────── */}
      <style>{`
        .legal-intro {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text);
          margin-bottom: 2.5rem;
          padding: 1.25rem 1.5rem;
          border-left: 3px solid var(--accent);
          background: var(--accent-light);
          border-radius: 0 8px 8px 0;
        }
        .legal-body {
          font-size: 0.9rem;
          line-height: 1.85;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .sms-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface);
        }
        .sms-item-bullet {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          margin-top: 0.45rem;
        }
        .sms-item-heading {
          font-size: 0.938rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.625rem;
          letter-spacing: -0.01em;
        }
      `}</style>
    </div>
  );
}

export default function SMSPrivacyClient() {
  return (
    <LanguageProvider>
      <SMSContent />
    </LanguageProvider>
  );
}
