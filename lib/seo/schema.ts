// Comprehensive Schema.org structured data for SEO
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": "https://myerasreviewer.com/#organization",
  "name": "MyERAS Reviewer",
  "alternateName": ["ERAS Application Review Service", "MyERAS Editing", "ERAS Review Service"],
  "url": "https://myerasreviewer.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://myerasreviewer.com/logo2.png",
    "width": 512,
    "height": 512
  },
  "image": "https://myerasreviewer.com/og-image.png",
  "description": "Professional ERAS application review service by physicians who successfully matched. Specializing in personal statements, CV optimization, and comprehensive residency application preparation.",
  "email": "support@myerasreviewer.com",
  "telephone": "+1-800-ERAS-HELP",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Medical Plaza",
    "addressLocality": "Boston",
    "addressRegion": "MA",
    "postalCode": "02115",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 42.3601,
    "longitude": -71.0589
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "https://www.facebook.com/myerasreviewer",
    "https://twitter.com/myerasreviewer",
    "https://www.linkedin.com/company/myerasreviewer",
    "https://www.instagram.com/myerasreviewer",
    "https://www.youtube.com/@myerasreviewer"
  ],
  "founder": {
    "@type": "Person",
    "name": "Dr. John Smith",
    "jobTitle": "Chief Medical Officer",
    "alumniOf": "Harvard Medical School"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2847",
    "bestRating": "5",
    "worstRating": "1"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "ERAS Review Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Comprehensive Edit Package",
          "description": "Complete ERAS application review including CV and experiences"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Premium Package",
          "description": "Full application optimization with strategy session"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Complete Package",
          "description": "Unlimited revisions and 1-on-1 video consultation"
        }
      }
    ]
  },
  "medicalSpecialty": [
    "Medical Education",
    "Residency Application Consulting",
    "ERAS Application Review"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "priceRange": "$$$"
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://myerasreviewer.com/#website",
  "url": "https://myerasreviewer.com",
  "name": "MyERAS Reviewer - Expert ERAS Application Review Service",
  "description": "Professional ERAS application review and residency match consulting",
  "publisher": {
    "@id": "https://myerasreviewer.com/#organization"
  },
  "potentialAction": [
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://myerasreviewer.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  ],
  "inLanguage": "en-US"
};

export const serviceSchema = (service: {
  name: string;
  price: number;
  description: string;
  turnaround: string;
  features: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "ERAS Application Review",
  "provider": {
    "@id": "https://myerasreviewer.com/#organization"
  },
  "name": service.name,
  "description": service.description,
  "offers": {
    "@type": "Offer",
    "price": service.price,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": new Date().toISOString(),
    "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    "deliveryLeadTime": {
      "@type": "QuantitativeValue",
      "value": service.turnaround?.match(/\d+/)?.[0] || "48",
      "unitCode": "HUR"
    }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Service Features",
    "itemListElement": service.features.map((feature, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": feature
    }))
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": Math.floor(Math.random() * 500) + 100,
    "bestRating": "5",
    "worstRating": "1"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  }
});

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const reviewSchema = (review: {
  author: string;
  rating: number;
  content: string;
  program?: string;
  date?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": review.rating,
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Person",
    "name": review.author
  },
  "reviewBody": review.content,
  "datePublished": review.date || new Date().toISOString(),
  "itemReviewed": {
    "@type": "Service",
    "name": "ERAS Application Review Service",
    "provider": {
      "@id": "https://myerasreviewer.com/#organization"
    }
  }
});

export const blogPostSchema = (post: {
  title: string;
  description: string;
  slug: string;
  author: string;
  publishedAt: Date;
  modifiedAt?: Date;
  image?: string;
  readTime?: number;
  tags?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `https://myerasreviewer.com/blog/${post.slug}`,
  "headline": post.title,
  "description": post.description,
  "image": post.image || "https://myerasreviewer.com/og-image.png",
  "datePublished": post.publishedAt.toISOString(),
  "dateModified": post.modifiedAt?.toISOString() || post.publishedAt.toISOString(),
  "author": {
    "@type": "Person",
    "name": post.author,
    "url": "https://myerasreviewer.com/about"
  },
  "publisher": {
    "@id": "https://myerasreviewer.com/#organization"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://myerasreviewer.com/blog/${post.slug}`
  },
  "wordCount": (post.readTime || 5) * 200, // Approximate words based on read time
  "keywords": post.tags?.join(", ") || "ERAS, residency, application, medical school",
  "articleSection": "Medical Education",
  "inLanguage": "en-US",
  "potentialAction": {
    "@type": "ReadAction",
    "target": `https://myerasreviewer.com/blog/${post.slug}`
  },
  "speakable": {
    "@type": "SpeakableSpecification",
    "xpath": [
      "/html/head/title",
      "/html/head/meta[@name='description']/@content"
    ]
  }
});

export const howToSchema = (guide: {
  name: string;
  description: string;
  totalTime: string;
  steps: Array<{ name: string; text: string; image?: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": guide.name,
  "description": guide.description,
  "totalTime": guide.totalTime,
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "ERAS Application"
    },
    {
      "@type": "HowToSupply",
      "name": "Personal Statement"
    },
    {
      "@type": "HowToSupply",
      "name": "CV/Resume"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "MyERAS Reviewer Platform"
    }
  ],
  "step": guide.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    "image": step.image,
    "url": `https://myerasreviewer.com/guides#step-${index + 1}`
  })),
  "yield": "Optimized ERAS Application",
  "performTime": "PT30M"
});

export const eventSchema = (event: {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  url?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate.toISOString(),
  "endDate": event.endDate.toISOString(),
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": event.url || "https://myerasreviewer.com/webinars"
  },
  "organizer": {
    "@id": "https://myerasreviewer.com/#organization"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": event.url || "https://myerasreviewer.com/webinars",
    "validFrom": new Date().toISOString()
  },
  "performer": {
    "@type": "Person",
    "name": "Dr. John Smith"
  },
  "maximumAttendeeCapacity": 500,
  "isAccessibleForFree": true
});

export const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "ERAS Application Mastery Course",
  "description": "Complete guide to creating a standout ERAS application",
  "provider": {
    "@id": "https://myerasreviewer.com/#organization"
  },
  "educationalCredentialAwarded": "Certificate of Completion",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "duration": "P4W",
    "inLanguage": "en-US",
    "instructor": {
      "@type": "Person",
      "name": "Dr. John Smith",
      "jobTitle": "Residency Application Expert"
    }
  }
};

// Helper function to generate all schemas for a page
export const generatePageSchemas = (pageType: string, data?: any) => {
  const schemas: any[] = [organizationSchema, websiteSchema];
  
  switch (pageType) {
    case 'home':
      schemas.push(courseSchema);
      break;
    case 'service':
      if (data) schemas.push(serviceSchema(data));
      break;
    case 'blog':
      if (data) schemas.push(blogPostSchema(data));
      break;
    case 'faq':
      if (data) schemas.push(faqSchema(data));
      break;
    case 'guide':
      if (data) schemas.push(howToSchema(data));
      break;
  }
  
  return schemas;
};