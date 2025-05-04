import { PermissionForm } from "@/components/admin/permission-form"
import { PermissionsList } from "@/components/admin/permissions-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPermissions } from "@/lib/data"

export default async function PermissionsPage() {
  const permissions = await getPermissions()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Permissions Management</h1>
      <p className="text-muted-foreground">Create and manage permissions that can be assigned to roles.</p>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">All Permissions</TabsTrigger>
          <TabsTrigger value="create">Create Permission</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Permissions</CardTitle>
              <CardDescription>View and manage all permissions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionsList permissions={permissions} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Permission</CardTitle>
              <CardDescription>Add a new permission to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
