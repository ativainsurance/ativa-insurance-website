// Configure OPENPHONE_API_KEY in .env.local to enable SMS sending.
// The sender number is fetched automatically from your OpenPhone account.
// Without the key, the code is logged to the server console (dev fallback).

import { NextRequest, NextResponse } from "next/server";
import { generateCode, storeCode } from "@/lib/verificationStore";

const OPENPHONE_BASE = "https://api.openphone.com/v1";

/** Converts any US phone string to E.164 (+1XXXXXXXXXX). */
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

/** Returns the first OpenPhone number on the account (E.164), or null on failure. */
async function getFromNumber(apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(`${OPENPHONE_BASE}/phone-numbers`, {
      // Authorization is a raw API key — NOT a Bearer token
      headers: { Authorization: apiKey },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const first = data?.data?.[0];
    if (!first) return null;
    console.log("All phone number fields:", JSON.stringify(first));
    // Use "number" field — E.164 format (+13214744894)
    // NOT "formattedNumber" (returns "(321) 474-4894") or "forward" (forwarding number)
    const number = first.number as string | undefined;
    console.log("Using from number:", number);
    return number ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const phone: string = body.phone ?? "";

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return NextResponse.json({ error: "Invalid US phone number" }, { status: 400 });
  }

  const code = generateCode();
  // Store using raw digits so verify-sms can look up the same key
  storeCode(`phone:${digits}`, code);

  const apiKey = process.env.OPENPHONE_API_KEY;

  if (apiKey) {
    const fromNumber = await getFromNumber(apiKey);
    console.log("QUO from number resolved:", fromNumber);

    if (!fromNumber) {
      console.error("[verify/send-sms] Could not retrieve sender number.");
      return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
    }

    const formattedPhone  = toE164(phone);
    const messageContent  = `Your Ativa Insurance code is: ${code}. Expires in 10 minutes.`;

    console.log("QUO request body:", JSON.stringify({
      content: messageContent,
      from:    fromNumber,
      to:      [formattedPhone],
    }));

    const res = await fetch(`${OPENPHONE_BASE}/messages`, {
      method: "POST",
      headers: {
        // Raw API key — NOT Bearer
        Authorization:  apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: messageContent,
        from:    fromNumber,
        to:      [formattedPhone],
      }),
    });

    const responseData = await res.json().catch(() => ({}));
    console.log("QUO response status:", res.status);
    console.log("QUO response body:", JSON.stringify(responseData));

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
    }
  } else {
    // Dev fallback — code appears in server console when OPENPHONE_API_KEY is not set
    console.log(`[DEV] SMS verification code for ${phone}: ${code}`);
  }

  return NextResponse.json({ ok: true });
}
