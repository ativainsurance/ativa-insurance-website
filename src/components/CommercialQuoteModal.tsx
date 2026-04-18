"use client";

import { useState, useCallback, useEffect } from "react";
import AddressAutocomplete from "./AddressAutocomplete";
import { sendQuoteEmail } from "@/lib/emailjs";
import { useLanguage } from "@/context/LanguageContext";
import type { Mode } from "@/types";

// ─── Commercial dark theme tokens ─────────────────────────────────────────────

const ACCENT     = "#F59E0B";
const ACCENT_HOV = "#D97706";
const SURFACE    = "#0F1117";
const CARD_BG    = "#1A2035";
const BORDER_CLR = "rgba(245,158,11,0.12)";
const TEXT_CLR   = "#F1F5F9";
const TEXT_MUTED = "#94A3B8";
const INPUT_BG   = "#141B2D";

const BASE_INPUT =
  "w-full px-4 py-3.5 rounded-xl text-sm outline-none caret-gray-100 " +
  "placeholder-slate-500 transition-colors duration-150 focus:ring-4 focus:ring-amber-500/10";

const inputSt = (err: boolean): React.CSSProperties => ({
  backgroundColor: INPUT_BG,
  borderWidth: 1.5,
  borderStyle: "solid",
  borderColor: err ? "#EF4444" : "rgba(255,255,255,0.10)",
  color: TEXT_CLR,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Data  = Record<string, string>;
type Multi = Record<string, string[]>;
type Phase = "select" | "form" | "success";
type PID   =
  | "gl" | "commercial-auto" | "workers-comp" | "professional"
  | "cyber" | "builders-risk" | "inland-marine" | "umbrella"
  | "surety" | "do";

// ─── Product catalogue ────────────────────────────────────────────────────────

const PRODUCTS: { id: PID; label: string; icon: string; desc: string }[] = [
  { id: "gl",              label: "General Liability",       icon: "🛡️", desc: "Third-party claims & bodily injury"       },
  { id: "commercial-auto", label: "Commercial Auto",         icon: "🚛", desc: "Fleets, trucks & business vehicles"        },
  { id: "workers-comp",    label: "Workers' Compensation",   icon: "👷", desc: "Required employee injury coverage"         },
  { id: "professional",    label: "Professional Liability",  icon: "📋", desc: "Errors & omissions for service businesses" },
  { id: "cyber",           label: "Cyber Liability",         icon: "🔒", desc: "Data breach & cyber risk protection"       },
  { id: "builders-risk",   label: "Builders Risk",           icon: "🏗️", desc: "Construction & renovation projects"       },
  { id: "inland-marine",   label: "Inland Marine",           icon: "📦", desc: "Equipment, tools & property in transit"    },
  { id: "umbrella",        label: "Umbrella / Excess",       icon: "☂️", desc: "Extends limits over underlying policies"  },
  { id: "surety",          label: "Surety Bond",             icon: "📜", desc: "Contract, license & permit bonds"          },
  { id: "do",              label: "Directors & Officers",    icon: "🤝", desc: "Board & executive liability protection"    },
];

const PRODUCT_LABEL: Record<PID, string> = Object.fromEntries(
  PRODUCTS.map(p => [p.id, p.label])
) as Record<PID, string>;

const STEP_NAME: Record<PID, string[]> = {
  "gl":              ["Business Info",  "Contact"],
  "commercial-auto": ["Fleet Info",     "Contact"],
  "workers-comp":    ["Business Info",  "Contact"],
  "professional":    ["Business Info",  "Contact"],
  "cyber":           ["Business Info",  "Contact"],
  "builders-risk":   ["Project Info",   "Contact"],
  "inland-marine":   ["Equipment Info", "Contact"],
  "umbrella":        ["Coverage Info",  "Contact"],
  "surety":          ["Bond Info",      "Contact"],
  "do":              ["Company Info",   "Contact"],
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Fw({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: TEXT_MUTED }}>
        {label}{required && <span className="ml-1" style={{ color: ACCENT }}>*</span>}
      </label>
      {hint && <p className="text-xs mb-1.5" style={{ color: TEXT_MUTED }}>{hint}</p>}
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold" style={{ color: "#F87171" }}>{error}</p>}
    </div>
  );
}

function Chevron() {
  return (
    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" style={{ color: TEXT_MUTED }}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
      </svg>
    </div>
  );
}

function Radio({ label, checked, onSelect }: { label: string; checked: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left w-full transition-all duration-150"
      style={{
        border: `1.5px solid ${checked ? ACCENT : "rgba(255,255,255,0.10)"}`,
        backgroundColor: checked ? "rgba(245,158,11,0.08)" : "transparent",
        color: checked ? TEXT_CLR : TEXT_MUTED,
      }}>
      <span className="flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
        style={{ borderColor: checked ? ACCENT : "rgba(255,255,255,0.25)" }}>
        {checked && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} />}
      </span>
      {label}
    </button>
  );
}

