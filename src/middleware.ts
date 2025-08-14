import { auth } from "@/lib/authConfig"
import { NextResponse } from "next/server"

export default auth((req) => {
  // Only protect /pro routes
  if (req.nextUrl.pathname.startsWith('/pro')) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: ["/pro/:path*"]
}
