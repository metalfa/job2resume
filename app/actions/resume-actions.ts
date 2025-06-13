"use server"

import { analyzeJobDescription } from "@/lib/openai"
import { generateTailoredResume, type JobAnalysis } from "@/lib/resume-ai"

export async function analyzeJobDescriptionAction(jobDescription: string) {
  try {
    if (!jobDescription.trim()) {
      return { error: "Job description is required" }
    }

    const analysis = await analyzeJobDescription(jobDescription)
    return { success: true, data: analysis }
  } catch (error) {
    console.error("Error in analyzeJobDescriptionAction:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to analyze job description",
    }
  }
}

export async function generateResumeAction(jobAnalysis: JobAnalysis) {
  try {
    const defaultResumeData = {
      type: "perfect" as const,
      data: {
        personalInfo: {
          name: "Your Name",
          email: "your.email@example.com",
          phone: "(555) 123-4567",
          location: "Your City, State",
        },
        summary: "Professional summary will be generated based on the job description",
        skills: [],
        experience: [],
        education: [],
      },
    }

    const tailoredResume = await generateTailoredResume(jobAnalysis, defaultResumeData)
    return { success: true, data: tailoredResume }
  } catch (error) {
    console.error("Error in generateResumeAction:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to generate resume",
    }
  }
}
