'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, Eye, Sparkles } from 'lucide-react'

interface BlogStats {
  total: number
  published: number
  drafts: number
  featured: number
  byCategory: Record<string, number>
}

interface RecentPost {
  id: string
  title: string
  slug: string
  category: string
  publishedAt: string | null
  featured: boolean
  views: number
}

interface GenerationJob {
  id: string
  topic: string
  status: string
  createdAt: string
  category: string
}

export default function AdminBlogPage() {
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [recentJobs, setRecentJobs] = useState<GenerationJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [statsRes, postsRes, jobsRes] = await Promise.all([
        fetch('/api/admin/blog/stats'),
        fetch('/api/admin/blog/posts?limit=5'),
        fetch('/api/admin/blog/jobs?limit=5'),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setRecentPosts(postsData.posts || [])
      }
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json()
        setRecentJobs(jobsData.jobs || [])
      }
    } catch (error) {
      console.error('Failed to fetch blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Management</h1>
          <p className="text-gray-400 mt-1">Generate and manage ERAS application blog content</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-400">Total Posts</p>
          <p className="text-3xl font-bold text-white mt-1">{stats?.total || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-400">Published</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{stats?.published || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-400">Drafts</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{stats?.drafts || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-400">Featured</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{stats?.featured || 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/blog/generate"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Sparkles className="h-5 w-5" />
          Generate New Post
        </Link>
        <Link
          href="/admin/blog/posts"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          <FileText className="h-5 w-5" />
          All Posts
        </Link>
        <Link
          href="/blog"
          target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          <Eye className="h-5 w-5" />
          View Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Posts</h2>
            <Link href="/admin/blog/posts" className="text-sm text-gray-400 hover:text-white">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-700">
            {recentPosts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No posts yet. Generate your first blog post!
              </div>
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/blog/posts/${post.id}`} className="font-medium text-white hover:text-blue-400 truncate block">
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatCategory(post.category)} &middot; {post.views} views
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {post.featured && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900 text-blue-300">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.publishedAt ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {post.publishedAt ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Generation Jobs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Generations</h2>
            <Link href="/admin/blog/generate" className="text-sm text-gray-400 hover:text-white">
              Generate new
            </Link>
          </div>
          <div className="divide-y divide-gray-700">
            {recentJobs.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No generation jobs yet.
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">{job.topic}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatCategory(job.category)} &middot; {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    job.status === 'completed' ? 'bg-green-900 text-green-300' :
                    job.status === 'processing' ? 'bg-blue-900 text-blue-300' :
                    job.status === 'failed' ? 'bg-red-900 text-red-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      {stats?.byCategory && Object.keys(stats.byCategory).length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="font-semibold text-white">Posts by Category</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400">{formatCategory(category)}</p>
                  <p className="text-2xl font-bold text-white mt-1">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
