import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { ResumeData } from "@/types/resume-builder"

// Helper function to clean JSON response
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim()

  // Remove markdown code block syntax if present
  cleaned = cleaned.replace(/^```json\s*|^```\s*/i, "")
  cleaned = cleaned.replace(/\s*```$/i, "")

  return cleaned
}

export async function generateResumeFromJobDescription(jobDescription: string): Promise<ResumeData> {
  try {
    const prompt = `
      Analyze this job description and create a complete, realistic resume for an ideal candidate.
      
      Job Description:
      ${jobDescription}

      Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
      {
        "contactInfo": {
          "fullName": "John Smith",
          "email": "john.smith@email.com",
          "phone": "(555) 123-4567",
          "linkedin": "linkedin.com/in/johnsmith",
          "location": "New York, NY"
        },
        "professionalSummary": "Experienced professional with 5+ years in relevant field...",
        "workExperience": [
          {
            "id": "exp1",
            "jobTitle": "Senior Software Engineer",
            "company": "Tech Corp",
            "location": "New York, NY",
            "startDate": "Jan 2020",
            "endDate": "Present",
            "isCurrentRole": true,
            "responsibilities": [
              "Led development of web applications using React and Node.js",
              "Improved system performance by 40% through optimization",
              "Mentored team of 3 junior developers"
            ]
          }
        ],
        "skills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
        "education": [
          {
            "id": "edu1",
            "degree": "Bachelor of Science",
            "major": "Computer Science",
            "institution": "State University",
            "graduationDate": "May 2018",
            "gpa": "3.8"
          }
        ],
        "certifications": ["AWS Certified Developer", "Google Cloud Professional"],
        "awards": ["Employee of the Year 2023", "Innovation Award Winner"]
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    console.log("Raw AI response:", text)

    // Clean the response
    const cleanedResponse = cleanJsonResponse(text)
    console.log("Cleaned response:", cleanedResponse)

    let resumeData: ResumeData

    try {
      resumeData = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError)
      console.error("Attempted to parse:", cleanedResponse)

      // Fallback: create a basic resume structure
      resumeData = createFallbackResume(jobDescription)
    }

    // Ensure all required fields exist and have proper IDs
    resumeData = validateAndFixResumeData(resumeData)

    return resumeData
  } catch (error) {
    console.error("Error in generateResumeFromJobDescription:", error)

    // Return a fallback resume instead of throwing
    return createFallbackResume(jobDescription)
  }
}

function createFallbackResume(jobDescription: string): ResumeData {
  // Extract some basic info from job description for a more relevant fallback
  const jobTitle = extractJobTitle(jobDescription) || "Professional"
  const skills = extractSkills(jobDescription)

  return {
    contactInfo: {
      fullName: "Your Name",
      email: "your.email@example.com",
      phone: "(555) 123-4567",
      linkedin: "linkedin.com/in/yourprofile",
      location: "Your City, State",
    },
    professionalSummary: `Experienced ${jobTitle.toLowerCase()} with proven track record of delivering results. Skilled in ${skills.slice(0, 3).join(", ")} and passionate about driving innovation and excellence.`,
    workExperience: [
      {
        id: `exp_${Date.now()}`,
        jobTitle: jobTitle,
        company: "Previous Company",
        location: "City, State",
        startDate: "Jan 2020",
        endDate: "Present",
        isCurrentRole: true,
        responsibilities: [
          "Led key projects and initiatives",
          "Collaborated with cross-functional teams",
          "Delivered measurable results and improvements",
        ],
      },
    ],
    skills: skills.length > 0 ? skills : ["Communication", "Problem Solving", "Leadership", "Project Management"],
    education: [
      {
        id: `edu_${Date.now()}`,
        degree: "Bachelor's Degree",
        major: "Relevant Field",
        institution: "University Name",
        graduationDate: "Year",
        gpa: "",
      },
    ],
    certifications: [],
    awards: [],
  }
}

function extractJobTitle(jobDescription: string): string | null {
  // Simple extraction - look for common job title patterns
  const titlePatterns = [
    /(?:position|role|job)\s*:?\s*([^\n\r.]{10,50})/i,
    /(?:seeking|hiring)\s+(?:a\s+)?([^\n\r.]{10,50})/i,
    /^([^\n\r.]{10,50})\s*(?:position|role)/i,
  ]

  for (const pattern of titlePatterns) {
    const match = jobDescription.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return null
}

function extractSkills(jobDescription: string): string[] {
  const commonSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "Project Management",
    "Leadership",
    "Communication",
    "Problem Solving",
    "SQL",
    "Git",
    "Agile",
    "Scrum",
    "HTML",
    "CSS",
    "TypeScript",
    "Java",
    "C++",
    "Machine Learning",
    "Data Analysis",
    "Excel",
    "PowerBI",
  ]

  const foundSkills = commonSkills.filter((skill) => jobDescription.toLowerCase().includes(skill.toLowerCase()))

  return foundSkills.slice(0, 8) // Limit to 8 skills
}

function validateAndFixResumeData(data: any): ResumeData {
  // Ensure all required fields exist with defaults
  const validated: ResumeData = {
    contactInfo: {
      fullName: data.contactInfo?.fullName || "Your Name",
      email: data.contactInfo?.email || "your.email@example.com",
      phone: data.contactInfo?.phone || "(555) 123-4567",
      linkedin: data.contactInfo?.linkedin || "",
      location: data.contactInfo?.location || "Your City, State",
    },
    professionalSummary: data.professionalSummary || "Professional summary to be added.",
    workExperience: Array.isArray(data.workExperience)
      ? data.workExperience.map((exp: any, index: number) => ({
          id: exp.id || `exp_${Date.now()}_${index}`,
          jobTitle: exp.jobTitle || "Job Title",
          company: exp.company || "Company Name",
          location: exp.location || "City, State",
          startDate: exp.startDate || "Start Date",
          endDate: exp.endDate || "End Date",
          isCurrentRole: Boolean(exp.isCurrentRole),
          responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : ["Responsibility to be added"],
        }))
      : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    education: Array.isArray(data.education)
      ? data.education.map((edu: any, index: number) => ({
          id: edu.id || `edu_${Date.now()}_${index}`,
          degree: edu.degree || "Degree",
          major: edu.major || "Major",
          institution: edu.institution || "Institution",
          graduationDate: edu.graduationDate || "Graduation Date",
          gpa: edu.gpa || "",
        }))
      : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    awards: Array.isArray(data.awards) ? data.awards : [],
  }

  return validated
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
    // Return original content if enhancement fails
    return currentContent
  }
}
