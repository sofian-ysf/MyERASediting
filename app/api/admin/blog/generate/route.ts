import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'
import slugify from 'slugify'

const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }
  return new Anthropic({ apiKey })
}

function generateTags(topic: string, category: string, keywords: string[]): string[] {
  const baseTags = [
    'ERAS', 'residency application', 'medical school', 'match 2025',
    topic.split(' ').slice(0, 3).join(' ').toLowerCase(),
    category.replace(/_/g, ' ').toLowerCase(),
  ]
  return [...new Set([...baseTags, ...keywords])].slice(0, 12)
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
    const {
      category,
      topic,
      targetKeywords = [],
      wordCountTarget = 2000,
      includeFaq = true,
      autoPublish = true
    } = body

    if (!category || !topic) {
      return NextResponse.json({ error: 'Category and topic are required' }, { status: 400 })
    }

    // Check if slug already exists
    const slug = slugify(topic, { lower: true, strict: true })
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json({ error: 'A post with this topic already exists' }, { status: 400 })
    }

    const anthropic = getAnthropicClient()

    const keywordsPrompt = targetKeywords.length > 0
      ? `Target these keywords naturally: ${targetKeywords.join(', ')}`
      : ''

    const faqPrompt = includeFaq
      ? 'Include 5-8 relevant FAQs that address common "People Also Ask" questions about the topic.'
      : ''

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 6000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: `You are an expert medical educator and residency application advisor with deep knowledge of SEO and content marketing. Write a comprehensive, SEO-optimized blog post about: "${topic}"

The blog post should be targeted at medical students applying for residency through ERAS.
Category: ${category.replace(/_/g, ' ')}
Target word count: ${wordCountTarget} words

IMPORTANT SEO REQUIREMENTS:
- Include the main keyword "${topic}" in the first paragraph
- Use related keywords naturally throughout the content
${keywordsPrompt}
- Include long-tail keyword variations
- Optimize for featured snippets with clear, concise answers
- Include current year (2025) where relevant
- Target specific search intents

IMPORTANT: Return ONLY a valid JSON object (not markdown code blocks) with this exact structure:
{
  "content": "HTML content of the main article",
  "metaDescription": "A 150-160 character SEO description including the main keyword",
  ${includeFaq ? `"faqSection": [
    {
      "question": "Frequently asked question",
      "answer": "Detailed answer"
    }
  ],` : ''}
  "relatedKeywords": ["keyword1", "keyword2", "keyword3"]
}

Do not include any text before or after the JSON object. The response should start with { and end with }

For the main content:
1. Start with an engaging introduction (2-3 paragraphs) that includes the main keyword
2. Include 5-7 main sections with clear, keyword-rich subheadings
3. Use bullet points and numbered lists for better readability and featured snippets
4. Include specific, actionable advice with current statistics and data
5. Add a "Quick Answer" section near the beginning for featured snippet optimization
6. Include tables or comparison charts where relevant
7. End with a conclusion that summarizes key points and includes a call-to-action

Write the content in HTML format with proper tags:
- Use <h2> for main section headings
- Use <h3> for subsection headings
- Use <p> for paragraphs
- Use <ul> and <li> for bullet points
- Use <ol> and <li> for numbered lists
- Use <strong> for emphasis
- Use <blockquote> for important quotes or tips

${faqPrompt}

Make the content informative, practical, and engaging. Include specific examples and real scenarios that medical students face during the residency application process.`
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

    let blogData
    let content = ''
    let metaDescription = null
    let faqSection: any[] = []
    let relatedKeywords: string[] = []

    try {
      blogData = JSON.parse(responseText)
      content = typeof blogData.content === 'string' ? blogData.content : String(blogData.content || '')
      metaDescription = blogData.metaDescription || null
      faqSection = Array.isArray(blogData.faqSection) ? blogData.faqSection : []
      relatedKeywords = Array.isArray(blogData.relatedKeywords) ? blogData.relatedKeywords : []

      if (!content.includes('<') || !content.includes('>')) {
        content = `<p>${content}</p>`
      }
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e)
      if (responseText.includes('<') && responseText.includes('>')) {
        content = responseText
      } else {
        content = `<p>${responseText}</p>`
      }
    }

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'No valid content generated' }, { status: 500 })
    }

    const plainText = metaDescription || content.replace(/<[^>]*>/g, '').substring(0, 200)
    const wordCount = content.split(' ').length
    const readTime = Math.ceil(wordCount / 200)
    const tags = generateTags(topic, category, [...targetKeywords, ...relatedKeywords])

    const schemaMarkup = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: topic,
      description: metaDescription || plainText,
      author: {
        '@type': 'Person',
        name: 'MyERAS Reviewer Team',
      },
      datePublished: new Date().toISOString(),
      publisher: {
        '@type': 'Organization',
        name: 'MyERAS Reviewer',
      },
    })

    const blogPost = await prisma.blogPost.create({
      data: {
        title: topic,
        slug,
        excerpt: plainText + (plainText.length === 200 ? '...' : ''),
        content,
        category: category as any,
        tags: tags.join(', '),
        icon: category.toLowerCase().replace(/_/g, '-'),
        readTime,
        featured: Math.random() < 0.2,
        metaDescription,
        faqSection: faqSection.length > 0 ? faqSection : undefined,
        schemaMarkup,
        author: 'MyERAS Reviewer Team',
        publishedAt: autoPublish ? new Date() : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      postId: blogPost.id,
      slug: blogPost.slug,
    })
  } catch (error) {
    console.error('Error generating blog post:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to generate post'
    }, { status: 500 })
  }
}
