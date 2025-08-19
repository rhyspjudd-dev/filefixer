import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Only protect /pro routes
  if (req.nextUrl.pathname.startsWith('/pro')) {
    try {
      // For now, redirect all /pro routes to pricing
      // This will be updated when OAuth is fully configured
      const pricingUrl = new URL('/pricing', req.url)
      return NextResponse.redirect(pricingUrl)
    } catch (error) {
      console.error('Auth check error:', error)
      // If auth fails, redirect to home
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/pro/:path*"]
}
