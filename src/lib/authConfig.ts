// Simplified auth config for now - NextAuth v5 integration to be completed later
import { NextResponse } from 'next/server'

// Mock auth function for build purposes
export const auth = async () => null

// Mock handlers for API routes that return proper NextAuth responses
export const handlers = {
  GET: async (request: Request) => {
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const action = pathParts[pathParts.length - 1]
    
    // Handle session endpoint - return null (no active session)
    if (action === 'session') {
      return NextResponse.json(null)
    }
    
    // Handle providers endpoint
    if (action === 'providers') {
      return NextResponse.json({})
    }
    
    // Handle CSRF token endpoint  
    if (action === 'csrf') {
      return NextResponse.json({ csrfToken: 'mock-csrf-token' })
    }
    
    // Handle other endpoints
    return NextResponse.json({ 
      error: 'Authentication not configured' 
    }, { status: 501 })
  },
  POST: async (request: Request) => {
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const action = pathParts[pathParts.length - 1]
    
    // Handle signin endpoint
    if (action === 'signin') {
      return NextResponse.json({
        url: '/signin',
        error: 'Authentication not configured'
      })
    }
    
    // Handle signout endpoint
    if (action === 'signout') {
      return NextResponse.json({ url: '/' })
    }
    
    // Handle callback endpoint
    if (action === 'callback') {
      return NextResponse.json({
        url: '/',
        error: 'Authentication not configured'
      })
    }
    
    return NextResponse.json({ 
      error: 'Authentication not configured' 
    }, { status: 501 })
  }
}

// Configuration placeholder
const OWNER_EMAILS = (process.env.OWNER_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)

console.log('Owner emails configured:', OWNER_EMAILS.length)
