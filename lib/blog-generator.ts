import { prisma } from './prisma';
import slugify from 'slugify';
import { getUniqueRandomTopic, getTopicForTimeOfDay } from './blog-topics';
import { generateEnhancedBlogPost } from './blog-enhancer';
import { pingSearchEngines, submitUrlToSearchEngines } from './seo/search-engine-ping';

function generateTags(topic: string, category: string, relatedKeywords: string[] = []): string[] {
  const baseTags = ['ERAS', 'residency', 'medical students', 'match 2025'];

  // Add category-specific tags
  const categoryTags: { [key: string]: string[] } = {
    APPLICATION_TIPS: ['application tips', 'ERAS tips', 'application strategy'],
    PERSONAL_STATEMENT: ['personal statement', 'PS writing', 'residency essay'],
    INTERVIEW_PREP: ['interview tips', 'residency interview', 'MMI prep'],
    SPECIALTY_GUIDES: ['specialty selection', 'medical specialties', 'career path'],
    TIMELINE_PLANNING: ['application timeline', 'ERAS deadlines', 'match calendar'],
    PROGRAM_SELECTION: ['program research', 'residency programs', 'where to apply'],
    MATCH_STRATEGY: ['match strategy', 'rank list', 'NRMP match'],
    SUCCESS_STORIES: ['match success', 'residency journey', 'applicant stories'],
  };

  const tags = [
    ...baseTags,
    ...categoryTags[category] || [],
    ...relatedKeywords.slice(0, 4),
    topic.split(' ').slice(0, 2).join(' ').toLowerCase(),
  ];

  return [...new Set(tags)].slice(0, 12);
}

export async function generateBlogPost() {
  try {
    // Select topic based on time of day for better engagement
    const currentHour = new Date().getHours();
    const topicData = getTopicForTimeOfDay(currentHour) || getUniqueRandomTopic();

    if (!topicData) {
      throw new Error('No available topics to generate blog post');
    }

    const { topic, category: categoryName, icon } = topicData;

    // Check if post with this slug already exists
    const slug = slugify(topic, { lower: true, strict: true });
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (existingPost) {
      console.log(`Blog post with slug "${slug}" already exists. Skipping...`);
      return null;
    }

    console.log(`Generating enhanced blog post: "${topic}"`);

    // Use two-pass enhanced generation
    const blogData = await generateEnhancedBlogPost(
      topic,
      categoryName,
      [], // No specific keywords for auto-generation
      2000, // Target word count
      true // Include FAQ
    );

    if (!blogData.content || blogData.content.trim() === '') {
      throw new Error('No valid content generated');
    }

    // Generate excerpt from meta description or content
    const plainText = blogData.metaDescription || blogData.content.replace(/<[^>]*>/g, '').substring(0, 200);
    const tags = generateTags(topic, categoryName, blogData.relatedKeywords);

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
    });

    // Save to database with auto-publish
    const blogPost = await prisma.blogPost.create({
      data: {
        title: topic,
        slug,
        excerpt: plainText + (plainText.length === 200 ? '...' : ''),
        content: blogData.content,
        category: categoryName as any,
        tags: tags.join(', '),
        icon: icon,
        readTime: blogData.readTime,
        featured: Math.random() < 0.2, // 20% chance of being featured
        author: 'MyERAS Reviewer Team',
        metaDescription: blogData.metaDescription,
        faqSection: blogData.faqSection.length > 0 ? blogData.faqSection : undefined,
        schemaMarkup,
        publishedAt: new Date(), // Auto-publish
      },
    });

    console.log(`Successfully generated enhanced blog post: ${topic} (${blogData.readTime} min read)`);

    // Ping search engines about new content (non-blocking)
    const blogUrl = `${process.env.NEXT_PUBLIC_URL || 'https://www.myerasediting.com'}/blog/${slug}`;
    pingSearchEngines().catch(err => console.error('Search engine ping failed:', err));
    submitUrlToSearchEngines(blogUrl).catch(err => console.error('URL submission failed:', err));

    return blogPost;

  } catch (error) {
    console.error('Error generating blog post:', error);
    throw error;
  }
}

export async function generateMultipleBlogPosts(count: number = 5) {
  const results = [];

  for (let i = 0; i < count; i++) {
    try {
      console.log(`Generating blog post ${i + 1} of ${count}...`);
      const post = await generateBlogPost();
      if (post) {
        results.push(post);
      }

      // Delay between posts to avoid rate limiting
      if (i < count - 1) {
        console.log('Waiting 10 seconds before next post...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    } catch (error) {
      console.error(`Failed to generate post ${i + 1}:`, error);
    }
  }

  console.log(`Generated ${results.length} of ${count} blog posts`);
  return results;
}
