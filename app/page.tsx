"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Clock, Users, Award, AlertTriangle, DollarSign, XCircle, ArrowRight, Target, Trophy, ChevronRight, Minus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SitelinksSchema from "@/components/SitelinksSchema";
import { ServiceListSchema } from "@/components/seo/ServiceSchema";
import Script from "next/script";
import { useState } from "react";

const packages = [
  {
    name: "Comprehensive Edit",
    price: 299,
    description: "48 hours turnaround",
    features: [
      "Personal Statement Review",
      "CV/Resume review",
      "3 Experience descriptions",
      "Program-specific tailoring",
      "Two rounds of revisions",
      "Priority support"
    ],
    popular: false,
  },
  {
    name: "Premium Package",
    price: 499,
    description: "24 hours turnaround",
    features: [
      "Everything in Comprehensive",
      "All experience descriptions",
      "Letter of recommendation review",
      "Mock interview questions",
      "Three rounds of revisions",
      "Direct reviewer communication",
      "Application strategy session"
    ],
    popular: true,
  },
  {
    name: "Complete Package",
    price: 799,
    description: "24 hours turnaround",
    features: [
      "Everything in Premium",
      "Unlimited experience descriptions",
      "All documents review",
      "School list optimization",
      "Unlimited revisions for 30 days",
      "1-on-1 video consultation",
      "Post-match support"
    ],
    popular: false,
  }
];

const stats = [
  { value: "85%", label: "Match Rate" },
  { value: "10,000+", label: "Applications Reviewed" },
  { value: "5.2×", label: "More Interviews" },
  { value: "48hr", label: "Turnaround" }
];

const testimonials = [
  {
    name: "Sarah M., MD",
    program: "Internal Medicine, Johns Hopkins",
    content: "From 0 interviews last year to 14 this year. The strategic positioning made all the difference.",
    stats: "USMLE: 235 | Interviews: 14 | Matched: #1"
  },
  {
    name: "Michael K., DO",
    program: "General Surgery, Mayo Clinic",
    content: "They transformed my average application into something that stood out. Worth every penny.",
    stats: "COMLEX: 580 | Interviews: 18 | Matched: #2"
  },
  {
    name: "Jennifer L., MD",
    program: "Pediatrics, CHOP",
    content: "The program signal strategy alone secured interviews at all my top choices.",
    stats: "Step 1: 251 | Interviews: 22 | Matched: #1"
  }
];

const faqs = [
  {
    question: "What if I don't match?",
    answer: "We offer a 100% money-back guarantee if you don't receive any interview invitations. Plus, we'll work with you through SOAP at no additional cost."
  },
  {
    question: "How are you different?",
    answer: "Our reviewers are physicians who've served on admission committees. We don't just edit - we strategically position you for your specific specialty."
  },
  {
    question: "Is it worth the investment?",
    answer: "Not matching costs you $300,000+ in lost attending salary. Our clients average 5x more interviews. The ROI is clear."
  },
  {
    question: "What about competitive specialties?",
    answer: "We've helped IMGs match into Dermatology, Orthopedics, and Interventional Radiology. Your reviewer will be matched to your specialty."
  },
  {
    question: "How fast is the turnaround?",
    answer: "Standard turnaround is 48 hours. Premium packages get 24-hour priority. We've never missed a deadline."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Services for ItemList schema
  const services = [
    {
      name: "Personal Statement Review",
      description: "Expert review and editing of ERAS personal statement by successful physicians",
      url: "https://www.myerasediting.com/services/personal-statement",
      price: "149"
    },
    {
      name: "Experience Descriptions",
      description: "Optimize all 15 ERAS experience descriptions for maximum impact",
      url: "https://www.myerasediting.com/services/experiences",
      price: "199"
    },
    {
      name: "Letters of Recommendation Review",
      description: "Review and improve recommendation letters to avoid red flags",
      url: "https://www.myerasediting.com/services/letters",
      price: "99"
    }
  ];

  // Aggregate Rating schema
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MyERAS Editing",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SitelinksSchema />
      <ServiceListSchema services={services} />
      <Script
        id="aggregate-rating-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aggregateRatingSchema)
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="line-clamp-1">42% of applicants didn't match last year</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-[1.1] tracking-tight">
              Your application has
              <span className="block text-gray-400">7 seconds</span>
              <span className="block">to impress.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
              Program directors spend seconds scanning each application.
              One weak statement, one poorly written experience — that's all it takes.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 bg-gray-900 hover:bg-gray-800 text-white rounded-lg cursor-pointer">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="#testimonials" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 border-gray-300 rounded-lg cursor-pointer text-black">
                  See Success Stories
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600">
              {stats.slice(0, 3).map((stat, i) => (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">{stat.value} {stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              The cost of not matching
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Every unmatched year compounds into lost opportunities and income.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">$300,000</div>
              <div className="text-gray-600">Lost attending income per year</div>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">$8,000+</div>
              <div className="text-gray-600">Reapplication costs</div>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">12 months</div>
              <div className="text-gray-600">Career delay minimum</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                Match at your dream program
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Strategic positioning</h3>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">We know exactly what program directors look for in your specialty.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">5-10× more interviews</h3>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">Our clients average 12 interviews versus the typical 2-3.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Match guarantee</h3>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">100% refund if you don't receive interview invitations.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl mt-8 lg:mt-0">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 sm:mb-6">Recent Matches</h3>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">2 hours ago</p>
                  <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Orthopedics at Stanford</p>
                  <p className="text-xs sm:text-sm text-gray-600">IMG with Step 1: 245</p>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Yesterday</p>
                  <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Dermatology at NYU</p>
                  <p className="text-xs sm:text-sm text-gray-600">15 interview invites</p>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">3 days ago</p>
                  <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Internal Medicine at Hopkins</p>
                  <p className="text-xs sm:text-sm text-gray-600">Matched #1 choice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-[#f3f4f6] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Choose the level of support that fits your needs
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 ${
                  pkg.popular 
                    ? 'ring-2 ring-gray-900' 
                    : 'border border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-900 text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{pkg.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">${pkg.price}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/auth/signup" className="block">
                  <Button 
                    className={`w-full rounded-lg py-2.5 sm:py-3 cursor-pointer text-sm ${
                      pkg.popular 
                        ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                        : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12 px-4">
            <p className="text-xs sm:text-sm text-gray-600">
              All plans include HIPAA-compliant security and 100% money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Trusted by thousands
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Real results from real applicants
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl">
                <div className="flex gap-0.5 sm:gap-1 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-gray-900 text-gray-900" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{testimonial.program}</div>
                  <div className="text-xs text-gray-500 font-mono">{testimonial.stats}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            Frequently asked questions
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
                <button
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900 text-sm sm:text-base pr-2">{faq.question}</span>
                  <ChevronRight className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform flex-shrink-0 ${
                    openFaq === index ? 'rotate-90' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <p className="text-gray-600 text-sm sm:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-[#f3f4f6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to secure your match?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10">
            Join thousands who trusted us with their future
          </p>
          
          <Link href="/auth/signup">
            <Button size="lg" className="text-sm sm:text-base px-6 sm:px-10 py-4 sm:py-6 bg-white hover:bg-gray-100 text-gray-900 rounded-lg cursor-pointer">
              Start Your Review
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>100% Money-back guarantee</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>48-hour turnaround</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Payment plans available</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}