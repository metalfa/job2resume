"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2, Edit3, Save, Plus, Trash2 } from "lucide-react"
import type { JobAnalysis } from "@/lib/resume-ai"

interface PerfectResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  summary: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    location: string
    duration: string
    achievements: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    location: string
    year: string
  }>
}

interface PerfectResumeGeneratorProps {
  jobAnalysis: JobAnalysis | null
  onComplete?: (resumeData: PerfectResumeData) => void
}

export function PerfectResumeGenerator({ jobAnalysis, onComplete }: PerfectResumeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<PerfectResumeData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableResume, setEditableResume] = useState<PerfectResumeData | null>(null)

  const generatePerfectResume = async () => {
    if (!jobAnalysis) return

    setIsGenerating(true)

    // Simulate AI generation with realistic data based on job analysis
    setTimeout(() => {
      const perfectResume: PerfectResumeData = {
        personalInfo: {
          name: "Alex Johnson",
          email: "alex.johnson@email.com",
          phone: "(555) 123-4567",
          location: "San Francisco, CA",
        },
        summary: `Highly skilled ${jobAnalysis.jobTitle.toLowerCase()} with 5+ years of experience in ${jobAnalysis.requiredSkills.slice(0, 3).join(", ")}. Proven track record of delivering exceptional results at ${jobAnalysis.companyName || "leading technology companies"}. Expertise in ${jobAnalysis.preferredSkills.slice(0, 2).join(" and ")} with a passion for innovation and continuous learning.`,
        skills: [...jobAnalysis.requiredSkills, ...jobAnalysis.preferredSkills].slice(0, 12),
        experience: [
          {
            title: `Senior ${jobAnalysis.jobTitle}`,
            company: "TechCorp Solutions",
            location: "San Francisco, CA",
            duration: "2021 - Present",
            achievements: [
              `Led ${jobAnalysis.keyResponsibilities?.[0]?.toLowerCase() || "key projects"} resulting in 40% performance improvement`,
              `Implemented ${jobAnalysis.requiredSkills[0]} solutions serving 100k+ users`,
              `Mentored team of 5 developers in ${jobAnalysis.requiredSkills.slice(1, 3).join(" and ")}`,
              `Collaborated with stakeholders to deliver projects 20% ahead of schedule`,
            ],
          },
          {
            title: jobAnalysis.jobTitle,
            company: "Innovation Labs",
            location: "San Francisco, CA",
            duration: "2019 - 2021",
            achievements: [
              `Developed applications using ${jobAnalysis.requiredSkills.slice(0, 2).join(" and ")}`,
              `Improved system efficiency by 35% through optimization`,
              `Participated in agile development and code review processes`,
              `Contributed to open-source projects in ${jobAnalysis.preferredSkills[0] || "relevant technologies"}`,
            ],
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "Stanford University",
            location: "Stanford, CA",
            year: "2019",
          },
        ],
      }

      setGeneratedResume(perfectResume)
      setEditableResume(perfectResume)
      setIsGenerating(false)
    }, 2000)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    setGeneratedResume(editableResume)
    if (onComplete && editableResume) {
      onComplete(editableResume)
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
          duration: "Start - End",
          achievements: ["Achievement 1", "Achievement 2"],
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

  useEffect(() => {
    if (generatedResume && onComplete) {
      onComplete(generatedResume)
    }
  }, [generatedResume, onComplete])

  if (!jobAnalysis) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Please complete the job description analysis first to generate a perfect resume.
        </p>
      </div>
    )
  }

  if (!generatedResume) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="max-w-md mx-auto">
          <Wand2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Generate Perfect Resume</h3>
          <p className="text-gray-600 mb-6">
            Create an ideal resume tailored specifically for the <strong>{jobAnalysis.jobTitle}</strong> position at{" "}
            <strong>{jobAnalysis.companyName}</strong>. This will generate a hypothetical resume optimized for the job
            requirements.
          </p>
          <Button onClick={generatePerfectResume} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Perfect Resume...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Perfect Resume
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Perfect Resume Generated</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <Button onClick={handleSave} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Resume
            </Button>
          )}
        </div>
      </div>

      <div className="bg-gray-50 border rounded-lg p-6 max-h-[600px] overflow-y-auto">
        <div className="bg-white shadow-md w-full max-w-[700px] mx-auto p-8 space-y-6">
          {/* Personal Info */}
          <div className="text-center border-b-2 border-blue-600 pb-4">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editableResume?.personalInfo.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value, "personalInfo")}
                  className="text-2xl font-bold text-blue-800 text-center w-full border rounded px-2 py-1"
                />
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <input
                    type="email"
                    value={editableResume?.personalInfo.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value, "personalInfo")}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="tel"
                    value={editableResume?.personalInfo.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value, "personalInfo")}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    value={editableResume?.personalInfo.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value, "personalInfo")}
                    className="border rounded px-2 py-1"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-blue-800 mb-2">{generatedResume.personalInfo.name}</h1>
                <div className="text-sm text-gray-600">
                  {generatedResume.personalInfo.email} | {generatedResume.personalInfo.phone} |{" "}
                  {generatedResume.personalInfo.location}
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-300 pb-1 mb-3">
              PROFESSIONAL SUMMARY
            </h2>
            {isEditing ? (
              <Textarea
                value={editableResume?.summary || ""}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-sm italic text-gray-700 leading-relaxed">{generatedResume.summary}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-300 pb-1 mb-3">SKILLS</h2>
            {isEditing ? (
              <Textarea
                value={editableResume?.skills.join(", ") || ""}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                placeholder="Separate skills with commas"
                className="min-h-[80px]"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {generatedResume.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-sm rounded border">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-300 pb-1">EXPERIENCE</h2>
              {isEditing && (
                <Button onClick={addExperience} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            {(isEditing ? editableResume?.experience : generatedResume.experience)?.map((exp, index) => (
              <div key={index} className="mb-4 relative">
                {isEditing && (
                  <Button
                    onClick={() => removeExperience(index)}
                    size="sm"
                    variant="ghost"
                    className="absolute top-0 right-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {isEditing ? (
                  <div className="space-y-2 border rounded p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleInputChange("title", e.target.value, "experience", index)}
                        className="font-semibold border rounded px-2 py-1"
                        placeholder="Job Title"
                      />
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value, "experience", index)}
                        className="text-sm border rounded px-2 py-1"
                        placeholder="Duration"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleInputChange("company", e.target.value, "experience", index)}
                        className="border rounded px-2 py-1"
                        placeholder="Company"
                      />
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleInputChange("location", e.target.value, "experience", index)}
                        className="border rounded px-2 py-1"
                        placeholder="Location"
                      />
                    </div>
                    <div className="space-y-1">
                      {exp.achievements.map((achievement, achIndex) => (
                        <Textarea
                          key={achIndex}
                          value={achievement}
                          onChange={(e) =>
                            handleInputChange(achIndex.toString(), e.target.value, "experience", index, "achievements")
                          }
                          className="min-h-[60px]"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>
            {(isEditing ? editableResume?.education : generatedResume.education)?.map((edu, index) => (
              <div key={index} className="mb-2">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2 border rounded p-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleInputChange("degree", e.target.value, "education", index)}
                      className="font-semibold border rounded px-2 py-1"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => handleInputChange("year", e.target.value, "education", index)}
                      className="border rounded px-2 py-1"
                      placeholder="Year"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleInputChange("institution", e.target.value, "education", index)}
                      className="border rounded px-2 py-1"
                      placeholder="Institution"
                    />
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => handleInputChange("location", e.target.value, "education", index)}
                      className="border rounded px-2 py-1"
                      placeholder="Location"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <span className="text-sm text-gray-600">{edu.year}</span>
                    </div>
                    <p className="text-sm italic text-gray-600">
                      {edu.institution} | {edu.location}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
