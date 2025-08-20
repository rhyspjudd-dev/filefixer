import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { enhanceSessionWithProStatus } from "./auth"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session }: { session: any }) {
      // Enhance session with Pro status
      return await enhanceSessionWithProStatus(session)
    },
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

// Configuration for owner emails
const OWNER_EMAILS = (process.env.OWNER_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)

console.log('Owner emails configured:', OWNER_EMAILS.length)
