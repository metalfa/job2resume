"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobDescriptionForm } from "@/components/job-description-form"
import { ResumeUpload } from "@/components/resume-upload"
import { ResumeTemplates } from "@/components/resume-templates"
import { GenerateButton } from "@/components/generate-button"
import { Button } from "@/components/ui/button"
import { Download, AlertCircle } from "lucide-react"
import { generateTailoredResume, extractResumeContent, type JobAnalysis, type ResumeData } from "@/lib/resume-ai"
import { downloadResumeAsPDF, type TailoredResume } from "@/lib/pdf-generator"

export default function DashboardPage() {
  const [jobDescriptionComplete, setJobDescriptionComplete] = useState(false)
  const [resumeComplete, setResumeComplete] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<TailoredResume | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!jobAnalysis || !resumeData) {
      setError("Please complete both job description analysis and resume selection")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Extract content from uploaded file if needed
      if (resumeData.type === "upload" && resumeData.file && !resumeData.content) {
        const extractedContent = await extractResumeContent(resumeData.file as File)
        resumeData.content = extractedContent
      }

      // Generate tailored resume using AI (or mock data if no API key)
      const tailoredResume = await generateTailoredResume(jobAnalysis, resumeData)
      setGeneratedResume(tailoredResume)
    } catch (error) {
      console.error("Error generating resume:", error)
      setError("Failed to generate tailored resume. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedResume) {
      downloadResumeAsPDF(generatedResume)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Create Your Tailored Resume</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Paste Job Description</h2>
            <JobDescriptionForm
              onAnalysisComplete={(analysis) => {
                setJobDescriptionComplete(true)
                setJobAnalysis({
                  requiredSkills: analysis.requiredSkills || [],
                  preferredSkills: analysis.preferredSkills || [],
                  jobTitle: analysis.jobTitle || "",
                  companyName: analysis.companyName || "",
                  keyResponsibilities: analysis.keyResponsibilities || [],
                })
              }}
            />
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Your Resume</h2>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                <TabsTrigger value="template">Use Template</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-0">
                <ResumeUpload
                  onComplete={(file) => {
                    setResumeComplete(true)
                    setResumeData({ type: "upload", file })
                  }}
                />
              </TabsContent>
              <TabsContent value="template" className="mt-0">
                <ResumeTemplates
                  onComplete={(template) => {
                    setResumeComplete(true)
                    setResumeData({ type: "template", data: template.data, templateId: template.id })
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6 mt-8">
            {!generatedResume ? (
              <div className="flex justify-center">
                <GenerateButton
                  disabled={!jobDescriptionComplete || !resumeComplete}
                  onClick={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Tailored Resume</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setGeneratedResume(null)}>
                      Generate New
                    </Button>
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download HTML
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                  <div className="bg-white shadow-md w-full max-w-[700px] mx-auto p-8">
                    <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
                      <h1 className="text-2xl font-bold text-blue-800 mb-2">{generatedResume.personalInfo.name}</h1>
                      <div className="text-sm text-gray-600">
                        {generatedResume.personalInfo.email} | {generatedResume.personalInfo.phone} |{" "}
                        {generatedResume.personalInfo.location}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-300 pb-1 mb-3">
                        PROFESSIONAL SUMMARY
                      </h2>
                      <p className="text-sm italic text-gray-700 leading-relaxed">{generatedResume.summary}</p>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-300 pb-1 mb-3">SKILLS</h2>
                      <div className="flex flex-wrap gap-2">
                        {generatedResume.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-sm rounded border">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-300 pb-1 mb-3">
                        EXPERIENCE
                      </h2>
                      {generatedResume.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold">{exp.title}</h3>
                            <span className="text-sm text-gray-600">{exp.duration}</span>
                          </div>
                          <p className="text-sm italic text-gray-600 mb-2">
                            {exp.company} | {exp.location}
                          </p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-300 pb-1 mb-3">
                        EDUCATION
                      </h2>
                      {generatedResume.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <span className="text-sm text-gray-600">{edu.year}</span>
                          </div>
                          <p className="text-sm italic text-gray-600">
                            {edu.institution} | {edu.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full ${jobDescriptionComplete ? "bg-primary text-white" : "bg-gray-200 text-gray-500"} flex items-center justify-center text-sm font-medium`}
              >
                1
              </div>
              <div>
                <p className={`font-medium ${jobDescriptionComplete ? "" : "text-gray-500"}`}>Job Description</p>
                <p className="text-sm text-gray-500">Paste the job description</p>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-gray-200 ml-4"></div>
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full ${resumeComplete ? "bg-primary text-white" : "bg-gray-200 text-gray-500"} flex items-center justify-center text-sm font-medium`}
              >
                2
              </div>
              <div>
                <p className={`font-medium ${resumeComplete ? "" : "text-gray-500"}`}>Resume</p>
                <p className="text-sm text-gray-500">Upload or create your resume</p>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-gray-200 ml-4"></div>
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full ${generatedResume ? "bg-primary text-white" : "bg-gray-200 text-gray-500"} flex items-center justify-center text-sm font-medium`}
              >
                3
              </div>
              <div>
                <p className={`font-medium ${generatedResume ? "" : "text-gray-500"}`}>Generate</p>
                <p className="text-sm text-gray-500">Create tailored documents</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-gray-500 mb-4">Watch our quick tutorial on how to get the best results.</p>
            <button className="text-sm text-primary font-medium hover:underline">Watch Tutorial</button>
          </div>
        </div>
      </div>
    </div>
  )
}
