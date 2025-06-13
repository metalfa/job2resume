"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Edit3, Check, X, Sparkles } from "lucide-react"

interface InlineEditorProps {
  value: string
  onSave: (value: string) => void
  onEnhance?: () => void
  multiline?: boolean
  placeholder?: string
  className?: string
}

export function InlineEditor({
  value,
  onSave,
  onEnhance,
  multiline = false,
  placeholder = "Click to edit...",
  className = "",
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (multiline) {
        const textarea = inputRef.current as HTMLTextAreaElement
        textarea.setSelectionRange(textarea.value.length, textarea.value.length)
      } else {
        const input = inputRef.current as HTMLInputElement
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }
  }, [isEditing, multiline])

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    } else if (e.key === "Enter" && e.ctrlKey && multiline) {
      e.preventDefault()
      handleSave()
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`min-h-[100px] ${className}`}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={className}
          />
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          {onEnhance && (
            <Button size="sm" variant="outline" onClick={onEnhance}>
              <Sparkles className="h-3 w-3 mr-1" />
              Enhance with AI
            </Button>
          )}
        </div>
        {multiline && <p className="text-xs text-gray-500">Press Ctrl+Enter to save, Escape to cancel</p>}
      </div>
    )
  }

  return (
    <div
      className={`group relative cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200 ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">{value || <span className="text-gray-400 italic">{placeholder}</span>}</div>
        <Edit3 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
      </div>
    </div>
  )
}
