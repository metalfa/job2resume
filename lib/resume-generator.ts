import type { JobDescription, Resume } from "@/types/resume"

export async function generateTailoredResume(jobDescription: JobDescription, resume: Resume): Promise<Resume> {
  // In a real application, this would call an AI service
  // For now, we'll simulate the process with a delay

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Create a tailored resume based on the job description and original resume
  const tailoredResume: Resume = {
    ...resume,
    // Highlight relevant skills based on job description
    skills: highlightRelevantSkills(resume.skills, jobDescription.requiredSkills),
    // Tailor experience to emphasize relevant achievements
    experience: tailorExperience(resume.experience, jobDescription),
    // Adjust summary to match job requirements
    summary: generateTailoredSummary(resume.summary, jobDescription),
  }

  return tailoredResume
}

function highlightRelevantSkills(skills: string[], requiredSkills: string[]): string[] {
  // Prioritize skills that match the job requirements
  const prioritizedSkills = [...skills]

  // Move matching skills to the front of the array
  requiredSkills.forEach((requiredSkill) => {
    const matchIndex = prioritizedSkills.findIndex((skill) => skill.toLowerCase().includes(requiredSkill.toLowerCase()))

    if (matchIndex > -1) {
      const matchingSkill = prioritizedSkills.splice(matchIndex, 1)[0]
      prioritizedSkills.unshift(matchingSkill)
    }
  })

  return prioritizedSkills
}

function tailorExperience(experience: any[], jobDescription: JobDescription): any[] {
  // In a real application, this would use AI to rewrite experience bullets
  // to emphasize achievements relevant to the job description
  return experience
}

function generateTailoredSummary(summary: string, jobDescription: JobDescription): string {
  // In a real application, this would use AI to rewrite the summary
  // to match the job requirements
  return summary
}
