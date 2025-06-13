import type React from "react"
import Link from "next/link"
import { FileText, Home, Settings, User } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FileText className="h-6 w-6" />
            <span>Job2Resume4">
            <Link href="/dashboard/settings" className="text-sm font-medium hover:underline underline-offset-4">
              Settings
            </Link>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-16 md:w-64 border-r bg-white hidden md:block">
          <div className="p-4">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
              >
                <Home className="h-5 w-5" />
                <span className="hidden md:inline-block">Dashboard</span>
              </Link>
              <Link
                href="/dashboard/results"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
              >
                <FileText className="h-5 w-5" />
                <span className="hidden md:inline-block">My Documents</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
                <span className="hidden md:inline-block">Settings</span>
              </Link>
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
