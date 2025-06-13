"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobDescriptionForm } from "@/components/job-description-form"
import { ResumeUpload } from "@/components/resume-upload"
import { ResumeTemplates } from "@/components/resume-templates"
import { GenerateButton } from "@/components/generate-button"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const handleDownload = () => {
  // In a real application, this would generate and download a PDF
  // For now, we'll simulate a download with a timeout
  const link = document.createElement("a")
  link.href = "/placeholder.svg" // This would be the actual PDF URL
  link.download = "tailored-resume.pdf"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function DashboardPage() {
  const [jobDescriptionComplete, setJobDescriptionComplete] = useState(false)
  const [resumeComplete, setResumeComplete] = useState(false)
  const [resumeData, setResumeData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeGenerated, setResumeGenerated] = useState(false)

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
                    setResumeData({ type: "template", ...template })
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6 mt-8">
            {!resumeGenerated ? (
              <div className="flex justify-center">
                <GenerateButton
                  disabled={!jobDescriptionComplete || !resumeComplete}
                  onClick={async () => {
                    setIsGenerating(true)

                    // Simulate generating a tailored resume
                    await new Promise((resolve) => setTimeout(resolve, 2000))

                    setResumeGenerated(true)
                    setIsGenerating(false)
                  }}
                  isGenerating={isGenerating}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Tailored Resume</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setResumeGenerated(false)}>
                      Edit
                    </Button>
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 border rounded-lg p-6 min-h-[400px]">
                  <div className="bg-white shadow-md w-full max-w-[600px] h-[800px] border mx-auto">
                    <div className="p-8">
                      <h1 className="text-2xl font-bold mb-1">John Doe</h1>
                      <p className="text-gray-600 mb-4">Frontend Developer</p>
                      <div className="flex text-sm text-gray-600 mb-6 gap-4">
                        <span>john@example.com</span>
                        <span>(123) 456-7890</span>
                        <span>New York, NY</span>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Professional Summary</h2>
                        <p className="text-sm">
                          Experienced Frontend Developer with 5+ years of expertise in building responsive web
                          applications using React, TypeScript, and modern CSS frameworks. Passionate about creating
                          intuitive user interfaces and optimizing web performance.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h2>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">Senior Frontend Developer</h3>
                            <span className="text-sm text-gray-600">2020 - Present</span>
                          </div>
                          <p className="text-sm font-medium mb-1">Tech Solutions Inc.</p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            <li>
                              Led the development of the company's flagship web application using React and TypeScript
                            </li>
                            <li>Improved application performance by 40% through code optimization and lazy loading</li>
                            <li>Collaborated with UX designers to implement responsive designs and animations</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-sm rounded">React</span>
                          <span className="px-2 py-1 bg-gray-100 text-sm rounded">TypeScript</span>
                          <span className="px-2 py-1 bg-gray-100 text-sm rounded">JavaScript</span>
                          <span className="px-2 py-1 bg-gray-100 text-sm rounded">HTML5</span>
                          <span className="px-2 py-1 bg-gray-100 text-sm rounded">CSS3</span>
                          <span className="px-2 py-1 bg-gray-100 text-sm rounded">Tailwind CSS</span>
                        </div>
                      </div>
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
              <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-gray-500">Generate</p>
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
