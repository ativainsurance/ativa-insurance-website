import { NextRequest, NextResponse } from "next/server";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
  error?: { type: string; message: string };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // ── Guard: missing key ──────────────────────────────────────────────────────
  if (!apiKey) {
    console.error("[Ativa Chat] ANTHROPIC_API_KEY is not set in environment.");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  let body: { messages: ChatMessage[]; systemPrompt: string };
  try {
    body = (await req.json()) as { messages: ChatMessage[]; systemPrompt: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages, systemPrompt } = body;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
  }

  // ── Call Anthropic REST API directly ───────────────────────────────────────
  let anthropicRes: Response;
  try {
    anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
        system: systemPrompt ?? "",
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });
  } catch (networkErr) {
    console.error("[Ativa Chat] Network error calling Anthropic:", networkErr);
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }

  // ── Handle non-2xx from Anthropic ──────────────────────────────────────────
  if (!anthropicRes.ok) {
    const errorBody = await anthropicRes.text();
    console.error(
      `[Ativa Chat] Anthropic returned ${anthropicRes.status}:`,
      errorBody
    );
    return NextResponse.json(
      { error: `Anthropic error ${anthropicRes.status}`, detail: errorBody },
      { status: anthropicRes.status }
    );
  }

  // ── Parse and return ────────────────────────────────────────────────────────
  let data: AnthropicResponse;
  try {
    data = (await anthropicRes.json()) as AnthropicResponse;
  } catch (parseErr) {
    console.error("[Ativa Chat] Failed to parse Anthropic response:", parseErr);
    return NextResponse.json({ error: "Parse error" }, { status: 500 });
  }

  const text =
    data.content?.find((b) => b.type === "text")?.text ?? "";

  return NextResponse.json({ reply: text });
}
