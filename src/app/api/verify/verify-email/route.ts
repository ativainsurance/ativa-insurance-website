import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/verificationStore";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = body.email ?? "";
  const code: string = body.code ?? "";

  if (!email || !code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = verifyCode(`email:${email.toLowerCase()}`, code);
  return NextResponse.json({ result });
}
