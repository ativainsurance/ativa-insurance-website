"use client";

import { useState, useCallback, useEffect } from "react";
import AddressAutocomplete from "./AddressAutocomplete";
import { sendQuoteEmail } from "@/lib/emailjs";
import { validateDOB, validatePetDOB } from "@/lib/validateDOB";
import { useLanguage } from "@/context/LanguageContext";
import type { Mode } from "@/types";

// ─── Shared styles ────────────────────────────────────────────────────────────

const ACCENT     = "#1B3A6B";
const ACCENT_HOV = "#2451A0";

const INPUT = [
  "w-full px-4 py-3.5 min-h-[52px] rounded-xl border-2 text-gray-900 bg-white",
  "placeholder-gray-400 outline-none caret-gray-900",
  "focus:ring-[3px] focus:ring-[#1B3A6B]/10 transition-colors duration-150",
].join(" ");
// Note: font-size 16px enforced globally in globals.css to prevent iOS zoom

const SELECT = `${INPUT} appearance-none cursor-pointer`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Data      = Record<string, string>;
type Phase     = "select" | "form" | "success";
type PID       = "auto" | "property" | "renters" | "pet" | "flood" | "umbrella" | "vacant" | "boat" | "motorcycle" | "bundle";
type VinStatus = "idle" | "loading" | "success" | "error";

interface VehicleData {
  vin: string; primaryUse: string; dailyMiles: string;
  decodedYear: string; decodedMake: string; decodedModel: string;
  decodedTrim: string; decodedBodyClass: string; driveType: string; engineHP: string;
  vinStatus: VinStatus;
}

interface DriverData {
  fullName: string; dob: string; licenseNumber: string; licenseState: string;
  maritalStatus: string; education: string; occupation: string;
  accidents: string; accidentDetails: string;
}

function emptyVehicle(): VehicleData {
  return {
    vin: "", primaryUse: "", dailyMiles: "",
    decodedYear: "", decodedMake: "", decodedModel: "",
    decodedTrim: "", decodedBodyClass: "", driveType: "", engineHP: "",
    vinStatus: "idle",
  };
}

function emptyDriver(): DriverData {
  return {
    fullName: "", dob: "", licenseNumber: "", licenseState: "",
    maritalStatus: "", education: "", occupation: "",
    accidents: "", accidentDetails: "",
  };
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

// ─── Product catalogue ────────────────────────────────────────────────────────

const PRODUCTS: { id: PID; label: string; emoji: string }[] = [
  { id: "auto",       label: "Auto Insurance",          emoji: "🚗" },
  { id: "property",   label: "Property Insurance",      emoji: "🏠" },
  { id: "renters",    label: "Renters Insurance",       emoji: "🔑" },
  { id: "pet",        label: "Pet Insurance",           emoji: "🐾" },
  { id: "flood",      label: "Flood Insurance",         emoji: "💧" },
  { id: "bundle",     label: "Bundle & Save",           emoji: "🛡️" },
  { id: "umbrella",   label: "Umbrella Insurance",      emoji: "☂️" },
  { id: "vacant",     label: "Vacant Property",         emoji: "🏚️" },
  { id: "boat",       label: "Boat / Watercraft",       emoji: "⛵" },
  { id: "motorcycle", label: "Motorcycle Insurance",    emoji: "🏍️" },
];

const PRODUCT_LABEL: Record<PID, string> = Object.fromEntries(
  PRODUCTS.map(p => [p.id, p.label])
) as Record<PID, string>;

// Steps per product (0-indexed; last step is always Contact)
const STEP_COUNT: Record<PID, number> = {
  auto: 5, property: 3, renters: 2, pet: 2, flood: 2,
  umbrella: 2, vacant: 2, boat: 2, motorcycle: 2, bundle: 3,
};

const STEP_NAME: Record<PID, string[]> = {
  auto:       ["Vehicle", "Details", "Vehicles", "Drivers", "Contact"],
  property:   ["Property", "Coverage", "Contact"],
  renters:    ["Property", "Contact"],
  pet:        ["Pet Info", "Contact"],
  flood:      ["Property", "Contact"],
  umbrella:   ["Coverage", "Contact"],
  vacant:     ["Property", "Contact"],
  boat:       ["Vessel", "Contact"],
  motorcycle: ["Motorcycle", "Contact"],
  bundle:     ["Products", "Details", "Contact"],
};

const BUNDLE_OPTIONS = PRODUCTS.filter(p => p.id !== "bundle");

// ─── Sub-components ───────────────────────────────────────────────────────────

function Fw({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-medium mb-1.5" style={{ color: "#374151", fontSize: "15px", lineHeight: 1.5 }}>
        {label}{required && <span className="ml-1" style={{ color: "#DC2626" }}>*</span>}
      </label>
      {hint && <p className="mb-1.5" style={{ color: "var(--text-muted)", fontSize: "14px" }}>{hint}</p>}
      {children}
      {error && <p className="mt-1 font-medium" style={{ fontSize: "14px", color: "#DC2626" }}>{error}</p>}
    </div>
  );
}

function Chevron() {
  return (
    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
      </svg>
    </div>
  );
}

function Radio({ label, checked, onSelect }: { label: string; checked: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium text-left w-full transition-all duration-150"
      style={{
        borderColor:     checked ? ACCENT : "#E2E8F0",
        backgroundColor: checked ? `${ACCENT}0D` : "transparent",
        color:           "var(--text)",
      }}>
      <span className="flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: checked ? ACCENT : "#CBD5E1" }}>
        {checked && <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: ACCENT }} />}
      </span>
      {label}
    </button>
  );
}

function SelectField({ id, value, onChange, options, placeholder, borderColor }: {
  id: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; borderColor: string;
}) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={e => onChange(e.target.value)}
        className={SELECT} style={{ borderColor }}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <Chevron />
    </div>
  );
}

// ─── Contact step (shared last step for all products) ─────────────────────────

function ContactFields({ data, update, errors, borderOf }: {
  data: Data; update: (k: string, v: string) => void;
  errors: Record<string, string>; borderOf: (k: string) => string;
}) {
  return (
    <>
      <Fw label="Full Name" required error={errors.fullName}>
        <input type="text" value={data.fullName ?? ""} onChange={e => update("fullName", e.target.value)}
          placeholder="Jane Doe" className={INPUT} style={{ borderColor: borderOf("fullName") }} />
      </Fw>
      <Fw label="Phone Number" required error={errors.phone}>
        <input type="tel" value={data.phone ?? ""} onChange={e => update("phone", e.target.value)}
          placeholder="(561) 000-0000" className={INPUT} style={{ borderColor: borderOf("phone") }}
          autoComplete="tel" />
      </Fw>
      <Fw label="Email Address" required error={errors.email}>
        <input type="email" value={data.email ?? ""} onChange={e => update("email", e.target.value)}
          placeholder="you@example.com" className={INPUT} style={{ borderColor: borderOf("email") }}
          autoComplete="email" />
      </Fw>
    </>
  );
}

// ─── Per-product step renderers ───────────────────────────────────────────────

