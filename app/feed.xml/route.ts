import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.myerasediting.com';
  
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 50,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        publishedAt: true,
        category: true,
        tags: true,
        author: true,
      }
    });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>MyERAS Reviewer Blog - ERAS Application Tips & Residency Match Advice</title>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <link>${baseUrl}/blog</link>
    <description>Expert insights on ERAS applications, personal statements, interview prep, and match strategies from physicians who successfully matched.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-US</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>MyERAS Reviewer RSS Generator</generator>
    <copyright>Copyright © ${new Date().getFullYear()} MyERAS Reviewer</copyright>
    <managingEditor>editor@myerasreviewer.com (MyERAS Reviewer Team)</managingEditor>
    <webMaster>tech@myerasreviewer.com (MyERAS Tech Team)</webMaster>
    <image>
      <url>${baseUrl}/logo2.png</url>
      <title>MyERAS Reviewer</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <ttl>60</ttl>
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator>${escapeXml(post.author || 'MyERAS Reviewer Team')}</dc:creator>
      <pubDate>${post.publishedAt?.toUTCString() || new Date().toUTCString()}</pubDate>
      <category>${escapeXml(post.category || 'ERAS Tips')}</category>
      ${post.tags?.split(',').map(tag => `<category>${escapeXml(tag.trim())}</category>`).join('') || ''}
      <media:content url="${baseUrl}/api/og?title=${encodeURIComponent(post.title)}" medium="image" />
      <media:thumbnail url="${baseUrl}/api/og?title=${encodeURIComponent(post.title)}" />
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Return a minimal valid RSS feed on error
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MyERAS Reviewer Blog</title>
    <link>${baseUrl}/blog</link>
    <description>ERAS Application Review Service Blog</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-US</language>
  </channel>
</rss>`;

    return new NextResponse(fallbackRss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  }
}

// Helper function for Atom feed generation (not exported as route)
async function generateAtomFeed() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.myerasediting.com';

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });

    const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>MyERAS Reviewer Blog</title>
  <link href="${baseUrl}/blog" />
  <link href="${baseUrl}/feed.atom" rel="self" />
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>MyERAS Reviewer Team</name>
    <email>editor@myerasreviewer.com</email>
  </author>
  <id>${baseUrl}/blog</id>
  ${posts.map(post => `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${baseUrl}/blog/${post.slug}" />
    <id>${baseUrl}/blog/${post.slug}</id>
    <updated>${post.publishedAt?.toISOString() || new Date().toISOString()}</updated>
    <summary>${escapeXml(post.excerpt || post.title)}</summary>
    <content type="html">${escapeXml(post.content || '')}</content>
    <author>
      <name>${escapeXml(post.author || 'MyERAS Reviewer Team')}</name>
    </author>
    ${post.tags?.split(',').map(tag => `<category term="${escapeXml(tag.trim())}" />`).join('') || ''}
  </entry>`).join('')}
</feed>`;

    return atom;
  } catch (error) {
    console.error('Error generating Atom feed:', error);
    return null;
  }
}