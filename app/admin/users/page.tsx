import { UserForm } from "@/components/admin/user-form"
import { UsersList } from "@/components/admin/users-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getRoles, getUsers } from "@/lib/data"

export default async function UsersPage() {
  const users = await getUsers()
  const roles = await getRoles()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users Management</h1>
      <p className="text-muted-foreground">Create and manage users and their roles.</p>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">All Users</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersList users={users} roles={roles} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create User</CardTitle>
              <CardDescription>Add a new user to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <UserForm roles={roles} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