interface DecodedVehicle {
  year: string; make: string; model: string; trim: string; bodyClass: string;
}

function AutoStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  const [vinStatus, setVinStatus] = useState<VinStatus>(() =>
    (data.year && data.make && data.model) ? "success" : "idle"
  );
  const [decoded, setDecoded] = useState<DecodedVehicle | null>(() =>
    (data.year && data.make && data.model)
      ? { year: data.year, make: data.make, model: data.model, trim: data.trim ?? "", bodyClass: data.bodyClass ?? "" }
      : null
  );

  const decodeVin = async (vin: string) => {
    setVinStatus("loading");
    try {
      const res  = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`);
      const json = await res.json();
      const r    = json.Results?.[0];
      const year      = r?.ModelYear    ?? "";
      const make      = r?.Make         ?? "";
      const model     = r?.Model        ?? "";
      const trim      = r?.Trim         ?? "";
      const bodyClass = r?.BodyClass    ?? "";
      const driveType = r?.DriveType    ?? "";
      const engineHP  = r?.EngineHP     ?? "";

      if (year && make && model) {
        setDecoded({ year, make, model, trim, bodyClass });
        setVinStatus("success");
        update("year",      year);
        update("make",      make);
        update("model",     model);
        update("trim",      trim);
        update("bodyClass", bodyClass);
        update("driveType", driveType);
        update("engineHP",  engineHP);
      } else {
        setDecoded(null);
        setVinStatus("error");
      }
    } catch {
      setDecoded(null);
      setVinStatus("error");
    }
  };

  const handleVinChange = (raw: string) => {
    const vin = raw.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    update("vin", vin);
    if (vin.length < 17) {
      setVinStatus("idle");
      setDecoded(null);
    } else if (vin.length === 17) {
      decodeVin(vin);
    }
  };

  return (
    <>
      {/* Garaging ZIP — pre-filled from hero ZIP field */}
      <Fw label="Vehicle Garaging ZIP Code" required error={errors.garageZip}>
        <input
          type="text"
          value={data.garageZip ?? ""}
          onChange={e => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 5);
            update("garageZip", val);
          }}
          placeholder="e.g. 33401"
          maxLength={5}
          inputMode="numeric"
          className={INPUT}
          style={{ borderColor: errors.garageZip ? "#EF4444" : "#E2E8F0" }}
        />
      </Fw>

      {/* VIN — primary field */}
      <Fw label="VIN Number" required error={errors.vin}
        hint="Enter your 17-character VIN (found on dashboard or driver's door)">
        <div className="relative">
          <input
            type="text"
            value={data.vin ?? ""}
            onChange={e => handleVinChange(e.target.value)}
            placeholder="1HGBH41JXMN109186"
            maxLength={17}
            className={`${INPUT} font-mono tracking-widest pr-10`}
            style={{ borderColor: vinStatus === "error" ? "#EF4444" : vinStatus === "success" ? "#10B981" : borderOf("vin") }}
          />
          {/* Character counter */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono"
            style={{ color: (data.vin?.length ?? 0) === 17 ? "#10B981" : "#9CA3AF" }}>
            {data.vin?.length ?? 0}/17
          </span>
        </div>
      </Fw>

      {/* Loading */}
      {vinStatus === "loading" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#F0F4FF", border: "1px solid #C7D7FE" }}>
          <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          <span className="text-sm font-medium" style={{ color: "#1B3A6B" }}>Looking up vehicle…</span>
        </div>
      )}

      {/* Success — decoded card */}
      {vinStatus === "success" && decoded && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <svg viewBox="0 0 20 20" fill="#10B981" className="w-5 h-5 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <div>
            <p className="text-sm font-bold" style={{ color: "#065F46" }}>
              {decoded.year} {decoded.make} {decoded.model}
              {decoded.trim ? ` — ${decoded.trim}` : ""}
            </p>
            {decoded.bodyClass && (
              <p className="text-xs mt-0.5" style={{ color: "#047857" }}>{decoded.bodyClass}</p>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {vinStatus === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
          <svg viewBox="0 0 20 20" fill="#DC2626" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <p className="text-sm font-medium" style={{ color: "#DC2626" }}>
            VIN not found — please check and re-enter
          </p>
        </div>
      )}

      {/* Primary use */}
      <Fw label="Primary use of this vehicle" required error={errors.primaryUse}>
        <div className="flex flex-col gap-2 mt-0.5">
          {[
            "Commute to work / school",
            "Personal / leisure only",
            "Business use",
            "Rideshare (Uber/Lyft)",
          ].map(o => (
            <Radio key={o} label={o} checked={data.primaryUse === o} onSelect={() => update("primaryUse", o)} />
          ))}
        </div>
      </Fw>

      {/* Daily mileage */}
      <Fw label="Estimated daily miles driven" required error={errors.dailyMiles}>
        <SelectField
          id="q-dailyMiles"
          value={data.dailyMiles ?? ""}
          onChange={v => update("dailyMiles", v)}
          options={["Less than 10 miles/day", "10–30 miles/day", "30–60 miles/day", "60+ miles/day"]}
          placeholder="— Select daily mileage —"
          borderColor={borderOf("dailyMiles")}
        />
      </Fw>
    </>
  );
}

function AutoStep1({ data, update, errors }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string> }) {
  return (
    <>
      <Fw label="Drivers in Household" required error={errors.driversCount}>
        <input type="number" value={data.driversCount ?? ""} onChange={e => update("driversCount", e.target.value)}
          placeholder="2" className={INPUT} style={{ borderColor: errors.driversCount ? "#EF4444" : "#E2E8F0" }} min="1" max="10" />
      </Fw>
      <Fw label="Any accidents or violations in the last 3 years?" required error={errors.accidents}>
        <div className="flex gap-3 mt-0.5">
          {["Yes", "No"].map(o => (
            <Radio key={o} label={o} checked={data.accidents === o} onSelect={() => update("accidents", o)} />
          ))}
        </div>
      </Fw>
    </>
  );
}

// ─── VIN decode helper (shared by VehicleCard) ────────────────────────────────

async function decodeVinApi(vin: string): Promise<{
  year: string; make: string; model: string; trim: string;
  bodyClass: string; driveType: string; engineHP: string;
} | null> {
  try {
    const res  = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`);
    const json = await res.json();
    const r    = json.Results?.[0];
    const year = r?.ModelYear ?? "";
    const make = r?.Make      ?? "";
    const model = r?.Model    ?? "";
    if (!year || !make || !model) return null;
    return {
      year, make, model,
      trim:      r?.Trim      ?? "",
      bodyClass: r?.BodyClass ?? "",
      driveType: r?.DriveType ?? "",
      engineHP:  r?.EngineHP  ?? "",
    };
  } catch { return null; }
}

// ─── VIN status cards (shared UI) ────────────────────────────────────────────

