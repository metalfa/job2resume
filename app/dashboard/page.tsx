"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Wand2,
  Download,
  Save,
  Edit3,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  FileText,
  Palette,
  Printer,
  ClipboardCopy,
  Mail,
} from "lucide-react"
import {
  analyzeJobDescriptionAction,
  generateResumeAction,
  generateCoverLetterAction,
} from "@/app/actions/resume-actions"
import {
  downloadResumeAsDirectPDF,
  printResumeDocument,
  downloadCoverLetterAsPDF, // Added new import
  type TailoredResume,
} from "@/lib/pdf-generator"
import type { JobAnalysis } from "@/lib/resume-ai"

export default function DashboardPage() {
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
  const [coverLetterError, setCoverLetterError] = useState<string | null>(null)
  const [coverLetterSuccess, setCoverLetterSuccess] = useState<string | null>(null)
  const [isDownloadingCoverLetter, setIsDownloadingCoverLetter] = useState(false) // New state

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resumeTemplate, setResumeTemplate] = useState("professional")
  const [colorScheme, setColorScheme] = useState("blue")
  const [isDownloadingResume, setIsDownloadingResume] = useState(false) // Renamed for clarity
  const [activeTab, setActiveTab] = useState("resume")

  const handleAnalyzeAndGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setSuccess(null)
    setJobAnalysisData(null)
    setGeneratedResume(null)
    setGeneratedCoverLetter(null)
    setCoverLetterError(null)
    setCoverLetterSuccess(null)

    try {
      const analysisResult = await analyzeJobDescriptionAction(jobDescription)

      if (analysisResult.error || !analysisResult.success || !analysisResult.data) {
        setError(analysisResult.error || "Failed to analyze job description")
        setIsAnalyzing(false)
        return
      }

      setJobAnalysisData(analysisResult.data)

      const resumeResult = await generateResumeAction(analysisResult.data)

      if (resumeResult.error || !resumeResult.success || !resumeResult.data) {
        setError(resumeResult.error || "Failed to generate resume")
        setIsAnalyzing(false)
        return
      }

      setGeneratedResume(resumeResult.data)
      setEditableResume(JSON.parse(JSON.stringify(resumeResult.data)))
      setSuccess("Resume generated successfully! You can now edit and customize it.")
      setActiveTab("resume")
    } catch (error) {
      console.error("Error generating resume:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!jobAnalysisData || !generatedResume) {
      setCoverLetterError("Please generate a resume first, which includes job analysis.")
      return
    }
    setIsGeneratingCoverLetter(true)
    setCoverLetterError(null)
    setCoverLetterSuccess(null)

    try {
      const coverLetterResult = await generateCoverLetterAction(jobAnalysisData, generatedResume)
      if (coverLetterResult.error || !coverLetterResult.success || !coverLetterResult.data) {
        setCoverLetterError(coverLetterResult.error || "Failed to generate cover letter.")
      } else {
        setGeneratedCoverLetter(coverLetterResult.data)
        setEditableCoverLetter(coverLetterResult.data)
        setCoverLetterSuccess("Cover letter generated successfully!")
        setIsEditingCoverLetter(false)
      }
    } catch (e) {
      console.error("Error generating cover letter:", e)
      setCoverLetterError("An unexpected error occurred while generating the cover letter.")
    } finally {
      setIsGeneratingCoverLetter(false)
    }
  }

  const handleEditResume = () => {
    setIsEditingResume(true)
    setSuccess(null)
  }

  const handleSaveResumeChanges = () => {
    if (editableResume) {
      setGeneratedResume(JSON.parse(JSON.stringify(editableResume)))
      setIsEditingResume(false)
      setSuccess("Resume changes saved successfully!")
    }
  }

  const handleEditCoverLetter = () => {
    setIsEditingCoverLetter(true)
    setCoverLetterSuccess(null)
  }

  const handleSaveCoverLetterChanges = () => {
    if (editableCoverLetter !== null) {
      setGeneratedCoverLetter(editableCoverLetter)
      setIsEditingCoverLetter(false)
      setCoverLetterSuccess("Cover letter changes saved successfully!")
    }
  }

  const handleCopyCoverLetter = () => {
    if (generatedCoverLetter) {
      navigator.clipboard
        .writeText(generatedCoverLetter)
        .then(() => setCoverLetterSuccess("Cover letter copied to clipboard!"))
        .catch(() => setCoverLetterError("Failed to copy cover letter."))
    }
  }

  const handleDownloadResumePDF = async () => {
    // Renamed for clarity
    if (generatedResume) {
      setIsDownloadingResume(true)
      setSuccess(null)
      setError(null)
      try {
        await downloadResumeAsDirectPDF(generatedResume, resumeTemplate, colorScheme)
        setSuccess("Resume downloaded successfully!")
      } catch (e) {
        setError("Failed to download PDF. Please try printing or try again later.")
      } finally {
        setIsDownloadingResume(false)
      }
    }
  }

  const handleDownloadCoverLetterPDF = async () => {
    if (generatedCoverLetter && generatedResume) {
      setIsDownloadingCoverLetter(true)
      setCoverLetterSuccess(null)
      setCoverLetterError(null)
      try {
        await downloadCoverLetterAsPDF(generatedCoverLetter, generatedResume.personalInfo.name)
        setCoverLetterSuccess("Cover letter PDF downloaded successfully!")
      } catch (e) {
        setCoverLetterError("Failed to download Cover Letter PDF. Please try again.")
      } finally {
        setIsDownloadingCoverLetter(false)
      }
    } else {
      setCoverLetterError("Cannot download: Cover letter or resume data is missing.")
    }
  }

  const handlePrint = () => {
    if (generatedResume) {
      printResumeDocument(generatedResume, resumeTemplate, colorScheme)
      setSuccess("Print dialog initiated. Please select your printer and settings.")
    }
  }

  const handleResumeInputChange = (
    field: string,
    value: string,
    section?: string,
    index?: number,
    subField?: string,
  ) => {
    if (!editableResume) return

    setEditableResume((prev) => {
      if (!prev) return prev
      const updated = JSON.parse(JSON.stringify(prev))

      if (section === "personalInfo") {
        updated.personalInfo = { ...updated.personalInfo, [field]: value }
      } else if (section === "experience" && typeof index === "number") {
        updated.experience = [...updated.experience]
        if (subField === "achievements") {
          const achievementIndex = Number.parseInt(field)
          updated.experience[index].achievements[achievementIndex] = value
        } else {
          updated.experience[index] = { ...updated.experience[index], [field]: value }
        }
      } else if (section === "education" && typeof index === "number") {
        updated.education = [...updated.education]
        updated.education[index] = { ...updated.education[index], [field]: value }
      } else if (field === "summary") {
        updated.summary = value
      } else if (field === "skills") {
        updated.skills = value
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      }
      return updated
    })
  }

  const handleCoverLetterInputChange = (value: string) => {
    setEditableCoverLetter(value)
  }

  const addExperience = () => {
    if (!editableResume) return
    setEditableResume((prev) => ({
      ...prev!,
      experience: [
        ...prev!.experience,
        {
          title: "Job Title",
          company: "Company Name",
          location: "City, State",
          duration: "Start Date - End Date",
          achievements: ["Key achievement or responsibility"],
        },
      ],
    }))
  }

  const removeExperience = (index: number) => {
    if (!editableResume) return
    setEditableResume((prev) => ({
      ...prev!,
      experience: prev!.experience.filter((_, i) => i !== index),
    }))
  }

  const addAchievement = (expIndex: number) => {
    if (!editableResume) return
    setEditableResume((prev) => {
      const updated = { ...prev! }
      updated.experience = [...updated.experience]
      updated.experience[expIndex] = {
        ...updated.experience[expIndex],
        achievements: [...updated.experience[expIndex].achievements, "New achievement"],
      }
      return updated
    })
  }

  const removeAchievement = (expIndex: number, achIndex: number) => {
    if (!editableResume) return
    setEditableResume((prev) => {
      const updated = { ...prev! }
      updated.experience = [...updated.experience]
      updated.experience[expIndex] = {
        ...updated.experience[expIndex],
        achievements: updated.experience[expIndex].achievements.filter((_, i) => i !== achIndex),
      }
      return updated
    })
  }

  const addEducation = () => {
    if (!editableResume) return
    setEditableResume((prev) => ({
      ...prev!,
      education: [
        ...prev!.education,
        {
          degree: "Degree Name",
          institution: "Institution Name",
          location: "City, State",
          year: "Graduation Year",
        },
      ],
    }))
  }

  const removeEducation = (index: number) => {
    if (!editableResume) return
    setEditableResume((prev) => ({
      ...prev!,
      education: prev!.education.filter((_, i) => i !== index),
    }))
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Resume & Cover Letter Generator</h1>
        <p className="text-gray-600">Paste a job description to get a tailored resume and cover letter in seconds</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the complete job description here..."
            className="min-h-[200px] resize-none"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {jobDescription ? (
                <>
                  <span className="font-medium">{jobDescription.length}</span> characters
                </>
              ) : (
                "Paste a job description to get started"
              )}
            </div>
            <Button
              onClick={handleAnalyzeAndGenerate}
              disabled={!jobDescription.trim() || isAnalyzing}
              size="lg"
              className="min-w-[200px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Resume Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {success && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Resume Success</h3>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {coverLetterError && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Cover Letter Error</h3>
                <p className="text-sm text-red-700">{coverLetterError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {coverLetterSuccess && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Cover Letter Success</h3>
                <p className="text-sm text-green-700">{coverLetterSuccess}</p>
              </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Edit3 className="h-5 w-5" />
                          {isEditingResume ? "Edit Resume" : "Generated Resume"}
                        </CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          {isEditingResume ? (
                            <Button onClick={handleSaveResumeChanges} size="sm" disabled={isDownloadingResume}>
                              <Save className="mr-2 h-4 w-4" />
                              Save Resume
                            </Button>
                          ) : (
                            <Button
                              onClick={handleEditResume}
                              variant="outline"
                              size="sm"
                              disabled={isDownloadingResume}
                            >
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit Resume
                            </Button>
                          )}
                          <Button onClick={handleDownloadResumePDF} size="sm" disabled={isDownloadingResume}>
                            {isDownloadingResume ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="mr-2 h-4 w-4" />
                            )}
                            Download PDF
                          </Button>
                          <Button onClick={handlePrint} size="sm" variant="outline" disabled={isDownloadingResume}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Resume
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 border rounded-lg p-6 max-h-[800px] overflow-y-auto">
                        <div
                          id="resume-preview-content"
                          className={`bg-white shadow-lg w-full max-w-[700px] mx-auto p-8 space-y-6 ${colorScheme === "blue" ? "border-t-4 border-blue-600" : colorScheme === "green" ? "border-t-4 border-green-600" : "border-t-4 border-gray-600"}`}
                        >
                          <div className="text-center border-b-2 border-gray-200 pb-4">
                            {isEditingResume && editableResume ? (
                              <div className="space-y-3">
                                <Input
                                  value={editableResume.personalInfo.name}
                                  onChange={(e) => handleResumeInputChange("name", e.target.value, "personalInfo")}
                                  className="text-2xl font-bold text-center text-gray-800"
                                  placeholder="Your Full Name"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                  <Input
                                    type="email"
                                    value={editableResume.personalInfo.email}
                                    onChange={(e) => handleResumeInputChange("email", e.target.value, "personalInfo")}
                                    placeholder="your.email@example.com"
                                  />
                                  <Input
                                    type="tel"
                                    value={editableResume.personalInfo.phone}
                                    onChange={(e) => handleResumeInputChange("phone", e.target.value, "personalInfo")}
                                    placeholder="(555) 123-4567"
                                  />
                                  <Input
                                    value={editableResume.personalInfo.location}
                                    onChange={(e) =>
                                      handleResumeInputChange("location", e.target.value, "personalInfo")
                                    }
                                    placeholder="City, State"
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                  {generatedResume.personalInfo.name}
                                </h1>
                                <div className="text-sm text-gray-600">
                                  {generatedResume.personalInfo.email} | {generatedResume.personalInfo.phone} |{" "}
                                  {generatedResume.personalInfo.location}
                                </div>
                              </>
                            )}
                          </div>
                          <div>
                            <h2
                              className={`text-lg font-semibold ${colorScheme === "blue" ? "text-blue-800" : colorScheme === "green" ? "text-green-800" : "text-gray-800"} border-b border-gray-300 pb-1 mb-3`}
                            >
                              PROFESSIONAL SUMMARY
                            </h2>
                            {isEditingResume && editableResume ? (
                              <Textarea
                                value={editableResume.summary}
                                onChange={(e) => handleResumeInputChange("summary", e.target.value)}
                                className="min-h-[100px]"
                                placeholder="Write a compelling professional summary..."
                              />
                            ) : (
                              <p className="text-sm text-gray-700 leading-relaxed">{generatedResume.summary}</p>
                            )}
                          </div>
                          <div>
                            <h2
                              className={`text-lg font-semibold ${colorScheme === "blue" ? "text-blue-800" : colorScheme === "green" ? "text-green-800" : "text-gray-800"} border-b border-gray-300 pb-1 mb-3`}
                            >
                              CORE COMPETENCIES
                            </h2>
                            {isEditingResume && editableResume ? (
                              <Textarea
                                value={editableResume.skills.join(", ")}
                                onChange={(e) => handleResumeInputChange("skills", e.target.value)}
                                placeholder="Separate skills with commas (e.g., JavaScript, React, Node.js)"
                                className="min-h-[80px]"
                              />
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {generatedResume.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className={`px-3 py-1 ${colorScheme === "blue" ? "bg-blue-100 text-blue-800" : colorScheme === "green" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"} text-sm rounded border`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h2
                                className={`text-lg font-semibold ${colorScheme === "blue" ? "text-blue-800" : colorScheme === "green" ? "text-green-800" : "text-gray-800"} border-b border-gray-300 pb-1`}
                              >
                                PROFESSIONAL EXPERIENCE
                              </h2>
                              {isEditingResume && (
                                <Button onClick={addExperience} size="sm" variant="outline">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Experience
                                </Button>
                              )}
                            </div>
                            {(isEditingResume && editableResume
                              ? editableResume.experience
                              : generatedResume.experience
                            )?.map((exp, index) => (
                              <div key={index} className="mb-6 relative">
                                {isEditingResume && (
                                  <Button
                                    onClick={() => removeExperience(index)}
                                    size="sm"
                                    variant="ghost"
                                    className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1 h-auto"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                                {isEditingResume && editableResume ? (
                                  <div className="space-y-3 border rounded p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <Input
                                        value={exp.title}
                                        onChange={(e) =>
                                          handleResumeInputChange("title", e.target.value, "experience", index)
                                        }
                                        placeholder="Job Title"
                                        className="font-semibold"
                                      />
                                      <Input
                                        value={exp.duration}
                                        onChange={(e) =>
                                          handleResumeInputChange("duration", e.target.value, "experience", index)
                                        }
                                        placeholder="Start Date - End Date"
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <Input
                                        value={exp.company}
                                        onChange={(e) =>
                                          handleResumeInputChange("company", e.target.value, "experience", index)
                                        }
                                        placeholder="Company Name"
                                      />
                                      <Input
                                        value={exp.location}
                                        onChange={(e) =>
                                          handleResumeInputChange("location", e.target.value, "experience", index)
                                        }
                                        placeholder="City, State"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Key Achievements</label>
                                        <Button
                                          onClick={() => addAchievement(index)}
                                          size="sm"
                                          variant="outline"
                                          className="p-1 h-auto text-xs"
                                        >
                                          <Plus className="h-3 w-3 mr-1" /> Add
                                        </Button>
                                      </div>
                                      {exp.achievements.map((achievement, achIndex) => (
                                        <div key={achIndex} className="flex gap-2 items-start">
                                          <Textarea
                                            value={achievement}
                                            onChange={(e) =>
                                              handleResumeInputChange(
                                                achIndex.toString(),
                                                e.target.value,
                                                "experience",
                                                index,
                                                "achievements",
                                              )
                                            }
                                            className="min-h-[60px] flex-1"
                                            placeholder="Describe a key achievement..."
                                          />
                                          <Button
                                            onClick={() => removeAchievement(index, achIndex)}
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 p-1 h-auto mt-1"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-start mb-1">
                                      <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                                      <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                                        {exp.duration}
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-600 mb-2 italic">
                                      {exp.company} | {exp.location}
                                    </p>
                                    <ul className="text-sm list-disc list-inside space-y-1 text-gray-700">
                                      {exp.achievements.map((achievement, achIndex) => (
                                        <li key={achIndex}>{achievement}</li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h2
                                className={`text-lg font-semibold ${colorScheme === "blue" ? "text-blue-800" : colorScheme === "green" ? "text-green-800" : "text-gray-800"} border-b border-gray-300 pb-1`}
                              >
                                EDUCATION
                              </h2>
                              {isEditingResume && (
                                <Button onClick={addEducation} size="sm" variant="outline">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Education
                                </Button>
                              )}
                            </div>
                            {(isEditingResume && editableResume
                              ? editableResume.education
                              : generatedResume.education
                            )?.map((edu, index) => (
                              <div key={index} className="mb-4 relative">
                                {" "}
                                {/* Added mb-4 for consistency and relative positioning */}
                                {isEditingResume && (
                                  <Button
                                    onClick={() => removeEducation(index)}
                                    size="sm"
                                    variant="ghost"
                                    className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1 h-auto z-10" // Added z-10
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                                {isEditingResume && editableResume ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded p-4 bg-gray-50 pt-8">
                                    {" "}
                                    {/* Added pt-8 for space for delete button */}
                                    <Input
                                      value={edu.degree}
                                      onChange={(e) =>
                                        handleResumeInputChange("degree", e.target.value, "education", index)
                                      }
                                      placeholder="Degree Name"
                                      className="font-semibold"
                                    />
                                    <Input
                                      value={edu.year}
                                      onChange={(e) =>
                                        handleResumeInputChange("year", e.target.value, "education", index)
                                      }
                                      placeholder="Graduation Year"
                                    />
                                    <Input
                                      value={edu.institution}
                                      onChange={(e) =>
                                        handleResumeInputChange("institution", e.target.value, "education", index)
                                      }
                                      placeholder="Institution Name"
                                    />
                                    <Input
                                      value={edu.location}
                                      onChange={(e) =>
                                        handleResumeInputChange("location", e.target.value, "education", index)
                                      }
                                      placeholder="City, State"
                                    />
                                  </div>
                                ) : (
                                  <div className="mb-3">
                                    {" "}
                                    {/* Keep original mb-3 for non-editing display */}
                                    <div className="flex justify-between items-start">
                                      <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                                      <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{edu.year}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">
                                      {edu.institution} | {edu.location}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Customize Resume
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Template</label>
                        <Select value={resumeTemplate} onValueChange={setResumeTemplate} disabled={isDownloadingResume}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="executive">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Color Scheme</label>
                        <Select value={colorScheme} onValueChange={setColorScheme} disabled={isDownloadingResume}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="gray">Gray</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Quick Actions</h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={handleEditResume}
                            disabled={isEditingResume || isDownloadingResume}
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Content
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={handleSaveResumeChanges}
                            disabled={!isEditingResume || isDownloadingResume}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={handleDownloadResumePDF}
                            disabled={isDownloadingResume}
                          >
                            {isDownloadingResume ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="mr-2 h-4 w-4" />
                            )}
                            Download PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={handlePrint}
                            disabled={isDownloadingResume}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Print Resume
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Pro Tips</h3>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>Use action verbs</li>
                          <li>Quantify achievements</li>
                          <li>Tailor skills</li>
                          <li>Keep it concise</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cover-letter">
            {!generatedCoverLetter && jobAnalysisData && generatedResume && (
              <Card className="mb-6">
                <CardContent className="pt-6 text-center">
                  <p className="mb-4 text-gray-600">Your tailored resume is ready. Generate a cover letter to match?</p>
                  <Button
                    onClick={handleGenerateCoverLetter}
                    disabled={isGeneratingCoverLetter || !jobAnalysisData || !generatedResume}
                    size="lg"
                  >
                    {isGeneratingCoverLetter ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Cover Letter...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Generate Cover Letter
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {generatedCoverLetter && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      {isEditingCoverLetter ? "Edit Cover Letter" : "Generated Cover Letter"}
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      {isEditingCoverLetter ? (
                        <Button onClick={handleSaveCoverLetterChanges} size="sm" disabled={isDownloadingCoverLetter}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Cover Letter
                        </Button>
                      ) : (
                        <Button
                          onClick={handleEditCoverLetter}
                          variant="outline"
                          size="sm"
                          disabled={isDownloadingCoverLetter}
                        >
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Cover Letter
                        </Button>
                      )}
                      <Button
                        onClick={handleCopyCoverLetter}
                        variant="outline"
                        size="sm"
                        disabled={isDownloadingCoverLetter}
                      >
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        Copy Text
                      </Button>
                      <Button
                        onClick={handleDownloadCoverLetterPDF}
                        variant="outline"
                        size="sm"
                        disabled={isDownloadingCoverLetter}
                      >
                        {isDownloadingCoverLetter ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingCoverLetter && editableCoverLetter !== null ? (
                    <Textarea
                      value={editableCoverLetter}
                      onChange={(e) => handleCoverLetterInputChange(e.target.value)}
                      className="min-h-[400px] w-full border rounded p-4 text-sm leading-relaxed font-serif"
                      placeholder="Your cover letter content..."
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none border rounded p-6 bg-white min-h-[400px] whitespace-pre-wrap font-serif leading-relaxed">
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
