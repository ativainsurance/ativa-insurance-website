// Configure RESEND_API_KEY in .env.local to enable email sending.
// Without it, the code is logged to the server console (dev fallback).

import { NextRequest, NextResponse } from "next/server";
import { generateCode, storeCode } from "@/lib/verificationStore";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = body.email ?? "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const code = generateCode();
  storeCode(`email:${email.toLowerCase()}`, code);

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    console.log('Resend send attempted to:', email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "Your Ativa Insurance Verification Code",
        text: [
          `Your verification code is: ${code}`,
          "",
          "This code expires in 10 minutes.",
          "If you did not request this, please ignore this email.",
        ].join("\n"),
      }),
    });

    const resBody = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.log('Resend error if any:', JSON.stringify(resBody));
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    console.log('Resend response:', JSON.stringify(resBody));
  } else {
    // Dev fallback — print to server console so you can test without Resend
    console.log(`[DEV] Email verification code for ${email}: ${code}`);
  }

  return NextResponse.json({ ok: true });
}
