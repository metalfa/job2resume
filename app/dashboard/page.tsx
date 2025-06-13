"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"
import { analyzeJobDescriptionAction, generateResumeAction } from "@/app/actions/resume-actions"
import { downloadResumeAsPDF, type TailoredResume } from "@/lib/pdf-generator"

export default function DashboardPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<TailoredResume | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableResume, setEditableResume] = useState<TailoredResume | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resumeTemplate, setResumeTemplate] = useState("professional")
  const [colorScheme, setColorScheme] = useState("blue")

  const handleAnalyzeAndGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setSuccess(null)

    try {
      // Step 1: Analyze job description using server action
      const analysisResult = await analyzeJobDescriptionAction(jobDescription)

      if (analysisResult.error) {
        setError(analysisResult.error)
        return
      }

      if (!analysisResult.success || !analysisResult.data) {
        setError("Failed to analyze job description")
        return
      }

      // Step 2: Generate tailored resume using server action
      const resumeResult = await generateResumeAction(analysisResult.data)

      if (resumeResult.error) {
        setError(resumeResult.error)
        return
      }

      if (!resumeResult.success || !resumeResult.data) {
        setError("Failed to generate resume")
        return
      }

      setGeneratedResume(resumeResult.data)
      setEditableResume(resumeResult.data)
      setSuccess("Resume generated successfully! You can now edit and customize it.")
    } catch (error) {
      console.error("Error generating resume:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSuccess(null)
  }

  const handleSaveChanges = () => {
    if (editableResume) {
      setGeneratedResume(editableResume)
      setIsEditing(false)
      setSuccess("Changes saved successfully!")
    }
  }

  const handleDownload = () => {
    if (generatedResume) {
      downloadResumeAsPDF(generatedResume, resumeTemplate, colorScheme)
      setSuccess("Resume downloaded successfully!")
    }
  }

  const handleInputChange = (field: string, value: string, section?: string, index?: number, subField?: string) => {
    if (!editableResume) return

    setEditableResume((prev) => {
      if (!prev) return prev

      const updated = { ...prev }

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Resume Generator</h1>
        <p className="text-gray-600">Paste a job description and get a tailored resume in seconds</p>
      </div>

      {/* Job Description Input */}
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
                  Generating Resume...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Analyze & Generate Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
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
                <h3 className="font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Resume */}
      {generatedResume && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Resume Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    {isEditing ? "Edit Resume" : "Generated Resume"}
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <Button onClick={handleSaveChanges} size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    ) : (
                      <Button onClick={handleEdit} variant="outline" size="sm">
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Resume
                      </Button>
                    )}
                    <Button onClick={handleDownload} size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border rounded-lg p-6 max-h-[800px] overflow-y-auto">
                  <div
                    className={`bg-white shadow-lg w-full max-w-[700px] mx-auto p-8 space-y-6 ${colorScheme === "blue" ? "border-t-4 border-blue-600" : colorScheme === "green" ? "border-t-4 border-green-600" : "border-t-4 border-gray-600"}`}
                  >
                    {/* Personal Info */}
                    <div className="text-center border-b-2 border-gray-200 pb-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Input
                            value={editableResume?.personalInfo.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value, "personalInfo")}
                            className="text-2xl font-bold text-center text-gray-800"
                            placeholder="Your Full Name"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <Input
                              type="email"
                              value={editableResume?.personalInfo.email || ""}
                              onChange={(e) => handleInputChange("email", e.target.value, "personalInfo")}
                              placeholder="your.email@example.com"
                            />
                            <Input
                              type="tel"
                              value={editableResume?.personalInfo.phone || ""}
                              onChange={(e) => handleInputChange("phone", e.target.value, "personalInfo")}
                              placeholder="(555) 123-4567"
                            />
                            <Input
                              value={editableResume?.personalInfo.location || ""}
                              onChange={(e) => handleInputChange("location", e.target.value, "personalInfo")}
                              placeholder="City, State"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h1 className="text-2xl font-bold text-gray-800 mb-2">{generatedResume.personalInfo.name}</h1>
                          <div className="text-sm text-gray-600">
                            {generatedResume.personalInfo.email} | {generatedResume.personalInfo.phone} |{" "}
                            {generatedResume.personalInfo.location}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Professional Summary */}
                    <div>
                      <h2
                        className={`text-lg font-semibold ${colorScheme === "blue" ? "text-blue-800" : colorScheme === "green" ? "text-green-800" : "text-gray-800"} border-b border-gray-300 pb-1 mb-3`}
                      >
                        PROFESSIONAL SUMMARY
                      </h2>
                      {isEditing ? (
                        <Textarea
                          value={editableResume?.summary || ""}
                          onChange={(e) => handleInputChange("summary", e.target.value)}
                          className="min-h-[100px]"
                          placeholder="Write a compelling professional summary..."
                        />
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">{generatedResume.summary}</p>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <h2
                        className={`text-lg font-semibold ${colorScheme === "blue" ? "text-blue-800" : colorScheme === "green" ? "text-green-800" : "text-gray-800"} border-b border-gray-300 pb-1 mb-3`}
                      >
                        CORE COMPETENCIES
                      </h2>
                      {isEditing ? (
                        <Textarea
                          value={editableResume?.skills.join(", ") || ""}
                          onChange={(e) => handleInputChange("skills", e.target.value)}
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

                    {/* Experience */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2
                          className={`text-lg font-semibold ${colorScheme === "blue" ? "text-blue-800" : colorScheme === "green" ? "text-green-800" : "text-gray-800"} border-b border-gray-300 pb-1`}
                        >
                          PROFESSIONAL EXPERIENCE
                        </h2>
                        {isEditing && (
                          <Button onClick={addExperience} size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Experience
                          </Button>
                        )}
                      </div>

                      {(isEditing ? editableResume?.experience : generatedResume.experience)?.map((exp, index) => (
                        <div key={index} className="mb-6 relative">
                          {isEditing && (
                            <Button
                              onClick={() => removeExperience(index)}
                              size="sm"
                              variant="ghost"
                              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}

                          {isEditing ? (
                            <div className="space-y-3 border rounded p-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                  value={exp.title}
                                  onChange={(e) => handleInputChange("title", e.target.value, "experience", index)}
                                  placeholder="Job Title"
                                  className="font-semibold"
                                />
                                <Input
                                  value={exp.duration}
                                  onChange={(e) => handleInputChange("duration", e.target.value, "experience", index)}
                                  placeholder="Start Date - End Date"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                  value={exp.company}
                                  onChange={(e) => handleInputChange("company", e.target.value, "experience", index)}
                                  placeholder="Company Name"
                                />
                                <Input
                                  value={exp.location}
                                  onChange={(e) => handleInputChange("location", e.target.value, "experience", index)}
                                  placeholder="City, State"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium">Key Achievements</label>
                                  <Button onClick={() => addAchievement(index)} size="sm" variant="outline">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                  </Button>
                                </div>
                                {exp.achievements.map((achievement, achIndex) => (
                                  <div key={achIndex} className="flex gap-2">
                                    <Textarea
                                      value={achievement}
                                      onChange={(e) =>
                                        handleInputChange(
                                          achIndex.toString(),
                                          e.target.value,
                                          "experience",
                                          index,
                                          "achievements",
                                        )
                                      }
                                      className="min-h-[60px] flex-1"
                                      placeholder="Describe a key achievement or responsibility..."
                                    />
                                    <Button
                                      onClick={() => removeAchievement(index, achIndex)}
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-500 hover:text-red-700 self-start mt-2"
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
                                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{exp.duration}</span>
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

                    {/* Education */}
                    <div>
                      <h2
                        className={`text-lg font-semibold ${colorScheme === "blue" ? "text-blue-800" : colorScheme === "green" ? "text-green-800" : "text-gray-800"} border-b border-gray-300 pb-1 mb-3`}
                      >
                        EDUCATION
                      </h2>
                      {(isEditing ? editableResume?.education : generatedResume.education)?.map((edu, index) => (
                        <div key={index} className="mb-3">
                          {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded p-3 bg-gray-50">
                              <Input
                                value={edu.degree}
                                onChange={(e) => handleInputChange("degree", e.target.value, "education", index)}
                                placeholder="Degree Name"
                                className="font-semibold"
                              />
                              <Input
                                value={edu.year}
                                onChange={(e) => handleInputChange("year", e.target.value, "education", index)}
                                placeholder="Graduation Year"
                              />
                              <Input
                                value={edu.institution}
                                onChange={(e) => handleInputChange("institution", e.target.value, "education", index)}
                                placeholder="Institution Name"
                              />
                              <Input
                                value={edu.location}
                                onChange={(e) => handleInputChange("location", e.target.value, "education", index)}
                                placeholder="City, State"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{edu.year}</span>
                              </div>
                              <p className="text-sm text-gray-600 italic">
                                {edu.institution} | {edu.location}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customization Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Customize
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Template</label>
                  <Select value={resumeTemplate} onValueChange={setResumeTemplate}>
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

                {/* Color Scheme */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Color Scheme</label>
                  <Select value={colorScheme} onValueChange={setColorScheme}>
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

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleEdit}
                      disabled={isEditing}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Content
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleSaveChanges}
                      disabled={!isEditing}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                {/* Tips */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Pro Tips</h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Use action verbs to start bullet points</li>
                    <li>• Include quantifiable achievements</li>
                    <li>• Tailor skills to match job requirements</li>
                    <li>• Keep descriptions concise and impactful</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
