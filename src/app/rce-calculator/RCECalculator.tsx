"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { useLanguage } from "@/context/LanguageContext";
import { sendQuoteEmail } from "@/lib/emailjs";
import VerificationGate from "@/components/VerificationGate";

// ─── RCE Config ───────────────────────────────────────────────────────────────

const BASE_COST: Record<string, number> = {
  FL: 185, GA: 165, NC: 160, SC: 155, NJ: 195,
  PA: 185, CT: 190, MA: 198, MD: 185, OH: 162, TN: 158,
};

const TYPE_MULT: Record<string, number> = {
  single_family: 1.00,
  townhouse:     0.90,
  condo:         0.28,
  mobile_home:   0.62,
  duplex:        0.95,
};

const FINISH_MULT: Record<string, number> = {
  basic: 1.00,
  mid:   1.22,
  high:  1.55,
};

const ROOF_MULT: Record<string, number> = {
  shingle: 1.00,
  metal:   1.12,
  tile:    1.18,
  flat:    0.96,
};

const GARAGE_ADDER: Record<string, number> = {
  none: 0, single: 18000, double: 32000,
};

const POOL_ADDER: Record<string, number> = {
  none: 0, pool: 35000, spa: 12000, both: 47000,
};

function yearBuiltMult(year: number): number {
  if (year < 1960) return 1.18;
  if (year < 1980) return 1.10;
  if (year < 2000) return 1.06;
  if (year < 2015) return 1.00;
  return 0.97;
}

