import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface JobAnalysis {
  requiredSkills: string[]
  preferredSkills: string[]
  jobTitle: string
  companyName: string
  keyResponsibilities: string[]
}

export interface ResumeData {
  type: "upload" | "template"
  content?: string // For uploaded files
  data?: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
  }
  templateId?: string
  file?: File
}

export async function generateTailoredResume(jobAnalysis: JobAnalysis, resumeData: ResumeData) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using mock data")
      return generateMockTailoredResume(jobAnalysis, resumeData)
    }

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
          : `Uploaded Resume Content: ${resumeData.content || "Content extraction pending"}`
      }

      Instructions:
      1. Create a professional resume that highlights skills and experiences most relevant to the job
      2. Rewrite the professional summary to match the job requirements
      3. Emphasize skills that match the required and preferred skills
      4. Use action verbs and quantifiable achievements
      5. Ensure ATS compatibility
      6. Keep the format clean and professional

      Return the resume in the following JSON format:
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
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    // Clean and parse the JSON response
    const cleanedResponse = text.replace(/```json\s*|```\s*/g, "").trim()
    return JSON.parse(cleanedResponse)
  } catch (error) {
    console.error("Error generating tailored resume:", error)
    console.warn("Falling back to mock data generation")
    return generateMockTailoredResume(jobAnalysis, resumeData)
  }
}

function generateMockTailoredResume(jobAnalysis: JobAnalysis, resumeData: ResumeData) {
  // Generate a tailored resume using the provided data without AI
  const personalInfo =
    resumeData.type === "template" && resumeData.data
      ? {
          name: resumeData.data.fullName || "John Doe",
          email: resumeData.data.email || "john.doe@email.com",
          phone: resumeData.data.phone || "(555) 123-4567",
          location: resumeData.data.location || "New York, NY",
        }
      : {
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "(555) 123-4567",
          location: "New York, NY",
        }

  // Create a tailored summary based on job analysis
  const summary =
    resumeData.type === "template" && resumeData.data?.summary
      ? `${resumeData.data.summary} Specifically interested in ${jobAnalysis.jobTitle} role at ${jobAnalysis.companyName}, bringing expertise in ${jobAnalysis.requiredSkills.slice(0, 3).join(", ")}.`
      : `Experienced professional with expertise in ${jobAnalysis.requiredSkills.slice(0, 3).join(", ")}. Seeking ${jobAnalysis.jobTitle} position at ${jobAnalysis.companyName} to leverage skills in ${jobAnalysis.preferredSkills.slice(0, 2).join(" and ")}.`

  // Combine required and preferred skills, prioritizing required ones
  const allSkills = [...jobAnalysis.requiredSkills, ...jobAnalysis.preferredSkills]
  const uniqueSkills = Array.from(new Set(allSkills)).slice(0, 12)

  return {
    personalInfo,
    summary,
    skills: uniqueSkills,
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Solutions Inc.",
        location: "New York, NY",
        duration: "2020 - Present",
        achievements: [
          `Led development projects utilizing ${jobAnalysis.requiredSkills.slice(0, 2).join(" and ")}`,
          `Improved system performance by 40% through optimization techniques`,
          `Collaborated with cross-functional teams to deliver solutions matching ${jobAnalysis.jobTitle} requirements`,
          `Mentored junior developers in ${jobAnalysis.preferredSkills.slice(0, 1).join("")} best practices`,
        ],
      },
      {
        title: "Software Developer",
        company: "Innovation Labs",
        location: "New York, NY",
        duration: "2018 - 2020",
        achievements: [
          `Developed applications using ${jobAnalysis.requiredSkills.slice(1, 3).join(" and ")}`,
          `Participated in agile development processes and code reviews`,
          `Contributed to projects that align with ${jobAnalysis.companyName}'s technology stack`,
          "Delivered high-quality software solutions on time and within budget",
        ],
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Technology",
        location: "New York, NY",
        year: "2018",
      },
    ],
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
