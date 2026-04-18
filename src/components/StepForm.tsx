"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { FormStep, FormData, Mode } from "@/types";
import AddressAutocomplete from "./AddressAutocomplete";
import { sendQuoteEmail } from "@/lib/emailjs";

interface StepFormProps {
  steps: FormStep[];
  mode: Mode;
  productTitle: string;
  onClose: () => void;
}

/* Shared input class — always white bg, dark text, clearly readable */
const INPUT_CLASS = `
  w-full px-4 py-4 rounded-xl border-2 text-gray-900 bg-white
  placeholder-gray-400 text-base outline-none caret-gray-900
  focus:border-personal focus:ring-4 focus:ring-personal/10
  transition-colors duration-150
`;

const SELECT_CLASS = `
  ${INPUT_CLASS} appearance-none cursor-pointer
`;

export default function StepForm({ steps, mode, productTitle, onClose }: StepFormProps) {
  const { t, tArray, lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError]   = useState(false);

  const isPersonal = mode === "personal";
  const step   = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const accentBg    = isPersonal ? "#1B3A6B" : "#F5C400";
  const accentText  = isPersonal ? "#FFFFFF"  : "#111111";
  const accentHover = isPersonal ? "#2451A0"  : "#D4A800";

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    step.fields.forEach((field) => {
      const val = formData[field.key]?.trim() ?? "";
      if (field.required && !val) {
        newErrors[field.key] = t("form.errors.required");
      }
      if (field.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors[field.key] = t("form.errors.email");
      }
      if (field.type === "tel" && val && !/[\d\s\-().+]{7,}/.test(val)) {
        newErrors[field.key] = t("form.errors.phone");
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, formData, t]);

  const handleNext = () => {
    if (!validate()) return;
    if (isLast) handleSubmit();
    else setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSendError(false);

    // Build human-readable field summary
    const allFields = steps.flatMap((s) => s.fields);
    const summary = allFields
      .map((f) => {
        const label = t(f.labelKey);
        const value = formData[f.key] ?? "(not provided)";
        return `${label}: ${value}`;
      })
      .join("\n");

    try {
      await sendQuoteEmail({
        product_type:   productTitle,
        mode:           mode === "personal" ? "Personal Lines" : "Commercial Lines",
        language:       lang.toUpperCase(),
        timestamp:      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET",
        fields_summary: summary,
        to_email:       "info@ativainsurance.com",
      });
    } catch (err) {
      console.error("[Ativa] EmailJS send failed:", err);
      setSendError(true);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  /* ── Success screen ─────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-6 gap-5 animate-fade-in">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: accentBg }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke={accentText} strokeWidth="2.5" className="w-8 h-8">
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
              (Could not send email automatically — please call 561-946-8261)
            </p>
          )}
        </div>
        {/* WhatsApp CTA */}
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
          style={{ borderColor: isPersonal ? "#CBD5E1" : "rgba(255,255,255,0.2)", color: "var(--text-muted)" }}
        >
          {t("form.success.cta")}
        </button>
      </div>
    );
  }

  /* ── Progress bar ───────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col">
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {t("form.progress", { current: currentStep + 1, total: steps.length })}
          </span>
          <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>
            {t(`form.steps.${step.stepKey}`)}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isPersonal ? "#E2E8F0" : "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%`, backgroundColor: accentBg }}
          />
        </div>
      </div>

      {/* ── Fields ─────────────────────────────────────────────────────────── */}
      <div className="px-6 pt-2 pb-3 grid grid-cols-1 gap-4 animate-slide-in" key={currentStep}>
        {step.fields.map((field) => {
          const label       = t(field.labelKey);
          const placeholder = field.placeholderKey ? t(field.placeholderKey) : "";
          const value       = formData[field.key] ?? "";
          const error       = errors[field.key];
          const borderColor = error ? "#EF4444" : "#E2E8F0";

          return (
            <div key={field.key}>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                {label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>

              {field.type === "select" ? (
                <div className="relative">
                  <select
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={SELECT_CLASS}
                    style={{ borderColor }}
                  >
                    <option value="" disabled>— {label} —</option>
                    {tArray(field.optionsKey ?? "").map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              ) : field.type === "address" ? (
                <AddressAutocomplete
                  id={`field-${field.key}`}
                  value={value}
                  onChange={(v) => handleChange(field.key, v)}
                  placeholder={placeholder || "Start typing address…"}
                  className={INPUT_CLASS}
                />
              ) : field.type === "vin" ? (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value.toUpperCase())}
                    placeholder={placeholder || "1HGBH41JXMN109186"}
                    maxLength={17}
                    className={`${INPUT_CLASS} font-mono tracking-wider`}
                    style={{ borderColor }}
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-400">17-character VIN — enter to auto-fill vehicle details</p>
                </div>
              ) : (
                <input
                  type={
                    field.type === "email"  ? "email"
                    : field.type === "tel"  ? "tel"
                    : field.type === "date" ? "date"
                    : field.type === "number" ? "number"
                    : "text"
                  }
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={placeholder}
                  className={INPUT_CLASS}
                  style={{ borderColor }}
                  autoComplete={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "off"}
                />
              )}

              {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
            </div>
          );
        })}
      </div>

      {/* ── Actions ─────────────────────────────────────────────────────────── */}
      <div className={`px-6 pt-2 pb-6 flex gap-3 ${currentStep > 0 ? "justify-between" : "justify-end"}`}>
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-colors duration-150"
            style={{ borderColor: isPersonal ? "#CBD5E1" : "rgba(255,255,255,0.2)", color: "var(--text-muted)" }}
          >
            {t("form.buttons.back")}
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: accentBg, color: accentText }}
          onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = accentHover; }}
          onMouseLeave={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = accentBg; }}
        >
          {submitting ? t("form.buttons.submitting") : isLast ? t("form.buttons.submit") : t("form.buttons.next")}
        </button>
      </div>
    </div>
  );
}