function calcRCE(inputs: {
  state: string;
  propType: string;
  sqft: number;
  yearBuilt: number;
  finishLevel: string;
  roofType: string;
  garage: string;
  pool: string;
}): { low: number; high: number; recommended: number } {
  const base = inputs.sqft * (BASE_COST[inputs.state] ?? 175);
  const isCondo = inputs.propType === "condo";

  let structural = base
    * (TYPE_MULT[inputs.propType] ?? 1)
    * (FINISH_MULT[inputs.finishLevel] ?? 1)
    * yearBuiltMult(inputs.yearBuilt);

  if (!isCondo) {
    structural *= (ROOF_MULT[inputs.roofType] ?? 1);
    structural += (GARAGE_ADDER[inputs.garage] ?? 0);
    structural += (POOL_ADDER[inputs.pool] ?? 0);
  }

  const recommended = Math.round(structural / 1000) * 1000;
  return {
    low:         Math.round(recommended * 0.90),
    high:        Math.round(recommended * 1.15),
    recommended,
  };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

// ─── Step types ───────────────────────────────────────────────────────────────

interface FormData {
  state: string;
  propType: string;
  sqft: string;
  address: string;
  yearBuilt: string;
  finishLevel: string;
  roofType: string;
  garage: string;
  pool: string;
  firstName: string;
  email: string;
  phone: string;
}

const INITIAL: FormData = {
  state: "", propType: "", sqft: "", address: "", yearBuilt: "",
  finishLevel: "", roofType: "shingle", garage: "none", pool: "none",
  firstName: "", email: "", phone: "",
};

const TOTAL_STEPS = 5; // 0–4

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepHeader({ step, title }: { step: number; title: string }) {
  const STEP_KEYS = ["state","propertyType","details","finishes","leadGate"] as const;
  return (
    <div className="mb-6">
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-4">
        {STEP_KEYS.map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i === step ? "24px" : "8px",
              height: "8px",
              backgroundColor: i <= step ? "#1B3A6B" : "#E2E8F0",
              transition: "all 0.2s ease",
            }}
          />
        ))}
        <span className="ml-2 text-xs font-medium text-slate-400">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function SelectGrid({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className="p-3.5 rounded-xl border-2 text-left font-semibold text-sm transition-all duration-150"
          style={{
            borderColor: value === o.value ? "#1B3A6B" : "#E2E8F0",
            backgroundColor: value === o.value ? "#EEF2FF" : "#FFFFFF",
            color: value === o.value ? "#1B3A6B" : "#374151",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RCECalculator() {
  const { t, tRaw, lang } = useLanguage();
  const [step, setStep]         = useState(0);
  const [data, setData]         = useState<FormData>(INITIAL);
  const [errors, setErrors]     = useState<Partial<FormData>>({});
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying]   = useState(false);
  const [result, setResult] = useState<{ low: number; high: number; recommended: number } | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const set = (k: keyof FormData, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const isCondo = data.propType === "condo";

  // ── Validation per step ──────────────────────────────────────────────────
  function validate(s: number): boolean {
    const e: Partial<FormData> = {};
    if (s === 0 && !data.state)    e.state    = "required";
    if (s === 1 && !data.propType) e.propType = "required";
    if (s === 2) {
      if (!data.sqft || isNaN(Number(data.sqft)) || Number(data.sqft) < 100) e.sqft = "required";
      if (!data.yearBuilt || isNaN(Number(data.yearBuilt)) || Number(data.yearBuilt) < 1900) e.yearBuilt = "required";
    }
    if (s === 3 && !data.finishLevel) e.finishLevel = "required";
    if (s === 4) {
      if (!data.firstName.trim())          e.firstName = "required";
      if (!data.email.includes("@"))       e.email     = "required";
      if (data.phone.replace(/\D/g, "").length < 10) e.phone = "required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    if (step === 3) {
      // Compute result before showing lead gate
      const r = calcRCE({
        state:       data.state,
        propType:    data.propType,
        sqft:        Number(data.sqft),
        yearBuilt:   Number(data.yearBuilt),
        finishLevel: data.finishLevel,
        roofType:    data.roofType,
        garage:      data.garage,
        pool:        data.pool,
      });
      setResult(r);
    }
    setStep((s) => s + 1);
  }

  // Step 1 of submission: validate lead gate fields, then show the verification gate.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(4)) return;
    setVerifying(true);
  }

  // Step 2 of submission: called by VerificationGate once both channels are verified.
  const completeSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      // Branded results email to user via Resend (fire-and-forget; non-blocking on failure)
      if (result) {
        await fetch("/api/rce/send-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email:       data.email,
            firstName:   data.firstName,
            recommended: result.recommended,
            low:         result.low,
            high:        result.high,
            state:       data.state,
            propType:    data.propType,
            sqft:        data.sqft,
            yearBuilt:   data.yearBuilt,
            address:     data.address,
          }),
        }).catch(() => {}); // never block the user flow on email failure
      }

      // Email to agency
      await sendQuoteEmail({
        product_type:   "RCE Calculator Lead",
        mode:           "personal",
        language:       lang,
        timestamp:      new Date().toLocaleString(),
        to_email:       "info@ativainsurance.com",
        fields_summary: `Name: ${data.firstName} | Email: ${data.email} | Phone: ${data.phone} | State: ${data.state} | Type: ${data.propType} | Sqft: ${data.sqft} | Year: ${data.yearBuilt} | Finish: ${data.finishLevel} | Estimated RCE: ${result ? fmt(result.recommended) : "N/A"} | Address: ${data.address}`,
      });
      // Confirmation to user
      await sendQuoteEmail({
        product_type:   "Your RCE Estimate from Ativa Insurance",
        mode:           "personal",
        language:       lang,
        timestamp:      new Date().toLocaleString(),
        to_email:       data.email,
        fields_summary: `Hi ${data.firstName}! Your estimated replacement cost is ${result ? fmt(result.recommended) : "N/A"} (range: ${result ? fmt(result.low) : ""} – ${result ? fmt(result.high) : ""}). An Ativa agent will follow up with a personalized quote. WhatsApp: https://wa.me/15619468261`,
      });
      setSubmitted(true);
    } catch {
      // Still show result even if email fails
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [data, lang, result]);

  const rawStates  = tRaw("rce.options.states")  as string[] | undefined;
  const stateOpts  = (rawStates ?? ["FL","GA","NC","SC","NJ","PA","CT","MA","MD","OH","TN"])
    .map((s) => ({ value: s, label: s }));
  const propOpts   = (tRaw("rce.options.propertyTypes")  as Array<{ value: string; label: string }> | undefined) ?? [];
  const finishOpts = (tRaw("rce.options.finishLevels")   as Array<{ value: string; label: string }> | undefined) ?? [];
  const roofOpts   = (tRaw("rce.options.roofTypes")      as Array<{ value: string; label: string }> | undefined) ?? [];
  const garageOpts = (tRaw("rce.options.garageTypes")    as Array<{ value: string; label: string }> | undefined) ?? [];
  const poolOpts   = (tRaw("rce.options.poolOptions")    as Array<{ value: string; label: string }> | undefined) ?? [];
  const faqItems   = (tRaw("rce.faq.items")              as Array<{ q: string; a: string }> | undefined) ?? [];
  const eduCards   = (tRaw("rce.education.cards")        as Array<{ icon: string; title: string; text: string }> | undefined) ?? [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <style>{`
        .rce-hero-section { min-height: 520px; }
        @media (max-width: 768px) {
          .rce-hero-section  { min-height: 420px; }
          .rce-hero-img      { object-position: center center !important; }
          .rce-hero-overlay  { background: rgba(235, 240, 255, 0.95) !important; }
        }
      `}</style>
      <section
        className="rce-hero-section relative px-4 py-20 text-center overflow-hidden"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* Background image */}
        <Image
          src="/images/rce-hero-bg.png"
          alt=""
          fill
          priority
          aria-hidden
          className="rce-hero-img"
          style={{ objectFit: "cover", objectPosition: "right center", zIndex: 0 }}
        />

        {/* Left-to-right gradient overlay — keeps text readable */}
        <div
          className="rce-hero-overlay"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(to right, rgba(235,240,255,0.92) 0%, rgba(235,240,255,0.75) 40%, rgba(235,240,255,0.10) 100%)",
          }}
        />

        {/* Content — sits above image and overlay */}
        <div className="max-w-3xl mx-auto w-full" style={{ position: "relative", zIndex: 2 }}>
          <span
            className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}
          >
            {t("rce.hero.badge")}
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4"
            style={{ color: "#0F172A" }}
          >
            {t("rce.hero.headline")}
          </h1>
          <p className="text-lg font-medium mb-8" style={{ color: "#475569" }}>
            {t("rce.hero.sub")}
          </p>
          <a
            href="#calculator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg"
            style={{ backgroundColor: "#1B3A6B", boxShadow: "0 4px 20px rgba(27,58,107,0.3)" }}
          >
            {t("rce.hero.cta")}
          </a>
        </div>
      </section>

      {/* ── Education block ─────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        {/* Warning callout */}
        <div
          className="flex items-start gap-4 p-5 rounded-2xl mb-8 border-l-4"
          style={{ backgroundColor: "#FFFBEB", borderLeftColor: "#F59E0B" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0 mt-0.5" style={{ color: "#D97706" }}>
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
          <div>
            <p className="font-bold text-sm" style={{ color: "#92400E" }}>{t("rce.education.warning.title")}</p>
            <p className="text-sm mt-1" style={{ color: "#78350F" }}>{t("rce.education.warning.text")}</p>
          </div>
        </div>

        {/* Edu cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {eduCards.map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#EEF2FF" }}
              >
                {card.icon === "condo" ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" style={{ color: "#1B3A6B" }}>
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" style={{ color: "#1B3A6B" }}>
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                  </svg>
                )}
              </div>
              <h3 className="font-bold mb-2" style={{ color: "#0F172A" }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Calculator ──────────────────────────────────────────────────── */}
      <section id="calculator" className="max-w-xl mx-auto px-4 pb-16">
        <div
          className="rounded-2xl border shadow-xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <div className="p-6 sm:p-8">

            {/* ── Step 0: State ─────────────────────────────────────────── */}
            {step === 0 && (
              <div>
                <StepHeader step={0} title={t("rce.steps.state")} />
                <SelectGrid
                  options={(stateOpts.length ? stateOpts : ["FL","GA","NC","SC","NJ","PA","CT","MA","MD","OH","TN"].map(s => ({ value: s, label: s })))}
                  value={data.state}
                  onChange={(v) => { set("state", v); setErrors({}); }}
                />
                {errors.state && (
                  <p className="mt-2 text-xs font-medium text-red-500">{t("form.errors.required")}</p>
                )}
              </div>
            )}

            {/* ── Step 1: Property type ─────────────────────────────────── */}
            {step === 1 && (
              <div>
                <StepHeader step={1} title={t("rce.steps.propertyType")} />
                <SelectGrid
                  options={propOpts}
                  value={data.propType}
                  onChange={(v) => { set("propType", v); setErrors({}); }}
                />
                {errors.propType && (
                  <p className="mt-2 text-xs font-medium text-red-500">{t("form.errors.required")}</p>
                )}
              </div>
            )}

            {/* ── Step 2: Details ───────────────────────────────────────── */}
            {step === 2 && (
              <div>
                <StepHeader step={2} title={t("rce.steps.details")} />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                      {t("rce.labels.sqft")}
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="20000"
                      placeholder="e.g. 1800"
                      value={data.sqft}
                      onChange={(e) => { set("sqft", e.target.value); setErrors({}); }}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium"
                      style={{
                        borderColor: errors.sqft ? "#EF4444" : "#E2E8F0",
                        outline: "none",
                      }}
                    />
                    {errors.sqft && (
                      <p className="mt-1 text-xs text-red-500">{t("form.errors.required")}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                      {t("rce.labels.address")}
                    </label>
                    <AddressAutocomplete
                      value={data.address}
                      onChange={(v) => set("address", v)}
                      placeholder={t("form.placeholders.address")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                      {t("rce.labels.yearBuilt")}
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="e.g. 2002"
                      value={data.yearBuilt}
                      onChange={(e) => { set("yearBuilt", e.target.value); setErrors({}); }}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium"
                      style={{
                        borderColor: errors.yearBuilt ? "#EF4444" : "#E2E8F0",
                        outline: "none",
                      }}
                    />
                    {errors.yearBuilt && (
                      <p className="mt-1 text-xs text-red-500">{t("form.errors.required")}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Finishes ──────────────────────────────────────── */}
            {step === 3 && (
              <div>
                <StepHeader step={3} title={t("rce.steps.finishes")} />
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: "#374151" }}>{t("rce.labels.finishLevel")}</p>
                    <SelectGrid
                      options={finishOpts}
                      value={data.finishLevel}
                      onChange={(v) => { set("finishLevel", v); setErrors({}); }}
                    />
                    {errors.finishLevel && (
                      <p className="mt-1 text-xs text-red-500">{t("form.errors.required")}</p>
                    )}
                  </div>

                  {!isCondo && (
                    <>
                      <div>
                        <p className="text-sm font-semibold mb-2" style={{ color: "#374151" }}>{t("rce.labels.roofType")}</p>
                        <SelectGrid
                          options={roofOpts}
                          value={data.roofType}
                          onChange={(v) => set("roofType", v)}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2" style={{ color: "#374151" }}>{t("rce.labels.garage")}</p>
                        <SelectGrid
                          options={garageOpts}
                          value={data.garage}
                          onChange={(v) => set("garage", v)}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2" style={{ color: "#374151" }}>{t("rce.labels.pool")}</p>
                        <SelectGrid
                          options={poolOpts}
                          value={data.pool}
                          onChange={(v) => set("pool", v)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 4: Lead gate ─────────────────────────────────────── */}
            {step === 4 && (
              <div>
                <StepHeader step={4} title={t("rce.steps.leadGate")} />

                {/* Blurred result preview */}
                {result && (
                  <div
                    className="relative mb-6 p-5 rounded-2xl text-center overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #EEF2FF, #DBEAFE)" }}
                  >
                    {!submitted && (
                      <div
                        className="absolute inset-0 flex items-center justify-center z-10"
                        style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(238,242,255,0.6)" }}
                      >
                        <div className="text-center px-4">
                          <div className="text-2xl mb-2">{verifying ? "🔐" : "🔒"}</div>
                          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
                            {verifying ? "Verifying your identity…" : t("rce.lead.title")}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "#475569" }}>
                            {verifying ? "Almost there — confirm your contact info" : t("rce.lead.subtitle")}
                          </p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#6366F1" }}>
                      {t("rce.results.recommended")}
                    </p>
                    <p className="text-4xl font-black" style={{ color: "#1B3A6B" }}>{fmt(result.recommended)}</p>
                    <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                      {t("rce.results.rangeLabel")}: {fmt(result.low)} – {fmt(result.high)}
                    </p>
                  </div>
                )}

                {submitted ? (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#DCFCE7" }}>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7" style={{ color: "#16A34A" }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <p className="font-bold text-lg mb-1" style={{ color: "#0F172A" }}>{t("rce.emailSuccess.title")}</p>
                    <p className="text-sm mb-5" style={{ color: "#475569" }}>{t("rce.emailSuccess.subtitle")}</p>
                    {lang === "en" ? (
                      /* EN — native SMS */
                      <a
                        href="sms:5619468261"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                        style={{ backgroundColor: "#0F2A44" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                        {t("rce.emailSuccess.whatsapp")}
                      </a>
                    ) : (
                      /* PT / ES — WhatsApp */
                      <a
                        href="https://wa.me/15619468261"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                        style={{ backgroundColor: "#25D366" }}
                      >
                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {t("rce.emailSuccess.whatsapp")}
                      </a>
                    )}
                  </div>
                ) : verifying ? (
                  /* ── Verification gate ──────────────────────────────── */
                  <VerificationGate
                    email={data.email}
                    phone={data.phone}
                    onComplete={completeSubmit}
                  />
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                        {t("rce.labels.firstName")}
                      </label>
                      <input
                        type="text"
                        placeholder="Ana"
                        value={data.firstName}
                        onChange={(e) => { set("firstName", e.target.value); setErrors({}); }}
                        className="w-full px-4 py-3 rounded-xl border-2 font-medium"
                        style={{ borderColor: errors.firstName ? "#EF4444" : "#E2E8F0" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                        {t("rce.labels.email")}
                      </label>
                      <input
                        type="email"
                        placeholder="ana@example.com"
                        value={data.email}
                        onChange={(e) => { set("email", e.target.value); setErrors({}); }}
                        className="w-full px-4 py-3 rounded-xl border-2 font-medium"
                        style={{ borderColor: errors.email ? "#EF4444" : "#E2E8F0" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                        {t("rce.labels.phone")}
                      </label>
                      <input
                        type="tel"
                        placeholder="(305) 555-0100"
                        value={data.phone}
                        onChange={(e) => { set("phone", e.target.value); setErrors({}); }}
                        className="w-full px-4 py-3 rounded-xl border-2 font-medium"
                        style={{ borderColor: errors.phone ? "#EF4444" : "#E2E8F0" }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>{t("rce.lead.consent")}</p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
                      style={{ backgroundColor: "#1B3A6B", opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? "…" : t("rce.buttons.calculate")}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ── Nav buttons ───────────────────────────────────────────── */}
            {step < 4 && (
              <div className={`mt-6 flex ${step > 0 ? "justify-between" : "justify-end"}`}>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="px-5 py-2.5 rounded-xl border font-semibold text-sm"
                    style={{ color: "#475569", borderColor: "#E2E8F0" }}
                  >
                    {t("rce.buttons.back")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  className="px-7 py-2.5 rounded-xl font-bold text-sm text-white"
                  style={{ backgroundColor: "#1B3A6B" }}
                >
                  {t("rce.buttons.next")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs mt-4 px-4" style={{ color: "#9CA3AF" }}>
          {t("rce.results.disclaimer")}
        </p>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 text-center"
        style={{ backgroundColor: "#1B3A6B" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black mb-3 text-white">{t("rce.cta.headline")}</h2>
          <p className="mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>{t("rce.cta.sub")}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm"
            style={{ backgroundColor: "#F5C400", color: "#111111" }}
          >
            {t("rce.cta.button")}
          </Link>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black mb-8 text-center" style={{ color: "#0F172A" }}>
          {t("rce.faq.heading")}
        </h2>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
            >
              <button
                className="w-full px-5 py-4 text-left flex items-start justify-between gap-3"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              >
                <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>{item.q}</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{
                    color: "#6B7280",
                    transform: faqOpen === i ? "rotate(180deg)" : "none",
                    transition: "transform 0.15s",
                  }}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {faqOpen === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
