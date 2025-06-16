import type React from "react"
import Link from "next/link"
import { cookies } from "next/headers"
import { FileText, Home, Settings, User } from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  // SidebarRail, // You can add SidebarRail here if you want a draggable edge
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button" // For user icon button

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  // Default to open if cookie is not set or is "true"
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-900">
        <header className="border-b bg-white dark:bg-neutral-800 dark:border-neutral-700 sticky top-0 z-30">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              {/* SidebarTrigger will be visible on mobile to toggle Sheet, and on desktop to toggle sidebar */}
              <SidebarTrigger className="h-8 w-8" />
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <FileText className="h-6 w-6" />
                <span>Job2Resume</span>
              </Link>
            </div>
            <nav className="flex items-center gap-4">
              {/* Example: Settings link in header, could be moved to sidebar exclusively */}
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <User className="h-5 w-5" />
                <span className="sr-only">User Profile</span>
              </Button>
            </nav>
          </div>
        </header>

        <div className="flex flex-1">
          <Sidebar
            collapsible="icon"
            variant="sidebar" // Default variant, can be "inset" or "floating"
            className="bg-white dark:bg-neutral-800 dark:border-neutral-700 hidden md:flex" // Ensure it's part of the flex layout on desktop
          >
            <SidebarContent className="p-2 pt-4">
              {" "}
              {/* Added some padding */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{ children: "Dashboard", sideOffset: 6 }}>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-neutral-700"
                    >
                      <Home className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{ children: "Settings", sideOffset: 6 }}>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-neutral-700"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            {/* <SidebarRail /> You can add this for a draggable edge */}
          </Sidebar>

          {/*
            SidebarInset handles the main content area adjustment.
            It uses CSS variables set by SidebarProvider and Sidebar
            to adjust its margins based on the sidebar's state and variant.
          */}
          <SidebarInset>
            {/* The main content from page.tsx will be rendered here */}
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
