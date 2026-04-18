"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

const CONTACT_EMAIL = "info@ativainsurance.com";

// Text with inline mailto link — splits on the placeholder token
function TextWithContactLink({ text }: { text: string }) {
  const parts = text.split("[[contact]]");
  return (
    <>
      {parts[0]}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        style={{ color: "var(--accent)", textDecoration: "underline" }}
      >
        contacting us
      </a>
      {parts[1] ?? ""}
    </>
  );
}

const UI_COPY = {
  en: { home: "Home", title: "Privacy Policy",    updated: "Last Updated: April 2026", breadcrumb: "Privacy Policy" },
  pt: { home: "Início", title: "Política de Privacidade", updated: "Última Atualização: Abril de 2026", breadcrumb: "Política de Privacidade" },
  es: { home: "Inicio", title: "Política de Privacidad",  updated: "Última Actualización: Abril 2026",  breadcrumb: "Política de Privacidad" },
};

function PolicyContent() {
  const { lang } = useLanguage();
  const ui = UI_COPY[lang as keyof typeof UI_COPY] ?? UI_COPY.en;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Header mode="personal" />

      {/* ── Hero band ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#1B3A6B", padding: "2.5rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Breadcrumb */}
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
          This notice describes our privacy policy ("Notice"). By visiting our Web Site ("Web Site"),
          you are accepting the practices described in this Notice.
        </p>

        {/* ARTICLE I */}
        <h2 className="legal-article">ARTICLE I — PRINCIPLES</h2>

        <h3 className="legal-section">Section 1.01 — Principles</h3>
        <p className="legal-body">We may gather and use information as follows:</p>

        {/* (1) Notice */}
        <h4 className="legal-sub">(1) Notice</h4>
        <p className="legal-body">We may gather and use information as follows:</p>

        <h5 className="legal-letter">(a) Volunteered Information</h5>
        <p className="legal-body">
          We will receive and store any information you enter on the Web Site or give us in any other way that personally
          identifies you to improve your experience at the Web Site, to get a better general understanding of the type of
          individuals visiting the Web Site, and to enable us to contact you when needed. Typically you will provide
          information on the Web Site for the purchase of products or services or when you submit comments or questions for
          review by us.
        </p>

        <h5 className="legal-letter">(b) Automatic Information</h5>
        <p className="legal-body">
          To enable us to provide content that users need and desire, we collect aggregated site-visitation statistics using
          cookies. A Cookie is simply a small data file we place on your computer's hard drive when you first visit the Web
          Site. This file contains a unique number that helps us identify you when you return to the Web Site. Cookies are
          employed by thousands of web sites to enhance users' web viewing experience. Cookies can neither damage user files
          nor can they read information from users' hard drives. We do not monitor your use of the Web Site. Allowing us to
          create a Cookie on your hard drive will not give us or anyone else the right to look at any other information on
          your hard drive.
        </p>
        <p className="legal-body">
          We use the information we gather from cookies to respond to your requests for purchases, comments, or questions;
          to improve your experience at the Web Site; to collect aggregated site-visitation statistics; and to alert you to
          product enhancements, special offers, updated information, and other new services from us. We also use information
          to alert you of subscription renewal discounts, to automatically renew your subscription and advise you of upcoming
          service offerings and events.
        </p>
        <p className="legal-body">
          We may disclose information to third parties, or disclosing customer lists to commercial or charitable users thereof.
          Disclosure for such purposes is limited to your name, company, position, address, phone and fax numbers, and web
          site and email addresses. If you do not wish to have such information disclosed, please let us know by{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>contacting us</a>.
          To enable us to process your request, please include your name and address. Once properly notified, we will remove
          your name from the lists and disclosures as soon as we practicably can in the course of normal business practices.
        </p>
        <p className="legal-body">
          When you order products or services from us, we ask for your credit card number and billing address. We use this
          information only to bill you for the products or services you order at that time and for no other purpose. Annual
          subscriptions are payable on the purchase date of the Subscription and renew automatically each anniversary unless
          canceled in writing thirty days in advance of each anniversary date.
        </p>
        <p className="legal-body">
          Any user questions or comments submitted to us may become available in the public sections of the Web Site,
          including a section entitled "Frequently Asked Questions," immediately after such questions or comments are submitted
          to us. If we publicize any user questions, such questions will not contain facts that identify the user or the
          specific parties involved. We also reserve the right to use any user comments submitted to us for promotional
          purposes and by submitting such comments to us you agree that we may do so.
        </p>
        <p className="legal-body">
          We may release any user information if required to comply with law; to enforce or to apply the Web Site Terms and
          Conditions; or under the good faith belief that disclosure is otherwise necessary or advisable including, without
          limitation, to protect the rights, properties, or safety of us or our users.
        </p>

        {/* (2) Choice */}
        <h4 className="legal-sub">(2) Choice</h4>
        <p className="legal-body">We give you a choice as to the type and amount of private information we have, as follows:</p>

        <h5 className="legal-letter">(a) Volunteered Information</h5>
        <p className="legal-body">
          You can always choose not to provide certain information to us. If you choose not to provide personal information,
          you can still use many parts of the Web Site. However, you will not be able to purchase products and services and
          you will not be able to take advantage of many of our features. If you have previously provided certain information
          to us and you desire to remove such information from our databases, or if you do not wish for your information to be
          disclosed to third parties, you may{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>contact us</a>
          {" "}to remove such information.
        </p>

        <h5 className="legal-letter">(b) Automatic Information</h5>
        <p className="legal-body">
          Most web browsers automatically accept Cookies, but if you prefer, you can edit your browser options to block
          Cookies in the future. The "Help" portion of the toolbar on most browsers will explain how you can prevent your
          browser from accepting new Cookies, how to set the browser to inform you when you receive a new Cookie, or how to
          reject Cookies altogether.
        </p>

        {/* (3) Access */}
        <h4 className="legal-sub">(3) Access</h4>
        <p className="legal-body">
          We provide you with the ability to ensure that your personal information is correct and current. You may review and
          update your personal information by{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>contacting us</a>.
          For security purposes, we require user verification via user's user name and password to receive personal information.
        </p>

        {/* (4) Security */}
        <h4 className="legal-sub">(4) Security</h4>
        <p className="legal-body">
          We protect the security of your personal information. We takes steps to protect your data from loss, misuse,
          alteration, destruction, or unauthorized access. We use sophisticated security technologies to secure users'
          ordering information, user name, and password. We encrypt users' ordering information, user name, and password
          (including users' credit card account number) using Secure Socket Layer ("SSL") technology. SSL is a proven coding
          system that lets your browser automatically encrypt, or scramble, data before you send it to us. To support this
          technology, users must have an SSL-capable browser. SSL is one of the safest encryption technologies available.
          While we use such sophisticated security technology to secure users' ordering information, user name, and password,
          we cannot guarantee that any electronic commerce is totally secure.
        </p>

        {/* Section 2.01 */}
        <h3 className="legal-section">Section 2.01 — User Safeguards</h3>
        <p className="legal-body">
          You are responsible for maintaining the secrecy of your user name, password, and any account information. It is
          important for you to be responsible and protect your user name, password, and computer against unauthorized users.
          It is important to sign off when you have completed using a computer accessible by others.
        </p>

        {/* Section 3.01 */}
        <h3 className="legal-section">Section 3.01 — Children</h3>
        <p className="legal-body">
          We do not sell products for children. Users of the Web Site must be at least eighteen years old. If a child has
          provided us with personal information, that child's parent or guardian should{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>contact us</a>
          {" "}to delete such information from our records.
        </p>

        {/* Section 4.01 */}
        <h3 className="legal-section">Section 4.01 — Third Party Web Sites</h3>
        <p className="legal-body">
          Please be aware that the Web Site may have links to third party web sites that may collect personally identifiable
          information about you. When you click on one of these third party links, you are entering another web site for which
          we have no responsibility. This Notice does not cover the information practices or policies of such third party web
          sites. We encourage you to read the privacy statements of all such web sites since their privacy policies may be
          materially different from our Notice.
        </p>

        {/* Section 5.01 */}
        <h3 className="legal-section">Section 5.01 — Agreement and Modification</h3>
        <p className="legal-body">
          By using and accessing the Web Site you indicate that you have read and understand this Notice and you consent to
          the collection and use of information by us in the manner explained in this Notice, including without limitation,
          provisions covering limitations on damages, arbitration of disputes, and the application of Texas law govern any
          dispute over privacy. By using and accessing the Web Site you agree to indemnify us for any and all third party
          claims resulting from your breach of this Notice or the Web Site Terms and Conditions. If you have any questions or
          concerns about your privacy at the Web Site, please{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>contact us</a>.
          If you do not accept this Notice, do not access and use the Web Site.
        </p>
        <p className="legal-body">
          We may revise this Notice at any time without notice by updating this Notice. Any modifications in the way we use
          personal information will be provided in future updates of this Notice so you are always aware of what information
          we collect, how we use it, and under what circumstances we disclose such information. Modifications will be
          effective immediately and will be available on the Web Site. You should visit this web page periodically to review
          the Notice. User accepts any such modifications to this Notice by continued use of the Web Site after such
          modifications are made.
        </p>

        {/* Section 6.01 */}
        <h3 className="legal-section">Section 6.01 — Google Analytics</h3>
        <p className="legal-body">
          Please be aware that Google Analytics Features may be tracking visitor data on this website. Google Analytics may
          use cookies to collect Demographics and Interest Reporting data, which is used to get a better general understanding
          of the type of individuals visiting the Web Site; to collect aggregated site-visitation statistics; and to improve
          marketing initiatives, such as display and remarketing advertising. This information will not be sold to third
          parties, and the data collected through Google Analytics Advertising Features — including Demographics and Interest
          Reporting — is not personally identifiable.
        </p>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", margin: "3rem 0 2rem" }} />

        {/* Contact */}
        <p className="legal-body">
          Questions about this Privacy Policy?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline", fontWeight: 600 }}>
            {CONTACT_EMAIL}
          </a>
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
        .legal-article {
          font-size: 0.688rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 2.5rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--accent);
        }
        .legal-section {
          font-size: 0.938rem;
          font-weight: 700;
          color: var(--text);
          margin: 2rem 0 0.75rem;
          letter-spacing: -0.01em;
        }
        .legal-sub {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text);
          margin: 1.5rem 0 0.5rem;
        }
        .legal-letter {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
          margin: 1.25rem 0 0.5rem;
          font-style: italic;
        }
        .legal-body {
          font-size: 0.9rem;
          line-height: 1.85;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}

export default function PrivacyPolicyClient() {
  return (
    <LanguageProvider>
      <PolicyContent />
    </LanguageProvider>
  );
}
