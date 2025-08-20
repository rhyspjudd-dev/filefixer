// Auth utilities with NextAuth integration
import type { Session } from "next-auth"
import { getServerSession as nextAuthGetServerSession } from "next-auth/next"
import { cookies } from "next/headers"
import { getProUserDetails } from "./proStorage"
import { authOptions } from "./authConfig"

export async function getServerSession(): Promise<Session | null> {
  // Try to get real NextAuth session first
  try {
    const session = await nextAuthGetServerSession(authOptions)
    if (session) {
      return await enhanceSessionWithProStatus(session)
    }
  } catch (error) {
    // If NextAuth fails (e.g., no env vars), fall back to mock auth for development
    console.log('NextAuth not configured, using mock auth for development')
  }
  
  // For development: Check if user wants to simulate being signed in
  const cookieStore = await cookies()
  const mockAuth = cookieStore.get('mock-auth')?.value
  
  // Only return a session if explicitly requested (for testing)
  if (mockAuth === 'true') {
    const email = "dev@example.com"
    
    // Check if this user has Pro status
    const proDetails = await getProUserDetails(email)
    
    return {
      user: {
        id: "mock-user-id",
        name: "Development User",
        email: email,
        image: "",
        role: "admin", // Set to "admin" for testing, change to "user" for regular user testing
        plan: proDetails?.plan || "free",
        isPro: !!proDetails
      }
    }
  }
  
  // By default, return null (no user signed in)
  return null
}

/**
 * Enhanced session handler that checks Pro status for real OAuth users
 * This will be called after successful OAuth authentication
 */
export async function enhanceSessionWithProStatus(session: Session): Promise<Session> {
  if (!session.user?.email) {
    return session
  }
  
  const userEmail = session.user.email.toLowerCase().trim()
  
  // Configuration for owner emails
  const OWNER_EMAILS = (process.env.OWNER_EMAILS || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
  
  // Check if user is an owner (auto-Pro)
  const isOwner = OWNER_EMAILS.includes(userEmail)
  
  // Check if user has Pro status based on Lemon Squeezy payments
  const proDetails = await getProUserDetails(session.user.email)
  
  // User is Pro if they're an owner OR have paid for Pro
  const isPro = isOwner || !!proDetails
  const plan = proDetails?.plan || "free"
  
  return {
    ...session,
    user: {
      ...session.user,
      plan: plan,
      isPro: isPro,
      role: isOwner ? "admin" : "user"
    }
  }
}

/**
 * Get checkout URL with user email pre-filled
 * This ensures purchases are linked to the correct user account
 */
export function getCheckoutUrl(productUrl: string, userEmail?: string): string {
  if (!userEmail) {
    return productUrl
  }
  
  // Add email as URL parameter for better tracking
  const url = new URL(productUrl)
  url.searchParams.set('checkout[email]', userEmail)
  url.searchParams.set('checkout[custom][user_email]', userEmail)
  
  return url.toString()
}

export function isAdmin(session: Session | null): boolean {
  return !!(session?.user && 'role' in session.user && session.user.role === "admin")
}
