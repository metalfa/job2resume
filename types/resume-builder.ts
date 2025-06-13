export interface ResumeData {
  contactInfo: {
    fullName: string
    email: string
    phone: string
    linkedin: string
    location: string
  }
  professionalSummary: string
  workExperience: WorkExperience[]
  skills: string[]
  education: Education[]
  certifications: string[]
  awards: string[]
}

export interface WorkExperience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  isCurrentRole: boolean
  responsibilities: string[]
}

export interface Education {
  id: string
  degree: string
  major: string
  institution: string
  graduationDate: string
  gpa?: string
}

export interface KeywordSuggestion {
  keyword: string
  frequency: number
  category: "skill" | "experience" | "qualification"
  suggested: boolean
}
