/**
 * Fire-and-forget: forwards completed quote data to the internal agency system.
 * Never throws — if it fails, the user's form submission continues normally.
 */
export function submitToIntake(payload: {
  name:            string;
  phone:           string;
  email:           string;
  address?:        string;
  city?:           string;
  insuranceType:   string;
  additionalNotes: string;
}): void {
  fetch("/api/submit-quote", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  }).catch((err) => {
    console.warn("[Ativa] Intake forwarding failed (non-blocking):", err);
  });
}
