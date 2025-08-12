import { withAuth } from "next-auth/middleware"

export default withAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function middleware(_req) {
    // Middleware function runs after authentication
    // You can add additional logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only protect /pro routes
        if (req.nextUrl.pathname.startsWith('/pro')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/pro/:path*"]
}