function VinStatusCard({ status, decoded }: { status: VinStatus; decoded?: { year: string; make: string; model: string; trim: string; bodyClass: string } | null }) {
  if (status === "loading") return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
      style={{ backgroundColor: "#F0F4FF", border: "1px solid #C7D7FE" }}>
      <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <span className="text-sm font-medium" style={{ color: "#1B3A6B" }}>Looking up vehicle…</span>
    </div>
  );
  if (status === "success" && decoded) return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
      style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
      <svg viewBox="0 0 20 20" fill="#10B981" className="w-5 h-5 shrink-0 mt-0.5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
      <div>
        <p className="text-sm font-bold" style={{ color: "#065F46" }}>
          {decoded.year} {decoded.make} {decoded.model}{decoded.trim ? ` — ${decoded.trim}` : ""}
        </p>
        {decoded.bodyClass && <p className="text-xs mt-0.5" style={{ color: "#047857" }}>{decoded.bodyClass}</p>}
      </div>
    </div>
  );
  if (status === "error") return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
      style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
      <svg viewBox="0 0 20 20" fill="#DC2626" className="w-4 h-4 shrink-0">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
      <p className="text-sm font-medium" style={{ color: "#DC2626" }}>VIN not found — please check and re-enter</p>
    </div>
  );
  return null;
}

// ─── Vehicle card (for Step 2 additional vehicles) ────────────────────────────

function VehicleCard({ index, vehicle, onUpdate, errors }: {
  index: number;
  vehicle: VehicleData;
  onUpdate: (field: keyof VehicleData, value: string | VinStatus) => void;
  errors: Record<string, string>;
}) {
  const label  = `Vehicle ${index + 2}`;
  const prefix = `v${index + 2}_`;

  const handleVinChange = async (raw: string) => {
    const vin = raw.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    onUpdate("vin", vin);
    if (vin.length < 17) { onUpdate("vinStatus", "idle"); return; }
    onUpdate("vinStatus", "loading");
    const result = await decodeVinApi(vin);
    if (result) {
      onUpdate("decodedYear",      result.year);
      onUpdate("decodedMake",      result.make);
      onUpdate("decodedModel",     result.model);
      onUpdate("decodedTrim",      result.trim);
      onUpdate("decodedBodyClass", result.bodyClass);
      onUpdate("driveType",        result.driveType);
      onUpdate("engineHP",         result.engineHP);
      onUpdate("vinStatus",        "success");
    } else {
      onUpdate("vinStatus", "error");
    }
  };

  const vinBorder = vehicle.vinStatus === "error" ? "#EF4444"
    : vehicle.vinStatus === "success" ? "#10B981"
    : errors[`${prefix}vin`] ? "#EF4444" : "#E2E8F0";

  return (
    <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#F8FAFF" }}>
      <p className="text-sm font-bold mb-3" style={{ color: "#0F2A44" }}>{label}</p>
      <div className="space-y-3">
        <Fw label="VIN Number" required error={errors[`${prefix}vin`]}>
          <div className="relative">
            <input type="text" value={vehicle.vin} onChange={e => handleVinChange(e.target.value)}
              placeholder="1HGBH41JXMN109186" maxLength={17}
              className={`${INPUT} font-mono tracking-widest pr-10`}
              style={{ borderColor: vinBorder }} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono"
              style={{ color: vehicle.vin.length === 17 ? "#10B981" : "#9CA3AF" }}>
              {vehicle.vin.length}/17
            </span>
          </div>
        </Fw>
        <VinStatusCard status={vehicle.vinStatus}
          decoded={vehicle.vinStatus === "success" ? { year: vehicle.decodedYear, make: vehicle.decodedMake, model: vehicle.decodedModel, trim: vehicle.decodedTrim, bodyClass: vehicle.decodedBodyClass } : null} />
        <Fw label="Primary use" required error={errors[`${prefix}primaryUse`]}>
          <div className="flex flex-col gap-2 mt-0.5">
            {["Commute to work / school","Personal / leisure only","Business use","Rideshare (Uber/Lyft)"].map(o => (
              <Radio key={o} label={o} checked={vehicle.primaryUse === o} onSelect={() => onUpdate("primaryUse", o)} />
            ))}
          </div>
        </Fw>
        <Fw label="Estimated daily miles" required error={errors[`${prefix}dailyMiles`]}>
          <SelectField id={`vm-miles-${index}`} value={vehicle.dailyMiles}
            onChange={v => onUpdate("dailyMiles", v)}
            options={["Less than 10 miles/day","10–30 miles/day","30–60 miles/day","60+ miles/day"]}
            placeholder="— Select daily mileage —"
            borderColor={errors[`${prefix}dailyMiles`] ? "#EF4444" : "#E2E8F0"} />
        </Fw>
      </div>
    </div>
  );
}

// ─── Driver card (for Step 3) ─────────────────────────────────────────────────

function DriverCard({ index, driver, onUpdate, errors }: {
  index: number;
  driver: DriverData;
  onUpdate: (field: keyof DriverData, value: string) => void;
  errors: Record<string, string>;
}) {
  const label  = index === 0 ? "Driver 1 (Primary)" : `Driver ${index + 1}`;
  const prefix = `d${index + 1}_`;
  const b = (f: string) => errors[`${prefix}${f}`] ? "#EF4444" : "#E2E8F0";

  return (
    <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#F8FAFF" }}>
      <p className="text-sm font-bold mb-3" style={{ color: "#0F2A44" }}>{label}</p>
      <div className="space-y-3">
        <Fw label="Full Name" required error={errors[`${prefix}fullName`]}>
          <input type="text" value={driver.fullName} onChange={e => onUpdate("fullName", e.target.value)}
            placeholder="Jane Doe" className={INPUT} style={{ borderColor: b("fullName") }} />
        </Fw>
        <Fw label="Date of Birth" required error={errors[`${prefix}dob`]}>
          <input type="date" value={driver.dob} onChange={e => onUpdate("dob", e.target.value)}
            className={INPUT} style={{ borderColor: b("dob") }} />
        </Fw>
        <Fw label="Driver's License Number" required error={errors[`${prefix}licenseNumber`]}>
          <input type="text" value={driver.licenseNumber}
            onChange={e => onUpdate("licenseNumber", e.target.value.toUpperCase())}
            placeholder="A12345678" className={`${INPUT} font-mono tracking-wider`}
            style={{ borderColor: b("licenseNumber") }} />
        </Fw>
        <Fw label="License State" required error={errors[`${prefix}licenseState`]}>
          <SelectField id={`d-state-${index}`} value={driver.licenseState}
            onChange={v => onUpdate("licenseState", v)}
            options={US_STATES} placeholder="— Select state —"
            borderColor={b("licenseState")} />
        </Fw>
        <div className="grid grid-cols-2 gap-3">
          <Fw label="Marital Status" required error={errors[`${prefix}maritalStatus`]}>
            <SelectField id={`d-marital-${index}`} value={driver.maritalStatus}
              onChange={v => onUpdate("maritalStatus", v)}
              options={["Single","Married","Divorced","Widowed"]}
              placeholder="— Select —" borderColor={b("maritalStatus")} />
          </Fw>
          <Fw label="Education" required error={errors[`${prefix}education`]}>
            <SelectField id={`d-edu-${index}`} value={driver.education}
              onChange={v => onUpdate("education", v)}
              options={["High School","Some College","Bachelor's Degree","Graduate Degree","Trade School"]}
              placeholder="— Select —" borderColor={b("education")} />
          </Fw>
        </div>
        <Fw label="Occupation" required error={errors[`${prefix}occupation`]}>
          <input type="text" value={driver.occupation} onChange={e => onUpdate("occupation", e.target.value)}
            placeholder="e.g. Teacher, Engineer, Driver" className={INPUT}
            style={{ borderColor: b("occupation") }} />
        </Fw>
        <Fw label="Any accidents or violations in the last 3 years?" required error={errors[`${prefix}accidents`]}>
          <div className="flex gap-3 mt-0.5">
            {["Yes","No"].map(o => (
              <Radio key={o} label={o} checked={driver.accidents === o} onSelect={() => onUpdate("accidents", o)} />
            ))}
          </div>
        </Fw>
        {driver.accidents === "Yes" && (
          <Fw label="Please describe briefly" hint="Optional">
            <input type="text" value={driver.accidentDetails}
              onChange={e => onUpdate("accidentDetails", e.target.value)}
              placeholder="e.g. Minor fender bender, 2023" className={INPUT}
              style={{ borderColor: "#E2E8F0" }} />
          </Fw>
        )}
      </div>
    </div>
  );
}