function SelectField({ id, value, onChange, options, placeholder, hasError }: {
  id: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; hasError?: boolean;
}) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={e => onChange(e.target.value)}
        className={`${BASE_INPUT} appearance-none cursor-pointer`}
        style={inputSt(!!hasError)}>
        <option value="" disabled style={{ backgroundColor: CARD_BG }}>{placeholder}</option>
        {options.map(o => <option key={o} style={{ backgroundColor: CARD_BG }}>{o}</option>)}
      </select>
      <Chevron />
    </div>
  );
}

function MultiCheckbox({ options, selected, onToggle, error }: {
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {options.map(opt => {
          const on = selected.includes(opt.id);
          return (
            <button key={opt.id} type="button" onClick={() => onToggle(opt.id)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-150"
              style={{
                border: `1.5px solid ${on ? ACCENT : "rgba(255,255,255,0.10)"}`,
                backgroundColor: on ? "rgba(245,158,11,0.08)" : "transparent",
                color: on ? TEXT_CLR : TEXT_MUTED,
              }}>
              <span className="w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all"
                style={{ borderColor: on ? ACCENT : "rgba(255,255,255,0.25)", backgroundColor: on ? ACCENT : "transparent" }}>
                {on && (
                  <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                )}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold" style={{ color: "#F87171" }}>{error}</p>}
    </div>
  );
}

// ─── Contact fields (shared last step) ───────────────────────────────────────

function ContactFields({ data, update, errors }: {
  data: Data; update: (k: string, v: string) => void; errors: Record<string, string>;
}) {
  return (
    <>
      <Fw label="Full Name" required error={errors.fullName}>
        <input type="text" value={data.fullName ?? ""} onChange={e => update("fullName", e.target.value)}
          placeholder="Jane Doe" className={BASE_INPUT} style={inputSt(!!errors.fullName)} />
      </Fw>
      <Fw label="Phone Number" required error={errors.phone}>
        <input type="tel" value={data.phone ?? ""} onChange={e => update("phone", e.target.value)}
          placeholder="(561) 000-0000" className={BASE_INPUT} style={inputSt(!!errors.phone)} autoComplete="tel" />
      </Fw>
      <Fw label="Email Address" required error={errors.email}>
        <input type="email" value={data.email ?? ""} onChange={e => update("email", e.target.value)}
          placeholder="you@company.com" className={BASE_INPUT} style={inputSt(!!errors.email)} autoComplete="email" />
      </Fw>
    </>
  );
}

// ─── General Liability ────────────────────────────────────────────────────────

function GLFields({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Business Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Acme Corp LLC" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Business Type / Industry" required error={errors.industry}>
        <SelectField id="c-gl-ind" value={data.industry ?? ""} onChange={v => update("industry", v)} hasError={!!errors.industry}
          options={["Retail","Restaurant / Food Service","Construction","Healthcare","Professional Services","Transportation","Technology","Real Estate","Manufacturing","Other"]}
          placeholder="— Select industry —" />
      </Fw>
      <div className="grid grid-cols-2 gap-3">
        <Fw label="Years in Operation" required error={errors.yearsInOp}>
          <input type="number" value={data.yearsInOp ?? ""} onChange={e => update("yearsInOp", e.target.value)}
            placeholder="5" min="0" className={BASE_INPUT} style={inputSt(!!errors.yearsInOp)} />
        </Fw>
        <Fw label="No. of Employees" required error={errors.employees}>
          <input type="number" value={data.employees ?? ""} onChange={e => update("employees", e.target.value)}
            placeholder="12" min="1" className={BASE_INPUT} style={inputSt(!!errors.employees)} />
        </Fw>
      </div>
      <Fw label="Annual Gross Revenue ($)" required error={errors.revenue}>
        <input type="number" value={data.revenue ?? ""} onChange={e => update("revenue", e.target.value)}
          placeholder="500000" min="0" className={BASE_INPUT} style={inputSt(!!errors.revenue)} />
      </Fw>
      <Fw label="Any claims in the last 3 years?" required error={errors.claims}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.claims === o} onSelect={() => update("claims", o)} />)}
        </div>
      </Fw>
      <Fw label="Business Address" required error={errors.businessAddress}>
        <AddressAutocomplete id="c-gl-addr" value={data.businessAddress ?? ""}
          onChange={v => update("businessAddress", v)}
          placeholder="Start typing business address…" className={BASE_INPUT} />
      </Fw>
    </>
  );
}

// ─── Commercial Auto ──────────────────────────────────────────────────────────

const VEHICLE_TYPES = [
  { id: "sedans",    label: "Sedans / Passenger Cars" },
  { id: "trucks",    label: "Trucks / Pickups"         },
  { id: "vans",      label: "Vans / Cargo Vans"        },
  { id: "heavy",     label: "Heavy Equipment / Semi"   },
];

function CommAutoFields({ data, update, errors, multi, onToggle }: {
  data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>;
  multi: Multi; onToggle: (key: string, id: string) => void;
}) {
  return (
    <>
      <Fw label="Business Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Fleet Co LLC" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Number of Vehicles" required error={errors.numVehicles}>
        <input type="number" value={data.numVehicles ?? ""} onChange={e => update("numVehicles", e.target.value)}
          placeholder="4" min="1" className={BASE_INPUT} style={inputSt(!!errors.numVehicles)} />
      </Fw>
      <Fw label="Vehicle Types" required error={errors.vehicleTypes}>
        <MultiCheckbox options={VEHICLE_TYPES} selected={multi.vehicleTypes ?? []}
          onToggle={id => onToggle("vehicleTypes", id)} error={errors.vehicleTypes} />
      </Fw>
      <Fw label="Primary Use" required error={errors.primaryUse}>
        <div className="flex flex-col gap-2 mt-0.5">
          {["Local deliveries","Long-haul","Passenger transport","Construction / Work site"].map(o => (
            <Radio key={o} label={o} checked={data.primaryUse === o} onSelect={() => update("primaryUse", o)} />
          ))}
        </div>
      </Fw>
      <Fw label="Any drivers with violations in the last 3 years?" required error={errors.violations}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.violations === o} onSelect={() => update("violations", o)} />)}
        </div>
      </Fw>
    </>
  );
}

