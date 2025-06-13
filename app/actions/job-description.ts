"use server"

import { analyzeJobDescription } from "@/lib/openai"

export async function saveJobDescription(formData: FormData) {
  try {
    const description = formData.get("description") as string

    if (!description) {
      return { error: "Job description is required" }
    }

    // Analyze the job description using OpenAI
    const analysis = await analyzeJobDescription(description)

    // In a real application, you would save this to a database
    // For now, we'll just return the analysis
    return {
      success: true,
      analysis,
    }
  } catch (error) {
    console.error("Error in saveJobDescription:", error)

    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("JSON")) {
        return { error: "Failed to process the job description. Please try again or use a different job description." }
      }
    }

    return { error: "Failed to analyze job description. Please try again later." }
  }
}
