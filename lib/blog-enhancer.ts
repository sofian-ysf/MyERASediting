import OpenAI from 'openai'

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  return new OpenAI({ apiKey })
}

// Enhance a single blog section using GPT-4o-mini (fast & cost-effective)
export async function enhanceBlogSection(
  sectionContent: string,
  sectionTitle: string,
  topic: string,
  targetKeywords: string[]
): Promise<string> {
  const openai = getOpenAIClient()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 2500,
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: 'You are an expert content enhancer for medical residency application articles. Your task is to expand and enrich content sections while maintaining accuracy and SEO optimization.'
      },
      {
        role: 'user',
        content: `Enhance this content section for a medical residency application blog post.

Guidelines:
- Add more detailed explanations, examples, and practical tips
- Include relevant statistics, facts, or real scenarios medical students face
- Maintain a professional but approachable tone
- Keep the HTML formatting (h2, h3, p, ul, li, strong tags)
- Naturally incorporate keywords without stuffing
- Add bullet points or numbered lists where they improve readability
- Include actionable advice applicants can use immediately
- Reference current ERAS/NRMP data where applicable

Topic: "${topic}"
Section Title: ${sectionTitle}
Target Keywords: ${targetKeywords.join(', ')}

Original Content:
${sectionContent}

Please expand this section to be 2-3x more detailed with:
- More specific examples and real scenarios
- Practical, actionable tips
- Relevant statistics or data points
- Better structured information (lists, subpoints)
- Insider tips from successful applicants

Return ONLY the enhanced HTML content for this section (including the heading tag). Do not include any explanation or markdown - just the HTML.`
      }
    ]
  })

  const result = response.choices[0]?.message?.content
  return result || sectionContent
}

// Enhance entire blog content by processing each major section
export async function enhanceBlogContent(
  content: string,
  topic: string,
  targetKeywords: string[]
): Promise<string> {
  // Split content by H2 headings
  const sections = content.split(/(?=<h2[^>]*>)/i).filter(s => s.trim())

  if (sections.length <= 1) {
    // If no H2 sections found, enhance the whole content
    return await enhanceBlogSection(content, topic, topic, targetKeywords)
  }

  const enhancedSections: string[] = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    // Extract section title from the H2 heading
    const titleMatch = section.match(/<h2[^>]*>([^<]+)<\/h2>/i)
    const sectionTitle = titleMatch ? titleMatch[1] : `Section ${i + 1}`

    // Skip very short sections or conclusions
    if (section.length < 200 || sectionTitle.toLowerCase().includes('conclusion')) {
      enhancedSections.push(section)
      continue
    }

    try {
      const enhanced = await enhanceBlogSection(section, sectionTitle, topic, targetKeywords)
      enhancedSections.push(enhanced)

      // Small delay between API calls to avoid rate limiting
      if (i < sections.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error(`Failed to enhance section "${sectionTitle}":`, error)
      enhancedSections.push(section) // Use original if enhancement fails
    }
  }

  return enhancedSections.join('\n\n')
}

