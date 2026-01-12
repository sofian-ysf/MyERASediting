import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ArticleSVG from '../ArticleSVG'
import './article.css'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (!post) {
      return null
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { slug },
      data: { views: post.views + 1 },
    })

    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

async function getRelatedPosts(category: string, currentSlug: string) {
  try {
    return await prisma.blogPost.findMany({
      where: {
        category: category as any,
        slug: { not: currentSlug },
        publishedAt: { not: null },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        readTime: true,
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.metaDescription ? `${post.title} | MyERAS Editing` : post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      select: { slug: true },
      where: { publishedAt: { not: null } },
      take: 100,
    })
    return posts.map(post => ({ slug: post.slug }))
  } catch (error) {
    return []
  }
}

function formatDate(date: Date) {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

function generateSVGIndex(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) % 10
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category, slug)

  // Parse FAQ items
  const faqItems: { question: string; answer: string }[] = (() => {
    if (!post.faqSection) return []
    if (Array.isArray(post.faqSection)) return post.faqSection as any[]
    if (typeof post.faqSection === 'string') {
      try {
        const parsed = JSON.parse(post.faqSection)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  })()

  // Parse tags
  const tags: string[] = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author || 'MyERAS Reviewer Team'
    },
    "publisher": {
      "@type": "Organization",
      "name": "MyERAS Editing",
      "url": "https://www.myerasediting.com"
    },
    "datePublished": post.publishedAt?.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.myerasediting.com/blog/${post.slug}`
    },
  }

  // FAQ schema
  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  const shareUrl = `https://www.myerasediting.com/blog/${slug}`
  const svgIndex = generateSVGIndex(slug)

  return (
    <main className="blog-detail-page">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Navigation */}
      <nav className="blog-detail-nav">
        <Link href="/blog" className="nav-back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
      </nav>

      <article>
        {/* Header Image/SVG */}
        <div className="blog-detail-header-image">
          <ArticleSVG index={svgIndex} />
        </div>

        <div className="blog-detail-content">
          <header className="blog-detail-header">
            {/* Meta Section */}
            <div className="blog-detail-meta">
              <div className="blog-detail-meta-info">
                <div className="blog-detail-meta-item">
                  <span className="blog-detail-meta-label">Written by</span>
                  <span className="blog-detail-meta-value">{post.author || 'MyERAS Reviewer Team'}</span>
                </div>
                <div className="blog-detail-meta-item">
                  <span className="blog-detail-meta-label">Published on</span>
                  <time className="blog-detail-meta-value" dateTime={post.publishedAt?.toISOString()}>
                    {post.publishedAt ? formatDate(post.publishedAt) : ''}
                  </time>
                </div>
                {post.readTime && (
                  <div className="blog-detail-meta-item">
                    <span className="blog-detail-meta-label">Read time</span>
                    <span className="blog-detail-meta-value">{post.readTime} min</span>
                  </div>
                )}
              </div>
              <div className="blog-detail-social-buttons">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-detail-social-button"
                  aria-label="Share on X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-detail-social-button"
                  aria-label="Share on LinkedIn"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <h1 className="blog-detail-title">{post.title}</h1>
          </header>

          {/* Article Body */}
          <div className="blog-detail-body">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="blog-tags-section">
              <h3>Tags</h3>
              <div className="blog-tags">
                {tags.map((tag) => (
                  <span key={tag} className="blog-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {faqItems.length > 0 && (
            <div className="faq-section">
              <h2>Frequently Asked Questions</h2>
              {faqItems.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="blog-detail-footer">
            <Link href="/blog" className="back-link">&larr; Back to Articles</Link>
          </footer>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="related-posts-section">
          <div className="related-posts-container">
            <h2>Related Articles</h2>
            <div className="related-posts-grid">
              {relatedPosts.map((relatedPost, index) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="related-post-card"
                >
                  <div className="related-post-image">
                    <ArticleSVG index={generateSVGIndex(relatedPost.slug)} />
                  </div>
                  <h3 className="related-post-title">{relatedPost.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
