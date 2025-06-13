import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim()
  cleaned = cleaned.replace(/^```json\s*|^```\s*/i, "")
  cleaned = cleaned.replace(/\s*```$/i, "")
  return cleaned
}

export async function analyzeJobDescription(description: string) {
  try {
    const prompt = `
      You are an expert job market analyst and resume strategist. Analyze the following job description and extract comprehensive information that will be used to create a perfectly tailored resume.

      ANALYSIS REQUIREMENTS:
      1. Extract all technical skills, tools, and technologies mentioned
      2. Identify soft skills and leadership qualities required
      3. Determine the seniority level and scope of responsibility
      4. Understand the company context and industry
      5. Identify key performance metrics and success criteria
      6. Extract specific responsibilities and expectations
      7. Determine the ideal candidate profile

      Job Description:
      ${description}

      Return ONLY the raw JSON without any markdown formatting, code blocks, or explanations.
      The response should be a valid JSON object with this exact structure:
      {
        "jobTitle": "Exact job title from posting",
        "companyName": "Company name if mentioned",
        "industryContext": "Industry or business domain",
        "seniority": "Entry/Mid/Senior/Lead/Executive level",
        "companySize": "Startup/Small/Medium/Large/Enterprise",
        "requiredSkills": ["technical skill 1", "technical skill 2", ...],
        "preferredSkills": ["preferred skill 1", "preferred skill 2", ...],
        "techStack": ["technology 1", "technology 2", ...],
        "softSkills": ["soft skill 1", "soft skill 2", ...],
        "keyResponsibilities": ["responsibility 1", "responsibility 2", ...],
        "achievements": ["expected achievement 1", "expected achievement 2", ...],
        "metrics": ["performance metric 1", "performance metric 2", ...],
        "teamSize": "Expected team size or collaboration scope",
        "reportingStructure": "Reporting relationship and hierarchy",
        "growthOpportunities": ["growth opportunity 1", "growth opportunity 2", ...],
        "companyValues": ["company value 1", "company value 2", ...],
        "workEnvironment": "Remote/Hybrid/On-site and culture description"
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      prompt: prompt,
      temperature: 0.3, // Lower temperature for more consistent analysis
    })

    const cleanedResponse = cleanJsonResponse(text)

    try {
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
