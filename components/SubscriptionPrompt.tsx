// New file: components/SubscriptionPrompt.tsx
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, X } from "lucide-react"
import { useState } from "react"
import { getStripe } from "@/lib/stripe/client"

interface SubscriptionPromptProps {
  onClose: () => void
}

export default function SubscriptionPrompt({ onClose }: SubscriptionPromptProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_ID || process.env.STRIPE_PREMIUM_PLAN_PRICE_ID,
        }), // Ensure env var is public or passed correctly
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { sessionId } = await response.json()
      const stripe = await getStripe()
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error("Stripe redirect error:", error)
          // Handle error display to user
        }
      }
    } catch (error: any) {
      console.error("Subscription error:", error)
      // Handle error display to user, e.g., set an error message state
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Upgrade to Premium</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription>
            You've used all your free generations. Subscribe to unlock unlimited resumes, cover letters, and all premium
            features!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-primary/10 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">$19</p>
            <p className="text-sm text-primary/80">per month</p>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Unlimited AI Resume Generations
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Unlimited AI Cover Letter Generations
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Access to All Templates & Styles
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Advanced Job Posting Analysis
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Priority Support
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubscribe} className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Subscribe Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
