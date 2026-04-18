"use client";

import { useEffect, useCallback } from "react";
import type { Mode, FormStep } from "@/types";
import StepForm from "./StepForm";
import PropertyInsuranceForm from "./PropertyInsuranceForm";
import PetInsuranceForm from "./PetInsuranceForm";
import { useLanguage } from "@/context/LanguageContext";

interface ModalProps {
  productId: string;
  productTitle: string;
  steps: FormStep[];
  mode: Mode;
  onClose: () => void;
}

export default function Modal({ productId, productTitle, steps, mode, onClose }: ModalProps) {
  const { t } = useLanguage();
  const isPersonal = mode === "personal";

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden animate-modal-in max-h-[92dvh] overflow-y-auto shadow-modal"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Modal header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-0.5"
              style={{ color: "var(--accent)" }}
            >
              {t("nav.getQuote")}
            </p>
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {productTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{ color: "var(--text-muted)" }}
            aria-label={t("form.buttons.close")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form — dedicated components for products with custom flows */}
        {productId === "home" ? (
          <PropertyInsuranceForm
            mode={mode}
            productTitle={productTitle}
            onClose={onClose}
          />
        ) : productId === "condo" ? (
          <PetInsuranceForm
            mode={mode}
            productTitle={productTitle}
            onClose={onClose}
          />
        ) : (
          <StepForm
            steps={steps}
            mode={mode}
            productTitle={productTitle}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
