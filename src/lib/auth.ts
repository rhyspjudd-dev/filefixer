import { auth } from "@/lib/authConfig"
import type { Session } from "next-auth"

export async function getServerSession() {
  return await auth()
}

export function isAdmin(session: Session | null): boolean {
  return !!(session?.user && 'role' in session.user && session.user.role === "admin")
}

// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
      role: "admin" | "user"
      plan: "free" | "pro"
      isPro: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "admin" | "user"
    plan?: "free" | "pro"
    isPro?: boolean
  }
}