// ─── Workers' Comp ────────────────────────────────────────────────────────────

function WorkersCompFields({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Business Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Acme Corp LLC" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Industry" required error={errors.industry}>
        <SelectField id="c-wc-ind" value={data.industry ?? ""} onChange={v => update("industry", v)} hasError={!!errors.industry}
          options={["Construction","Healthcare","Manufacturing","Retail","Restaurant / Food Service","Transportation","Professional Services","Technology","Other"]}
          placeholder="— Select industry —" />
      </Fw>
      <div className="grid grid-cols-2 gap-3">
        <Fw label="No. of Employees" required error={errors.employees}>
          <input type="number" value={data.employees ?? ""} onChange={e => update("employees", e.target.value)}
            placeholder="12" min="1" className={BASE_INPUT} style={inputSt(!!errors.employees)} />
        </Fw>
        <Fw label="Annual Payroll ($)" required error={errors.payroll}>
          <input type="number" value={data.payroll ?? ""} onChange={e => update("payroll", e.target.value)}
            placeholder="400000" min="0" className={BASE_INPUT} style={inputSt(!!errors.payroll)} />
        </Fw>
      </div>
      <Fw label="Any claims in the last 3 years?" required error={errors.claims}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.claims === o} onSelect={() => update("claims", o)} />)}
        </div>
      </Fw>
      <Fw label="Business Address" required error={errors.businessAddress}>
        <AddressAutocomplete id="c-wc-addr" value={data.businessAddress ?? ""}
          onChange={v => update("businessAddress", v)}
          placeholder="Start typing business address…" className={BASE_INPUT} />
      </Fw>
    </>
  );
}

