"use client"

import type React from "react"

import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean
  isGenerating?: boolean
}

export function GenerateButton({ isDisabled = false, isGenerating = false, ...props }: GenerateButtonProps) {
  return (
    <Button disabled={isDisabled || isGenerating} size="lg" className="w-full md:w-auto" {...props}>
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
