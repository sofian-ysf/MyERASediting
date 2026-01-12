import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Priority calculation based on page importance
const getPriority = (path: string): number => {
  if (path === '/') return 1.0;
  if (path.includes('/pricing')) return 0.95;
  if (path.includes('/services/interview-prep')) return 0.92;
  if (path.includes('/guides')) return 0.9;
  if (path.includes('/timeline')) return 0.9;
  if (path.includes('/services')) return 0.88;
  if (path.includes('/blog') && !path.includes('/blog/')) return 0.85;
  if (path.includes('/specialties')) return 0.85;
  if (path.includes('/about')) return 0.8;
  if (path.includes('/contact')) return 0.8;
  if (path.includes('/blog/')) return 0.7;
  if (path.includes('/auth/')) return 0.6;
  if (path.includes('/privacy') || path.includes('/terms')) return 0.3;
  return 0.5;
};

// Change frequency based on content type
const getChangeFrequency = (path: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' => {
  if (path === '/') return 'daily';
  if (path.includes('/blog') && !path.includes('/blog/')) return 'daily';
  if (path.includes('/pricing')) return 'weekly';
  if (path.includes('/guides')) return 'weekly';
  if (path.includes('/timeline')) return 'monthly';
  if (path.includes('/blog/')) return 'monthly';
  if (path.includes('/about')) return 'monthly';
  if (path.includes('/privacy') || path.includes('/terms')) return 'yearly';
  return 'weekly';
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.myerasediting.com';
  
  // Get all blog posts from database
  let blogPosts: MetadataRoute.Sitemap = [];
  
  try {
    const posts = await prisma.blogPost.findMany({
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
        featured: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    
    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: post.featured ? 'weekly' as const : 'monthly' as const,
      priority: post.featured ? 0.8 : 0.7,
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(post.slug)}`],
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Core pages with high priority
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      images: [`${baseUrl}/og-image.png`],
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
      images: [`${baseUrl}/og-pricing.png`],
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${baseUrl}/og-guides.png`],
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      images: [`${baseUrl}/og-timeline.png`],
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
      images: [`${baseUrl}/og-blog.png`],
    },
  ];

  // Service pages that exist
  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/personal-statement`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      images: [`${baseUrl}/og-personal-statement.png`],
    },
    {
      url: `${baseUrl}/services/experiences`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
      images: [`${baseUrl}/og-experiences.png`],
    },
    {
      url: `${baseUrl}/services/letters`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
      images: [`${baseUrl}/og-letters.png`],
    },
    {
      url: `${baseUrl}/services/interview-prep`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.92,
      images: [`${baseUrl}/og-interview-prep.png`],
    },
  ];

  // Only include guide pages that actually exist
  const existingGuides = [
    'personal-statement',
    'letters-of-recommendation',
    'activity-descriptions',
    'interview-prep',
    'program-selection',
    'specialties'
  ];

  const guidePages: MetadataRoute.Sitemap = existingGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Only include info pages that exist
  const infoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Auth pages (lower priority)
  const authPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.65,
    },
  ];

  // Only include legal pages that exist
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Combine only pages that actually exist
  return [
    ...corePages,      // Home, pricing, guides, timeline, blog
    ...servicePages,   // 3 service pages
    ...guidePages,     // 6 guide subpages
    ...infoPages,      // About page
    ...authPages,      // Sign in/up pages
    ...legalPages,     // Privacy, terms
    ...blogPosts,      // Dynamic blog posts from database
  ];
}

// Additional sitemap for blog posts only (for Google News)
export async function blogSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.myerasediting.com';
  
  try {
    const posts = await prisma.blogPost.findMany({
      select: {
        slug: true,
        title: true,
        updatedAt: true,
        publishedAt: true,
        category: true,
        tags: true,
      },
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 48 * 60 * 60 * 1000), // Last 48 hours for news
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 1000, // Google News limit
    });
    
    return posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
      news: {
        publication: {
          name: 'MyERAS Editing Blog',
          language: 'en',
        },
        publicationDate: post.publishedAt?.toISOString() || new Date().toISOString(),
        title: post.title,
        keywords: post.tags || '',
      },
    }));
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return [];
  }
}