// ─── Professional Liability ───────────────────────────────────────────────────

function ProfessionalFields({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Business Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Consulting Group LLC" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Profession / Service Type" required error={errors.profession}>
        <input type="text" value={data.profession ?? ""} onChange={e => update("profession", e.target.value)}
          placeholder="e.g. IT Consultant, Accountant, Engineer…" className={BASE_INPUT} style={inputSt(!!errors.profession)} />
      </Fw>
      <div className="grid grid-cols-2 gap-3">
        <Fw label="Years in Business" required error={errors.yearsInBiz}>
          <input type="number" value={data.yearsInBiz ?? ""} onChange={e => update("yearsInBiz", e.target.value)}
            placeholder="7" min="0" className={BASE_INPUT} style={inputSt(!!errors.yearsInBiz)} />
        </Fw>
        <Fw label="Annual Revenue ($)" required error={errors.revenue}>
          <input type="number" value={data.revenue ?? ""} onChange={e => update("revenue", e.target.value)}
            placeholder="300000" min="0" className={BASE_INPUT} style={inputSt(!!errors.revenue)} />
        </Fw>
      </div>
      <Fw label="Any claims or complaints in the last 5 years?" required error={errors.claims}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.claims === o} onSelect={() => update("claims", o)} />)}
        </div>
      </Fw>
    </>
  );
}

// ─── Cyber Liability ──────────────────────────────────────────────────────────

function CyberFields({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Business Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Tech Solutions Inc" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Industry" required error={errors.industry}>
        <SelectField id="c-cy-ind" value={data.industry ?? ""} onChange={v => update("industry", v)} hasError={!!errors.industry}
          options={["Technology / SaaS","Healthcare","Financial Services","Retail / eCommerce","Education","Professional Services","Manufacturing","Other"]}
          placeholder="— Select industry —" />
      </Fw>
      <div className="grid grid-cols-2 gap-3">
        <Fw label="No. of Employees" required error={errors.employees}>
          <input type="number" value={data.employees ?? ""} onChange={e => update("employees", e.target.value)}
            placeholder="25" min="1" className={BASE_INPUT} style={inputSt(!!errors.employees)} />
        </Fw>
        <Fw label="Annual Revenue ($)" required error={errors.revenue}>
          <input type="number" value={data.revenue ?? ""} onChange={e => update("revenue", e.target.value)}
            placeholder="1000000" min="0" className={BASE_INPUT} style={inputSt(!!errors.revenue)} />
        </Fw>
      </div>
      <Fw label="Do you store customer data?" required error={errors.storesData}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.storesData === o} onSelect={() => update("storesData", o)} />)}
        </div>
      </Fw>
      <Fw label="Currently have cyber coverage?" required error={errors.hasCyber}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.hasCyber === o} onSelect={() => update("hasCyber", o)} />)}
        </div>
      </Fw>
    </>
  );
}

// ─── Builders Risk ────────────────────────────────────────────────────────────

function BuildersRiskFields({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Project Address" required error={errors.projectAddress}>
        <AddressAutocomplete id="c-br-addr" value={data.projectAddress ?? ""}
          onChange={v => update("projectAddress", v)}
          placeholder="Start typing project address…" className={BASE_INPUT} />
      </Fw>
      <Fw label="Type of Project" required error={errors.projectType}>
        <div className="flex flex-col gap-2 mt-0.5">
          {["New Construction","Renovation","Addition"].map(o => (
            <Radio key={o} label={o} checked={data.projectType === o} onSelect={() => update("projectType", o)} />
          ))}
        </div>
      </Fw>
      <Fw label="Estimated Project Value ($)" required error={errors.projectValue}>
        <input type="number" value={data.projectValue ?? ""} onChange={e => update("projectValue", e.target.value)}
          placeholder="250000" min="0" className={BASE_INPUT} style={inputSt(!!errors.projectValue)} />
      </Fw>
      <Fw label="Expected Completion Date" required error={errors.completionDate}>
        <input type="date" value={data.completionDate ?? ""} onChange={e => update("completionDate", e.target.value)}
          className={BASE_INPUT} style={inputSt(!!errors.completionDate)} />
      </Fw>
      <Fw label="Is the project currently underway?" required error={errors.underway}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.underway === o} onSelect={() => update("underway", o)} />)}
        </div>
      </Fw>
    </>
  );
}

