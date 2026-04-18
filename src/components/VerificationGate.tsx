"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── OTP input ────────────────────────────────────────────────────────────────

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="flex gap-2 justify-center my-5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] ?? ""}
          onChange={(e) => {
            const char = e.target.value.replace(/\D/g, "").slice(-1);
            const next = (value.slice(0, i) + char + value.slice(i + 1)).slice(0, 6);
            onChange(next);
            if (char && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            onChange(pasted);
            refs.current[Math.min(pasted.length, 5)]?.focus();
          }}
          style={{
            width: "44px",
            height: "56px",
            textAlign: "center",
            fontSize: "1.25rem",
            fontWeight: 700,
            borderRadius: "12px",
            border: `2px solid ${value[i] ? "#1B3A6B" : "#E2E8F0"}`,
            backgroundColor: value[i] ? "#EEF2FF" : "#FFFFFF",
            color: "#0F172A",
            outline: "none",
            transition: "border-color 0.15s, background-color 0.15s",
            opacity: disabled ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  );
}

// ─── Step badge ───────────────────────────────────────────────────────────────

function StepBadge({
  label,
  done,
  active,
}: {
  label: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: done ? "#16A34A" : active ? "#1B3A6B" : "#E2E8F0",
          transition: "background-color 0.2s",
          flexShrink: 0,
        }}
      >
        {done ? (
          <svg viewBox="0 0 16 16" fill="white" width="10" height="10">
            <path
              fillRule="evenodd"
              d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
            />
          </svg>
        ) : (
          <span style={{ fontSize: "10px", color: active ? "white" : "#94A3B8", fontWeight: 700 }}>
            {label === "Email" ? "1" : "2"}
          </span>
        )}
      </div>
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: done ? "#16A34A" : active ? "#1B3A6B" : "#94A3B8",
          transition: "color 0.2s",
        }}
      >
        {label}
        {done && " ✓"}
      </span>
    </div>
  );
}

// ─── Phone helpers ────────────────────────────────────────────────────────────

/** Converts any US phone string to E.164 (+1XXXXXXXXXX). */
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

/** Formats raw digits as (XXX) XXX-XXXX for display while typing. */
function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ─── Main component ───────────────────────────────────────────────────────────

type Phase = "email-send" | "email-code" | "phone-send" | "phone-code" | "both-done";

interface Props {
  email: string;
  phone: string;
  onComplete: () => void;
}

