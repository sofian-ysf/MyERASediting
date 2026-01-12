import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: 'ERAS Application Blog | Residency Tips & Strategies | MyERAS Editing',
  description: 'Expert ERAS application insights, personal statement tips, interview prep strategies, and residency match guidance. Stay updated with the latest application strategies.',
  keywords: 'ERAS application tips, residency application blog, personal statement advice, interview preparation, match strategy',
  openGraph: {
    title: 'ERAS Application Blog | Residency Tips & Strategies',
    description: 'Expert ERAS application insights and residency match guidance.',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
}

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      publishedAt: { not: null }
    },
    orderBy: { publishedAt: 'desc' },
    take: 30,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      metaDescription: true,
      category: true,
      publishedAt: true,
      featured: true,
      readTime: true,
      views: true,
    }
  });

  return posts;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Get the featured post (first featured one, or just the first post)
  const featuredPost = posts.find(p => p.featured) || posts[0] || null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogClient
        posts={posts as any}
        featuredPost={featuredPost as any}
      />
      <Footer />
    </div>
  );
}
