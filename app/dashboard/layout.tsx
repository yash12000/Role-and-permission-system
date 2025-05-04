import type React from "react"
import { UserSidebar } from "@/components/user/user-sidebar"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