export default function VerificationGate({ email, phone, onComplete }: Props) {
  const [phase, setPhase]           = useState<Phase>("email-send");
  const [emailCode, setEmailCode]   = useState("");
  const [phoneCode, setPhoneCode]   = useState("");
  const [sending, setSending]       = useState(false);
  const [checking, setChecking]     = useState(false);
  const [error, setError]           = useState("");
  const [resendAt, setResendAt]     = useState(0);   // timestamp: resend available
  const [expiresAt, setExpiresAt]   = useState(0);   // timestamp: code expires
  const [now, setNow]               = useState(() => Date.now());
  const completedRef                = useRef(false);
  // Editable phone field — pre-filled from prop, formatted for display
  const [localPhone, setLocalPhone] = useState(() => formatPhoneDisplay(phone));

  // Tick every second for the countdown display
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Trigger parent callback when both verified
  useEffect(() => {
    if (phase === "both-done" && !completedRef.current) {
      completedRef.current = true;
      setTimeout(onComplete, 900);
    }
  }, [phase, onComplete]);

  const canResend    = now >= resendAt && resendAt > 0;
  const secondsLeft  = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const countdownStr = secondsLeft > 0
    ? `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
    : null;

  const emailDone = phase === "phone-send" || phase === "phone-code" || phase === "both-done";
  const phoneDone = phase === "both-done";

  // ── Helpers ────────────────────────────────────────────────────────────────

  function startCodeTimer() {
    const base = Date.now();
    setResendAt(base + 30_000);
    setExpiresAt(base + 600_000);
  }

  const handleVerifyResult = useCallback(
    (
      result: string,
      successPhase: Phase,
      failPhase: Phase
    ) => {
      if (result === "ok") {
        setError("");
        setPhase(successPhase);
      } else if (result === "expired") {
        setError("Code expired. Please request a new one.");
        setPhase(failPhase);
      } else if (result === "too_many") {
        setError("Too many attempts. Please request a new code.");
        setPhase(failPhase);
      } else {
        setError("Incorrect code. Please try again.");
      }
    },
    []
  );

  // ── Actions ────────────────────────────────────────────────────────────────

  async function sendEmailCode() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/verify/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setPhase("email-code");
      setEmailCode("");
      startCodeTimer();
    } catch {
      setError("Failed to send code. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function checkEmailCode() {
    if (emailCode.length !== 6) return;
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/verify/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: emailCode }),
      });
      const { result } = await res.json();
      handleVerifyResult(result, "phone-send", "email-send");
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  async function sendSmsCode() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/verify/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Always send E.164 to the API regardless of how user typed the number
        body: JSON.stringify({ phone: toE164(localPhone) }),
      });
      if (!res.ok) throw new Error();
      setPhase("phone-code");
      setPhoneCode("");
      startCodeTimer();
    } catch {
      setError("Failed to send SMS. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function checkSmsCode() {
    if (phoneCode.length !== 6) return;
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/verify/verify-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: toE164(localPhone), code: phoneCode }),
      });
      const { result } = await res.json();
      handleVerifyResult(result, "both-done", "phone-send");
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  // ── Shared styles ──────────────────────────────────────────────────────────

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  };

  const displayFieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "2px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    fontWeight: 600,
    fontSize: "14px",
  };

  const primaryBtnStyle = (disabled: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "14px",
    color: "#FFFFFF",
    backgroundColor: disabled ? "#94A3B8" : "#1B3A6B",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "background-color 0.15s",
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "#EEF2FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 20 20" fill="#1B3A6B" width="18" height="18">
            <path
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
            Verify your identity
          </p>
          <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "1px" }}>
            Confirm email + phone to unlock your results
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        <StepBadge label="Email" done={emailDone} active={!emailDone} />
        <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }} />
        <StepBadge label="Phone" done={phoneDone} active={emailDone && !phoneDone} />
      </div>

      {/* ── Email: send phase ─────────────────────────────────────────── */}
      {phase === "email-send" && (
        <div className="space-y-3">
          <div>
            <label style={labelStyle}>Enter your email to receive your results</label>
            <div style={displayFieldStyle}>{email}</div>
          </div>
          {error && (
            <p style={{ fontSize: "13px", color: "#EF4444", fontWeight: 500 }}>{error}</p>
          )}
          <button
            type="button"
            onClick={sendEmailCode}
            disabled={sending}
            style={primaryBtnStyle(sending)}
          >
            {sending ? "Sending…" : "Send Verification Code"}
          </button>
        </div>
      )}

      {/* ── Email: code entry phase ───────────────────────────────────── */}
      {phase === "email-code" && (
        <div>
          <p style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
            Enter the 6-digit code sent to{" "}
            <strong style={{ color: "#0F172A" }}>{email}</strong>
          </p>

          <OtpInput value={emailCode} onChange={setEmailCode} disabled={checking} />

          <div className="flex items-center justify-between mb-3">
            {countdownStr ? (
              <span style={{ fontSize: "12px", color: "#6B7280" }}>
                Code expires in {countdownStr}
              </span>
            ) : (
              <span style={{ fontSize: "12px", color: "#EF4444" }}>Code expired</span>
            )}
            {canResend && (
              <button
                type="button"
                onClick={() => { setPhase("email-send"); setError(""); setEmailCode(""); }}
                style={{ fontSize: "12px", color: "#1B3A6B", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                Resend code
              </button>
            )}
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "#EF4444", fontWeight: 500, marginBottom: "12px" }}>{error}</p>
          )}

          <button
            type="button"
            onClick={checkEmailCode}
            disabled={checking || emailCode.length !== 6}
            style={primaryBtnStyle(checking || emailCode.length !== 6)}
          >
            {checking ? "Verifying…" : "Verify Email"}
          </button>
        </div>
      )}

      {/* ── Phone: send phase ─────────────────────────────────────────── */}
      {phase === "phone-send" && (
        <div className="space-y-3">
          {/* Email verified badge */}
          <div
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}
          >
            <svg viewBox="0 0 20 20" fill="#16A34A" width="16" height="16">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#15803D" }}>
              Email verified ✓
            </span>
          </div>

          <div>
            <label style={labelStyle}>Verify your phone number</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="(561) 946-8261"
              value={localPhone}
              onChange={(e) => {
                setLocalPhone(formatPhoneDisplay(e.target.value));
                setError("");
              }}
              style={{
                ...displayFieldStyle,
                backgroundColor: "#FFFFFF",
                cursor: "text",
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "#EF4444", fontWeight: 500 }}>{error}</p>
          )}

          <button
            type="button"
            onClick={sendSmsCode}
            disabled={sending}
            style={primaryBtnStyle(sending)}
          >
            {sending ? "Sending…" : "Send SMS Code"}
          </button>
        </div>
      )}

      {/* ── Phone: code entry phase ───────────────────────────────────── */}
      {phase === "phone-code" && (
        <div>
          {/* Email verified badge */}
          <div
            className="flex items-center gap-2 p-2.5 rounded-xl mb-4"
            style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}
          >
            <svg viewBox="0 0 20 20" fill="#16A34A" width="14" height="14">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#15803D" }}>
              Email verified ✓
            </span>
          </div>

          <p style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
            Enter the 6-digit code sent to{" "}
            <strong style={{ color: "#0F172A" }}>{phone}</strong>
          </p>

          <OtpInput value={phoneCode} onChange={setPhoneCode} disabled={checking} />

          <div className="flex items-center justify-between mb-3">
            {countdownStr ? (
              <span style={{ fontSize: "12px", color: "#6B7280" }}>
                Code expires in {countdownStr}
              </span>
            ) : (
              <span style={{ fontSize: "12px", color: "#EF4444" }}>Code expired</span>
            )}
            {canResend && (
              <button
                type="button"
                onClick={() => { setPhase("phone-send"); setError(""); setPhoneCode(""); }}
                style={{ fontSize: "12px", color: "#1B3A6B", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                Resend code
              </button>
            )}
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "#EF4444", fontWeight: 500, marginBottom: "12px" }}>{error}</p>
          )}

          <button
            type="button"
            onClick={checkSmsCode}
            disabled={checking || phoneCode.length !== 6}
            style={primaryBtnStyle(checking || phoneCode.length !== 6)}
          >
            {checking ? "Verifying…" : "Verify Phone"}
          </button>
        </div>
      )}

      {/* ── Both verified ─────────────────────────────────────────────── */}
      {phase === "both-done" && (
        <div className="text-center py-4">
          <div
            className="flex items-center gap-2 p-3 rounded-xl mb-4"
            style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}
          >
            <svg viewBox="0 0 20 20" fill="#16A34A" width="16" height="16">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#15803D" }}>
              Phone verified ✓
            </span>
          </div>
          <div
            className="flex items-center justify-center gap-2"
            style={{ color: "#1B3A6B", fontSize: "14px", fontWeight: 600 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              width="16"
              height="16"
              style={{ animation: "spin 0.8s linear infinite" }}
            >
              <path strokeLinecap="round" d="M12 4v2m0 12v2M4 12H2m20 0h-2m-2.93-6.07-1.41 1.41M7.34 16.66l-1.41 1.41M19.07 19.07l-1.41-1.41M7.34 7.34 5.93 5.93" />
            </svg>
            Unlocking your results…
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}
