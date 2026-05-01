import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the lead copywriter for Ativa Insurance LLC, an independent insurance agency in Melbourne, FL serving Florida families and business owners, with a specialty in the Brazilian immigrant community.

BRAND VOICE:
Write like a knowledgeable friend who works inside an insurance office. Direct. Specific. Real. Never corporate. Never brochure-like. The reader detects fake in 3 seconds.

THE 7 MANDATORY TECHNIQUES — use all in every post:

1. COTIDIANO ELEVADO: Take a normal insurance moment, frame it as a turning point.
"The day we opened that policy and saw what was missing — that's the day everything changed for him"

2. MICRO-ESPECIFICIDADE: One unexpected specific detail.
"A cleaning company lost a $21,000 contract because they couldn't produce one document the general contractor asked for"

3. METÁFORA QUE EXPLICA: One metaphor per post that simplifies AND creates feeling.
"Having insurance and having the right insurance is like wearing a life vest with a hole in it."

4. TRADUÇÃO POPULAR: Never use insurance jargon without immediate plain language translation.
General Liability = "the document that gets you in the room"
Policy lapse = "when your coverage disappears quietly"
Underinsured = "protected on paper, exposed in real life"

5. AUTORIDADE CALMA: Never claim expertise. Demonstrate it.
Wrong: "I have years of experience"
Right: "The third time I saw this happen, I started writing it down"

6. CLIFFHANGER: Once per article use an attention redirect.
"Now here's the part most people miss."
"But there's one thing nobody mentions."
"Agora olha isso aqui."

7. LOOP EMOCIONAL ABERTO: Never conclude completely. End with a realization that plants a question in the reader's mind they carry into their next conversation.

E-E-A-T SIGNALS (mandatory in every post):
- Experience: First-person field observations with real dates, real numbers, real moments. Never hypothetical.
- Expertise: Translate the technical. Name real documents: SR-22, FR-44, COI, ACORD 25. Reference real FL statutes.
- Authoritativeness: Name real carriers, real forms, real Florida-specific rules and requirements.
- Trustworthiness: Acknowledge what insurance DOESN'T do before being asked. Honest disclosure builds trust.

REAL STORIES TO DRAW FROM (use one per post as hook):

Story 01 — The $21,000 Cleaning Contract:
A cleaning company had been building their business, chasing bigger contracts, growing their team. They had a shot at a $21,000 contract. The general contractor asked for one document — proof of General Liability with the right limits. They didn't have it. Not because they couldn't afford it. Because no one had told them that the document, not the service, is what gets you in the room.

Story 02 — The $100,000 Restaurant Gap:
Gabriel was sitting in a friend's restaurant. The owner had just bought new espresso machines and a commercial range — close to $100,000 in equipment. The conversation drifted to insurance. The owner had a policy — active, paid up. Gabriel asked to look. The new equipment wasn't listed. If that restaurant had burned down the next day, those machines would not have been covered.

Story 03 — The Driver Nobody Mentioned:
A family comes in for auto insurance. They live with a 19-year-old son who drives sometimes. They don't mention him. The policy binds. Six months later there's an accident — the son was driving. The claim is denied. Not because the insurance company was cruel. Because the policy was built around a household that didn't include him.

Story 04 — The ZIP Code Nobody Chose:
A client moves from one Florida ZIP to another — still Miami-Dade, fifteen minutes away. The premium goes up $40/month. Same car, same driver, same history. The new ZIP has higher theft rates and more uninsured drivers. The agent who explains why — calmly, with data — becomes the agent they trust forever.

BLAME SHIFT RULE (always):
Never frame problems as the customer's failure.
❌ "You need to update your policy when you buy equipment"
✅ "Most agents don't call when you buy new equipment. That's the gap nobody warns you about."

SIGNATURE FRAME:
Every post should feel like: "This seems simple... but whoever understands this... plays a different game."

CTA (always use this exact version — never salesy):
"If any of this sounds like your situation — Ana Letícia reviews policies at no cost. Just send a message at ativainsurance.com"

SEO REQUIREMENTS:
- H1 = primary question people actually type
- H2s = related questions from People Also Ask
- Answer the title question in first 100 words then deepen
- Include Quick Answer box (40-60 words, direct) at top
- Include FAQ section with 5-7 questions in customer language
- Meta description = hook + specific detail + CTA under 155 chars

