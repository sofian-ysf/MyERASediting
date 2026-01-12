'use client'

import Link from 'next/link'
import ArticleSVG from './ArticleSVG'
import './blog-styles.css'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  metaDescription: string | null
  category: string
  publishedAt: Date
  readTime: number
  views: number
  featured: boolean
}

interface BlogClientProps {
  posts: Post[]
  featuredPost: Post | null
}

function formatDate(date: Date) {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

function formatCategory(category: string) {
  return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export default function BlogClient({ posts, featuredPost }: BlogClientProps) {
  const remainingPosts = featuredPost
    ? posts.filter(p => p.id !== featuredPost.id)
    : posts

  return (
    <main className="blog-page">
      <div className="blog-container">
        {/* Header */}
        <div className="blog-header">
          <h1>ERAS Application Resources</h1>
          <p>Expert insights and strategies to help you match into your dream residency</p>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>No Articles Found</h3>
            <p>Check back soon for new ERAS application tips and insights.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="featured-post">
                <Link href={`/blog/${featuredPost.slug}`} className="featured-post-link">
                  <div className="featured-post-image-wrapper">
                    <ArticleSVG index={0} />
                  </div>
                  <div className="featured-post-content">
                    <span className="blog-card-category">{formatCategory(featuredPost.category)}</span>
                    <h2 className="featured-post-title">{featuredPost.title}</h2>
                    <p className="featured-post-description">
                      {featuredPost.metaDescription || featuredPost.excerpt}
                    </p>
                    <p className="featured-post-meta">
                      {formatDate(featuredPost.publishedAt)} &middot; {featuredPost.readTime} min read
                    </p>
                    <span className="featured-post-button">READ MORE &rarr;</span>
                  </div>
                </Link>
              </section>
            )}

            {/* Blog Grid */}
            {remainingPosts.length > 0 && (
              <section className="blog-grid-section">
                <div className="blog-grid">
                  {remainingPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="blog-card"
                    >
                      <div className="blog-card-image-wrapper">
                        <ArticleSVG index={index + 1} />
                      </div>
                      <div className="blog-card-content">
                        <span className="blog-card-category">{formatCategory(post.category)}</span>
                        <h3 className="blog-card-title">{post.title}</h3>
                        <p className="blog-card-date">
                          {formatDate(post.publishedAt)} &middot; {post.readTime} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}
