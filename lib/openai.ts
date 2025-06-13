import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Helper function to clean markdown code blocks from the response
function cleanJsonResponse(text: string): string {
  // Remove markdown code block syntax if present
  let cleaned = text.trim()

  // Remove ```json or ``` at the beginning
  cleaned = cleaned.replace(/^```json\s*|^```\s*/i, "")

  // Remove ``` at the end
  cleaned = cleaned.replace(/\s*```$/i, "")

  return cleaned
}

export async function analyzeJobDescription(description: string) {
  try {
    const prompt = `
      Analyze the following job description and extract:
      1. Required skills (technical and soft skills explicitly mentioned as requirements)
      2. Preferred skills (skills mentioned as "nice to have" or "preferred")
      3. Job title
      4. Company name (if available)
      
      Return ONLY the raw JSON without any markdown formatting, code blocks, or explanations.
      The response should be a valid JSON object with this exact structure:
      {
        "requiredSkills": ["skill1", "skill2", ...],
        "preferredSkills": ["skill1", "skill2", ...],
        "jobTitle": "Title",
        "companyName": "Company"
      }
      
      Job Description:
      ${description}
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    // Clean the response in case it still contains markdown formatting
    const cleanedResponse = cleanJsonResponse(text)

    try {
      // Parse the cleaned response as JSON
      return JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("Raw response:", text)
      console.error("Cleaned response:", cleanedResponse)
      throw new Error("Failed to parse AI response as JSON")
    }
  } catch (error) {
    console.error("Error analyzing job description:", error)
    throw new Error("Failed to analyze job description")
  }
}
