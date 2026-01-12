import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'

const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }
  return new Anthropic({ apiKey })
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  APPLICATION_TIPS: 'Tips for completing ERAS applications, activity descriptions, and overall application strategy',
  PERSONAL_STATEMENT: 'Writing compelling personal statements for residency applications',
  INTERVIEW_PREP: 'Preparing for residency interviews, common questions, and interview etiquette',
  SPECIALTY_GUIDES: 'Guides for specific medical specialties and their application requirements',
  TIMELINE_PLANNING: 'Application timelines, deadlines, and scheduling strategies',
  PROGRAM_SELECTION: 'How to research and select residency programs',
  MATCH_STRATEGY: 'Strategies for the match process and ranking programs',
  SUCCESS_STORIES: 'Success stories and lessons learned from matched residents',
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { category } = body

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    // Get existing post titles to avoid duplicates
    const existingPosts = await prisma.blogPost.findMany({
      where: { category: category as any },
      select: { title: true },
      take: 50,
    })
    const existingTitles = existingPosts.map(p => p.title).join('\n')

    const categoryDescription = CATEGORY_DESCRIPTIONS[category] || category.replace(/_/g, ' ')

    const anthropic = getAnthropicClient()

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: `You are an expert in ERAS residency applications and SEO content strategy.

Generate 5 unique, SEO-optimized blog post topic ideas for the category: "${categoryDescription}"

These posts will be published on myerasediting.com, a service that helps medical students with their ERAS residency applications.

AVOID these existing topics (or very similar ones):
${existingTitles || 'No existing topics yet'}

Each topic should:
1. Be highly searchable (target what medical students actually search for)
2. Include specific keywords that people use in Google
3. Be actionable and provide value
4. Target the 2025 residency application cycle
5. Be between 8-15 words

Return ONLY a valid JSON object with this structure:
{
  "topics": [
    {
      "title": "The exact blog post title",
      "description": "A 1-2 sentence description of what the post will cover",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

Do not include any text before or after the JSON object.`
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

    try {
      const data = JSON.parse(responseText)
      return NextResponse.json({ topics: data.topics || [] })
    } catch (e) {
      console.error('Failed to parse topic suggestions:', e)
      return NextResponse.json({ error: 'Failed to parse suggestions' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error suggesting topics:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to suggest topics'
    }, { status: 500 })
  }
}
