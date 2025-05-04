import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import { getUserPermissions } from "@/lib/data"
import { notFound } from "next/navigation"

export default async function PermissionPage({
  params,
}: {
  params: { permission: string }
}) {
  const session = await getSession()
  const permissions = await getUserPermissions(session?.user.id || "")

  const decodedPermission = decodeURIComponent(params.permission)

  const hasPermission = permissions.some((p) => p.slug === decodedPermission)

  if (!hasPermission) {
    notFound()
  }

  const permission = permissions.find((p) => p.slug === decodedPermission)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{permission?.name}</h1>
      <p className="text-muted-foreground">{permission?.description}</p>

      <Card>
        <CardHeader>
          <CardTitle>Permission Details</CardTitle>
          <CardDescription>This is a placeholder page for the {permission?.name} permission</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This is a common placeholder page for all permissions. In a real application, this would be a specific page
            with functionality related to the permission.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
