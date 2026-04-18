// Sends the RCE results email to the verified user address via Resend.
// Triggered immediately after both email + phone verification pass.

import { NextRequest, NextResponse } from "next/server";

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

const PROP_TYPE_LABELS: Record<string, string> = {
  single_family: "Single Family Home",
  townhouse:     "Townhouse",
  condo:         "Condo / Unit",
  mobile_home:   "Mobile Home",
  duplex:        "Duplex",
};

function buildHtml(p: {
  firstName:  string;
  recommended: number;
  low:         number;
  high:        number;
  state:       string;
  propType:    string;
  sqft:        string;
  yearBuilt:   string;
  address:     string;
}): string {
  const propLabel = PROP_TYPE_LABELS[p.propType] ?? p.propType;
  const location  = p.address ? p.address : p.state;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your RCE Results — Ativa Insurance</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F9;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Logo header -->
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <img
              src="https://ativainsurance.com/logos/personal-logo.png"
              alt="Ativa Insurance"
              width="140"
              style="display:block;height:auto;"
            />
          </td>
        </tr>

        <!-- Main card -->
        <tr>
          <td style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

            <!-- Navy header band -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#1B3A6B;padding:28px 32px 24px;text-align:center;">
                  <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.65);">
                    Replacement Cost Estimate
                  </p>
                  <h1 style="margin:0;font-size:26px;font-weight:800;color:#FFFFFF;line-height:1.2;">
                    Your Estimate is Ready, ${p.firstName}
                  </h1>
                </td>
              </tr>

              <!-- Recommended coverage highlight -->
              <tr>
                <td style="background:linear-gradient(135deg,#EEF2FF,#DBEAFE);padding:28px 32px;text-align:center;border-bottom:1px solid #E2E8F0;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6366F1;">
                    Recommended Coverage
                  </p>
                  <p style="margin:0;font-size:42px;font-weight:900;color:#1B3A6B;line-height:1.1;">
                    ${fmt(p.recommended)}
                  </p>
                  <p style="margin:8px 0 0;font-size:13px;color:#6B7280;">
                    Estimated range: ${fmt(p.low)} &ndash; ${fmt(p.high)}
                  </p>
                </td>
              </tr>

              <!-- Property details -->
              <tr>
                <td style="padding:28px 32px;">
                  <p style="margin:0 0 16px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94A3B8;">
                    Property Details
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;">
                        <span style="font-size:13px;color:#6B7280;">Property Type</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;text-align:right;">
                        <span style="font-size:13px;font-weight:600;color:#0F172A;">${propLabel}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;">
                        <span style="font-size:13px;color:#6B7280;">Square Footage</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;text-align:right;">
                        <span style="font-size:13px;font-weight:600;color:#0F172A;">${Number(p.sqft).toLocaleString()} sq ft</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;">
                        <span style="font-size:13px;color:#6B7280;">Year Built</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;text-align:right;">
                        <span style="font-size:13px;font-weight:600;color:#0F172A;">${p.yearBuilt}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="font-size:13px;color:#6B7280;">Location</span>
                      </td>
                      <td style="padding:8px 0;text-align:right;">
                        <span style="font-size:13px;font-weight:600;color:#0F172A;">${location}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Disclaimer -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <p style="margin:0;font-size:11px;line-height:1.6;color:#94A3B8;background:#F8FAFC;border-radius:8px;padding:12px 14px;">
                    This estimate is for insurance planning purposes. Actual replacement cost should be confirmed by a licensed appraiser or your insurance carrier.
                  </p>
                </td>
              </tr>

              <!-- CTA button -->
              <tr>
                <td style="padding:0 32px 32px;text-align:center;">
                  <a
                    href="https://ativainsurance.com/?tab=personal"
                    style="display:inline-block;background-color:#F5C400;color:#111111;font-size:14px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:10px;letter-spacing:0.01em;"
                  >
                    Get a Free Property Quote &rarr;
                  </a>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 16px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#94A3B8;font-weight:600;">Ativa Insurance</p>
            <p style="margin:0 0 4px;font-size:11px;color:#CBD5E1;">
              2412 Irwin St Ste 372, Melbourne FL 32901
            </p>
            <p style="margin:0;font-size:11px;color:#CBD5E1;">
              <a href="mailto:info@ativainsurance.com" style="color:#CBD5E1;text-decoration:none;">info@ativainsurance.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const {
    email,
    firstName  = "",
    recommended,
    low,
    high,
    state      = "",
    propType   = "",
    sqft       = "",
    yearBuilt  = "",
    address    = "",
  } = body as {
    email:       string;
    firstName:   string;
    recommended: number;
    low:         number;
    high:        number;
    state:       string;
    propType:    string;
    sqft:        string;
    yearBuilt:   string;
    address:     string;
  };

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[DEV] RCE results email skipped — RESEND_API_KEY not set");
    return NextResponse.json({ ok: true });
  }

  console.log("RCE results email sent to:", email);

  const html = buildHtml({ firstName, recommended, low, high, state, propType, sqft, yearBuilt, address });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:    "onboarding@resend.dev",
      to:      [email],
      subject: "Your Home Replacement Cost Estimate — Ativa Insurance",
      html,
    }),
  });

  const data = await res.json().catch(() => ({}));
  console.log("Resend response:", JSON.stringify(data));

  if (!res.ok) {
    console.error("[rce/send-results] Resend error:", JSON.stringify(data));
    // Non-blocking — don't fail the user flow
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
