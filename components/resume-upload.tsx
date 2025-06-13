"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, X, CheckCircle } from "lucide-react"

interface ResumeUploadProps {
  onComplete?: (file: File) => void
}

export function ResumeUpload({ onComplete }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploaded, setIsUploaded] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is PDF, DOCX, or DOC
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]

    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document")
      return
    }

    setFile(file)
    simulateUpload()
  }

  const simulateUpload = () => {
    setUploadProgress(0)
    setIsUploaded(false)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploaded(true)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const removeFile = () => {
    setFile(null)
    setUploadProgress(0)
    setIsUploaded(false)
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-200"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <h3 className="font-medium">Drag and drop your resume</h3>
            <p className="text-sm text-gray-500 mb-4">Supports PDF, DOCX, or DOC (Max 5MB)</p>
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              ref={(input) => {
                if (input) {
                  ;(window as any).resumeFileInput = input
                }
              }}
            />
            <Button
              variant="outline"
              type="button"
              className="cursor-pointer"
              onClick={() => {
                const fileInput = document.getElementById("resume-upload") as HTMLInputElement
                if (fileInput) {
                  fileInput.click()
                }
              }}
            >
              Browse Files
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <File className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!isUploaded ? (
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Upload complete</span>
            </div>
          )}
        </div>
      )}

      {file && isUploaded && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Resume Preview</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your resume has been uploaded successfully. You can proceed to the next step.
          </p>
          <Button
            onClick={() => {
              if (file && onComplete) {
                onComplete(file)
              }
            }}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  )
}
