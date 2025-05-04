"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  createPermissionInDB,
  createRoleInDB,
  createUserInDB,
  deletePermissionFromDB,
  deleteRoleFromDB,
  deleteUserFromDB,
  getUserByLoginId,
} from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/auth"

export async function login(loginId: string, password: string) {
  try {
    if (loginId === "admin123" && password === "Pass@123") {
      const session = {
        user: {
          id: "admin",
          name: "Administrator",
          loginId: "admin123",
          isAdmin: true,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      cookies().set("session", JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
      })

      return { success: true, isAdmin: true }
    }

    const user = await getUserByLoginId(loginId)

    if (!user) {
      return { success: false, error: "Invalid login credentials" }
    }

    const passwordValid = await verifyPassword(password, user.password)

    if (!passwordValid) {
      return { success: false, error: "Invalid login credentials" }
    }

    const session = {
      user: {
        id: user.id,
        name: user.name,
        loginId: user.loginId,
        isAdmin: user.isAdmin,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return { success: true, isAdmin: user.isAdmin }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logout() {
  cookies().delete("session")
  return { success: true }
}

export async function createPermission(data: {
  name: string
  description: string
}) {
  try {
    await createPermissionInDB(data)
    revalidatePath("/admin/permissions")
    return { success: true }
  } catch (error) {
    console.error("Create permission error:", error)
    return {
      success: false,
      error: "Failed to create permission. It might already exist.",
    }
  }
}

export async function deletePermission(id: string) {
  try {
    await deletePermissionFromDB(id)
    revalidatePath("/admin/permissions")
    revalidatePath("/admin/roles")
    return { success: true }
  } catch (error) {
    console.error("Delete permission error:", error)
    return { success: false, error: "Failed to delete permission" }
  }
}

export async function createRole(data: {
  name: string
  description: string
  permissionIds: string[]
}) {
  try {
    await createRoleInDB(data)
    revalidatePath("/admin/roles")
    return { success: true }
  } catch (error) {
    console.error("Create role error:", error)
    return {
      success: false,
      error: "Failed to create role. It might already exist.",
    }
  }
}

export async function deleteRole(id: string) {
  try {
    await deleteRoleFromDB(id)
    revalidatePath("/admin/roles")
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Delete role error:", error)
    return { success: false, error: "Failed to delete role" }
  }
}

export async function createUser(data: {
  name: string
  loginId: string
  password: string
  isAdmin: boolean
  roleIds: string[]
}) {
  try {
    const hashedPassword = await hashPassword(data.password)
    await createUserInDB({
      ...data,
      password: hashedPassword,
    })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Create user error:", error)
    return {
      success: false,
      error: "Failed to create user. The login ID might already be taken.",
    }
  }
}

export async function deleteUser(id: string) {
  try {
    await deleteUserFromDB(id)
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Delete user error:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
