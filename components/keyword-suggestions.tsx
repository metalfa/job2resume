"use client"

import { Badge } from "@/components/ui/badge"
import type { KeywordSuggestion } from "@/types/resume-builder"

interface KeywordSuggestionsProps {
  suggestions: KeywordSuggestion[]
  onApplySuggestion: (keyword: string) => void
}

export function KeywordSuggestions({ suggestions, onApplySuggestion }: KeywordSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-3">Keyword Suggestions</h3>
      <p className="text-sm text-blue-700 mb-3">
        Based on the job description, consider including these keywords in your resume:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className="cursor-pointer hover:bg-blue-100 border-blue-300"
            onClick={() => onApplySuggestion(suggestion.keyword)}
          >
            {suggestion.keyword}
            <span className="ml-1 text-xs">+</span>
          </Badge>
        ))}
      </div>
    </div>
  )
}