// ─── AutoStep2 — multi-vehicle ────────────────────────────────────────────────

function AutoStep2({ data, update, errors, vehicles, setVehicles }: {
  data: Data; update: (k: string, v: string) => void; errors: Record<string, string>;
  vehicles: VehicleData[];
  setVehicles: React.Dispatch<React.SetStateAction<VehicleData[]>>;
}) {
  const handleCountChange = (count: string) => {
    update("vehicleCount", count);
    const n = parseInt(count === "5+" ? "5" : count) || 1;
    const additionalCount = Math.max(0, n - 1);
    setVehicles(prev => {
      if (additionalCount > prev.length) {
        return [...prev, ...Array.from({ length: additionalCount - prev.length }, emptyVehicle)];
      }
      return prev.slice(0, additionalCount);
    });
  };

  return (
    <>
      <Fw label="How many vehicles would you like to insure?" required error={errors.vehicleCount}>
        <SelectField id="q-vehicleCount" value={data.vehicleCount ?? ""} onChange={handleCountChange}
          options={["1","2","3","4","5+"]} placeholder="— Select number of vehicles —"
          borderColor={errors.vehicleCount ? "#EF4444" : "#E2E8F0"} />
      </Fw>
      {vehicles.map((vehicle, i) => (
        <VehicleCard key={i} index={i} vehicle={vehicle}
          onUpdate={(field, val) =>
            setVehicles(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: val } : v))
          }
          errors={errors} />
      ))}
    </>
  );
}

// ─── AutoStep3 — multi-driver ─────────────────────────────────────────────────

function AutoStep3({ data, update, errors, drivers, setDrivers }: {
  data: Data; update: (k: string, v: string) => void; errors: Record<string, string>;
  drivers: DriverData[];
  setDrivers: React.Dispatch<React.SetStateAction<DriverData[]>>;
}) {
  const handleCountChange = (count: string) => {
    update("driverCount", count);
    const n = parseInt(count === "5+" ? "5" : count) || 1;
    setDrivers(prev => {
      if (n > prev.length) {
        return [...prev, ...Array.from({ length: n - prev.length }, emptyDriver)];
      }
      return prev.slice(0, n);
    });
  };

  return (
    <>
      <Fw label="How many drivers will be on the policy?" required error={errors.driverCount}>
        <SelectField id="q-driverCount" value={data.driverCount ?? ""} onChange={handleCountChange}
          options={["1","2","3","4","5+"]} placeholder="— Select number of drivers —"
          borderColor={errors.driverCount ? "#EF4444" : "#E2E8F0"} />
      </Fw>
      {drivers.map((driver, i) => (
        <DriverCard key={i} index={i} driver={driver}
          onUpdate={(field, val) =>
            setDrivers(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d))
          }
          errors={errors} />
      ))}
    </>
  );
}

function PropertyStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  return (
    <>
      <Fw label="Property Address" required error={errors.propertyAddress}>
        <AddressAutocomplete id="q-propAddr" value={data.propertyAddress ?? ""}
          onChange={v => update("propertyAddress", v)}
          placeholder="Start typing property address…" className={INPUT} />
      </Fw>
      <Fw label="Property Type" required error={errors.propertyType}>
        <SelectField id="q-propType" value={data.propertyType ?? ""} onChange={v => update("propertyType", v)}
          options={["House", "Condo", "Mobile Home"]} placeholder="— Select type —"
          borderColor={borderOf("propertyType")} />
      </Fw>
      <Fw label="Occupancy" required error={errors.occupancy}>
        <SelectField id="q-occ" value={data.occupancy ?? ""} onChange={v => update("occupancy", v)}
          options={["Primary Owner Residency", "Secondary Owner Residency", "Short Term Rental", "Annual Rental"]}
          placeholder="— Select occupancy —" borderColor={borderOf("occupancy")} />
      </Fw>
    </>
  );
}

function PropertyStep1({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  const isNewPurchase = data.purpose === "New Purchase";
  const hasInsurance  = data.currentlyInsured === "Yes";
  return (
    <>
      <Fw label="Date of Birth" required error={errors.dob}>
        <input type="date" value={data.dob ?? ""} onChange={e => update("dob", e.target.value)}
          className={INPUT} style={{ borderColor: borderOf("dob") }} />
      </Fw>
      <Fw label="Current Address" hint="Only if different from property address" error={errors.currentAddress}>
        <AddressAutocomplete id="q-curAddr" value={data.currentAddress ?? ""}
          onChange={v => update("currentAddress", v)}
          placeholder="Start typing current address…" className={INPUT} />
      </Fw>
      <Fw label="Insurance Purpose" required error={errors.purpose}>
        <div className="flex flex-col gap-2 mt-0.5">
          {["New Purchase", "Refinance", "Reshopping for Insurance"].map(o => (
            <Radio key={o} label={o} checked={data.purpose === o}
              onSelect={() => {
                update("purpose", o);
                if (o === "New Purchase") { update("currentlyInsured", ""); update("insurerName", ""); update("policyExp", ""); }
              }} />
          ))}
        </div>
      </Fw>
      {!isNewPurchase && (
        <Fw label="Currently insured?" required error={errors.currentlyInsured}>
          <div className="flex gap-3 mt-0.5">
            {["Yes", "No"].map(o => (
              <Radio key={o} label={o} checked={data.currentlyInsured === o}
                onSelect={() => { update("currentlyInsured", o); if (o === "No") { update("insurerName", ""); update("policyExp", ""); } }} />
            ))}
          </div>
        </Fw>
      )}
      {!isNewPurchase && hasInsurance && (
        <>
          <Fw label="Current Insurance Company" error={errors.insurerName}>
            <input type="text" value={data.insurerName ?? ""} onChange={e => update("insurerName", e.target.value)}
              placeholder="e.g. State Farm" className={INPUT} style={{ borderColor: borderOf("insurerName") }} />
          </Fw>
          <Fw label="Policy Expiration Date" error={errors.policyExp}>
            <input type="date" value={data.policyExp ?? ""} onChange={e => update("policyExp", e.target.value)}
              className={INPUT} style={{ borderColor: borderOf("policyExp") }} />
          </Fw>
        </>
      )}
    </>
  );
}

function RentersStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  return (
    <>
      <Fw label="Rental Address" required error={errors.rentalAddress}>
        <AddressAutocomplete id="q-rentAddr" value={data.rentalAddress ?? ""}
          onChange={v => update("rentalAddress", v)}
          placeholder="Start typing rental address…" className={INPUT} />
      </Fw>
      <Fw label="Monthly Rent ($)" required error={errors.monthlyRent}>
        <input type="number" value={data.monthlyRent ?? ""} onChange={e => update("monthlyRent", e.target.value)}
          placeholder="1500" className={INPUT} style={{ borderColor: borderOf("monthlyRent") }} min="0" />
      </Fw>
      <Fw label="Estimated Personal Property Value ($)" required error={errors.propertyValue}>
        <input type="number" value={data.propertyValue ?? ""} onChange={e => update("propertyValue", e.target.value)}
          placeholder="15000" className={INPUT} style={{ borderColor: borderOf("propertyValue") }} min="0" />
      </Fw>
    </>
  );
}

function PetStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  return (
    <>
      <Fw label="Pet Name" required error={errors.petName}>
        <input type="text" value={data.petName ?? ""} onChange={e => update("petName", e.target.value)}
          placeholder="Buddy" className={INPUT} style={{ borderColor: borderOf("petName") }} />
      </Fw>
      <Fw label="Species" required error={errors.species}>
        <SelectField id="q-species" value={data.species ?? ""} onChange={v => update("species", v)}
          options={["Dog", "Cat", "Other"]} placeholder="— Select species —"
          borderColor={borderOf("species")} />
      </Fw>
      <Fw label="Breed" required error={errors.breed}>
        <input type="text" value={data.breed ?? ""} onChange={e => update("breed", e.target.value)}
          placeholder="Golden Retriever" className={INPUT} style={{ borderColor: borderOf("breed") }} />
      </Fw>
      <Fw label="Pet Date of Birth" required error={errors.petDob}>
        <input type="date" value={data.petDob ?? ""} onChange={e => update("petDob", e.target.value)}
          className={INPUT} style={{ borderColor: borderOf("petDob") }} />
      </Fw>
      <Fw label="Spayed / Neutered?" required error={errors.spayedNeutered}>
        <div className="flex gap-3 mt-0.5">
          {["Yes", "No"].map(o => (
            <Radio key={o} label={o} checked={data.spayedNeutered === o} onSelect={() => update("spayedNeutered", o)} />
          ))}
        </div>
      </Fw>
      <Fw label="Pre-existing Conditions?" required error={errors.preExisting}>
        <div className="flex gap-3 mt-0.5">
          {["Yes", "No"].map(o => (
            <Radio key={o} label={o} checked={data.preExisting === o} onSelect={() => update("preExisting", o)} />
          ))}
        </div>
      </Fw>
    </>
  );
}

function FloodStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  const hasFloodIns = data.floodInsured === "Yes";
  return (
    <>
      <Fw label="Property Address" required error={errors.propertyAddress}>
        <AddressAutocomplete id="q-floodAddr" value={data.propertyAddress ?? ""}
          onChange={v => update("propertyAddress", v)}
          placeholder="Start typing property address…" className={INPUT} />
      </Fw>
      <Fw label="Property Type" required error={errors.propertyType}>
        <SelectField id="q-floodType" value={data.propertyType ?? ""} onChange={v => update("propertyType", v)}
          options={["House", "Condo", "Mobile Home"]} placeholder="— Select type —"
          borderColor={borderOf("propertyType")} />
      </Fw>
      <Fw label="Currently have flood insurance?" required error={errors.floodInsured}>
        <div className="flex gap-3 mt-0.5">
          {["Yes", "No"].map(o => (
            <Radio key={o} label={o} checked={data.floodInsured === o}
              onSelect={() => { update("floodInsured", o); if (o === "No") { update("floodCarrier", ""); update("floodExp", ""); } }} />
          ))}
        </div>
      </Fw>
      {hasFloodIns && (
        <>
          <Fw label="Current Carrier" error={errors.floodCarrier}>
            <input type="text" value={data.floodCarrier ?? ""} onChange={e => update("floodCarrier", e.target.value)}
              placeholder="e.g. Wright Flood" className={INPUT} style={{ borderColor: borderOf("floodCarrier") }} />
          </Fw>
          <Fw label="Policy Expiration Date" error={errors.floodExp}>
            <input type="date" value={data.floodExp ?? ""} onChange={e => update("floodExp", e.target.value)}
              className={INPUT} style={{ borderColor: borderOf("floodExp") }} />
          </Fw>
        </>
      )}
    </>
  );
}

function UmbrellaStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  return (
    <>
      <Fw label="Number of Auto Policies" required error={errors.autoPolicies}>
        <input type="number" value={data.autoPolicies ?? ""} onChange={e => update("autoPolicies", e.target.value)}
          placeholder="1" className={INPUT} style={{ borderColor: borderOf("autoPolicies") }} min="0" />
      </Fw>
      <Fw label="Number of Property Policies" required error={errors.propertyPolicies}>
        <input type="number" value={data.propertyPolicies ?? ""} onChange={e => update("propertyPolicies", e.target.value)}
          placeholder="1" className={INPUT} style={{ borderColor: borderOf("propertyPolicies") }} min="0" />
      </Fw>
      <Fw label="Estimated Total Assets to Protect ($)" required error={errors.totalAssets}>
        <input type="number" value={data.totalAssets ?? ""} onChange={e => update("totalAssets", e.target.value)}
          placeholder="500000" className={INPUT} style={{ borderColor: borderOf("totalAssets") }} min="0" />
      </Fw>
    </>
  );
}

function VacantStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  return (
    <>
      <Fw label="Property Address" required error={errors.propertyAddress}>
        <AddressAutocomplete id="q-vacAddr" value={data.propertyAddress ?? ""}
          onChange={v => update("propertyAddress", v)}
          placeholder="Start typing property address…" className={INPUT} />
      </Fw>
      <Fw label="How long has it been vacant?" required error={errors.vacancyDuration}>
        <SelectField id="q-vacDur" value={data.vacancyDuration ?? ""} onChange={v => update("vacancyDuration", v)}
          options={["Less than 30 days", "30–90 days", "Over 90 days"]}
          placeholder="— Select duration —" borderColor={borderOf("vacancyDuration")} />
      </Fw>
      <Fw label="Reason for Vacancy" error={errors.vacancyReason}>
        <input type="text" value={data.vacancyReason ?? ""} onChange={e => update("vacancyReason", e.target.value)}
          placeholder="Optional" className={INPUT} style={{ borderColor: borderOf("vacancyReason") }} />
      </Fw>
    </>
  );
}

function BoatStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <Fw label="Year" required error={errors.year}>
          <input type="number" value={data.year ?? ""} onChange={e => update("year", e.target.value)}
            placeholder="2020" className={INPUT} style={{ borderColor: borderOf("year") }} />
        </Fw>
        <Fw label="Make" required error={errors.make}>
          <input type="text" value={data.make ?? ""} onChange={e => update("make", e.target.value)}
            placeholder="Yamaha" className={INPUT} style={{ borderColor: borderOf("make") }} />
        </Fw>
        <Fw label="Model" required error={errors.model}>
          <input type="text" value={data.model ?? ""} onChange={e => update("model", e.target.value)}
            placeholder="AR210" className={INPUT} style={{ borderColor: borderOf("model") }} />
        </Fw>
      </div>
      <Fw label="Hull Length (feet)" required error={errors.hullLength}>
        <input type="number" value={data.hullLength ?? ""} onChange={e => update("hullLength", e.target.value)}
          placeholder="21" className={INPUT} style={{ borderColor: borderOf("hullLength") }} min="1" />
      </Fw>
      <Fw label="Storage Location" required error={errors.boatStorage}>
        <div className="flex flex-col gap-2 mt-0.5">
          {["Marina", "Home", "Storage Facility"].map(o => (
            <Radio key={o} label={o} checked={data.boatStorage === o} onSelect={() => update("boatStorage", o)} />
          ))}
        </div>
      </Fw>
    </>
  );
}

function MotoStep0({ data, update, errors, borderOf }: { data: Data; update: (k:string,v:string)=>void; errors: Record<string,string>; borderOf: (k:string)=>string }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <Fw label="Year" required error={errors.year}>
          <input type="number" value={data.year ?? ""} onChange={e => update("year", e.target.value)}
            placeholder="2021" className={INPUT} style={{ borderColor: borderOf("year") }} />
        </Fw>
        <Fw label="Make" required error={errors.make}>
          <input type="text" value={data.make ?? ""} onChange={e => update("make", e.target.value)}
            placeholder="Honda" className={INPUT} style={{ borderColor: borderOf("make") }} />
        </Fw>
        <Fw label="Model" required error={errors.model}>
          <input type="text" value={data.model ?? ""} onChange={e => update("model", e.target.value)}
            placeholder="CBR500R" className={INPUT} style={{ borderColor: borderOf("model") }} />
        </Fw>
      </div>
      <Fw label="Primary Use" required error={errors.motoUse}>
        <div className="flex gap-3 mt-0.5">
          {["Commute", "Recreation"].map(o => (
            <Radio key={o} label={o} checked={data.motoUse === o} onSelect={() => update("motoUse", o)} />
          ))}
        </div>
      </Fw>
    </>
  );
}