// ─── Inland Marine ────────────────────────────────────────────────────────────

function InlandMarineFields({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Business Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Equipment Co LLC" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Type of Equipment / Property to Insure" required error={errors.equipmentType}>
        <input type="text" value={data.equipmentType ?? ""} onChange={e => update("equipmentType", e.target.value)}
          placeholder="e.g. Construction equipment, medical devices, tools…" className={BASE_INPUT} style={inputSt(!!errors.equipmentType)} />
      </Fw>
      <Fw label="Estimated Total Value ($)" required error={errors.equipmentValue}>
        <input type="number" value={data.equipmentValue ?? ""} onChange={e => update("equipmentValue", e.target.value)}
          placeholder="75000" min="0" className={BASE_INPUT} style={inputSt(!!errors.equipmentValue)} />
      </Fw>
      <Fw label="Is equipment transported off-site?" required error={errors.offSite}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.offSite === o} onSelect={() => update("offSite", o)} />)}
        </div>
      </Fw>
    </>
  );
}

// ─── Umbrella / Excess ────────────────────────────────────────────────────────

const UNDERLYING_POLICIES = [
  { id: "gl",   label: "General Liability" },
  { id: "auto", label: "Commercial Auto"   },
  { id: "wc",   label: "Workers' Comp"     },
  { id: "other",label: "Other"             },
];

function UmbrellaFields({ data, update, errors, multi, onToggle }: {
  data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>;
  multi: Multi; onToggle: (key: string, id: string) => void;
}) {
  return (
    <>
      <Fw label="Business Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Acme Corp LLC" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Underlying Policies in Place" required error={errors.underlyingPolicies}>
        <MultiCheckbox options={UNDERLYING_POLICIES} selected={multi.underlyingPolicies ?? []}
          onToggle={id => onToggle("underlyingPolicies", id)} error={errors.underlyingPolicies} />
      </Fw>
      <Fw label="Current Aggregate Limits" required error={errors.currentLimits}>
        <input type="text" value={data.currentLimits ?? ""} onChange={e => update("currentLimits", e.target.value)}
          placeholder="e.g. $1M / $2M" className={BASE_INPUT} style={inputSt(!!errors.currentLimits)} />
      </Fw>
      <Fw label="Desired Umbrella Limit" required error={errors.umbrellaLimit}>
        <SelectField id="c-umb-lim" value={data.umbrellaLimit ?? ""} onChange={v => update("umbrellaLimit", v)} hasError={!!errors.umbrellaLimit}
          options={["$1,000,000","$2,000,000","$5,000,000","$10,000,000+"]}
          placeholder="— Select limit —" />
      </Fw>
    </>
  );
}

// ─── Surety Bond ──────────────────────────────────────────────────────────────

function SuretyFields({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Business Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Contracting Co LLC" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Bond Type Needed" required error={errors.bondType}>
        <input type="text" value={data.bondType ?? ""} onChange={e => update("bondType", e.target.value)}
          placeholder="e.g. License & Permit, Performance, Contract…" className={BASE_INPUT} style={inputSt(!!errors.bondType)} />
      </Fw>
      <Fw label="Bond Amount Required ($)" required error={errors.bondAmount}>
        <input type="number" value={data.bondAmount ?? ""} onChange={e => update("bondAmount", e.target.value)}
          placeholder="50000" min="0" className={BASE_INPUT} style={inputSt(!!errors.bondAmount)} />
      </Fw>
      <Fw label="State Where Bond Is Required" required error={errors.bondState}>
        <SelectField id="c-sur-st" value={data.bondState ?? ""} onChange={v => update("bondState", v)} hasError={!!errors.bondState}
          options={US_STATES} placeholder="— Select state —" />
      </Fw>
    </>
  );
}

// ─── Directors & Officers ─────────────────────────────────────────────────────

