import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { NextAuthProvider } from "./providers" // New Provider
import Link from "next/link"
import { FileText, Home, Settings, User } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import SignOutButton from "@/components/auth/SignOutButton" // New Component

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ResumeTailor - Dashboard",
  description: "AI-Powered Resume and Cover Letter Generator Dashboard.",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="min-h-screen flex flex-col">
              {session && ( // Only show header if user is logged in
                <header className="border-b bg-white">
                  <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                      <FileText className="h-6 w-6" />
                      <span>Job2Resume</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                      <Link href="/settings" className="text-sm font-medium hover:underline underline-offset-4">
                        Settings
                      </Link>
                      <div className="flex items-center gap-2">
                        {session.user?.image ? (
                          <img
                            src={session.user.image || "/placeholder.svg"}
                            alt="User"
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                        <SignOutButton />
                      </div>
                    </nav>
                  </div>
                </header>
              )}

              <div className="flex flex-1">
                {session && ( // Only show sidebar if user is logged in
                  <aside className="w-16 md:w-64 border-r bg-white hidden md:block">
                    <div className="p-4">
                      <nav className="space-y-2">
                        <Link
                          href="/"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Home className="h-5 w-5" />
                          <span className="hidden md:inline-block">Dashboard</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Settings className="h-5 w-5" />
                          <span className="hidden md:inline-block">Settings</span>
                        </Link>
                      </nav>
                    </div>
                  </aside>
                )}
                <main className={`flex-1 overflow-auto ${!session ? "h-screen flex items-center justify-center" : ""}`}>
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
