import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Only protect /pro routes - simplified for now
  if (req.nextUrl.pathname.startsWith('/pro')) {
    // For now, allow all access - auth integration to be completed
    console.log('Pro route accessed:', req.nextUrl.pathname)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/pro/:path*"]
}
