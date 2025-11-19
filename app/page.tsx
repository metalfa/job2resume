import Link from "next/link"
import { ArrowRight, CheckCircle, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b w-full">
        <div className="max-w-screen-xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FileText className="h-6 w-6" />
            <span>Job2Resume</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Land Your Dream Jobs with a Tailored Resume
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Our AI-powered platform customizes your resume to match job descriptions, increasing your chances of
                  getting interviews by up to 70%.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button className="px-8 animate-pulse">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Three Simple Steps</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to create a tailored resume in minutes.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-8">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 transition-all hover:shadow-md">
                <div className="rounded-full border bg-white p-2 text-gray-900">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Paste Job Description</h3>
                <p className="text-gray-500">Copy and paste the job description you're interested in applying for.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 transition-all hover:shadow-md">
                <div className="rounded-full border bg-white p-2 text-gray-900">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Upload Your Resume</h3>
                <p className="text-gray-500">Upload your existing resume or choose from our ATS-friendly templates.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 transition-all hover:shadow-md">
                <div className="rounded-full border bg-white p-2 text-gray-900">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Get Tailored Results</h3>
                <p className="text-gray-500">
                  Receive an optimized resume and cover letter tailored to the job description.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose ResumeTailor</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers everything you need to create the perfect resume.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {[
                {
                  title: "AI-Powered Optimization",
                  description:
                    "Our AI analyzes job descriptions to highlight your most relevant skills and experiences.",
                },
                {
                  title: "ATS-Friendly Templates",
                  description: "All our templates are designed to pass through Applicant Tracking Systems.",
                },
                {
                  title: "Custom Cover Letters",
                  description: "Generate personalized cover letters that complement your resume.",
                },
                {
                  title: "Multiple Export Formats",
                  description: "Download your documents in PDF or Word format.",
                },
                {
                  title: "Keyword Optimization",
                  description: "We identify and include key terms from the job description.",
                },
                {
                  title: "Real-Time Preview",
                  description: "See changes to your resume in real-time as you make edits.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-2 rounded-lg border p-4 transition-all hover:shadow-md"
                >
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for your job search needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-8">
              {[
                {
                  name: "Basic",
                  price: "$9.99",
                  description: "Perfect for a single job application",
                  features: ["1 Tailored Resume", "1 Cover Letter", "PDF & Word Downloads", "24-hour support"],
                },
                {
                  name: "Pro",
                  price: "$19.99",
                  description: "Ideal for active job seekers",
                  features: [
                    "5 Tailored Resumes",
                    "5 Cover Letters",
                    "PDF & Word Downloads",
                    "Priority support",
                    "Resume storage",
                  ],
                },
                {
                  name: "Premium",
                  price: "$39.99",
                  description: "For serious job hunters",
                  features: [
                    "Unlimited Resumes",
                    "Unlimited Cover Letters",
                    "All Export Formats",
                    "Priority support",
                    "Resume storage",
                    "LinkedIn profile optimization",
                  ],
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`flex flex-col rounded-lg border p-6 ${index === 1 ? "border-2 border-primary shadow-lg" : ""}`}
                >
                  {index === 1 && (
                    <div className="rounded-full bg-primary px-3 py-1 text-sm text-white w-fit mx-auto -mt-10 mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                    <span className="ml-1 text-sm text-gray-500">/month</span>
                  </div>
                  <p className="mt-2 text-gray-500">{plan.description}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard" className="mt-8">
                    <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50 w-full">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 md:px-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <FileText className="h-6 w-6" />
              <span>ResumeTailor</span>
            </div>
            <p className="text-sm text-gray-500">AI-powered resume and cover letter tailoring for job seekers.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="space-y-4">
              <h4 className="font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Help</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Social</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-gray-500">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            © {new Date().getFullYear()} ResumeTailor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
