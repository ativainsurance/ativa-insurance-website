"use client";

import { useState, useCallback } from "react";
import AddressAutocomplete from "./AddressAutocomplete";
import { sendQuoteEmail } from "@/lib/emailjs";
import { validateDOB } from "@/lib/validateDOB";
import { useLanguage } from "@/context/LanguageContext";
import type { Mode } from "@/types";

interface Props {
  mode: Mode;
  productTitle: string;
  onClose: () => void;
}

type Data = Record<string, string>;

const INPUT_CLASS = [
  "w-full px-4 py-4 rounded-xl border-2 text-gray-900 bg-white",
  "placeholder-gray-400 text-base outline-none caret-gray-900",
  "focus:border-personal focus:ring-4 focus:ring-personal/10",
  "transition-colors duration-150",
].join(" ");

const SELECT_CLASS = `${INPUT_CLASS} appearance-none cursor-pointer`;

const TOTAL      = 4;
const STEP_NAMES = ["Property", "Applicant", "Coverage", "Contact"];
const ACCENT     = "#1B3A6B";
const ACCENT_HOV = "#2451A0";

export default function PropertyInsuranceForm({ productTitle, onClose }: Props) {
  const { t, lang } = useLanguage();
  const [step, setStep]           = useState(0);
  const [data, setData]           = useState<Data>({});
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(false);

  const isNewPurchase = data.insurancePurpose === "New Purchase";
  const hasCurrentIns = data.currentInsurance === "Yes";

  const update = useCallback((key: string, val: string) => {
    setData(p => ({ ...p, [key]: val }));
    setErrors(p => {
      if (!p[key]) return p;
      const n = { ...p };
      delete n[key];
      return n;
    });
  }, []);

  const borderOf = (key: string) => errors[key] ? "#EF4444" : "#E2E8F0";
  const reqMsg   = t("form.errors.required") || "Required";

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!data.propertyAddress?.trim())  e.propertyAddress  = reqMsg;
      if (!data.propertyType?.trim())     e.propertyType     = reqMsg;
      if (!data.propertyOccupancy?.trim()) e.propertyOccupancy = reqMsg;
    } else if (step === 1) {
      if (!data.fullName?.trim()) e.fullName = reqMsg;
      if (!data.dob?.trim())      e.dob      = reqMsg;
      else { const dobErr = validateDOB(data.dob); if (dobErr) e.dob = dobErr; }
    } else if (step === 2) {
      if (!data.insurancePurpose?.trim()) e.insurancePurpose = reqMsg;
      if (!isNewPurchase && !data.currentInsurance?.trim()) e.currentInsurance = reqMsg;
    } else if (step === 3) {
      if (!data.phone?.trim()) e.phone = reqMsg;
      if (!data.email?.trim()) {
        e.email = reqMsg;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        e.email = t("form.errors.email") || "Invalid email";
      }
      if (data.phone && !/[\d\s\-().+]{7,}/.test(data.phone)) {
        e.phone = t("form.errors.phone") || "Invalid phone";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step === TOTAL - 1) handleSubmit();
    else setStep(s => s + 1);
  };

  const handleBack = () => { setErrors({}); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSendError(false);
    const summary = [
      `Property Address: ${data.propertyAddress     || "(not provided)"}`,
      `Property Type: ${data.propertyType           || "(not provided)"}`,
      `Property Occupancy: ${data.propertyOccupancy || "(not provided)"}`,
      `Full Name: ${data.fullName                   || "(not provided)"}`,
      `Date of Birth: ${data.dob                    || "(not provided)"}`,
      `Current Address: ${data.currentAddress       || "(same as property)"}`,
      `Insurance Purpose: ${data.insurancePurpose   || "(not provided)"}`,
      ...(isNewPurchase ? [] : [
        `Current Insurance: ${data.currentInsurance || "(not provided)"}`,
        ...(hasCurrentIns ? [
          `Current Insurance Company: ${data.currentInsuranceCompany || "(not provided)"}`,
          `Policy Expiration: ${data.policyExpirationDate            || "(not provided)"}`,
        ] : []),
      ]),
      `Phone: ${data.phone || "(not provided)"}`,
      `Email: ${data.email || "(not provided)"}`,
    ].join("\n");

    try {
      await sendQuoteEmail({
        product_type:   productTitle,
        mode:           "Personal Lines",
        language:       lang.toUpperCase(),
        timestamp:      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET",
        fields_summary: summary,
        to_email:       "info@ativainsurance.com",
      });
    } catch (err) {
      console.error("[Ativa] PropertyInsuranceForm submit failed:", err);
      setSendError(true);
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  /* ── Success screen ──────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-6 gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: ACCENT }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
            {t("form.success.title")}
          </h3>
          <p style={{ color: "var(--text-muted)" }}>{t("form.success.body")}</p>
          {sendError && (
            <p className="mt-2 text-xs text-amber-500">
              (Could not send email — please call 561-946-8261)
            </p>
          )}
        </div>
        <a
          href="https://wa.me/13213448474"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Continue on WhatsApp
        </a>
        <button
          onClick={onClose}
          className="px-8 py-2.5 rounded-xl font-semibold text-sm border-2 transition-colors duration-150"
          style={{ borderColor: "#CBD5E1", color: "var(--text-muted)" }}
        >
          {t("form.success.cta")}
        </button>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col">

      {/* Progress */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {t("form.progress", { current: step + 1, total: TOTAL })}
          </span>
          <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>
            {STEP_NAMES[step]}
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "#E2E8F0" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / TOTAL) * 100}%`, backgroundColor: ACCENT }}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 pt-2 pb-3 grid grid-cols-1 gap-4 animate-slide-in" key={step}>

        {/* ── Step 0: Property ─────────────────────────────────────────────── */}
        {step === 0 && (
          <>
            <FieldWrap label="Property Address" required error={errors.propertyAddress}>
              <AddressAutocomplete
                id="field-propertyAddress"
                value={data.propertyAddress ?? ""}
                onChange={v => update("propertyAddress", v)}
                placeholder="Start typing property address…"
                className={INPUT_CLASS}
              />
            </FieldWrap>

            <FieldWrap label="Property Type" required error={errors.propertyType}>
              <div className="relative">
                <select
                  value={data.propertyType ?? ""}
                  onChange={e => update("propertyType", e.target.value)}
                  className={SELECT_CLASS}
                  style={{ borderColor: borderOf("propertyType") }}
                >
                  <option value="" disabled>— Select type —</option>
                  {["House", "Condo", "Mobile Home"].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <Chevron />
              </div>
            </FieldWrap>

            <FieldWrap label="Property Occupancy" required error={errors.propertyOccupancy}>
              <div className="relative">
                <select
                  value={data.propertyOccupancy ?? ""}
                  onChange={e => update("propertyOccupancy", e.target.value)}
                  className={SELECT_CLASS}
                  style={{ borderColor: borderOf("propertyOccupancy") }}
                >
                  <option value="" disabled>— Select occupancy —</option>
                  {[
                    "Primary Owner Residency",
                    "Secondary Owner Residency",
                    "Short Term Rental",
                    "Annual Rental",
                  ].map(o => <option key={o}>{o}</option>)}
                </select>
                <Chevron />
              </div>
            </FieldWrap>
          </>
        )}

        {/* ── Step 1: Applicant ────────────────────────────────────────────── */}
        {step === 1 && (
          <>
            <FieldWrap label="Applicant Full Name" required error={errors.fullName}>
              <input
                type="text"
                value={data.fullName ?? ""}
                onChange={e => update("fullName", e.target.value)}
                placeholder="Jane Doe"
                className={INPUT_CLASS}
                style={{ borderColor: borderOf("fullName") }}
              />
            </FieldWrap>

            <FieldWrap label="Date of Birth" required error={errors.dob}>
              <input
                type="date"
                value={data.dob ?? ""}
                onChange={e => update("dob", e.target.value)}
                className={INPUT_CLASS}
                style={{ borderColor: borderOf("dob") }}
              />
            </FieldWrap>

            <FieldWrap
              label="Current Address"
              error={errors.currentAddress}
              hint="Only if different from property address"
            >
              <AddressAutocomplete
                id="field-currentAddress"
                value={data.currentAddress ?? ""}
                onChange={v => update("currentAddress", v)}
                placeholder="Start typing current address…"
                className={INPUT_CLASS}
              />
            </FieldWrap>
          </>
        )}

        {/* ── Step 2: Coverage ─────────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <FieldWrap label="Insurance Purpose" required error={errors.insurancePurpose}>
              <div className="flex flex-col gap-2 mt-0.5">
                {["New Purchase", "Refinance", "Reshopping for Insurance"].map(opt => (
                  <RadioBtn
                    key={opt}
                    label={opt}
                    checked={data.insurancePurpose === opt}
                    accent={ACCENT}
                    onSelect={() => {
                      update("insurancePurpose", opt);
                      if (opt === "New Purchase") {
                        update("currentInsurance", "");
                        update("currentInsuranceCompany", "");
                        update("policyExpirationDate", "");
                      }
                    }}
                  />
                ))}
              </div>
            </FieldWrap>

            {!isNewPurchase && (
              <FieldWrap label="Current Insurance" required error={errors.currentInsurance}>
                <div className="flex gap-3 mt-0.5">
                  {["Yes", "No"].map(opt => (
                    <RadioBtn
                      key={opt}
                      label={opt}
                      checked={data.currentInsurance === opt}
                      accent={ACCENT}
                      onSelect={() => {
                        update("currentInsurance", opt);
                        if (opt === "No") {
                          update("currentInsuranceCompany", "");
                          update("policyExpirationDate", "");
                        }
                      }}
                    />
                  ))}
                </div>
              </FieldWrap>
            )}

            {!isNewPurchase && hasCurrentIns && (
              <>
                <FieldWrap label="Current Insurance Company" error={errors.currentInsuranceCompany}>
                  <input
                    type="text"
                    value={data.currentInsuranceCompany ?? ""}
                    onChange={e => update("currentInsuranceCompany", e.target.value)}
                    placeholder="e.g. State Farm, Allstate…"
                    className={INPUT_CLASS}
                    style={{ borderColor: borderOf("currentInsuranceCompany") }}
                  />
                </FieldWrap>

                <FieldWrap label="Policy Expiration Date" error={errors.policyExpirationDate}>
                  <input
                    type="date"
                    value={data.policyExpirationDate ?? ""}
                    onChange={e => update("policyExpirationDate", e.target.value)}
                    className={INPUT_CLASS}
                    style={{ borderColor: borderOf("policyExpirationDate") }}
                  />
                </FieldWrap>
              </>
            )}
          </>
        )}

        {/* ── Step 3: Contact ──────────────────────────────────────────────── */}
        {step === 3 && (
          <>
            <FieldWrap label="Phone Number" required error={errors.phone}>
              <input
                type="tel"
                value={data.phone ?? ""}
                onChange={e => update("phone", e.target.value)}
                placeholder="(561) 000-0000"
                className={INPUT_CLASS}
                style={{ borderColor: borderOf("phone") }}
                autoComplete="tel"
              />
            </FieldWrap>

            <FieldWrap label="Email Address" required error={errors.email}>
              <input
                type="email"
                value={data.email ?? ""}
                onChange={e => update("email", e.target.value)}
                placeholder="you@example.com"
                className={INPUT_CLASS}
                style={{ borderColor: borderOf("email") }}
                autoComplete="email"
              />
            </FieldWrap>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className={`px-6 pt-2 pb-6 flex gap-3 ${step > 0 ? "justify-between" : "justify-end"}`}>
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-colors duration-150"
            style={{ borderColor: "#CBD5E1", color: "var(--text-muted)" }}
          >
            {t("form.buttons.back")}
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
          onMouseEnter={e => {
            if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT_HOV;
          }}
          onMouseLeave={e => {
            if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT;
          }}
        >
          {submitting
            ? t("form.buttons.submitting")
            : step === TOTAL - 1
            ? t("form.buttons.submit")
            : t("form.buttons.next")}
        </button>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────────── */

function FieldWrap({
  label, required, error, hint, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {hint && (
        <p className="text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>{hint}</p>
      )}
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
      </svg>
    </div>
  );
}

function RadioBtn({
  label, checked, onSelect, accent,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium text-left w-full transition-all duration-150"
      style={{
        borderColor:     checked ? accent : "#E2E8F0",
        backgroundColor: checked ? `${accent}0D` : "transparent",
        color:           "var(--text)",
      }}
    >
      <span
        className="flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: checked ? accent : "#CBD5E1" }}
      >
        {checked && (
          <span
            className="w-2 h-2 rounded-full block"
            style={{ backgroundColor: accent }}
          />
        )}
      </span>
      {label}
    </button>
  );
}
