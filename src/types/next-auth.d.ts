// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
      role: "admin" | "user"
      plan: "free" | "monthly" | "yearly" | "lifetime"
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
    plan?: "free" | "monthly" | "yearly" | "lifetime"
    isPro?: boolean
  }
}
