"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { saveJobDescription } from "@/app/actions/job-description"

export function JobDescriptionForm() {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [keywordsDetected, setKeywordsDetected] = useState<string[]>([])
  const [jobTitle, setJobTitle] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!jobDescription) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("description", jobDescription)

      const result = await saveJobDescription(formData)

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        const requiredSkills = result.analysis.requiredSkills || []
        const preferredSkills = result.analysis.preferredSkills || []

        setKeywordsDetected([...requiredSkills, ...preferredSkills])
        setJobTitle(result.analysis.jobTitle || null)
        setCompanyName(result.analysis.companyName || null)
      }
    } catch (error) {
      console.error("Error analyzing job description:", error)
      setError("Failed to analyze job description. Please try again later.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste the full job description here..."
        className="min-h-[200px] resize-none"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {jobDescription ? (
            <>
              <span className="font-medium">{jobDescription.length}</span> characters
            </>
          ) : (
            "Paste a job description to continue"
          )}
        </div>
        <Button onClick={handleAnalyze} disabled={!jobDescription || isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Job Description"
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {keywordsDetected.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Analysis Complete</h3>
          </div>

          {(jobTitle || companyName) && (
            <div className="mb-3 text-sm">
              {jobTitle && (
                <p>
                  <span className="font-medium">Position:</span> {jobTitle}
                </p>
              )}
              {companyName && (
                <p>
                  <span className="font-medium">Company:</span> {companyName}
                </p>
              )}
            </div>
          )}

          <p className="text-sm mb-3">We've detected the following key skills and requirements:</p>
          <div className="flex flex-wrap gap-2">
            {keywordsDetected.map((keyword, index) => (
              <div key={index} className="bg-white border px-2 py-1 rounded-md text-xs">
                {keyword}
              </div>
            ))}
          </div>
        </div>
      )}

      {jobDescription && !keywordsDetected.length && !isAnalyzing && !error && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Tip</h3>
            <p className="text-sm">Click "Analyze Job Description" to identify key skills and requirements.</p>
          </div>
        </div>
      )}
    </div>
  )
}
