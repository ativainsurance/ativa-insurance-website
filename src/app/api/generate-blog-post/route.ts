import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ─── Topic tables (indexed by day of week: 0=Sun … 6=Sat) ────────────────────

const PERSONAL_TOPICS = [
  { topic: "Auto Insurance tips Florida",           category: "Auto"    },
  { topic: "Property Insurance Florida homeowners", category: "Home"    },
  { topic: "Flood Insurance Florida requirements",  category: "Flood"   },
  { topic: "Renters Insurance benefits",            category: "Renters" },
  { topic: "Bundle and Save strategies",            category: "Bundle"  },
  { topic: "Pet Insurance coverage guide",          category: "Pet"     },
  { topic: "General personal insurance education",  category: "General" },
];

const COMMERCIAL_TOPICS = [
  { topic: "General Liability for Florida contractors",    category: "General Liability"      },
  { topic: "Commercial Auto fleet management tips",        category: "Commercial Auto"         },
  { topic: "Workers Comp Florida compliance guide",        category: "Workers Comp"            },
  { topic: "Builders Risk construction projects",          category: "Builders Risk"           },
  { topic: "Cyber Liability small business protection",    category: "Cyber"                   },
  { topic: "Professional Liability E&O coverage guide",   category: "Professional Liability"  },
  { topic: "Liquor Liability catering events guide",       category: "Liquor Liability"        },
];

const LANG_LABELS: Record<string, string> = {
  en: "English",
  pt: "Brazilian Portuguese",
  es: "Latin American Spanish",
};

// ─── AI generation ────────────────────────────────────────────────────────────

async function generatePost(
  topic: string,
  category: string,
  line: "personal" | "commercial",
  language: string,
): Promise<{
  title: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  category: string;
  readTime: string;
  language: string;
  author: string;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const langLabel = LANG_LABELS[language] ?? "English";
  const lineLabel = line === "personal" ? "personal lines (homeowners, auto, renters, flood)" : "commercial lines (business insurance)";

  const prompt = `Write an insurance blog post for Ativa Insurance (independent P&C agency in Florida) in ${langLabel}.

Topic: "${topic}"
Category: ${category}
Product line: ${lineLabel}

Requirements:
- Title: engaging, SEO-friendly (include Florida or a relevant keyword), in ${langLabel}
- Meta description: 150-160 characters, SEO-optimized summary, in ${langLabel}
- Excerpt: 1-2 sentence hook for the blog card preview, in ${langLabel}
- Body: 800-1000 words in ${langLabel}, using:
  - H2 subheadings (## format)
  - Short, scannable paragraphs
  - Naturally weave in Florida-specific keywords and context (Florida climate, regulations, demographics)
  - Practical, actionable advice for the target reader
  - End with a clear CTA paragraph inviting readers to get a free quote at Ativa Insurance (phone: 561-946-8261, mention licensed agents, no-obligation)
- Read time: estimated reading time in ${langLabel} (e.g. "5 min read")
- Tone: friendly, expert, approachable — written for Florida's diverse community including Brazilian and Hispanic residents

Respond with ONLY valid JSON in this exact shape, nothing else:
{
  "title": "...",
  "metaDescription": "...",
  "excerpt": "...",
  "body": "...",
  "readTime": "..."
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:  "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 2500,
      messages:   [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic ${res.status}: ${err}`);
  }

  const data = (await res.json()) as { content: Array<{ type: string; text?: string }> };
  const text = data.content?.find((b) => b.type === "text")?.text ?? "";

  const jsonText = text.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  const parsed = JSON.parse(jsonText) as {
    title: string; metaDescription: string; excerpt: string; body: string; readTime: string;
  };

  return {
    title:           parsed.title,
    metaDescription: parsed.metaDescription,
    excerpt:         parsed.excerpt,
    body:            parsed.body,
    category,
    readTime:        parsed.readTime,
    language,
    author:          "Ativa Insurance Team",
  };
}

// ─── Build full bilingual post object ────────────────────────────────────────

async function generateFullPost(
  topic: string,
  category: string,
  line: "personal" | "commercial",
  dateStr: string,
  suffix: string,
) {
  const [en, pt, es] = await Promise.all([
    generatePost(topic, category, line, "en"),
    generatePost(topic, category, line, "pt"),
    generatePost(topic, category, line, "es"),
  ]);

  return {
    slug:     `${dateStr}-${suffix}`,
    date:     dateStr,
    line,
    category,
    topicKey: topic,
    en,
    pt,
    es,
  };
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now        = new Date();
  const dayOfWeek  = now.getDay(); // 0=Sun … 6=Sat
  const dateStr    = now.toISOString().split("T")[0];

  const personalTopic   = PERSONAL_TOPICS[dayOfWeek];
  const commercialTopic = COMMERCIAL_TOPICS[dayOfWeek];

  const dataDir = path.join(process.cwd(), "data", "blog");
  await mkdir(dataDir, { recursive: true });

  try {
    const [personalPost, commercialPost] = await Promise.all([
      generateFullPost(personalTopic.topic,   personalTopic.category,   "personal",   dateStr, "personal"),
      generateFullPost(commercialTopic.topic, commercialTopic.category, "commercial", dateStr, "commercial"),
    ]);

    await Promise.all([
      writeFile(path.join(dataDir, `${dateStr}-personal.json`),   JSON.stringify(personalPost,   null, 2), "utf-8"),
      writeFile(path.join(dataDir, `${dateStr}-commercial.json`), JSON.stringify(commercialPost, null, 2), "utf-8"),
    ]);

    return NextResponse.json({
      success: true,
      posts: [
        { slug: personalPost.slug,   topic: personalTopic.topic,   line: "personal"   },
        { slug: commercialPost.slug, topic: commercialTopic.topic, line: "commercial" },
      ],
    });
  } catch (err) {
    console.error("[Blog Generator] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ─── GET — localhost manual testing only ─────────────────────────────────────

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (!host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // Inject a fake auth header so POST passes the check during local testing
  const cronSecret = process.env.CRON_SECRET ?? "local";
  const fakeReq = new Request(req.url, {
    method:  "POST",
    headers: { ...Object.fromEntries(req.headers), authorization: `Bearer ${cronSecret}` },
    body:    null,
  });
  return POST(fakeReq as NextRequest);
}
