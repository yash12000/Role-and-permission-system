import { cookies } from "next/headers"
import { createHash } from "crypto"

export async function hashPassword(password: string): Promise<string> {
  return createHash("sha256").update(password).digest("hex")
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashed = await hashPassword(password)
  return hashed === hashedPassword
}

export async function getSession() {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)

    if (new Date(session.expires) < new Date()) {
      cookies().delete("session")
      return null
    }

    return session
  } catch (error) {
    return null
  }
}
