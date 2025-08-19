// For now, use the existing mock system - NextAuth v5 beta integration will be completed when OAuth credentials are ready

// Check if OAuth is configured
export const isOAuthConfigured = !!(
  process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.NEXTAUTH_SECRET
)

// Import the existing mock handlers for now
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { handlers: mockHandlers } = require('./authConfig')

// Export mock handlers - these will work for development and can be replaced with real NextAuth later
export const handlers = mockHandlers
export const auth = async () => null
export const signIn = async () => { throw new Error("OAuth not configured - add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to activate") }
export const signOut = async () => { throw new Error("OAuth not configured - add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to activate") }

/*
TODO: When ready to activate OAuth, uncomment and configure this:

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { enhanceSessionWithProStatus } from "./auth"

const OWNER_EMAILS = (process.env.OWNER_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn({ user }: any) {
      return !!(user.email)
    },
    async jwt({ token, user }: any) {
      if (user && user.email) {
        token.id = user.id
        token.email = user.email
        token.role = OWNER_EMAILS.includes(user.email.toLowerCase()) ? "admin" : "user"
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as "admin" | "user") || "user"
        
        try {
          session = await enhanceSessionWithProStatus(session)
        } catch (error) {
          console.error("Error enhancing session:", error)
        }
      }
      return session
    }
  },
  session: {
    strategy: "jwt" as const
  },
  secret: process.env.NEXTAUTH_SECRET,
})
*/
