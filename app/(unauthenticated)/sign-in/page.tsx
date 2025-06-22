// New file: app/(unauthenticated)/sign-in/page.tsx
"use client"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react" // Assuming you have Loader2 for loading state

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/") // Redirect to dashboard if already signed in
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (status === "authenticated") {
    return null // Or a loading spinner while redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-xl text-center">
        <div className="flex justify-center">
          <FileText className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Job2Resume</h1>
        <p className="text-gray-600">
          Sign in to tailor your resume and cover letter with AI, and land your dream job faster.
        </p>
        <Button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full text-lg py-3" size="lg">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12V14.26H17.94C17.64,15.93 16.73,17.33 15.29,18.25V20.91H19.07C21.25,19.03 22.56,15.93 22.56,12.25Z" />
            <path d="M12,23C14.97,23 17.45,22.04 19.07,20.91L15.29,18.25C14.31,18.93 13.21,19.33 12,19.33C9.38,19.33 7.15,17.62 6.32,15.28H2.55V17.95C4.18,20.93 6.93,23 12,23Z" />
            <path d="M6.32,15.28C6.03,14.53 5.89,13.77 5.89,13C5.89,12.23 6.03,11.47 6.32,10.72V8.05H2.55C1.61,9.77 1,11.33 1,13C1,14.67 1.61,16.23 2.55,17.95L6.32,15.28Z" />
            <path d="M12,6.67C13.44,6.67 14.73,7.16 15.71,8.09L19.14,4.66C17.45,3.16 14.97,2.17 12,2.17C6.93,2.17 4.18,5.07 2.55,8.05L6.32,10.72C7.15,8.38 9.38,6.67 12,6.67Z" />
          </svg>
          Sign in with Google
        </Button>
        <p className="text-xs text-gray-500">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  )
}