// Generate initial blog structure (First Pass) using GPT-4o
export async function generateInitialBlogPost(
  topic: string,
  category: string,
  targetKeywords: string[],
  wordCountTarget: number,
  includeFaq: boolean
): Promise<{
  content: string
  metaDescription: string
  faqSection: { question: string; answer: string }[]
  relatedKeywords: string[]
}> {
  const openai = getOpenAIClient()

  const keywordsPrompt = targetKeywords.length > 0
    ? `Target these keywords naturally: ${targetKeywords.join(', ')}`
    : ''

  const faqPrompt = includeFaq
    ? 'Include 5-8 relevant FAQs that address common "People Also Ask" questions about the topic.'
    : ''

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 6000,
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are an expert medical educator and residency application advisor with deep knowledge of SEO and content marketing. You always respond with valid JSON.'
      },
      {
        role: 'user',
        content: `Write a comprehensive, SEO-optimized blog post about: "${topic}"

The blog post should be targeted at medical students applying for residency through ERAS.
Category: ${category.replace(/_/g, ' ')}
Target word count: ${wordCountTarget} words

IMPORTANT SEO REQUIREMENTS:
- Include the main keyword "${topic}" in the first paragraph
- Use related keywords naturally throughout the content
${keywordsPrompt}
- Include long-tail keyword variations
- Optimize for featured snippets with clear, concise answers
- Include current year (2025) where relevant
- Target specific search intents

Return a JSON object with this exact structure:
{
  "content": "HTML content of the main article with proper h2, h3, p, ul, li, strong tags",
  "metaDescription": "A 150-160 character SEO description including the main keyword",
  ${includeFaq ? `"faqSection": [
    {
      "question": "Frequently asked question",
      "answer": "Detailed answer"
    }
  ],` : ''}
  "relatedKeywords": ["keyword1", "keyword2", "keyword3"]
}

For the main content:
1. Start with an engaging introduction (2-3 paragraphs) that includes the main keyword
2. Include 5-7 main sections with clear, keyword-rich subheadings using <h2> tags
3. Use bullet points (<ul><li>) and numbered lists (<ol><li>) for better readability
4. Include specific, actionable advice with current statistics and data
5. Add a "Quick Answer" section near the beginning for featured snippet optimization
6. Include real examples and scenarios from residency applications
7. End with a conclusion that summarizes key points and includes a call-to-action

${faqPrompt}

Make the content informative, practical, and engaging. Include specific examples and real scenarios that medical students face during the residency application process.`
      }
    ]
  })

  const responseText = response.choices[0]?.message?.content || ''

  try {
    const blogData = JSON.parse(responseText)
    return {
      content: blogData.content || '',
      metaDescription: blogData.metaDescription || null,
      faqSection: Array.isArray(blogData.faqSection) ? blogData.faqSection : [],
      relatedKeywords: Array.isArray(blogData.relatedKeywords) ? blogData.relatedKeywords : []
    }
  } catch (e) {
    console.error('Failed to parse initial blog response:', e)
    // Return basic structure if parsing fails
    if (responseText.includes('<')) {
      return {
        content: responseText,
        metaDescription: '',
        faqSection: [],
        relatedKeywords: []
      }
    }
    throw new Error('Failed to generate blog post content')
  }
}

// Two-pass enhanced blog generation
export async function generateEnhancedBlogPost(
  topic: string,
  category: string,
  targetKeywords: string[] = [],
  wordCountTarget: number = 2000,
  includeFaq: boolean = true
): Promise<{
  content: string
  metaDescription: string
  faqSection: { question: string; answer: string }[]
  relatedKeywords: string[]
  readTime: number
}> {
  console.log('Pass 1: Generating initial blog structure with GPT-4o...')

  // First Pass: Generate initial structure with GPT-4o
  const initialPost = await generateInitialBlogPost(
    topic,
    category,
    targetKeywords,
    wordCountTarget,
    includeFaq
  )

  console.log('Pass 2: Enhancing content sections with GPT-4o-mini...')

  // Second Pass: Enhance each section with GPT-4o-mini
  let enhancedContent = initialPost.content

  try {
    enhancedContent = await enhanceBlogContent(
      initialPost.content,
      topic,
      [...targetKeywords, ...initialPost.relatedKeywords]
    )
  } catch (error) {
    console.error('Content enhancement failed, using original:', error)
    // Continue with original content if enhancement fails
  }

  // Calculate read time based on enhanced content
  const wordCount = enhancedContent.replace(/<[^>]*>/g, '').split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200)

  console.log(`Enhanced blog generated: ${wordCount} words, ${readTime} min read`)

  return {
    content: enhancedContent,
    metaDescription: initialPost.metaDescription,
    faqSection: initialPost.faqSection,
    relatedKeywords: initialPost.relatedKeywords,
    readTime
  }
}
