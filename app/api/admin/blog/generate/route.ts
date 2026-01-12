import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateEnhancedBlogPost } from '@/lib/blog-enhancer'
import slugify from 'slugify'

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
      autoPublish = true,
      enhanceContent = true // New option for two-pass enhancement
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

    console.log(`Generating blog post: "${topic}" (enhanced: ${enhanceContent})`)

    // Use two-pass enhanced generation
    const blogData = await generateEnhancedBlogPost(
      topic,
      category,
      targetKeywords,
      wordCountTarget,
      includeFaq
    )

    if (!blogData.content || blogData.content.trim() === '') {
      return NextResponse.json({ error: 'No valid content generated' }, { status: 500 })
    }

    // Generate excerpt from meta description or content
    const plainText = blogData.metaDescription || blogData.content.replace(/<[^>]*>/g, '').substring(0, 200)
    const tags = generateTags(topic, category, [...targetKeywords, ...blogData.relatedKeywords])

    // Create schema markup
    const schemaMarkup = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: topic,
      description: blogData.metaDescription || plainText,
      author: {
        '@type': 'Person',
        name: 'MyERAS Reviewer Team',
      },
      datePublished: new Date().toISOString(),
      publisher: {
        '@type': 'Organization',
        name: 'MyERAS Editing',
        url: 'https://www.myerasediting.com'
      },
    })

    // Save to database
    const blogPost = await prisma.blogPost.create({
      data: {
        title: topic,
        slug,
        excerpt: plainText + (plainText.length === 200 ? '...' : ''),
        content: blogData.content,
        category: category as any,
        tags: tags.join(', '),
        icon: category.toLowerCase().replace(/_/g, '-'),
        readTime: blogData.readTime,
        featured: Math.random() < 0.2,
        metaDescription: blogData.metaDescription,
        faqSection: blogData.faqSection.length > 0 ? blogData.faqSection : undefined,
        schemaMarkup,
        author: 'MyERAS Reviewer Team',
        publishedAt: autoPublish ? new Date() : undefined,
      },
    })

    console.log(`Blog post created: ${blogPost.slug} (${blogData.readTime} min read)`)

    return NextResponse.json({
      success: true,
      postId: blogPost.id,
      slug: blogPost.slug,
      readTime: blogData.readTime,
      enhanced: enhanceContent
    })
  } catch (error) {
    console.error('Error generating blog post:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to generate post'
    }, { status: 500 })
  }
}
