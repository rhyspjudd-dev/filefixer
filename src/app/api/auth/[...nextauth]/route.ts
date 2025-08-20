// NextAuth v4 API route
import { authOptions } from "@/lib/authConfig"
import NextAuth from "next-auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