AEO REQUIREMENTS (for AI search engines):
- Write complete self-contained paragraphs AI can excerpt
- Include clear factual statements that can be quoted
- Use question-format H2s throughout
- Include "bottom line" paragraph near the top
- Name specific Florida statutes, forms, and requirements

CONTENT RULES:
- Never mention specific premium amounts
- Never rank or favor any specific carrier
- Never copy from other insurance websites
- Every post must be 100% original with Ativa's voice
- Write as if the reader is sitting across from you`

// ─── Topic tables (indexed by day of week: 0=Sun … 6=Sat) ────────────────────

interface TopicConfig {
  topic:          string
  primaryKeyword: string
  hook:           string
  story:          string
  audience:       string
  category:       string
}

const personalTopics: TopicConfig[] = [
  {
    topic:          "Why Did My Car Insurance Go Up? (The Real Reason Nobody Explains)",
    primaryKeyword: "why did my car insurance go up Florida",
    hook:           "Here's the hard truth",
    story:          "Story 04 — ZIP Code",
    audience:       "Buyer + Operator",
    category:       "Auto",
  },
  {
    topic:          "Can I Leave My Son Off My Car Insurance to Save Money?",
    primaryKeyword: "do I have to add my son to car insurance Florida",
    hook:           "Here's the hard truth",
    story:          "Story 03 — Driver Nobody Mentioned",
    audience:       "Buyer",
    category:       "Auto",
  },
  {
    topic:          "Why Does My Neighbor Pay Less for Car Insurance Than Me?",
    primaryKeyword: "why does my neighbor pay less car insurance Florida",
    hook:           "The question nobody asks",
    story:          "Story 04 — ZIP Code variation",
    audience:       "Buyer + Amplifier",
    category:       "Auto",
  },
  {
    topic:          "Flood Insurance in Florida: What Your Homeowners Policy Won't Tell You",
    primaryKeyword: "flood insurance Florida homeowners",
    hook:           "What your agent won't tell you",
    story:          "Original field observation",
    audience:       "Buyer + Operator",
    category:       "Flood",
  },
  {
    topic:          "Property Insurance in Florida: The $100,000 Mistake Most Homeowners Make",
    primaryKeyword: "property insurance Florida homeowners",
    hook:           "Nobody talks about this",
    story:          "Story 02 — Restaurant Gap adapted for homeowners",
    audience:       "Buyer + Advisor",
    category:       "Home",
  },
  {
    topic:          "Bundle and Save: How Florida Families Cut Insurance Bills Without Losing Coverage",
    primaryKeyword: "bundle home and auto insurance Florida",
    hook:           "3 things I wish I knew",
    story:          "Original field observation",
    audience:       "Buyer + Operator",
    category:       "Bundle",
  },
  {
    topic:          "Pet Insurance in Florida: Is It Worth It? A Real Answer",
    primaryKeyword: "pet insurance Florida worth it",
    hook:           "Here's the hard truth",
    story:          "Original field observation",
    audience:       "Buyer",
    category:       "Pet",
  },
]

const commercialTopics: TopicConfig[] = [
  {
    topic:          "How a Cleaning Company Lost a $21,000 Contract (Nothing to Do With Their Work)",
    primaryKeyword: "general liability insurance cleaning companies Florida",
    hook:           "Your competitor already knows this",
    story:          "Story 01 — $21,000 Contract",
    audience:       "Buyer + Gatekeeper + Amplifier",
    category:       "GL",
  },
  {
    topic:          "I Looked at My Friend's Restaurant Policy and Found a $100,000 Problem",
    primaryKeyword: "restaurant equipment insurance Florida",
    hook:           "What your agent won't tell you",
    story:          "Story 02 — Restaurant Gap",
    audience:       "Buyer + Advisor",
    category:       "Commercial",
  },
  {
    topic:          "Commercial Auto Insurance for Florida Fleet Owners: What Actually Moves Your Rate",
    primaryKeyword: "commercial auto insurance fleet Florida",
    hook:           "Nobody talks about this",
    story:          "Original field observation",
    audience:       "Buyer + Operator",
    category:       "Commercial",
  },
  {
    topic:          "Workers Comp in Florida: What Every Contractor Must Know Before Taking a Job",
    primaryKeyword: "workers compensation insurance Florida contractors",
    hook:           "This will cost you",
    story:          "Original field observation",
    audience:       "Buyer + Gatekeeper",
    category:       "WC",
  },
  {
    topic:          "Builders Risk Insurance: The Coverage Florida Contractors Forget Until It's Too Late",
    primaryKeyword: "builders risk insurance Florida contractors",
    hook:           "Stop scrolling",
    story:          "Original field observation",
    audience:       "Buyer + Gatekeeper",
    category:       "Builders",
  },
  {
    topic:          "Cyber Liability Insurance for Florida Small Businesses: Why It's No Longer Optional",
    primaryKeyword: "cyber liability insurance small business Florida",
    hook:           "Nobody talks about this",
    story:          "Original field observation",
    audience:       "Buyer + Advisor",
    category:       "Cyber",
  },
  {
    topic:          "Liquor Liability Insurance for Florida Catering and Events: The Complete Guide",
    primaryKeyword: "liquor liability insurance catering events Florida",
    hook:           "The question nobody asks",
    story:          "Original field observation",
    audience:       "Buyer + Gatekeeper",
    category:       "Liquor",
  },
]

// ─── User prompt builder ──────────────────────────────────────────────────────

function buildUserPrompt(t: TopicConfig): string {
  return `Write a complete SEO-optimized blog post for Ativa Insurance using the brand voice and techniques from your instructions.

