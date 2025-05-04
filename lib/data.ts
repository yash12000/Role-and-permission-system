"use server"

import { getPermissionsFromDB, getRolesFromDB, getUserPermissionsFromDB, getUsersFromDB } from "@/lib/db"

export async function getPermissions() {
  return getPermissionsFromDB()
}

export async function getRoles() {
  return getRolesFromDB()
}

export async function getUsers() {
  return getUsersFromDB()
}

export async function getUserPermissions(userId: string) {
  return getUserPermissionsFromDB(userId)
}

export async function getPermissionsCount() {
  const permissions = await getPermissionsFromDB()
  return permissions.length
}

export async function getRolesCount() {
  const roles = await getRolesFromDB()
  return roles.length
}

export async function getUsersCount() {
  const users = await getUsersFromDB()
  return users.length
}
