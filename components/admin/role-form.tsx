"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createRole } from "@/lib/actions"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Permission } from "@/lib/types"

export function RoleForm({ permissions }: { permissions: Permission[] }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await createRole({
        name,
        description,
        permissionIds: selectedPermissions,
      })

      if (result.success) {
        setSuccess(true)
        setName("")
        setDescription("")
        setSelectedPermissions([])
        router.refresh()
      } else {
        setError(result.error || "Failed to create role. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    )
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
          <AlertDescription>Role created successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Admin, Editor, Viewer"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this role is for"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Permissions</Label>
        <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
          {permissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No permissions available. Please create permissions first.</p>
          ) : (
            permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => togglePermission(permission.id)}
                />
                <Label htmlFor={`permission-${permission.id}`} className="text-sm font-normal cursor-pointer">
                  {permission.name} - {permission.description}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading || selectedPermissions.length === 0}>
        {loading ? "Creating..." : "Create Role"}
      </Button>
    </form>
  )
}
