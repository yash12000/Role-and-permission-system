"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createUser } from "@/lib/actions"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Role } from "@/lib/types"

export function UserForm({ roles }: { roles: Role[] }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await createUser({
        name,
        loginId,
        password,
        isAdmin,
        roleIds: selectedRoles,
      })

      if (result.success) {
        setSuccess(true)
        setName("")
        setLoginId("")
        setPassword("")
        setIsAdmin(false)
        setSelectedRoles([])
        router.refresh()
      } else {
        setError(result.error || "Failed to create user. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>User created successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="loginId">Login ID</Label>
        <Input
          id="loginId"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          placeholder="john.doe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="isAdmin" checked={isAdmin} onCheckedChange={(checked) => setIsAdmin(checked === true)} />
        <Label htmlFor="isAdmin" className="font-normal cursor-pointer">
          Make this user an administrator
        </Label>
      </div>

      <div className="space-y-2">
        <Label>Roles</Label>
        <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
          {roles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No roles available. Please create roles first.</p>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={() => toggleRole(role.id)}
                />
                <Label htmlFor={`role-${role.id}`} className="text-sm font-normal cursor-pointer">
                  {role.name} - {role.description}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  )
}
