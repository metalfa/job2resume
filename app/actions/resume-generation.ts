"use server"

import { generateTailoredResume, type JobAnalysis, type ResumeData } from "@/lib/resume-ai"

export async function generateResumeAction(jobAnalysis: JobAnalysis, resumeData: ResumeData) {
  try {
    const result = await generateTailoredResume(jobAnalysis, resumeData)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error in generateResumeAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate resume",
    }
  }
}
