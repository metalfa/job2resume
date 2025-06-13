"use client"

import type { ResumeData } from "@/types/resume-builder"

interface ResumePreviewProps {
  resumeData: ResumeData
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{resumeData.contactInfo.fullName || "Your Name"}</h1>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
            {resumeData.contactInfo.email && <span>{resumeData.contactInfo.email}</span>}
            {resumeData.contactInfo.phone && <span>{resumeData.contactInfo.phone}</span>}
            {resumeData.contactInfo.location && <span>{resumeData.contactInfo.location}</span>}
            {resumeData.contactInfo.linkedin && <span>{resumeData.contactInfo.linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {resumeData.professionalSummary && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.professionalSummary}</p>
          </div>
        )}

        {/* Work Experience */}
        {resumeData.workExperience.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h2>
            <div className="space-y-4">
              {resumeData.workExperience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                    <span className="text-sm text-gray-500">
                      {exp.startDate} - {exp.isCurrentRole ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {exp.company} • {exp.location}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {exp.responsibilities.map((resp, index) => (
                      <li key={index} className="text-sm">
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
            <div className="space-y-2">
              {resumeData.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {edu.degree} {edu.major && `in ${edu.major}`}
                      </h3>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-500">{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="text-sm">
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Awards */}
        {resumeData.awards.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Awards & Recognition</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {resumeData.awards.map((award, index) => (
                <li key={index} className="text-sm">
                  {award}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
