import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import { getUserPermissions } from "@/lib/data"

export default async function DashboardPage() {
  const session = await getSession()
  const permissions = await getUserPermissions(session?.user.id || "")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {session?.user.name}</p>

      <Card>
        <CardHeader>
          <CardTitle>Your Permissions</CardTitle>
          <CardDescription>These are the permissions assigned to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {permissions.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {permissions.map((permission) => (
                <li key={permission.id}>
                  {permission.name} - {permission.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>You don't have any permissions assigned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