Topic: ${t.topic}
Primary keyword: ${t.primaryKeyword}
Hook style: ${t.hook}
Real story to use: ${t.story}
Target audience roles: ${t.audience}

BLOG POST STRUCTURE (mandatory):

1. TITLE: Use the exact topic provided, optimized for search
   Formula: [Real question in plain language] + [Specific detail]

2. OPENING (150 words max):
   Start with the human moment from the real story.
   Drop reader into a real situation before explaining anything.
   No "In today's article we will discuss..."

3. QUICK ANSWER BOX:
   40-60 words. Direct answer to the title question.
   Label it: "Quick Answer:"
   This is what Google excerpts and AI quotes.

4. BODY — 4 H2 sections minimum:
   Each section answers one dimension of the main question.
   Use the cliffhanger transition between sections.
   Include one metaphor, one specific number, the real story.
   Use question-format H2s: "Why Does This Happen?"

5. FAQ SECTION:
   Label: "Questions Florida Residents Ask About [Topic]"
   5-7 questions in exact customer language.
   Short, conversational answers.

6. CLOSING — Open Loop:
   Do NOT summarize. Plant the next question.
   End with a realization that makes reader think about their own situation.

7. CTA:
   "If any of this sounds like your situation — Ana Letícia reviews policies at no cost. Just send a message at ativainsurance.com"

Return ONLY valid JSON, no markdown backticks:
{
  "title": "...",
  "slug": "url-friendly-slug",
  "category": "${t.category}",
  "readTime": "X min read",
  "excerpt": "hook-driven excerpt under 155 characters",
  "content": "complete HTML with h2, h3, p, ul, li, blockquote tags",
  "metaDescription": "hook + specific detail + CTA under 155 chars",
  "primaryKeyword": "${t.primaryKeyword}",
  "hook": "${t.hook}"
}`
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const type = body.type || 'personal'

    const dayOfWeek = new Date().getDay()
    const topicConfig = type === 'commercial'
      ? commercialTopics[dayOfWeek]
      : personalTopics[dayOfWeek]

    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 4000,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: buildUserPrompt(topicConfig) }],
    })

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    const cleanJson = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const postData = JSON.parse(cleanJson)

    const today = new Date().toISOString().split('T')[0]
    const newPost = {
      ...postData,
      publishedAt: today,
      author:      'Ativa Insurance Team',
      id:          `${postData.slug}-${Date.now()}`,
    }

    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json')

    let existingPosts: typeof newPost[] = []
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8')
      existingPosts = JSON.parse(fileContent)
    }

    existingPosts.unshift(newPost)

    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(existingPosts, null, 2),
      'utf-8'
    )

    return NextResponse.json({
      success: true,
      post: {
        title:       newPost.title,
        slug:        newPost.slug,
        category:    newPost.category,
        publishedAt: newPost.publishedAt,
      },
      message: 'Blog post generated and saved successfully',
    })

  } catch (error) {
    console.error('Blog generation error:', error)
    return NextResponse.json(
      {
        success:   false,
        error:     error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
