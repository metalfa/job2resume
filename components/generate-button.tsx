"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface GenerateButtonProps {
  isDisabled?: boolean
}

export function GenerateButton({ isDisabled = false }: GenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate API call to generate resume and cover letter
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsGenerating(false)
    router.push("/dashboard/results")
  }

  return (
    <Button onClick={handleGenerate} disabled={isDisabled || isGenerating} size="lg" className="w-full md:w-auto">
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Create Tailored Resume & Cover Letter
        </>
      )}
    </Button>
  )
}
