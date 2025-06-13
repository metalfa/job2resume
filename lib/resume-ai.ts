import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface JobAnalysis {
  requiredSkills: string[]
  preferredSkills: string[]
  jobTitle: string
  companyName: string
  keyResponsibilities: string[]
}

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

export interface ResumeData {
  type: "upload" | "template" | "perfect"
  content?: string // For uploaded files
  data?:
    | {
        fullName: string
        email: string
        phone: string
        location: string
        summary: string
      }
    | PerfectResumeData // Add support for perfect resume data
  templateId?: string
  file?: File
}

export async function generateTailoredResume(jobAnalysis: JobAnalysis, resumeData: ResumeData) {
  try {
    const prompt = `
      You are an expert resume writer. Create a tailored resume based on the job description analysis and the user's existing resume information.

      Job Analysis:
      - Job Title: ${jobAnalysis.jobTitle}
      - Company: ${jobAnalysis.companyName}
      - Required Skills: ${jobAnalysis.requiredSkills.join(", ")}
      - Preferred Skills: ${jobAnalysis.preferredSkills.join(", ")}
      - Key Responsibilities: ${jobAnalysis.keyResponsibilities?.join(", ") || "Not specified"}

      User's Resume Data:
      ${
        resumeData.type === "template"
          ? `Template Data:
           Name: ${resumeData.data?.fullName}
           Email: ${resumeData.data?.email}
           Phone: ${resumeData.data?.phone}
           Location: ${resumeData.data?.location}
           Summary: ${resumeData.data?.summary}`
          : resumeData.type === "upload"
            ? `Uploaded Resume Content: ${resumeData.content || "Content extraction pending"}`
            : `Perfect Resume Data: ${JSON.stringify(resumeData.data)}`
      }

      Instructions:
      1. Create a professional resume that highlights skills and experiences most relevant to the job
      2. Rewrite the professional summary to match the job requirements
      3. Emphasize skills that match the required and preferred skills
      4. Use action verbs and quantifiable achievements
      5. Ensure ATS compatibility
      6. Keep the format clean and professional

      Return ONLY the raw JSON without any markdown formatting, code blocks, or explanations.
      The response should be a valid JSON object with this exact structure:
      {
        "personalInfo": {
          "name": "Full Name",
          "email": "email@example.com",
          "phone": "(123) 456-7890",
          "location": "City, State"
        },
        "summary": "Professional summary tailored to the job",
        "skills": ["skill1", "skill2", "skill3"],
        "experience": [
          {
            "title": "Job Title",
            "company": "Company Name",
            "location": "City, State",
            "duration": "Start Date - End Date",
            "achievements": ["Achievement 1", "Achievement 2"]
          }
        ],
        "education": [
          {
            "degree": "Degree Name",
            "institution": "Institution Name",
            "location": "City, State",
            "year": "Graduation Year"
          }
        ]
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      prompt: prompt,
    })

    // Clean and parse the JSON response
    const cleanedResponse = text.replace(/```json\s*|```\s*/g, "").trim()

    try {
      return JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("Raw response:", text)
      console.error("Cleaned response:", cleanedResponse)
      throw new Error("Failed to parse AI response as JSON")
    }
  } catch (error) {
    console.error("Error generating tailored resume:", error)
    throw new Error("Failed to generate tailored resume")
  }
}

export async function extractResumeContent(file: File): Promise<string> {
  // In a real implementation, you would use libraries like pdf-parse or mammoth
  // For now, we'll simulate content extraction
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`
        John Doe
        john.doe@email.com
        (555) 123-4567
        New York, NY

        PROFESSIONAL SUMMARY
        Experienced software developer with 5+ years in web development, specializing in React, JavaScript, and modern web technologies. Proven track record of delivering high-quality applications and improving user experience.

        EXPERIENCE
        Senior Frontend Developer | Tech Solutions Inc. | 2020 - Present
        • Developed and maintained React applications serving 100k+ users
        • Improved application performance by 40% through optimization
        • Led a team of 3 junior developers
        • Collaborated with UX/UI designers on user interface improvements

        Frontend Developer | Web Innovations LLC | 2018 - 2020
        • Built responsive web applications using React and Redux
        • Implemented RESTful APIs integration
        • Participated in code reviews and agile development processes

        SKILLS
        JavaScript, React, TypeScript, HTML5, CSS3, Node.js, Git, Redux, REST APIs, Agile Development

        EDUCATION
        Bachelor of Science in Computer Science | University of Technology | 2018
      `)
    }, 1000)
  })
}
