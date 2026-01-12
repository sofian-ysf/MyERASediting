"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqSchema } from "@/lib/seo/schema";
import Script from "next/script";

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  description?: string;
}

export default function FAQSection({ 
  faqs, 
  title = "Frequently Asked Questions",
  description = "Get answers to common questions about ERAS application review services"
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const schema = faqSchema(faqs);

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-black pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-6 pb-4 text-gray-600"
                  >
                    <div className="prose prose-sm max-w-none">
                      {faq.answer.split('\n').map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// Pre-defined FAQs for different pages
export const homepageFAQs: FAQ[] = [
  {
    question: "What is ERAS application review and why do I need it?",
    answer: "ERAS (Electronic Residency Application Service) review is a professional service where experienced physicians who have successfully matched review your residency application. You need it because the residency match has become increasingly competitive - programs receive hundreds of applications for just a few spots. Our review ensures your application stands out by optimizing your personal statement, CV formatting, experience descriptions, and overall presentation to maximize your interview invitations."
  },
  {
    question: "Who reviews my ERAS application?",
    answer: "Your application is reviewed by physicians who have successfully matched into competitive residency programs and have experience on admission committees. Our reviewers understand exactly what program directors look for because they've been on both sides of the process. Each reviewer specializes in specific specialties, ensuring you get relevant, targeted feedback for your chosen field."
  },
  {
    question: "How long does the ERAS review process take?",
    answer: "Our turnaround times depend on the package you choose: Comprehensive Edit takes 48 hours, and Premium/Complete packages are delivered within 24 hours. During peak season (August-September), we recommend booking early. Rush services are available for urgent deadlines."
  },
  {
    question: "What's included in each ERAS review package?",
    answer: "Comprehensive Edit ($299): Personal statement review, CV review, 3 experience descriptions, and program-specific tailoring. Premium Package ($499): Everything in Comprehensive plus all experience descriptions, LOR review, and strategy session. Complete Package ($799): Everything in Premium plus unlimited revisions for 30 days and 1-on-1 video consultation."
  },
  {
    question: "Can you help with specialty-specific ERAS applications?",
    answer: "Yes! We have specialist reviewers for all major specialties including Internal Medicine, Surgery, Pediatrics, Emergency Medicine, Radiology, Anesthesiology, and more. Each reviewer has matched into their specialty and understands the unique requirements and expectations of that field's programs."
  },
  {
    question: "Do you offer services for International Medical Graduates (IMGs)?",
    answer: "Absolutely! Over 40% of our clients are IMGs. We understand the unique challenges IMGs face, including visa requirements, ECFMG certification, and the need to explain international medical education. Our IMG-specialized reviewers help highlight your strengths and address potential concerns proactively."
  },
  {
    question: "What's your success rate for matching?",
    answer: "Our clients have a 95% match rate, compared to the national average of 81% for US MDs. Clients who use our comprehensive services receive an average of 5.2x more interview invitations than their initial application would have generated. We're so confident in our service that we offer a satisfaction guarantee."
  },
  {
    question: "When should I start my ERAS application review?",
    answer: "Ideally, start 2-3 months before ERAS opens (June-July). This gives you time for multiple revisions and refinement. However, we accept applications throughout the season. Even if you've already submitted, we can help with program-specific updates and supplemental applications."
  },
  {
    question: "Do you help with personal statement writing from scratch?",
    answer: "While we primarily review and edit existing drafts, our Premium and Complete packages include brainstorming sessions to help you develop your narrative. We guide you through structuring your statement, identifying key experiences to highlight, and crafting a compelling story that resonates with program directors."
  },
  {
    question: "Is the ERAS review service worth the cost?",
    answer: "Consider this: the average cost of not matching is over $30,000 (lost year of income, reapplication fees, additional rotations). Our services range from $149-799 and significantly increase your match chances. Most clients tell us it's the best investment they made in their medical career. Plus, we offer payment plans for all packages."
  }
];

export const pricingFAQs: FAQ[] = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and PayPal. We also offer payment plans through Affirm for packages over $299, allowing you to split the cost into 3-6 monthly payments with no interest."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with our review within 48 hours of delivery, we'll either provide a full refund or work with you until you're satisfied. After your application is submitted to ERAS, refunds are not available as the service has been fully rendered."
  },
  {
    question: "Are there any hidden fees?",
    answer: "No hidden fees! The price you see is the price you pay. Rush delivery (12-hour turnaround) is available for an additional 50% fee. Additional revision rounds beyond what's included in your package are $49 each."
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes! We offer 15% off for groups of 3-5 people and 20% off for groups of 6 or more. Medical schools can contact us for institutional rates. We also provide 10% military and first responder discounts with valid ID."
  },
  {
    question: "Can I upgrade my package later?",
    answer: "Absolutely! You can upgrade to a higher tier anytime by paying the difference. Many clients start with Comprehensive Edit and upgrade to Premium or Complete after seeing the quality of our work."
  }
];