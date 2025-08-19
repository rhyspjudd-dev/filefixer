// Simplified auth utilities - NextAuth integration to be completed later
import type { Session } from "next-auth"
import { cookies } from "next/headers"

export async function getServerSession(): Promise<Session | null> {
  // For development: Check if user wants to simulate being signed in
  const cookieStore = await cookies()
  const mockAuth = cookieStore.get('mock-auth')?.value
  
  // Only return a session if explicitly requested (for testing)
  if (mockAuth === 'true') {
    return {
      user: {
        id: "mock-user-id",
        name: "Development User",
        email: "dev@example.com",
        image: "",
        role: "admin", // Set to "admin" for testing, change to "user" for regular user testing
        plan: "free",
        isPro: false
      }
    }
  }
  
  // By default, return null (no user signed in)
  return null
}

export function isAdmin(session: Session | null): boolean {
  return !!(session?.user && 'role' in session.user && session.user.role === "admin")
}
