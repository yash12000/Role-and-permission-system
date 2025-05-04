import { getSession } from "@/lib/auth"
import { getUserPermissionsFromDB } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    })
  }

  try {
    const permissions = await getUserPermissionsFromDB(session.user.id)
    return NextResponse.json(permissions)
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch permissions" }), { status: 500 })
  }
}
