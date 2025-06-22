// This is now the main dashboard page, accessible only when authenticated.
// The content is similar to the old app/dashboard/page.tsx
// Middleware will protect this route.
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Wand2,
  Download,
  Edit3,
  AlertCircle,
  CheckCircle,
  FileText,
  Printer,
  ClipboardCopy,
  Mail,
} from "lucide-react"
import {
  analyzeJobDescriptionAction,
  generateResumeAction,
  generateCoverLetterAction,
} from "@/app/actions/resume-actions" // Will need updates for trial checks
import type { TailoredResume } from "@/lib/pdf-generator"
import type { JobAnalysis } from "@/lib/resume-ai"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import SubscriptionPrompt from "@/components/SubscriptionPrompt" // New Component
import { getUserSubscription } from "@/lib/supabase/userActions" // New lib function

interface UserSubscription {
  trial_resumes_used: number
  trial_cover_letters_used: number
  subscription_status: string
}

const TRIAL_RESUME_LIMIT = 3
const TRIAL_COVER_LETTER_LIMIT = 3

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [jobAnalysisData, setJobAnalysisData] = useState<JobAnalysis | null>(null)
  const [generatedResume, setGeneratedResume] = useState<TailoredResume | null>(null)
  const [isEditingResume, setIsEditingResume] = useState(false)
  const [editableResume, setEditableResume] = useState<TailoredResume | null>(null)
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string | null>(null)
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false)
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false)
  const [editableCoverLetter, setEditableCoverLetter] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resumeTemplate, setResumeTemplate] = useState("professional")
  const [colorScheme, setColorScheme] = useState("blue")
  const [isDownloadingResume, setIsDownloadingResume] = useState(false)
  const [isDownloadingCoverLetter, setIsDownloadingCoverLetter] = useState(false)
  const [activeTab, setActiveTab] = useState("resume")
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchSubscription = async () => {
        const sub = await getUserSubscription(session.user.id!)
        setUserSubscription(sub)
      }
      fetchSubscription()
    }
  }, [session, status])

  const canGenerateResume = () => {
    if (!userSubscription) return false
    return userSubscription.subscription_status === "active" || userSubscription.trial_resumes_used < TRIAL_RESUME_LIMIT
  }

  const canGenerateCoverLetter = () => {
    if (!userSubscription) return false
    return (
      userSubscription.subscription_status === "active" ||
      userSubscription.trial_cover_letters_used < TRIAL_COVER_LETTER_LIMIT
    )
  }

  const handleAnalyzeAndGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first")
      return
    }
    if (!canGenerateResume()) {
      setError("You've reached your resume generation limit for the free trial.")
      setShowSubscriptionPrompt(true)
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setSuccess(null)
    // ... (rest of the logic, but call updateTrialUsage for resume)
    try {
      const analysisResult = await analyzeJobDescriptionAction(jobDescription)
      if (analysisResult.error || !analysisResult.data) throw new Error(analysisResult.error || "Analysis failed")
      setJobAnalysisData(analysisResult.data)

      const resumeResult = await generateResumeAction(analysisResult.data, session?.user?.id) // Pass userId
      if (resumeResult.error || !resumeResult.data) throw new Error(resumeResult.error || "Resume generation failed")

      setGeneratedResume(resumeResult.data.resume)
      setEditableResume(JSON.parse(JSON.stringify(resumeResult.data.resume)))
      if (resumeResult.data.updatedSubscription) setUserSubscription(resumeResult.data.updatedSubscription)
      setSuccess("Resume generated successfully!")
      setActiveTab("resume")
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!jobAnalysisData || !generatedResume) {
      setError("Please generate a resume first.")
      return
    }
    if (!canGenerateCoverLetter()) {
      setError("You've reached your cover letter generation limit for the free trial.")
      setShowSubscriptionPrompt(true)
      return
    }
    setIsGeneratingCoverLetter(true)
    setError(null)
    setSuccess(null)
    // ... (rest of the logic, but call updateTrialUsage for cover letter)
    try {
      const coverLetterResult = await generateCoverLetterAction(jobAnalysisData, generatedResume, session?.user?.id) // Pass userId
      if (coverLetterResult.error || !coverLetterResult.data)
        throw new Error(coverLetterResult.error || "Cover letter generation failed")

      setGeneratedCoverLetter(coverLetterResult.data.coverLetter)
      setEditableCoverLetter(coverLetterResult.data.coverLetter)
      if (coverLetterResult.data.updatedSubscription) setUserSubscription(coverLetterResult.data.updatedSubscription)
      setSuccess("Cover letter generated successfully!")
      setIsEditingCoverLetter(false)
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.")
    } finally {
      setIsGeneratingCoverLetter(false)
    }
  }

  // Placeholder for edit/save/download/print handlers - they remain largely the same
  // but should check subscription status if certain features are premium-only beyond generation.
  const handleEditResume = () => setIsEditingResume(true)
  const handleSaveResumeChanges = () => {
    if (editableResume) {
      setGeneratedResume(JSON.parse(JSON.stringify(editableResume)))
      setIsEditingResume(false)
      setSuccess("Resume changes saved!")
    }
  }
  const handleEditCoverLetter = () => setIsEditingCoverLetter(true)
  const handleSaveCoverLetterChanges = () => {
    if (editableCoverLetter !== null) {
      setGeneratedCoverLetter(editableCoverLetter)
      setIsEditingCoverLetter(false)
      setSuccess("Cover letter changes saved!")
    }
  }
  const handleCopyCoverLetter = () => {
    /* ... */
  }
  const handleDownloadResumePDF = async () => {
    /* ... */
  }
  const handleDownloadCoverLetterPDF = async () => {
    /* ... */
  }
  const handlePrint = () => {
    /* ... */
  }
  const handleResumeInputChange = (
    field: string,
    value: string,
    section?: string,
    index?: number,
    subField?: string,
  ) => {
    /* ... */
  }
  const handleCoverLetterInputChange = (value: string) => setEditableCoverLetter(value)
  const addExperience = () => {
    /* ... */
  }
  const removeExperience = (index: number) => {
    /* ... */
  }
  const addAchievement = (expIndex: number) => {
    /* ... */
  }
  const removeAchievement = (expIndex: number, achIndex: number) => {
    /* ... */
  }
  const addEducation = () => {
    /* ... */
  }
  const removeEducation = (index: number) => {
    /* ... */
  }

  useEffect(() => {
    if (generatedResume) {
      setEditableResume(JSON.parse(JSON.stringify(generatedResume)))
      setIsEditingResume(false)
    }
  }, [generatedResume])

  useEffect(() => {
    if (generatedCoverLetter) {
      setEditableCoverLetter(generatedCoverLetter)
      setIsEditingCoverLetter(false)
    }
  }, [generatedCoverLetter])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  if (status === "unauthenticated") {
    // This should ideally be handled by middleware, but as a fallback:
    router.push("/sign-in")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {showSubscriptionPrompt && <SubscriptionPrompt onClose={() => setShowSubscriptionPrompt(false)} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">AI Resume & Cover Letter Generator</h1>
        {userSubscription && userSubscription.subscription_status === "free_trial" && (
          <p className="text-sm text-gray-600">
            Trial: {TRIAL_RESUME_LIMIT - (userSubscription.trial_resumes_used || 0)} resumes &{" "}
            {TRIAL_COVER_LETTER_LIMIT - (userSubscription.trial_cover_letters_used || 0)} cover letters remaining.
          </p>
        )}
        {userSubscription && userSubscription.subscription_status === "active" && (
          <p className="text-sm text-green-600 font-medium">Premium Plan Active</p>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText /> Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the complete job description here..."
            className="min-h-[150px] resize-none"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {jobDescription ? `${jobDescription.length} characters` : "Paste a job description"}
            </div>
            <Button
              onClick={handleAnalyzeAndGenerate}
              disabled={!jobDescription.trim() || isAnalyzing || !userSubscription}
              size="lg"
              className="min-w-[200px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate Resume
                </>
              )}
            </Button>
          </div>
          {!canGenerateResume() && userSubscription && userSubscription.subscription_status !== "active" && (
            <p className="text-xs text-red-500 mt-1">
              Resume generation limit reached for trial.{" "}
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs"
                onClick={() => setShowSubscriptionPrompt(true)}
              >
                Subscribe for unlimited.
              </Button>
            </p>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
      {success && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Success</h3>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {(generatedResume || generatedCoverLetter || jobAnalysisData) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="resume" disabled={!generatedResume}>
              Resume
            </TabsTrigger>
            <TabsTrigger value="cover-letter" disabled={!jobAnalysisData || !generatedResume}>
              Cover Letter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume">
            {generatedResume && (
              // Resume Editor/Viewer UI (simplified for brevity, use your existing detailed UI)
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Resume</CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={handleEditResume} variant="outline" size="sm">
                        <Edit3 className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button onClick={handleDownloadResumePDF} size="sm" disabled={isDownloadingResume}>
                        {isDownloadingResume ? (
                          <Loader2 className="animate-spin mr-1 h-4 w-4" />
                        ) : (
                          <Download className="mr-1 h-4 w-4" />
                        )}{" "}
                        PDF
                      </Button>
                      <Button onClick={handlePrint} size="sm" variant="outline">
                        <Printer className="mr-1 h-4 w-4" /> Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingResume && editableResume ? (
                    <div>
                      {" "}
                      {/* Your resume editing UI here, using editableResume and handleResumeInputChange */}
                      <Textarea
                        value={JSON.stringify(editableResume, null, 2)}
                        rows={20}
                        onChange={(e) => setEditableResume(JSON.parse(e.target.value))}
                      />
                      <Button onClick={handleSaveResumeChanges} className="mt-2">
                        Save Resume
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 border rounded bg-gray-50 min-h-[300px] whitespace-pre-wrap font-mono text-xs">
                      {JSON.stringify(generatedResume, null, 2)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="cover-letter">
            {!generatedCoverLetter && jobAnalysisData && generatedResume && (
              <Card className="mb-6">
                <CardContent className="pt-6 text-center">
                  <p className="mb-4 text-gray-600">Generate a cover letter to match your new resume?</p>
                  <Button onClick={handleGenerateCoverLetter} disabled={isGeneratingCoverLetter || !userSubscription}>
                    {isGeneratingCoverLetter ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" /> Generate Cover Letter
                      </>
                    )}
                  </Button>
                  {!canGenerateCoverLetter() &&
                    userSubscription &&
                    userSubscription.subscription_status !== "active" && (
                      <p className="text-xs text-red-500 mt-1">
                        Cover letter generation limit reached for trial.{" "}
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs"
                          onClick={() => setShowSubscriptionPrompt(true)}
                        >
                          Subscribe for unlimited.
                        </Button>
                      </p>
                    )}
                </CardContent>
              </Card>
            )}
            {generatedCoverLetter && (
              // Cover Letter Editor/Viewer UI (simplified)
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Cover Letter</CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={handleEditCoverLetter} variant="outline" size="sm">
                        <Edit3 className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button onClick={handleCopyCoverLetter} variant="outline" size="sm">
                        <ClipboardCopy className="mr-1 h-4 w-4" /> Copy
                      </Button>
                      <Button onClick={handleDownloadCoverLetterPDF} size="sm" disabled={isDownloadingCoverLetter}>
                        {isDownloadingCoverLetter ? (
                          <Loader2 className="animate-spin mr-1 h-4 w-4" />
                        ) : (
                          <Download className="mr-1 h-4 w-4" />
                        )}{" "}
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingCoverLetter && editableCoverLetter !== null ? (
                    <div>
                      {" "}
                      {/* Your cover letter editing UI here */}
                      <Textarea
                        value={editableCoverLetter}
                        onChange={(e) => handleCoverLetterInputChange(e.target.value)}
                        rows={15}
                      />
                      <Button onClick={handleSaveCoverLetterChanges} className="mt-2">
                        Save Cover Letter
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 border rounded bg-gray-50 min-h-[300px] whitespace-pre-wrap">
                      {generatedCoverLetter}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
