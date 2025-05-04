import { RoleForm } from "@/components/admin/role-form"
import { RolesList } from "@/components/admin/roles-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPermissions, getRoles } from "@/lib/data"

export default async function RolesPage() {
  const roles = await getRoles()
  const permissions = await getPermissions()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Roles Management</h1>
      <p className="text-muted-foreground">Create and manage roles that can be assigned to users.</p>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">All Roles</TabsTrigger>
          <TabsTrigger value="create">Create Role</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Roles</CardTitle>
              <CardDescription>View and manage all roles in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <RolesList roles={roles} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Role</CardTitle>
              <CardDescription>Add a new role to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <RoleForm permissions={permissions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
