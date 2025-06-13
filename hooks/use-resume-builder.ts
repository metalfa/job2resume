"use client"

import { useState, useCallback } from "react"
import type { ResumeData, WorkExperience, Education } from "@/types/resume-builder"
import { generateResumeFromJobDescription, enhanceResumeSection } from "@/lib/resume-ai"

const initialResumeData: ResumeData = {
  contactInfo: {
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    location: "",
  },
  professionalSummary: "",
  workExperience: [],
  skills: [],
  education: [],
  certifications: [],
  awards: [],
}

export function useResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [currentJobDescription, setCurrentJobDescription] = useState("")

  const updateContactInfo = useCallback((field: keyof ResumeData["contactInfo"], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }))
  }, [])

  const updateProfessionalSummary = useCallback((summary: string) => {
    setResumeData((prev) => ({
      ...prev,
      professionalSummary: summary,
    }))
  }, [])

  const addWorkExperience = useCallback(() => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentRole: false,
      responsibilities: [""],
    }
    setResumeData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience],
    }))
  }, [])

  const updateWorkExperience = useCallback((id: string, field: keyof WorkExperience, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }, [])

  const removeWorkExperience = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }))
  }, [])

  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      major: "",
      institution: "",
      graduationDate: "",
      gpa: "",
    }
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }))
  }, [])

  const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }, [])

  const removeEducation = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }, [])

  const updateSkills = useCallback((skills: string[]) => {
    setResumeData((prev) => ({
      ...prev,
      skills,
    }))
  }, [])

  const updateCertifications = useCallback((certifications: string[]) => {
    setResumeData((prev) => ({
      ...prev,
      certifications,
    }))
  }, [])

  const updateAwards = useCallback((awards: string[]) => {
    setResumeData((prev) => ({
      ...prev,
      awards,
    }))
  }, [])

  const generateCompleteResume = useCallback(async (jobDescription: string) => {
    setIsGenerating(true)
    setCurrentJobDescription(jobDescription)
    try {
      const generatedResume = await generateResumeFromJobDescription(jobDescription)
      setResumeData(generatedResume)
    } catch (error) {
      console.error("Error generating resume:", error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const enhanceSection = useCallback(
    async (sectionType: string, currentContent: string) => {
      if (!currentJobDescription) return currentContent

      setIsEnhancing(true)
      try {
        const enhanced = await enhanceResumeSection(sectionType, currentContent, currentJobDescription)
        return enhanced
      } catch (error) {
        console.error("Error enhancing section:", error)
        return currentContent
      } finally {
        setIsEnhancing(false)
      }
    },
    [currentJobDescription],
  )

  return {
    resumeData,
    isGenerating,
    isEnhancing,
    currentJobDescription,
    updateContactInfo,
    updateProfessionalSummary,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    updateCertifications,
    updateAwards,
    generateCompleteResume,
    enhanceSection,
  }
}
