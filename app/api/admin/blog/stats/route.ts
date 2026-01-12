import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get blog stats
    const [total, published, featured, categoryStats] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { publishedAt: { not: null } } }),
      prisma.blogPost.count({ where: { featured: true } }),
      prisma.blogPost.groupBy({
        by: ['category'],
        _count: { id: true }
      })
    ])

    const byCategory: Record<string, number> = {}
    categoryStats.forEach(stat => {
      byCategory[stat.category] = stat._count.id
    })

    return NextResponse.json({
      total,
      published,
      drafts: total - published,
      featured,
      byCategory
    })
  } catch (error) {
    console.error('Error fetching blog stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