function BundleStep0({ bundleItems, setBundleItems, error }: {
  bundleItems: string[]; setBundleItems: React.Dispatch<React.SetStateAction<string[]>>; error?: string;
}) {
  const toggle = (id: string) =>
    setBundleItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Select at least 2 products to bundle:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {BUNDLE_OPTIONS.map(p => {
          const checked = bundleItems.includes(p.id);
          return (
            <button key={p.id} type="button" onClick={() => toggle(p.id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all duration-150"
              style={{
                borderColor:     checked ? ACCENT : "#E2E8F0",
                backgroundColor: checked ? `${ACCENT}0D` : "transparent",
                color:           "var(--text)",
              }}>
              <span className="w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-colors"
                style={{ borderColor: checked ? ACCENT : "#CBD5E1", backgroundColor: checked ? ACCENT : "transparent" }}>
                {checked && (
                  <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                )}
              </span>
              <span className="text-xs leading-tight">{p.emoji} {p.label}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </>
  );
}

function BundleStep1({ bundleItems, data, update, errors, borderOf }: {
  bundleItems: string[]; data: Data; update: (k:string,v:string)=>void;
  errors: Record<string,string>; borderOf: (k:string)=>string;
}) {
  const hasAuto     = bundleItems.includes("auto");
  const hasProperty = bundleItems.some(i => ["property","renters","flood","vacant"].includes(i));
  const hasPet      = bundleItems.includes("pet");
  const hasBoat     = bundleItems.includes("boat");
  const hasMoto     = bundleItems.includes("motorcycle");

  return (
    <>
      {hasAuto && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Auto</p>
          <div className="grid grid-cols-3 gap-3">
            {["year","make","model"].map(f => (
              <Fw key={f} label={f.charAt(0).toUpperCase()+f.slice(1)} required error={errors[f]}>
                <input type={f === "year" ? "number" : "text"} value={data[f] ?? ""}
                  onChange={e => update(f, e.target.value)}
                  placeholder={f === "year" ? "2022" : f === "make" ? "Toyota" : "Camry"}
                  className={INPUT} style={{ borderColor: borderOf(f) }} />
              </Fw>
            ))}
          </div>
        </div>
      )}
      {hasProperty && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Property</p>
          <Fw label="Property Address" required error={errors.propertyAddress}>
            <AddressAutocomplete id="q-bundleAddr" value={data.propertyAddress ?? ""}
              onChange={v => update("propertyAddress", v)}
              placeholder="Start typing property address…" className={INPUT} />
          </Fw>
        </div>
      )}
      {hasPet && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Pet</p>
          <Fw label="Pet Name" required error={errors.petName}>
            <input type="text" value={data.petName ?? ""} onChange={e => update("petName", e.target.value)}
              placeholder="Buddy" className={INPUT} style={{ borderColor: borderOf("petName") }} />
          </Fw>
          <Fw label="Species" required error={errors.species}>
            <SelectField id="q-bSpecies" value={data.species ?? ""} onChange={v => update("species", v)}
              options={["Dog","Cat","Other"]} placeholder="— Select species —" borderColor={borderOf("species")} />
          </Fw>
        </div>
      )}
      {hasBoat && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Boat / Watercraft</p>
          <div className="grid grid-cols-3 gap-3">
            {["boatYear","boatMake","boatModel"].map((f, i) => {
              const lbl = ["Year","Make","Model"][i];
              return (
                <Fw key={f} label={lbl} required error={errors[f]}>
                  <input type={i === 0 ? "number" : "text"} value={data[f] ?? ""}
                    onChange={e => update(f, e.target.value)}
                    placeholder={["2020","Yamaha","AR210"][i]}
                    className={INPUT} style={{ borderColor: borderOf(f) }} />
                </Fw>
              );
            })}
          </div>
        </div>
      )}
      {hasMoto && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Motorcycle</p>
          <div className="grid grid-cols-3 gap-3">
            {["motoYear","motoMake","motoModel"].map((f, i) => {
              const lbl = ["Year","Make","Model"][i];
              return (
                <Fw key={f} label={lbl} required error={errors[f]}>
                  <input type={i === 0 ? "number" : "text"} value={data[f] ?? ""}
                    onChange={e => update(f, e.target.value)}
                    placeholder={["2021","Honda","CBR500R"][i]}
                    className={INPUT} style={{ borderColor: borderOf(f) }} />
                </Fw>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

// Map product-card IDs (from locale/products) to QuoteModal PIDs
// Also includes direct PID passthrough for the mobile ProductBottomSheet
const PERSONAL_CARD_MAP: Partial<Record<string, PID>> = {
  // Hero card IDs
  auto:    "auto",
  home:    "property",
  renters: "renters",
  condo:   "pet",
  flood:   "flood",
  bundle:  "bundle",
  // Direct PID passthrough (bottom sheet selects these by PID)
  property:   "property",
  pet:        "pet",
  umbrella:   "umbrella",
  vacant:     "vacant",
  boat:       "boat",
  motorcycle: "motorcycle",
};

interface QuoteModalProps {
  onClose: () => void;
  mode: Mode;
  initialProduct?: string;
  initialData?: Record<string, string>;
}

export default function QuoteModal({ onClose, initialProduct, initialData }: QuoteModalProps) {
  const { t, lang } = useLanguage();
  const initPID = initialProduct ? (PERSONAL_CARD_MAP[initialProduct] ?? null) : null;
  const [phase, setPhase]           = useState<Phase>(initPID ? "form" : "select");
  const [product, setProduct]       = useState<PID | null>(initPID);
  const [formStep, setFormStep]     = useState(0);
  const [data, setData]             = useState<Data>(initialData ?? {});
  const [bundleItems, setBundleItems] = useState<string[]>([]);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [vehicles, setVehicles]     = useState<VehicleData[]>([]);
  const [drivers, setDrivers]       = useState<DriverData[]>([emptyDriver()]);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError]   = useState(false);

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

  const borderOf = (key: string) => errors[key] ? "#EF4444" : "#E2E8F0";
  const reqMsg   = t("form.errors.required") || "Required";

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    if (!product) return true;
    const e: Record<string, string> = {};
    const r = (k: string) => { if (!data[k]?.trim()) e[k] = reqMsg; };
    const totalSteps = STEP_COUNT[product];
    const isLast = formStep === totalSteps - 1;

    if (isLast) {
      r("fullName"); r("phone"); r("email");
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = t("form.errors.email") || "Invalid email";
      if (data.phone && !/[\d\s\-().+]{7,}/.test(data.phone)) e.phone = t("form.errors.phone") || "Invalid phone";
    } else {
      if (product === "auto") {
        if (formStep === 0) {
          if (!data.garageZip || data.garageZip.length !== 5) e.garageZip = "Please enter a valid 5-digit ZIP code";
          if (!data.vin || data.vin.length !== 17) e.vin = "Please enter a valid 17-character VIN";
          r("primaryUse");
          r("dailyMiles");
        }
        if (formStep === 1) { r("driversCount"); r("accidents"); }
        if (formStep === 2) {
          r("vehicleCount");
          vehicles.forEach((v, i) => {
            const prefix = `v${i + 2}_`;
            if (!v.vin || v.vin.length !== 17) e[`${prefix}vin`] = "Please enter a valid 17-character VIN";
            if (!v.primaryUse) e[`${prefix}primaryUse`] = reqMsg;
            if (!v.dailyMiles) e[`${prefix}dailyMiles`] = reqMsg;
          });
        }
        if (formStep === 3) {
          r("driverCount");
          drivers.forEach((d, i) => {
            const prefix = `d${i + 1}_`;
            if (!d.fullName?.trim()) e[`${prefix}fullName`] = reqMsg;
            if (!d.dob?.trim()) e[`${prefix}dob`] = reqMsg;
            else { const dobErr = validateDOB(d.dob); if (dobErr) e[`${prefix}dob`] = dobErr; }
            if (!d.licenseNumber?.trim()) e[`${prefix}licenseNumber`] = reqMsg;
            if (!d.licenseState?.trim()) e[`${prefix}licenseState`] = reqMsg;
            if (!d.maritalStatus?.trim()) e[`${prefix}maritalStatus`] = reqMsg;
            if (!d.education?.trim()) e[`${prefix}education`] = reqMsg;
            if (!d.occupation?.trim()) e[`${prefix}occupation`] = reqMsg;
            if (!d.accidents?.trim()) e[`${prefix}accidents`] = reqMsg;
          });
        }
      }
      if (product === "property") {
        if (formStep === 0) { r("propertyAddress"); r("propertyType"); r("occupancy"); }
        if (formStep === 1) {
          r("dob"); r("purpose");
          if (data.dob && !e.dob) { const dobErr = validateDOB(data.dob); if (dobErr) e.dob = dobErr; }
          if (data.purpose !== "New Purchase") r("currentlyInsured");
        }
      }
      if (product === "renters" && formStep === 0) { r("rentalAddress"); r("monthlyRent"); r("propertyValue"); }
      if (product === "pet"  && formStep === 0) {
        r("petName"); r("species"); r("breed"); r("petDob"); r("spayedNeutered"); r("preExisting");
        if (data.petDob && !e.petDob) { const dobErr = validatePetDOB(data.petDob); if (dobErr) e.petDob = dobErr; }
      }
      if (product === "flood" && formStep === 0) { r("propertyAddress"); r("propertyType"); r("floodInsured"); }
      if (product === "umbrella" && formStep === 0) { r("autoPolicies"); r("propertyPolicies"); r("totalAssets"); }
      if (product === "vacant" && formStep === 0) { r("propertyAddress"); r("vacancyDuration"); }
      if (product === "boat" && formStep === 0) { r("year"); r("make"); r("model"); r("hullLength"); r("boatStorage"); }
      if (product === "motorcycle" && formStep === 0) { r("year"); r("make"); r("model"); r("motoUse"); }
      if (product === "bundle") {
        if (formStep === 0 && bundleItems.length < 2) e.bundleItems = "Please select at least 2 products.";
        if (formStep === 1) {
          if (bundleItems.includes("auto")) { r("year"); r("make"); r("model"); }
          if (bundleItems.some(i => ["property","renters","flood","vacant"].includes(i))) r("propertyAddress");
          if (bundleItems.includes("pet")) { r("petName"); r("species"); }
          if (bundleItems.includes("boat")) { r("boatYear"); r("boatMake"); r("boatModel"); }
          if (bundleItems.includes("motorcycle")) { r("motoYear"); r("motoMake"); r("motoModel"); }
        }
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (!validate() || !product) return;
    const totalSteps = STEP_COUNT[product];
    if (formStep === totalSteps - 1) {
      await submit();
    } else {
      // Pre-fill fullName from Driver 1 when advancing to the contact step
      if (product === "auto" && formStep === totalSteps - 2 && !data.fullName && drivers[0]?.fullName) {
        setData(p => ({ ...p, fullName: drivers[0].fullName }));
      }
      setErrors({});
      setFormStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    if (formStep === 0) { setPhase("select"); setProduct(null); }
    else setFormStep(s => s - 1);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const submit = async () => {
    setSubmitting(true);
    setSendError(false);
    const lines = [`Product: ${product ? PRODUCT_LABEL[product] : "Unknown"}`];
    Object.entries(data).forEach(([k, v]) => { if (v) lines.push(`${k}: ${v}`); });
    if (bundleItems.length) lines.push(`Bundle items: ${bundleItems.map(i => PRODUCT_LABEL[i as PID]).join(", ")}`);
    if (product === "auto" && vehicles.length > 0) {
      vehicles.forEach((v, i) => {
        lines.push(`Vehicle ${i + 2}: VIN=${v.vin}, ${v.decodedYear} ${v.decodedMake} ${v.decodedModel}${v.decodedTrim ? ` ${v.decodedTrim}` : ""}, Use=${v.primaryUse}, Miles=${v.dailyMiles}`);
      });
    }
    if (product === "auto" && drivers.length > 0) {
      drivers.forEach((d, i) => {
        lines.push(`Driver ${i + 1}: ${d.fullName}, DOB=${d.dob}, License=${d.licenseNumber} (${d.licenseState}), ${d.maritalStatus}, Edu=${d.education}, Occ=${d.occupation}, Accidents=${d.accidents}`);
        if (d.accidents === "Yes" && d.accidentDetails) lines.push(`  Accident details: ${d.accidentDetails}`);
      });
    }

    try {
      await sendQuoteEmail({
        product_type:   product ? PRODUCT_LABEL[product] : "Quote",
        mode:           "Personal Lines",
        language:       lang.toUpperCase(),
        timestamp:      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET",
        fields_summary: lines.join("\n"),
        to_email:       "info@ativainsurance.com",
      });
    } catch (err) {
      console.error("[Ativa] QuoteModal submit failed:", err);
      setSendError(true);
    }
    setSubmitting(false);
    setPhase("success");
  };

  // ── Modal shell ─────────────────────────────────────────────────────────────
  const title    = phase === "select" ? "Find My Best Rate"
                 : phase === "form" && product ? PRODUCT_LABEL[product]
                 : "Quote Requested";
  const subtitle = phase === "form" ? "Find My Best Rate" : "Personal Lines";

  const fieldProps = { data, update, errors, borderOf };

  // ── Step fields renderer ────────────────────────────────────────────────────
  const renderFields = () => {
    if (!product) return null;
    const totalSteps = STEP_COUNT[product];
    const isLast = formStep === totalSteps - 1;
    if (isLast) return <ContactFields {...fieldProps} />;

    switch (product) {
      case "auto":
        if (formStep === 0) return <AutoStep0 {...fieldProps} />;
        if (formStep === 1) return <AutoStep1 data={data} update={update} errors={errors} />;
        if (formStep === 2) return <AutoStep2 data={data} update={update} errors={errors} vehicles={vehicles} setVehicles={setVehicles} />;
        if (formStep === 3) return <AutoStep3 data={data} update={update} errors={errors} drivers={drivers} setDrivers={setDrivers} />;
        return null;
      case "property":   return formStep === 0 ? <PropertyStep0 {...fieldProps} /> : <PropertyStep1 {...fieldProps} />;
      case "renters":    return <RentersStep0 {...fieldProps} />;
      case "pet":        return <PetStep0 {...fieldProps} />;
      case "flood":      return <FloodStep0 {...fieldProps} />;
      case "umbrella":   return <UmbrellaStep0 {...fieldProps} />;
      case "vacant":     return <VacantStep0 {...fieldProps} />;
      case "boat":       return <BoatStep0 {...fieldProps} />;
      case "motorcycle": return <MotoStep0 {...fieldProps} />;
      case "bundle":     return formStep === 0
        ? <BundleStep0 bundleItems={bundleItems} setBundleItems={setBundleItems} error={errors.bundleItems} />
        : <BundleStep1 bundleItems={bundleItems} {...fieldProps} />;
      default: return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden animate-modal-in shadow-modal"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxHeight: "92dvh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--accent)" }}>
              {subtitle}
            </p>
            <h2 className="font-bold" style={{ color: "var(--text)", fontSize: "22px" }}>{title}</h2>
          </div>
          <button onClick={onClose} className="rounded-full flex items-center justify-center"
            style={{ color: "var(--text-muted)", width: "44px", height: "44px", flexShrink: 0 }} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Success ── */}
        {phase === "success" && (
          <div className="flex flex-col items-center text-center py-12 px-6 gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: ACCENT }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>You&apos;re all set!</h3>
              <p className="text-base leading-relaxed max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
                We&apos;ll be in touch within minutes. Check your phone — a licensed agent will reach out shortly.
              </p>
              {sendError && (
                <p className="mt-3 text-xs text-amber-500">
                  Email delivery issue — we&apos;ll still follow up. Or call 561-946-8261.
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
            <button onClick={onClose} className="px-8 py-2.5 rounded-xl font-semibold text-sm border-2"
              style={{ borderColor: "#CBD5E1", color: "var(--text-muted)" }}>
              Close
            </button>
          </div>
        )}

        {/* ── Product selection ── */}
        {phase === "select" && (
          <div className="px-6 pt-5 pb-6">
            <p className="mb-4" style={{ color: "var(--text)", fontSize: "18px", fontWeight: 600 }}>
              What would you like to insure?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {PRODUCTS.map(p => (
                <button key={p.id} type="button"
                  onClick={() => { setProduct(p.id); setFormStep(0); setData({}); setErrors({}); setBundleItems([]); setVehicles([]); setDrivers([emptyDriver()]); setPhase("form"); }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-150"
                  style={{ borderColor: "#E2E8F0", backgroundColor: "var(--card-bg)", color: "var(--text)" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = ACCENT; el.style.backgroundColor = `${ACCENT}08`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "#E2E8F0"; el.style.backgroundColor = "var(--card-bg)"; }}
                >
                  <span className="text-xl shrink-0">{p.emoji}</span>
                  <span className="leading-tight" style={{ fontSize: "16px", fontWeight: 600 }}>{p.label}</span>
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
                <span className="font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                  Step {formStep + 1} of {STEP_COUNT[product]}
                </span>
                <span className="font-bold" style={{ color: "var(--accent)", fontSize: "14px" }}>
                  {STEP_NAME[product][formStep]}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${((formStep + 1) / STEP_COUNT[product]) * 100}%`, backgroundColor: ACCENT }} />
              </div>
            </div>

            {/* Fields */}
            <div className="px-6 pt-2 pb-3 grid grid-cols-1 gap-4 animate-slide-in" key={`${product}-${formStep}`}>
              {renderFields()}
            </div>

            {/* Nav */}
            <div className="px-6 pt-2 pb-6 flex gap-3 justify-between">
              <button type="button" onClick={handleBack}
                className="px-5 rounded-xl border-2 font-semibold transition-colors duration-150"
                style={{ borderColor: "#CBD5E1", color: "var(--text-muted)", fontSize: "16px", minHeight: "52px" }}>
                Back
              </button>
              <button type="button" onClick={handleNext} disabled={submitting}
                className="flex-1 sm:flex-none px-8 rounded-xl font-bold transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontSize: "16px", minHeight: "52px", backgroundColor: ACCENT, color: "#FFF" }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT_HOV; }}
                onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT; }}>
                {submitting ? "Submitting…"
                  : formStep === STEP_COUNT[product] - 1 ? (t("form.buttons.submit") || "Submit")
                  : (t("form.buttons.next") || "Next →")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
