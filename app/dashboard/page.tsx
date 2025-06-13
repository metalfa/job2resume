"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InlineEditor } from "@/components/inline-editor"
import { useResumeBuilder } from "@/hooks/use-resume-builder"
import { downloadResumeAsPDF, printResume } from "@/lib/resume-export"
import { Loader2, Download, Printer, Sparkles, Plus, Trash2, FileText, Zap, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const {
    resumeData,
    isGenerating,
    isEnhancing,
    updateContactInfo,
    updateProfessionalSummary,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    updateCertifications,
    updateAwards,
    generateCompleteResume,
    enhanceSection,
  } = useResumeBuilder()

  const [jobDescription, setJobDescription] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleGenerateResume = async () => {
    if (!jobDescription.trim()) return

    setError(null)
    try {
      await generateCompleteResume(jobDescription)
    } catch (error) {
      console.error("Resume generation error:", error)
      if (error instanceof Error) {
        if (error.message.includes("OpenAI API key")) {
          setError("OpenAI API key is missing. Please check your environment variables.")
        } else {
          setError("Failed to generate resume. Please try again.")
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    }
  }

  const handleEnhanceSection = async (
    sectionType: string,
    currentContent: string,
    updateFunction: (content: string) => void,
  ) => {
    setError(null)
    try {
      const enhanced = await enhanceSection(sectionType, currentContent)
      updateFunction(enhanced)
    } catch (error) {
      console.error("Section enhancement error:", error)
      if (error instanceof Error && error.message.includes("OpenAI API key")) {
        setError("OpenAI API key is missing. Please check your environment variables.")
      } else {
        setError("Failed to enhance section. Please try again.")
      }
    }
  }

  const handleDownload = () => {
    downloadResumeAsPDF(resumeData)
  }

  const handleSkillsChange = (skillsText: string) => {
    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
    updateSkills(skills)
  }

  const handleCertificationsChange = (certsText: string) => {
    const certifications = certsText
      .split("\n")
      .map((cert) => cert.trim())
      .filter(Boolean)
    updateCertifications(certifications)
  }

  const handleAwardsChange = (awardsText: string) => {
    const awards = awardsText
      .split("\n")
      .map((award) => award.trim())
      .filter(Boolean)
    updateAwards(awards)
  }

  const isResumeEmpty =
    !resumeData.contactInfo.fullName && !resumeData.professionalSummary && resumeData.workExperience.length === 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">AI Resume Builder</h1>
        {!isResumeEmpty && (
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download HTML
            </Button>
            <Button onClick={printResume} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print/PDF
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Job Description Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Step 1: Generate Perfect Resume with AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder="Paste the complete job description here. Our AI will analyze it and generate a perfect, tailored resume for you..."
                  className="min-h-[150px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <Button
                onClick={handleGenerateResume}
                disabled={!jobDescription.trim() || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Perfect Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Perfect Resume with AI
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 text-center">
                AI will create a complete, professional resume optimized for this specific job
              </p>
            </CardContent>
          </Card>

          {/* Manual Resume Builder Fallback */}
          {error && error.includes("OpenAI API key") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  Create Resume Manually
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  AI generation is currently unavailable. You can still create your resume manually using the form
                  below.
                </p>
                <Button
                  onClick={() => {
                    // Initialize an empty resume structure
                    updateContactInfo("fullName", "Your Name")
                    updateProfessionalSummary("Your professional summary")
                    addWorkExperience()
                    addEducation()
                    updateSkills(["Skill 1", "Skill 2", "Skill 3"])
                  }}
                  variant="outline"
                >
                  Start Manual Resume
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Generated Resume - Editable */}
          {!isResumeEmpty && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Step 2: Edit Your Resume
                </CardTitle>
                <p className="text-sm text-gray-500">Click on any section to edit.</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <InlineEditor
                        value={resumeData.contactInfo.fullName}
                        onSave={(value) => updateContactInfo("fullName", value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <InlineEditor
                        value={resumeData.contactInfo.email}
                        onSave={(value) => updateContactInfo("email", value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <InlineEditor
                        value={resumeData.contactInfo.phone}
                        onSave={(value) => updateContactInfo("phone", value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <InlineEditor
                        value={resumeData.contactInfo.location}
                        onSave={(value) => updateContactInfo("location", value)}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                      <InlineEditor
                        value={resumeData.contactInfo.linkedin}
                        onSave={(value) => updateContactInfo("linkedin", value)}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Professional Summary</h3>
                  <InlineEditor
                    value={resumeData.professionalSummary}
                    onSave={updateProfessionalSummary}
                    multiline
                    placeholder="Write a compelling professional summary..."
                  />
                </div>

                {/* Work Experience */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">Work Experience</h3>
                    <Button onClick={addWorkExperience} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Position
                    </Button>
                  </div>

                  {resumeData.workExperience.map((exp, index) => (
                    <Card key={exp.id} className="p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Position {index + 1}</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeWorkExperience(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Job Title</label>
                          <InlineEditor
                            value={exp.jobTitle}
                            onSave={(value) => updateWorkExperience(exp.id, "jobTitle", value)}
                            placeholder="Job title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Company</label>
                          <InlineEditor
                            value={exp.company}
                            onSave={(value) => updateWorkExperience(exp.id, "company", value)}
                            placeholder="Company name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Location</label>
                          <InlineEditor
                            value={exp.location}
                            onSave={(value) => updateWorkExperience(exp.id, "location", value)}
                            placeholder="City, State"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Duration</label>
                          <div className="flex gap-2">
                            <InlineEditor
                              value={exp.startDate}
                              onSave={(value) => updateWorkExperience(exp.id, "startDate", value)}
                              placeholder="Start date"
                              className="flex-1"
                            />
                            <span className="self-center">to</span>
                            <InlineEditor
                              value={exp.isCurrentRole ? "Present" : exp.endDate}
                              onSave={(value) => {
                                updateWorkExperience(exp.id, "endDate", value)
                                updateWorkExperience(exp.id, "isCurrentRole", value === "Present")
                              }}
                              placeholder="End date"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Responsibilities & Achievements</label>
                        <InlineEditor
                          value={exp.responsibilities.join("\n")}
                          onSave={(value) => {
                            const responsibilities = value.split("\n").filter(Boolean)
                            updateWorkExperience(exp.id, "responsibilities", responsibilities)
                          }}
                          multiline
                          placeholder="• Responsibility 1&#10;• Achievement 2&#10;• Impact 3"
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Skills</h3>
                  <InlineEditor
                    value={resumeData.skills.join(", ")}
                    onSave={handleSkillsChange}
                    multiline
                    placeholder="JavaScript, React, Node.js, Project Management..."
                  />
                  {resumeData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">Education</h3>
                    <Button onClick={addEducation} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>

                  {resumeData.education.map((edu, index) => (
                    <Card key={edu.id} className="p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Education {index + 1}</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Degree</label>
                          <InlineEditor
                            value={edu.degree}
                            onSave={(value) => updateEducation(edu.id, "degree", value)}
                            placeholder="Bachelor of Science"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Major</label>
                          <InlineEditor
                            value={edu.major}
                            onSave={(value) => updateEducation(edu.id, "major", value)}
                            placeholder="Computer Science"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Institution</label>
                          <InlineEditor
                            value={edu.institution}
                            onSave={(value) => updateEducation(edu.id, "institution", value)}
                            placeholder="University Name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Graduation Date</label>
                          <InlineEditor
                            value={edu.graduationDate}
                            onSave={(value) => updateEducation(edu.id, "graduationDate", value)}
                            placeholder="May 2020"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Certifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Certifications</h3>
                  <InlineEditor
                    value={resumeData.certifications.join("\n")}
                    onSave={handleCertificationsChange}
                    multiline
                    placeholder="AWS Certified Solutions Architect&#10;Google Professional Cloud Developer"
                  />
                </div>

                {/* Awards */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Awards & Recognition</h3>
                  <InlineEditor
                    value={resumeData.awards.join("\n")}
                    onSave={handleAwardsChange}
                    multiline
                    placeholder="Employee of the Year 2023&#10;Innovation Award Winner"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Paste Job Description</p>
                  <p className="text-sm text-gray-500">AI analyzes requirements and generates perfect resume</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Edit Inline</p>
                  <p className="text-sm text-gray-500">Click any section to edit, use AI to enhance content</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Download</p>
                  <p className="text-sm text-gray-500">Export as HTML or print to PDF</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ATS Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Keyword optimized
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Standard formatting
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Chronological structure
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Quantified achievements
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Clean, readable design
                </li>
              </ul>
            </CardContent>
          </Card>

          {isEnhancing && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is enhancing your content...</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
