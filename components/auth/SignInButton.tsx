// New file: components/auth/SignInButton.tsx
"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignInButton() {
  return <Button onClick={() => signIn("google", { callbackUrl: "/" })}>Sign in with Google</Button>
}
