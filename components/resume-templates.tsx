"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and traditional format suitable for most industries",
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with a creative touch",
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design focusing on content",
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior positions",
    image: "/placeholder.svg?height=200&width=150",
  },
]

interface ResumeTemplatesProps {
  onComplete?: (template: { id: string; data: any }) => void
}

export function ResumeTemplates({ onComplete }: ResumeTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    if (selectedTemplate) {
      const templateData = {
        id: selectedTemplate,
        data: formData,
      }
      if (onComplete) {
        onComplete(templateData)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedTemplate === template.id ? "ring-2 ring-primary" : "hover:border-gray-300"
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <img
              src={template.image || "/placeholder.svg"}
              alt={template.name}
              className="w-full h-auto object-cover"
            />
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            <div className="p-3">
              <h3 className="font-medium text-sm">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="space-y-4">
          <h3 className="font-medium">Fill Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="(123) 456-7890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="New York, NY"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Professional Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              placeholder="Briefly describe your professional background and key strengths..."
            ></textarea>
          </div>

          <Button onClick={handleSubmit}>Continue with Template</Button>
        </div>
      )}
    </div>
  )
}
