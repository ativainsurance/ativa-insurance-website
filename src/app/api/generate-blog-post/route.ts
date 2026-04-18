import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Rotating topic pool — never repeat two consecutive weeks
const TOPICS = [
  { en: "Why Florida Homeowners Need Separate Flood Insurance",        category: "Home" },
  { en: "How to Read Your Auto Insurance Declarations Page",           category: "Auto" },
  { en: "What Is an HO-6 Policy and Do Condo Owners Really Need It?", category: "Condo" },
  { en: "5 Commercial Insurance Mistakes Small Business Owners Make",  category: "Commercial" },
  { en: "How Bundling Home and Auto Can Save You 20%",                 category: "Bundle" },
  { en: "Workers' Comp in Florida: What Employers Must Know",          category: "Commercial" },
  { en: "Understanding Liability Coverage Limits — Why Cheap Isn't Always Better", category: "General" },
  { en: "Hurricane Season Prep: Is Your Home Insurance Ready?",        category: "Home" },
  { en: "What Does General Liability Insurance Actually Cover?",       category: "Commercial" },
  { en: "How Your Credit Score Affects Your Insurance Premium",        category: "General" },
  { en: "Renters Insurance: 7 Things Tenants Wish They'd Known Sooner", category: "Renters" },
  { en: "Cyber Insurance for Small Businesses: Do You Really Need It?", category: "Cyber" },
];

function getTodayTopic(): typeof TOPICS[number] {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return TOPICS[dayOfYear % TOPICS.length];
}

const LANG_LABELS: Record<string, string> = {
  en: "English",
  pt: "Brazilian Portuguese",
  es: "Latin American Spanish",
};

async function generatePost(topicEn: string, category: string, language: string): Promise<{
  title: string;
  excerpt: string;
  body: string;
  category: string;
  readTime: string;
  language: string;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const langLabel = LANG_LABELS[language] ?? "English";
  const prompt = `Write an insurance blog post for Ativa Insurance (independent P&C agency in Florida) in ${langLabel}.

Topic: "${topicEn}"
Category: ${category}

Requirements:
- Title: engaging, SEO-friendly, in ${langLabel}
- Excerpt: 1–2 sentences hook (for blog card preview), in ${langLabel}
- Body: 400–600 words, written in ${langLabel}, using:
  - H2 subheadings (## format)
  - Short paragraphs
  - Practical advice for homeowners/businesses
  - A natural CTA at the end mentioning Ativa Insurance and our phone 561-946-8261
- Read time: estimate in ${langLabel} (e.g. "4 min read" / "4 min de leitura" / "4 min de lectura")
- Tone: friendly, expert, bilingual-community-aware (many Brazilian and Hispanic clients)

Respond with ONLY valid JSON in this exact shape, nothing else:
{
  "title": "...",
  "excerpt": "...",
  "body": "...",
  "readTime": "..."
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic ${res.status}: ${err}`);
  }

  const data = (await res.json()) as { content: Array<{ type: string; text?: string }> };
  const text = data.content?.find((b) => b.type === "text")?.text ?? "";

  // Strip markdown code fences if present
  const jsonText = text.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();

  const parsed = JSON.parse(jsonText) as { title: string; excerpt: string; body: string; readTime: string };

  return {
    title:    parsed.title,
    excerpt:  parsed.excerpt,
    body:     parsed.body,
    category,
    readTime: parsed.readTime,
    language,
  };
}

export async function POST(req: NextRequest) {
  // Security: only allow from Vercel cron or localhost
  const host      = req.headers.get("host") ?? "";
  const authHeader = req.headers.get("authorization");
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET ?? ""}`;
  const isLocalhost  = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if (!isVercelCron && !isLocalhost) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const topic = getTodayTopic();
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const dataDir = path.join(process.cwd(), "data", "blog");
  await mkdir(dataDir, { recursive: true });

  const filePath = path.join(dataDir, `${dateStr}.json`);

  try {
    // Generate in all 3 languages in parallel
    const [en, pt, es] = await Promise.all([
      generatePost(topic.en, topic.category, "en"),
      generatePost(topic.en, topic.category, "pt"),
      generatePost(topic.en, topic.category, "es"),
    ]);

    const post = {
      slug:      dateStr,
      date:      dateStr,
      category:  topic.category,
      topicKey:  topic.en,
      en,
      pt,
      es,
    };

    await writeFile(filePath, JSON.stringify(post, null, 2), "utf-8");

    return NextResponse.json({ success: true, slug: dateStr, topic: topic.en });
  } catch (err) {
    console.error("[Blog Generator] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Allow GET from localhost for manual testing
export async function GET(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (!host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return POST(req);
}
