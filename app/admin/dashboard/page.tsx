import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPermissionsCount, getRolesCount, getUsersCount } from "@/lib/data"

export default async function AdminDashboardPage() {
  const usersCount = await getUsersCount()
  const rolesCount = await getRolesCount()
  const permissionsCount = await getPermissionsCount()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Manage your users, roles, and permissions from here.</p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Number of users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{usersCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Roles</CardTitle>
            <CardDescription>Number of roles defined</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{rolesCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Permissions</CardTitle>
            <CardDescription>Number of permissions defined</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{permissionsCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
