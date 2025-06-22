"use server"

import { analyzeJobDescription } from "@/lib/openai"
import {
  generateTailoredResume as generateResumeAIService, // Renamed to avoid conflict
  generateTailoredCoverLetter as generateCoverLetterAIService, // Renamed
  type JobAnalysis,
  type TailoredResume,
} from "@/lib/resume-ai"
import { updateTrialUsage, getUserSubscription } from "@/lib/supabase/userActions" // Import new function

const TRIAL_RESUME_LIMIT = 3
const TRIAL_COVER_LETTER_LIMIT = 3

export async function analyzeJobDescriptionAction(jobDescription: string) {
  try {
    if (!jobDescription.trim()) {
      return { error: "Job description is required" }
    }
    const analysis = await analyzeJobDescription(jobDescription)
    return { success: true, data: analysis }
  } catch (error) {
    console.error("Error in analyzeJobDescriptionAction:", error)
    return { error: error instanceof Error ? error.message : "Failed to analyze job description" }
  }
}

export async function generateResumeAction(jobAnalysis: JobAnalysis, userId?: string) {
  if (!userId) return { error: "User not authenticated" }

  try {
    const userSub = await getUserSubscription(userId)
    if (userSub.subscription_status !== "active" && (userSub.trial_resumes_used || 0) >= TRIAL_RESUME_LIMIT) {
      return { error: "Resume generation limit reached for free trial. Please subscribe." }
    }

    const defaultResumeData = {
      /* ... your default data ... */
      type: "perfect" as const,
      data: {
        personalInfo: {
          name: "Your Name",
          email: "your.email@example.com",
          phone: "123-456-7890",
          location: "City, State",
        },
        summary: "",
        skills: [],
        experience: [],
        education: [],
      },
    }
    const tailoredResume = await generateResumeAIService(jobAnalysis, defaultResumeData)

    let updatedSubscription = userSub
    if (userSub.subscription_status === "free_trial") {
      updatedSubscription = await updateTrialUsage(userId, "resume")
    }

    return { success: true, data: { resume: tailoredResume, updatedSubscription } }
  } catch (error) {
    console.error("Error in generateResumeAction:", error)
    return { error: error instanceof Error ? error.message : "Failed to generate resume" }
  }
}

export async function generateCoverLetterAction(jobAnalysis: JobAnalysis, resume: TailoredResume, userId?: string) {
  if (!userId) return { error: "User not authenticated" }

  try {
    const userSub = await getUserSubscription(userId)
    if (
      userSub.subscription_status !== "active" &&
      (userSub.trial_cover_letters_used || 0) >= TRIAL_COVER_LETTER_LIMIT
    ) {
      return { error: "Cover letter generation limit reached for free trial. Please subscribe." }
    }

    const coverLetterText = await generateCoverLetterAIService(jobAnalysis, resume)

    let updatedSubscription = userSub
    if (userSub.subscription_status === "free_trial") {
      updatedSubscription = await updateTrialUsage(userId, "cover_letter")
    }

    return { success: true, data: { coverLetter: coverLetterText, updatedSubscription } }
  } catch (error) {
    console.error("Error in generateCoverLetterAction:", error)
    return { error: error instanceof Error ? error.message : "Failed to generate cover letter" }
  }
}
