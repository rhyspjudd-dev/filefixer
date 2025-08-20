// NextAuth v4 API route  
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { enhanceSessionWithProStatus } from "@/lib/auth"

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session }: { session: any }) {
      // Enhance session with Pro status
      return await enhanceSessionWithProStatus(session)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      // Pass through user data to session
      if (user) {
        token.role = user.role || "user"
      }
      return token
    },
    async redirect(): Promise<string> {
      // Always redirect to home page after successful sign in
      return "/"
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: "jwt" as const,
  },
}

// @ts-expect-error NextAuth compatibility issue with Next.js 15
const handler = NextAuth.default ? NextAuth.default(authOptions) : NextAuth(authOptions)

export { handler as GET, handler as POST }
