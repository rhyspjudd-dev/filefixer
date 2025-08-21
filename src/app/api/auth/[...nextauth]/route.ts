// NextAuth v4 API route  
import NextAuth from "next-auth"
import { authOptions } from "@/lib/authConfig"

// @ts-expect-error NextAuth compatibility issue with Next.js 15
const handler = NextAuth.default ? NextAuth.default(authOptions) : NextAuth(authOptions)

export { handler as GET, handler as POST }