function DOFields({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Company Name" required error={errors.businessName}>
        <input type="text" value={data.businessName ?? ""} onChange={e => update("businessName", e.target.value)}
          placeholder="Holding Corp Inc" className={BASE_INPUT} style={inputSt(!!errors.businessName)} />
      </Fw>
      <Fw label="Industry" required error={errors.industry}>
        <SelectField id="c-do-ind" value={data.industry ?? ""} onChange={v => update("industry", v)} hasError={!!errors.industry}
          options={["Technology","Financial Services","Healthcare","Real Estate","Manufacturing","Non-Profit","Professional Services","Other"]}
          placeholder="— Select industry —" />
      </Fw>
      <div className="grid grid-cols-2 gap-3">
        <Fw label="Board Members / Officers" required error={errors.boardMembers}>
          <input type="number" value={data.boardMembers ?? ""} onChange={e => update("boardMembers", e.target.value)}
            placeholder="5" min="1" className={BASE_INPUT} style={inputSt(!!errors.boardMembers)} />
        </Fw>
        <Fw label="Annual Revenue ($)" required error={errors.revenue}>
          <input type="number" value={data.revenue ?? ""} onChange={e => update("revenue", e.target.value)}
            placeholder="2000000" min="0" className={BASE_INPUT} style={inputSt(!!errors.revenue)} />
        </Fw>
      </div>
      <Fw label="Publicly traded?" required error={errors.publiclyTraded}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.publiclyTraded === o} onSelect={() => update("publiclyTraded", o)} />)}
        </div>
      </Fw>
      <Fw label="Any claims or lawsuits in the last 5 years?" required error={errors.lawsuits}>
        <div className="flex gap-3 mt-0.5">
          {["Yes","No"].map(o => <Radio key={o} label={o} checked={data.lawsuits === o} onSelect={() => update("lawsuits", o)} />)}
        </div>
      </Fw>
    </>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

// Map product-card IDs (from locale/products) to CommercialQuoteModal PIDs
// Also includes direct PID passthrough for the mobile ProductBottomSheet
const COMMERCIAL_CARD_MAP: Partial<Record<string, PID>> = {
  // Hero card IDs
  bop:               "builders-risk",
  gl:                "gl",
  "commercial-auto": "commercial-auto",
  "workers-comp":    "workers-comp",
  professional:      "professional",
  cyber:             "cyber",
  // Direct PID passthrough (bottom sheet selects these by PID)
  "builders-risk":  "builders-risk",
  "inland-marine":  "inland-marine",
  umbrella:         "umbrella",
  surety:           "surety",
  do:               "do",
};

interface CommercialQuoteModalProps {
  onClose: () => void;
  mode: Mode;
  initialProduct?: string;
}

