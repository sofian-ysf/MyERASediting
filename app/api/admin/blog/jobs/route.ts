import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// For now, we'll return recent blog posts as "generation jobs"
// A proper BlogGenerationJob model can be added to the schema later
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get recent posts as "jobs" (since they're auto-generated)
    const recentPosts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        publishedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const jobs = recentPosts.map(post => ({
      id: post.id,
      topic: post.title,
      category: post.category,
      status: post.publishedAt ? 'completed' : 'draft',
      createdAt: post.createdAt.toISOString(),
    }))

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
