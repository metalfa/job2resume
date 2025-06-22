import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface TailoredResume {
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

export interface JobAnalysis {
  requiredSkills: string[]
  preferredSkills: string[]
  jobTitle: string
  companyName: string
  keyResponsibilities: string[]
  industryContext: string
  seniority: string
  companySize: string
  techStack: string[]
  softSkills: string[]
  achievements: string[]
  metrics: string[]
  companyValues?: string[]
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
  content?: string
  data?:
    | {
        fullName: string
        email: string
        phone: string
        location: string
        summary: string
      }
    | PerfectResumeData
  templateId?: string
  file?: File
}

export async function generateTailoredResume(jobAnalysis: JobAnalysis, resumeData: ResumeData) {
  try {
    const prompt = `
  You are an elite resume strategist and career consultant with expertise in creating compelling, ATS-optimized resumes that land interviews. Your task is to create a masterpiece resume that perfectly aligns with the target job while showcasing the candidate's unique value proposition.

  TARGET JOB ANALYSIS:
  - Position: ${jobAnalysis.jobTitle}
  - Company: ${jobAnalysis.companyName}
  - Industry Context: ${jobAnalysis.industryContext || "Technology/Professional Services"}
  - Seniority Level: ${jobAnalysis.seniority || "Mid to Senior Level"}
  - Company Size: ${jobAnalysis.companySize || "Medium to Large Enterprise"}
  
  TECHNICAL REQUIREMENTS:
  - Required Skills: ${jobAnalysis.requiredSkills.join(", ")}
  - Preferred Skills: ${jobAnalysis.preferredSkills.join(", ")}
  - Tech Stack: ${jobAnalysis.techStack?.join(", ") || "Modern technology stack"}
  
  KEY RESPONSIBILITIES & EXPECTATIONS:
  ${jobAnalysis.keyResponsibilities?.map((resp, i) => `${i + 1}. ${resp}`).join("\n") || "- Drive technical excellence and innovation"}
  
  SOFT SKILLS & LEADERSHIP:
  - ${jobAnalysis.softSkills?.join(", ") || "Leadership, Communication, Problem-solving, Team collaboration"}
  
  CANDIDATE'S BACKGROUND:
  ${
    resumeData.type === "template"
      ? `Template Data:
       Name: ${resumeData.data?.fullName}
       Email: ${resumeData.data?.email}
       Phone: ${resumeData.data?.phone}
       Location: ${resumeData.data?.location}
       Summary: ${resumeData.data?.summary}`
      : resumeData.type === "upload"
        ? `Uploaded Resume Content: ${resumeData.content || "Professional with relevant experience"}`
        : `Perfect Resume Data: ${JSON.stringify(resumeData.data)}`
  }

  INSTRUCTIONS FOR CREATING A MAGNIFICENT RESUME:

  1. PROFESSIONAL SUMMARY (3-4 lines):
     - Create a powerful opening that immediately positions the candidate as the ideal fit
     - Include specific years of experience, key technologies, and measurable impact
     - Highlight unique value proposition and leadership qualities
     - Use industry-specific terminology that resonates with hiring managers

  2. EXPERIENCE SECTION - DYNAMIC BULLET POINT GENERATION:
     For each role, create 4-6 unique, compelling bullet points that:
     
     a) ACHIEVEMENT-FOCUSED: Start with strong action verbs (Led, Architected, Optimized, Delivered, Transformed, Spearheaded)
     b) QUANTIFIABLE IMPACT: Include specific metrics, percentages, dollar amounts, user counts, performance improvements
     c) CONTEXTUALLY RELEVANT: Directly relate to the target job's requirements and responsibilities
     d) PROGRESSIVE COMPLEXITY: Show career growth and increasing responsibility
     e) TECHNICAL DEPTH: Demonstrate mastery of relevant technologies and methodologies
     f) BUSINESS IMPACT: Connect technical work to business outcomes and stakeholder value

     BULLET POINT FORMULA:
     [Action Verb] + [What you did] + [Technologies/Methods used] + [Quantifiable result] + [Business impact]

     Example Patterns:
     - "Architected and implemented [technology solution] that [specific improvement] resulting in [quantified benefit] for [stakeholder group]"
     - "Led cross-functional team of [number] to deliver [project] using [technologies], achieving [metric] improvement in [business area]"
     - "Optimized [system/process] through [specific approach], reducing [metric] by [percentage] and saving $[amount] annually"

  3. SKILLS SECTION:
     - Prioritize skills that directly match job requirements
     - Group by categories (Programming Languages, Frameworks, Tools, Cloud Platforms, etc.)
     - Include both technical and soft skills relevant to the role

  4. EDUCATION:
     - Include relevant degrees, certifications, and continuous learning
     - Highlight academic achievements if recent graduate

  CRITICAL REQUIREMENTS:
  - Every bullet point must be unique and avoid generic language
  - Focus on outcomes and impact, not just responsibilities
  - Use industry-specific terminology and keywords for ATS optimization
  - Ensure progressive career narrative showing growth and advancement
  - Make each role distinct with different focus areas and achievements
  - Incorporate elements that demonstrate cultural fit and soft skills

  Return ONLY the raw JSON without any markdown formatting, code blocks, or explanations.
  The response should be a valid JSON object with this exact structure:
  {
    "personalInfo": {
      "name": "Full Name",
      "email": "email@example.com",
      "phone": "(123) 456-7890",
      "location": "City, State"
    },
    "summary": "Compelling 3-4 line professional summary that positions candidate as ideal fit",
    "skills": ["skill1", "skill2", "skill3"],
    "experience": [
      {
        "title": "Job Title",
        "company": "GlobalTech Solutions",
        "location": "City, State",
        "duration": "Start Date - End Date",
        "achievements": [
          "Unique, quantifiable achievement bullet point 1",
          "Unique, quantifiable achievement bullet point 2",
          "Unique, quantifiable achievement bullet point 3",
          "Unique, quantifiable achievement bullet point 4"
        ]
      }
    ],
    "education": [
      {
        "degree": "Degree Name",
        "institution": "Polytechnique",
        "location": "Tunis, Tunisia",
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
      temperature: 0.7, // Add some creativity while maintaining accuracy
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

// Add the new function for generating cover letters
export async function generateTailoredCoverLetter(jobAnalysis: JobAnalysis, resume: TailoredResume): Promise<string> {
  try {
    const candidateName = resume.personalInfo.name
    const jobTitle = jobAnalysis.jobTitle
    const companyName = jobAnalysis.companyName

    // Select a few key skills and a brief experience highlight
    const relevantSkills = resume.skills.slice(0, 3).join(", ")
    const experienceHighlight =
      resume.experience.length > 0
        ? `${resume.experience[0].title} at ${resume.experience[0].company}`
        : "relevant professional experience"
    const keyResponsibilities = jobAnalysis.keyResponsibilities.slice(0, 2).join("; ")
    const topRequiredSkills = jobAnalysis.requiredSkills.slice(0, 2).join(", ")

    const prompt = `
    You are an expert career coach specializing in crafting compelling cover letters. Your task is to write a personalized cover letter for ${candidateName} applying for the ${jobTitle} position at ${companyName}.

    The tone must be:
    - Sincere and genuine.
    - Direct and to the point.
    - Overflowing with enthusiasm for this specific role and company.

    The cover letter MUST explicitly state:
    1. The candidate's strong and genuine desire to obtain THIS specific job at ${companyName}.
    2. The candidate's unwavering confidence in their ability to fulfill ALL of the role's requirements for the ${jobTitle} position.
    3. The candidate's conviction that they can execute the job responsibilities perfectly, drawing upon their skills and experiences.

    Content Guidelines:
    - Introduction: Clearly state the position being applied for (${jobTitle}) and where it was seen (if known, otherwise express direct interest). Immediately express genuine enthusiasm for this opportunity at ${companyName}.
    - Body Paragraph 1-2: Connect the candidate's key skills (such as ${relevantSkills}) and experiences (like their role as a ${experienceHighlight}) directly to the most critical requirements of the ${jobTitle} role, such as ${keyResponsibilities} and the need for ${topRequiredSkills}. Highlight 2-3 key matches and briefly explain how these qualifications will enable them to excel.
    - Body Paragraph 3 (Confidence & Desire): Reiterate the strong desire for the role and deep-seated confidence in their abilities, as per the explicit requirements above. If ${companyName} has known values or a mission (derived from job analysis if present, e.g., "${jobAnalysis.companyValues?.join(", ")}"), try to subtly align with them or express admiration for the company's work in ${jobAnalysis.industryContext}.
    - Conclusion: Express eagerness for an interview to discuss how they can contribute to ${companyName}'s success in the ${jobTitle} role. Reiterate their perfect fit and readiness to take on the responsibilities.

    The cover letter should be unique, tailored, approximately 3-4 paragraphs long, and professional.
    Output ONLY the cover letter text, without any introductory or concluding remarks from you, the AI. Do not wrap the output in markdown or JSON.
    `

    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      prompt: prompt,
      temperature: 0.65, // Slightly lower for more focused output but still creative
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating tailored cover letter:", error)
    throw new Error("Failed to generate tailored cover letter")
  }
}
