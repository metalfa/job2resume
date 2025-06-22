// New file: components/auth/SignOutButton.tsx
"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/sign-in" })}>
      <LogOut className="h-4 w-4 mr-2 md:mr-0" />
      <span className="md:hidden">Sign Out</span>
    </Button>
  )
}
