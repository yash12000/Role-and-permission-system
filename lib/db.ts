"use server"

import { v4 as uuidv4 } from "uuid"
import { slugify } from "@/lib/utils"
import type { Permission, Role, User } from "@/lib/types"


let permissions: Permission[] = [
  {
    id: "perm-1",
    name: "View Dashboard",
    description: "Allows user to view the main dashboard",
    slug: "view-dashboard",
  },
  {
    id: "perm-2",
    name: "Manage Reports",
    description: "Allows user to view and generate reports",
    slug: "manage-reports",
  },
  {
    id: "perm-3",
    name: "View Analytics",
    description: "Allows user to view analytics data",
    slug: "view-analytics",
  },
]

let roles: Role[] = [
  {
    id: "role-1",
    name: "Basic User",
    description: "Basic user with limited permissions",
    permissions: ["perm-1"],
  },
  {
    id: "role-2",
    name: "Manager",
    description: "Manager with access to reports",
    permissions: ["perm-1", "perm-2"],
  },
  {
    id: "role-3",
    name: "Analyst",
    description: "Analyst with access to analytics",
    permissions: ["perm-1", "perm-3"],
  },
]

let users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    loginId: "john.doe",
    password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // password
    isAdmin: false,
    roles: ["role-1"],
  },
  {
    id: "user-2",
    name: "Jane Smith",
    loginId: "jane.smith",
    password: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f", // 12345678
    isAdmin: false,
    roles: ["role-2"],
  },
  {
    id: "user-3",
    name: "Alex Johnson",
    loginId: "alex.johnson",
    password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // 123456
    isAdmin: false,
    roles: ["role-3"],
  },
]

export async function getPermissionsFromDB(): Promise<Permission[]> {
  return [...permissions]
}

export async function createPermissionInDB(data: {
  name: string
  description: string
}): Promise<Permission> {
  const slug = slugify(data.name)

  if (permissions.some((p) => slugify(p.name) === slug)) {
    throw new Error("Permission with this name already exists")
  }

  const newPermission: Permission = {
    id: `perm-${uuidv4()}`,
    name: data.name,
    description: data.description,
    slug,
  }

  permissions.push(newPermission)
  return newPermission
}

export async function deletePermissionFromDB(id: string): Promise<void> {
  roles = roles.map((role) => ({
    ...role,
    permissions: role.permissions.filter((permId) => permId !== id),
  }))

  permissions = permissions.filter((permission) => permission.id !== id)
}

export async function getRolesFromDB(): Promise<Role[]> {
  return roles.map((role) => ({
    ...role,
    permissions: role.permissions.map((permId) => {
      const permission = permissions.find((p) => p.id === permId)
      return (
        permission || {
          id: permId,
          name: "Unknown Permission",
          description: "This permission no longer exists",
          slug: "unknown",
        }
      )
    }),
  }))
}

export async function createRoleInDB(data: {
  name: string
  description: string
  permissionIds: string[]
}): Promise<Role> {
  if (roles.some((r) => r.name.toLowerCase() === data.name.toLowerCase())) {
    throw new Error("Role with this name already exists")
  }

  const newRole: Role = {
    id: `role-${uuidv4()}`,
    name: data.name,
    description: data.description,
    permissions: data.permissionIds,
  }

  roles.push(newRole)
  return newRole
}

export async function deleteRoleFromDB(id: string): Promise<void> {
  users = users.map((user) => ({
    ...user,
    roles: user.roles.filter((roleId) => roleId !== id),
  }))

  roles = roles.filter((role) => role.id !== id)
}

export async function getUsersFromDB(): Promise<User[]> {
  return users.map(({ password, ...user }) => ({
    ...user,
    password: "••••••••",
  }))
}

export async function getUserByLoginId(loginId: string): Promise<User | null> {
  return users.find((user) => user.loginId === loginId) || null
}

export async function createUserInDB(data: {
  name: string
  loginId: string
  password: string
  isAdmin: boolean
  roleIds: string[]
}): Promise<User> {
  if (users.some((u) => u.loginId.toLowerCase() === data.loginId.toLowerCase())) {
    throw new Error("User with this login ID already exists")
  }

  const newUser: User = {
    id: `user-${uuidv4()}`,
    name: data.name,
    loginId: data.loginId,
    password: data.password,
    isAdmin: data.isAdmin,
    roles: data.roleIds,
  }

  users.push(newUser)
  return newUser
}

export async function deleteUserFromDB(id: string): Promise<void> {
  users = users.filter((user) => user.id !== id)
}

export async function getUserPermissionsFromDB(userId: string): Promise<Permission[]> {
  if (userId === "admin") {
    return permissions
  }

  const user = users.find((u) => u.id === userId)

  if (!user) {
    return []
  }

  const userRoles = roles.filter((role) => user.roles.includes(role.id))

  const permissionIds = new Set<string>()
  userRoles.forEach((role) => {
    role.permissions.forEach((permId) => {
      permissionIds.add(permId)
    })
  })

  return permissions.filter((permission) => permissionIds.has(permission.id))
}
