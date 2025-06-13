import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { ResumeData } from "@/types/resume-builder"

// Remove the getOpenAIApiKey function entirely

export async function generateResumeFromJobDescription(jobDescription: string): Promise<ResumeData> {
  try {
    const prompt = `
      Based on the following job description, generate a complete, hypothetical but realistic resume for an ideal candidate. 
      The resume should be ATS-friendly and tailored specifically to this role.

      Job Description:
      ${jobDescription}

      Generate a JSON response with the following structure (no markdown formatting):
      {
        "contactInfo": {
          "fullName": "Professional realistic name",
          "email": "professional email",
          "phone": "phone number",
          "linkedin": "linkedin profile",
          "location": "relevant city, state"
        },
        "professionalSummary": "2-3 sentence compelling summary tailored to this role",
        "workExperience": [
          {
            "id": "unique_id",
            "jobTitle": "relevant job title",
            "company": "realistic company name",
            "location": "city, state",
            "startDate": "month year",
            "endDate": "month year or Present",
            "isCurrentRole": boolean,
            "responsibilities": ["bullet point 1", "bullet point 2", "bullet point 3"]
          }
        ],
        "skills": ["skill1", "skill2", "skill3"],
        "education": [
          {
            "id": "unique_id",
            "degree": "relevant degree",
            "major": "relevant major",
            "institution": "university name",
            "graduationDate": "month year",
            "gpa": "optional gpa"
          }
        ],
        "certifications": ["certification 1", "certification 2"],
        "awards": ["award 1", "award 2"]
      }

      Requirements:
      - Include 2-3 relevant work experiences
      - Use action verbs and quantifiable achievements
      - Include all skills mentioned in job description
      - Make education relevant to the role
      - Include realistic but impressive accomplishments
      - Ensure all dates are logical and recent
      - Make the candidate appear highly qualified but realistic
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    // Clean and parse the response
    const cleanedResponse = text.trim().replace(/^```json\s*|^```\s*|\s*```$/gi, "")
    const resumeData = JSON.parse(cleanedResponse)

    // Ensure IDs are present
    resumeData.workExperience = resumeData.workExperience.map((exp: any, index: number) => ({
      ...exp,
      id: exp.id || `exp_${Date.now()}_${index}`,
    }))

    resumeData.education = resumeData.education.map((edu: any, index: number) => ({
      ...edu,
      id: edu.id || `edu_${Date.now()}_${index}`,
    }))

    return resumeData
  } catch (error) {
    console.error("Error generating resume:", error)
    throw new Error("Failed to generate resume from job description")
  }
}

export async function enhanceResumeSection(
  sectionType: string,
  currentContent: string,
  jobDescription: string,
): Promise<string> {
  try {
    const prompt = `
      Enhance the following ${sectionType} section of a resume to better match this job description.
      Keep it professional, ATS-friendly, and realistic.

      Job Description:
      ${jobDescription}

      Current ${sectionType}:
      ${currentContent}

      Provide an improved version that:
      - Uses relevant keywords from the job description
      - Includes quantifiable achievements where appropriate
      - Maintains professional tone
      - Is optimized for ATS systems

      Return only the enhanced content, no explanations.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    return text.trim()
  } catch (error) {
    console.error("Error enhancing resume section:", error)
    throw new Error("Failed to enhance resume section")
  }
}
