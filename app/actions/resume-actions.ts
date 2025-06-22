"use server"

import { analyzeJobDescription } from "@/lib/openai"
import {
  generateTailoredResume,
  generateTailoredCoverLetter,
  type JobAnalysis,
  type TailoredResume,
} from "@/lib/resume-ai" // Added TailoredResume and generateTailoredCoverLetter

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
          name: "Faycal Ben Sassi", // Consider making this dynamic or from user profile
          email: "bensassi.faysel@gmail.com",
          phone: "(773) 837-3043",
          location: "Chicago, Illinois",
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

// New action for generating cover letter
export async function generateCoverLetterAction(jobAnalysis: JobAnalysis, resume: TailoredResume) {
  try {
    if (!jobAnalysis || !resume) {
      return { error: "Job analysis and resume data are required to generate a cover letter." }
    }
    const coverLetterText = await generateTailoredCoverLetter(jobAnalysis, resume)
    return { success: true, data: coverLetterText }
  } catch (error) {
    console.error("Error in generateCoverLetterAction:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to generate cover letter",
    }
  }
}
