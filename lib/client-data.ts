"use client"

export async function getUserPermissions() {
  const response = await fetch("/api/user/permissions")

  if (!response.ok) {
    throw new Error("Failed to fetch permissions")
  }

  return response.json()
}
