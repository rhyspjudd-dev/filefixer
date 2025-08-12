import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

const OWNER_EMAILS = (process.env.OWNER_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      // On initial sign in, save user info
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        
        // Check if user is owner/admin
        const isOwner = token.email && OWNER_EMAILS.includes(token.email.toLowerCase())
        token.role = isOwner ? "admin" : "user"
        token.plan = isOwner ? "pro" : (token.plan ?? "free")
        token.isPro = token.role === "admin" || token.plan === "pro"
      }
      
      return token
    },
    session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).role = token.role as "admin" | "user"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).plan = token.plan as "free" | "pro"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).isPro = token.isPro as boolean
      }
      
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
}
