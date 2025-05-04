"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions"
import { LayoutDashboard, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { getUserPermissions } from "@/lib/client-data"
import type { Permission } from "@/lib/types"

export function UserSidebar() {
  const pathname = usePathname()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getUserPermissions()
        setPermissions(data)
      } catch (error) {
        console.error("Failed to fetch permissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-50">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">User Panel</h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              pathname === "/dashboard"
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Loading permissions...</div>
          ) : permissions.length > 0 ? (
            permissions.map((permission) => (
              <Link
                key={permission.id}
                href={`/dashboard/${encodeURIComponent(permission.slug)}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  pathname === `/dashboard/${encodeURIComponent(permission.slug)}`
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {permission.name}
              </Link>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">No permissions assigned</div>
          )}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