export default function CommercialQuoteModal({ onClose, initialProduct }: CommercialQuoteModalProps) {
  const { t, lang } = useLanguage();
  const initPID = initialProduct ? (COMMERCIAL_CARD_MAP[initialProduct] ?? null) : null;
  const [phase, setPhase]       = useState<Phase>(initPID ? "form" : "select");
  const [product, setProduct]   = useState<PID | null>(initPID);
  const [step, setStep]         = useState(0);
  const [data, setData]         = useState<Data>({});
  const [multi, setMulti]       = useState<Multi>({});
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [submitting, setSubmit] = useState(false);
  const [sendError, setSendErr] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const update = useCallback((key: string, val: string) => {
    setData(p => ({ ...p, [key]: val }));
    setErrors(p => { if (!p[key]) return p; const n = { ...p }; delete n[key]; return n; });
  }, []);

  const toggleMulti = useCallback((key: string, id: string) => {
    setMulti(p => {
      const cur = p[key] ?? [];
      const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
      return { ...p, [key]: next };
    });
    setErrors(p => { if (!p[key]) return p; const n = { ...p }; delete n[key]; return n; });
  }, []);

  const reqMsg = t("form.errors.required") || "Required";

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    if (!product) return true;
    const e: Record<string, string> = {};
    const r = (k: string) => { if (!data[k]?.trim()) e[k] = reqMsg; };
    const rm = (k: string) => { if (!multi[k]?.length) e[k] = reqMsg; };
    const isContact = step === 1;

    if (isContact) {
      r("fullName"); r("phone"); r("email");
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        e.email = t("form.errors.email") || "Invalid email";
      if (data.phone && !/[\d\s\-().+]{7,}/.test(data.phone))
        e.phone = t("form.errors.phone") || "Invalid phone";
    } else {
      switch (product) {
        case "gl":
          r("businessName"); r("industry"); r("yearsInOp"); r("employees"); r("revenue"); r("claims"); r("businessAddress");
          break;
        case "commercial-auto":
          r("businessName"); r("numVehicles"); rm("vehicleTypes"); r("primaryUse"); r("violations");
          break;
        case "workers-comp":
          r("businessName"); r("industry"); r("employees"); r("payroll"); r("claims"); r("businessAddress");
          break;
        case "professional":
          r("businessName"); r("profession"); r("yearsInBiz"); r("revenue"); r("claims");
          break;
        case "cyber":
          r("businessName"); r("industry"); r("employees"); r("revenue"); r("storesData"); r("hasCyber");
          break;
        case "builders-risk":
          r("projectAddress"); r("projectType"); r("projectValue"); r("completionDate"); r("underway");
          break;
        case "inland-marine":
          r("businessName"); r("equipmentType"); r("equipmentValue"); r("offSite");
          break;
        case "umbrella":
          r("businessName"); rm("underlyingPolicies"); r("currentLimits"); r("umbrellaLimit");
          break;
        case "surety":
          r("businessName"); r("bondType"); r("bondAmount"); r("bondState");
          break;
        case "do":
          r("businessName"); r("industry"); r("boardMembers"); r("revenue"); r("publiclyTraded"); r("lawsuits");
          break;
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (!validate() || !product) return;
    if (step === 1) {
      await submit();
    } else {
      setErrors({});
      setStep(1);
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step === 0) { setPhase("select"); setProduct(null); }
    else setStep(0);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const submit = async () => {
    setSubmit(true);
    setSendErr(false);
    const lines = [`Product: ${product ? PRODUCT_LABEL[product] : "Unknown"}`, `Mode: Commercial Lines`];
    Object.entries(data).forEach(([k, v]) => { if (v) lines.push(`${k}: ${v}`); });
    Object.entries(multi).forEach(([k, v]) => { if (v?.length) lines.push(`${k}: ${v.join(", ")}`); });

    try {
      await sendQuoteEmail({
        product_type:   product ? PRODUCT_LABEL[product] : "Commercial Quote",
        mode:           "Commercial Lines",
        language:       lang.toUpperCase(),
        timestamp:      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET",
        fields_summary: lines.join("\n"),
        to_email:       "info@ativainsurance.com",
      });
    } catch (err) {
      console.error("[Ativa] CommercialQuoteModal submit failed:", err);
      setSendErr(true);
    }
    setSubmit(false);
    setPhase("success");
  };

  // ── Fields renderer ─────────────────────────────────────────────────────────
  const renderFields = () => {
    if (!product) return null;
    if (step === 1) return <ContactFields data={data} update={update} errors={errors} />;
    switch (product) {
      case "gl":              return <GLFields data={data} update={update} errors={errors} />;
      case "commercial-auto": return <CommAutoFields data={data} update={update} errors={errors} multi={multi} onToggle={toggleMulti} />;
      case "workers-comp":    return <WorkersCompFields data={data} update={update} errors={errors} />;
      case "professional":    return <ProfessionalFields data={data} update={update} errors={errors} />;
      case "cyber":           return <CyberFields data={data} update={update} errors={errors} />;
      case "builders-risk":   return <BuildersRiskFields data={data} update={update} errors={errors} />;
      case "inland-marine":   return <InlandMarineFields data={data} update={update} errors={errors} />;
      case "umbrella":        return <UmbrellaFields data={data} update={update} errors={errors} multi={multi} onToggle={toggleMulti} />;
      case "surety":          return <SuretyFields data={data} update={update} errors={errors} />;
      case "do":              return <DOFields data={data} update={update} errors={errors} />;
      default:                return null;
    }
  };

  const title    = phase === "select" ? "Get a Commercial Quote"
                 : phase === "form" && product ? PRODUCT_LABEL[product]
                 : "Quote Requested";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden animate-modal-in shadow-modal"
        style={{
          backgroundColor: SURFACE,
          border: `1px solid ${BORDER_CLR}`,
          maxHeight: "92dvh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,158,11,0.08)",
        }}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{
            backgroundColor: SURFACE,
            borderBottom: `1px solid ${BORDER_CLR}`,
          }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: ACCENT }}>
              Commercial Lines
            </p>
            <h2 className="text-lg font-bold" style={{ color: TEXT_CLR }}>{title}</h2>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{ color: TEXT_MUTED, backgroundColor: "rgba(255,255,255,0.06)" }}
            aria-label="Close"
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.06)"; }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Success ── */}
        {phase === "success" && (
          <div className="flex flex-col items-center text-center py-12 px-6 gap-5">
            {/* Amber ring + check */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(245,158,11,0.12)", border: `2px solid ${ACCENT}` }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" className="w-9 h-9">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2" style={{ color: TEXT_CLR }}>You&apos;re all set!</h3>
              <p className="text-sm leading-relaxed max-w-xs mx-auto mb-1" style={{ color: TEXT_MUTED }}>
                A licensed commercial agent will reach out within 1 business day with your personalized quote.
              </p>
              {sendError && (
                <p className="mt-3 text-xs" style={{ color: "#FBBF24" }}>
                  Delivery issue — we&apos;ll still follow up. Or call 561-946-8261.
                </p>
              )}
            </div>
            <a href="https://wa.me/13213448474" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ backgroundColor: "#25D366" }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
            <button onClick={onClose}
              className="px-8 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-150"
              style={{ border: `1.5px solid rgba(255,255,255,0.12)`, color: TEXT_MUTED, backgroundColor: "transparent" }}>
              Close
            </button>
          </div>
        )}

        {/* ── Product selection ── */}
        {phase === "select" && (
          <div className="px-6 pt-5 pb-6">
            <p className="text-sm font-semibold mb-1" style={{ color: TEXT_CLR }}>
              What coverage are you looking for?
            </p>
            <p className="text-xs mb-4" style={{ color: TEXT_MUTED }}>
              Select one — we&apos;ll ask only what we need.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {PRODUCTS.map(p => (
                <button key={p.id} type="button"
                  onClick={() => { setProduct(p.id); setStep(0); setData({}); setMulti({}); setErrors({}); setPhase("form"); }}
                  className="group flex flex-col gap-1 px-4 py-3.5 rounded-xl text-left transition-all duration-150"
                  style={{
                    border: `1.5px solid rgba(245,158,11,0.12)`,
                    backgroundColor: CARD_BG,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = ACCENT;
                    el.style.backgroundColor = "rgba(245,158,11,0.06)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(245,158,11,0.12)";
                    el.style.backgroundColor = CARD_BG;
                  }}
                >
                  <span className="text-xl leading-none">{p.icon}</span>
                  <span className="text-xs font-bold leading-tight mt-0.5" style={{ color: TEXT_CLR }}>{p.label}</span>
                  <span className="text-[10px] leading-tight hidden sm:block" style={{ color: TEXT_MUTED }}>{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Form steps ── */}
        {phase === "form" && product && (
          <>
            {/* Progress */}
            <div className="px-6 pt-5 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: TEXT_MUTED }}>
                  Step {step + 1} of 2
                </span>
                <span className="text-xs font-bold" style={{ color: ACCENT }}>
                  {STEP_NAME[product][step]}
                </span>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(step + 1) / 2 * 100}%`, backgroundColor: ACCENT }} />
              </div>
            </div>

            {/* Fields */}
            <div className="px-6 pt-2 pb-3 grid grid-cols-1 gap-4 animate-slide-in"
              key={`${product}-${step}`}>
              {renderFields()}
            </div>

            {/* Nav */}
            <div className="px-6 pt-2 pb-6 flex gap-3 justify-between"
              style={{ borderTop: `1px solid ${BORDER_CLR}` }}>
              <button type="button" onClick={handleBack}
                className="px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
                style={{
                  border: `1.5px solid rgba(255,255,255,0.12)`,
                  color: TEXT_MUTED,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}>
                Back
              </button>
              <button type="button" onClick={handleNext} disabled={submitting}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: ACCENT, color: "#0D1117" }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT_HOV; }}
                onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT; }}>
                {submitting ? "Submitting…"
                  : step === 1 ? (t("form.buttons.submit") || "Request My Quote")
                  : (t("form.buttons.next") || "Next →")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
