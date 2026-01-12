'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Lightbulb } from 'lucide-react'

const CATEGORIES = [
  { value: 'APPLICATION_TIPS', label: 'Application Tips' },
  { value: 'PERSONAL_STATEMENT', label: 'Personal Statement' },
  { value: 'INTERVIEW_PREP', label: 'Interview Prep' },
  { value: 'SPECIALTY_GUIDES', label: 'Specialty Guides' },
  { value: 'TIMELINE_PLANNING', label: 'Timeline Planning' },
  { value: 'PROGRAM_SELECTION', label: 'Program Selection' },
  { value: 'MATCH_STRATEGY', label: 'Match Strategy' },
  { value: 'SUCCESS_STORIES', label: 'Success Stories' },
]

interface TopicSuggestion {
  title: string
  description: string
  keywords: string[]
}

export default function BlogGeneratePage() {
  const [category, setCategory] = useState('')
  const [topic, setTopic] = useState('')
  const [targetKeywords, setTargetKeywords] = useState('')
  const [wordCountTarget, setWordCountTarget] = useState(2000)
  const [includeFaq, setIncludeFaq] = useState(true)
  const [autoPublish, setAutoPublish] = useState(true)

  const [generating, setGenerating] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSuggestTopics() {
    if (!category) {
      setError('Please select a category first')
      return
    }

    setSuggesting(true)
    setError('')
    setSuggestions([])

    try {
      const response = await fetch('/api/admin/blog/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to suggest topics')
      }

      setSuggestions(data.topics || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSuggesting(false)
    }
  }

  function selectSuggestion(suggestion: TopicSuggestion) {
    setTopic(suggestion.title)
    setTargetKeywords(suggestion.keywords.join(', '))
    setSuggestions([])
  }

  async function handleGenerate() {
    if (!category) {
      setError('Please select a category')
      return
    }
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setGenerating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          topic: topic.trim(),
          targetKeywords: targetKeywords.split(',').map(k => k.trim()).filter(Boolean),
          wordCountTarget,
          includeFaq,
          autoPublish,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setSuccess(`Blog post generated successfully! ${data.slug ? `Slug: ${data.slug}` : ''}`)
      setTopic('')
      setTargetKeywords('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Generate Blog Post</h1>
            <p className="text-gray-400 mt-1">Create SEO-optimized ERAS content using AI</p>
          </div>
        </div>
      </div>

      {/* Generation Form */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="font-semibold text-white mb-6">Generate New Blog Post</h3>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Topic / Title
              </label>
              <button
                type="button"
                onClick={handleSuggestTopics}
                disabled={suggesting || !category}
                className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {suggesting ? (
                  <>
                    <div className="animate-spin h-3 w-3 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    Suggesting...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4" />
                    Suggest Topics
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How to Write a Compelling ERAS Personal Statement"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a topic or click "Suggest Topics" for AI recommendations
            </p>

            {/* Topic Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-300">Suggested Topics:</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left p-3 bg-gray-700 border border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-600 transition-colors"
                    >
                      <div className="font-medium text-white text-sm">{suggestion.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{suggestion.description}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {suggestion.keywords.map((keyword, kidx) => (
                          <span key={kidx} className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Keywords (optional)
            </label>
            <input
              type="text"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="e.g., ERAS personal statement, residency application, medical school"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated keywords to target for SEO
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Word Count: {wordCountTarget}
            </label>
            <input
              type="range"
              min={1000}
              max={3000}
              step={100}
              value={wordCountTarget}
              onChange={(e) => setWordCountTarget(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1000 (Short)</span>
              <span>2000 (Medium)</span>
              <span>3000 (Long)</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeFaq"
                checked={includeFaq}
                onChange={(e) => setIncludeFaq(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="includeFaq" className="text-sm text-gray-300">
                Include FAQ section (recommended for SEO)
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoPublish"
                checked={autoPublish}
                onChange={(e) => setAutoPublish(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="autoPublish" className="text-sm text-gray-300">
                Auto-publish after generation
              </label>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !category || !topic.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Generating... This may take a minute
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Blog Post
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Generate Buttons */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="font-semibold text-white mb-4">Quick Generate by Category</h3>
        <p className="text-sm text-gray-400 mb-4">Click to generate a random topic from each category</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value)
                handleSuggestTopics()
              }}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
