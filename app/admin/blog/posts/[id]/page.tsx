'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string
  publishedAt: string | null
  featured: boolean
  readTime: number
  views: number
  author: string
  metaDescription: string
  faqSection: any[]
}

const CATEGORIES = [
  { value: 'APPLICATION_TIPS', label: 'Application Tips' },
  { value: 'PERSONAL_STATEMENT', label: 'Personal Statement' },
  { value: 'INTERVIEW_PREP', label: 'Interview Prep' },
  { value: 'SPECIALTY_GUIDES', label: 'Specialty Guides' },
  { value: 'TIMELINE_PLANNING', label: 'Timeline Planning' },
  { value: 'PROGRAM_SELECTION', label: 'Program Selection' },
  { value: 'MATCH_STRATEGY', label: 'Match Strategy' },
  { value: 'SUCCESS_STORIES', label: 'Success Stories' },
]

export default function BlogPostEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchPost()
  }, [params.id])

  async function fetchPost() {
    try {
      const response = await fetch(`/api/admin/blog/posts/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setPost(data.post)
      } else {
        setError(data.error || 'Failed to load post')
      }
    } catch (error) {
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!post) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/blog/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })

      if (response.ok) {
        setSuccess('Post saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save post')
      }
    } catch (error) {
      setError('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    if (!post) return

    const newPublishedAt = post.publishedAt ? null : new Date().toISOString()

    try {
      const response = await fetch(`/api/admin/blog/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publishedAt: newPublishedAt }),
      })

      if (response.ok) {
        setPost({ ...post, publishedAt: newPublishedAt })
        setSuccess(newPublishedAt ? 'Post published!' : 'Post unpublished')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      setError('Failed to update publish status')
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/blog/posts/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/blog/posts')
      } else {
        setError('Failed to delete post')
      }
    } catch (error) {
      setError('Failed to delete post')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{error || 'Post not found'}</p>
        <Link href="/admin/blog/posts" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Back to posts
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog/posts"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Post</h1>
            <p className="text-gray-400 mt-1">{post.views} views</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>
          <button
            onClick={handlePublish}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              post.publishedAt
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {post.publishedAt ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="font-semibold text-white mb-4">Content</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={post.slug}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                <textarea
                  value={post.excerpt}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (HTML)</label>
                <textarea
                  value={post.content}
                  onChange={(e) => setPost({ ...post, content: e.target.value })}
                  rows={20}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
                />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="font-semibold text-white mb-4">FAQ Section</h2>
            <div className="space-y-4">
              {post.faqSection && post.faqSection.length > 0 ? (
                post.faqSection.map((faq, index) => (
                  <div key={index} className="p-4 bg-gray-700 rounded-lg">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...post.faqSection]
                        newFaqs[index] = { ...faq, question: e.target.value }
                        setPost({ ...post, faqSection: newFaqs })
                      }}
                      placeholder="Question"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...post.faqSection]
                        newFaqs[index] = { ...faq, answer: e.target.value }
                        setPost({ ...post, faqSection: newFaqs })
                      }}
                      placeholder="Answer"
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const newFaqs = post.faqSection.filter((_, i) => i !== index)
                        setPost({ ...post, faqSection: newFaqs })
                      }}
                      className="mt-2 text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No FAQ items</p>
              )}
              <button
                onClick={() => {
                  const newFaqs = [...(post.faqSection || []), { question: '', answer: '' }]
                  setPost({ ...post, faqSection: newFaqs })
                }}
                className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-gray-500 hover:text-gray-300 transition-colors"
              >
                + Add FAQ Item
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="font-semibold text-white mb-4">Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={post.category}
                  onChange={(e) => setPost({ ...post, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                <input
                  type="text"
                  value={post.author}
                  onChange={(e) => setPost({ ...post, author: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  value={post.tags}
                  onChange={(e) => setPost({ ...post, tags: e.target.value })}
                  placeholder="Comma separated"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Read Time (minutes)</label>
                <input
                  type="number"
                  value={post.readTime}
                  onChange={(e) => setPost({ ...post, readTime: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={post.featured}
                  onChange={(e) => setPost({ ...post, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm text-gray-300">
                  Featured post
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="font-semibold text-white mb-4">SEO</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                <textarea
                  value={post.metaDescription}
                  onChange={(e) => setPost({ ...post, metaDescription: e.target.value })}
                  rows={3}
                  maxLength={160}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {post.metaDescription?.length || 0}/160 characters
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="font-semibold text-white mb-4">Danger Zone</h2>
            <button
              onClick={handleDelete}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
