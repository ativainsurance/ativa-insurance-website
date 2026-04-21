import { NextRequest, NextResponse } from "next/server";

const INTAKE_URL = "https://ativa-internal-production.up.railway.app/api/intake/quote-submission";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, address, city, insuranceType, additionalNotes } = body;

    const apiKey = process.env.INTAKE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Intake API key not configured" }, { status: 500 });
    }

    const payload = {
      name:      name      ?? "",
      phone:     phone     ?? "",
      email:     email     ?? "",
      address:   address   ?? "",
      city:      city      ?? "",
      source:    "website",
      product:   insuranceType   ?? "",
      notes:     additionalNotes ?? "",
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(INTAKE_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "X-Intake-Key":  apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[Ativa] Intake API error:", res.status, text);
      return NextResponse.json({ error: `Intake API responded ${res.status}` }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Ativa] submit-quote route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
