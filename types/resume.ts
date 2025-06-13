export interface JobDescription {
  title: string
  company: string
  description: string
  requiredSkills: string[]
  preferredSkills: string[]
}

export interface Resume {
  name: string
  email: string
  phone: string
  location: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  description: string
  achievements: string[]
}

export interface Education {
  degree: string
  institution: string
  location: string
  graduationDate: string
}

export interface CoverLetter {
  name: string
  email: string
  phone: string
  location: string
  date: string
  recipientName: string
  recipientTitle: string
  recipientCompany: string
  recipientLocation: string
  greeting: string
  body: string[]
  closing: string
}
