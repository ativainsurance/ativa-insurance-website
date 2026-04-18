import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/verificationStore";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const phone: string = body.phone ?? "";
  const code: string  = body.code ?? "";

  if (!phone || !code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const digits = phone.replace(/\D/g, "");
  const result = verifyCode(`phone:${digits}`, code);
  return NextResponse.json({ result });
}
