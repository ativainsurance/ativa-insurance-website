import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const personalTopics = [
  'Auto Insurance tips for Florida drivers',
  'Property Insurance for Florida homeowners',
  'Flood Insurance requirements in Florida',
  'Renters Insurance benefits and coverage',
  'Bundle and Save insurance strategies',
  'Pet Insurance coverage guide',
  'General personal insurance education Florida'
]

const commercialTopics = [
  'General Liability insurance for Florida contractors',
  'Commercial Auto insurance fleet management tips',
  'Workers Compensation Florida compliance guide',
  'Builders Risk insurance for construction projects',
  'Cyber Liability insurance for small businesses',
  'Professional Liability E&O coverage guide',
  'Liquor Liability insurance for catering and events'
]

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
    const topic = type === 'commercial'
      ? commercialTopics[dayOfWeek]
      : personalTopics[dayOfWeek]

    const prompt = `Write a comprehensive SEO-optimized blog post about "${topic}" for Ativa Insurance, an independent insurance agency licensed in Florida and 10 other states.

Requirements:
- Title: compelling, includes primary keyword
- Length: 800-1000 words
- Structure: use H2 and H3 subheadings
- Include practical tips and Florida-specific information
- Tone: professional but approachable, friendly to bilingual audience
- Include keywords naturally throughout
- End with a CTA to get a free quote at Ativa Insurance (ativainsurance.com)
- Do NOT mention specific premium amounts or carrier rankings
- Do NOT show favoritism to any specific carrier

Return ONLY a valid JSON object with no markdown, no backticks, no explanation:
{
  "title": "compelling title here",
  "slug": "url-friendly-slug-here",
  "category": "${type === 'commercial' ? 'Commercial' : 'Home'}",
  "readTime": "5 min read",
  "excerpt": "compelling excerpt under 155 characters",
  "content": "full blog post content in HTML format with proper h2, h3, p, ul, li tags",
  "metaDescription": "SEO meta description under 155 characters"
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
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
      author: 'Ativa Insurance Team',
      id: `${postData.slug}-${Date.now()}`
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
        title: newPost.title,
        slug: newPost.slug,
        category: newPost.category,
        publishedAt: newPost.publishedAt
      },
      message: 'Blog post generated and saved successfully'
    })

  } catch (error) {
    console.error('Blog generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
