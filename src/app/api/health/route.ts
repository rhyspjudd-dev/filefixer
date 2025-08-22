// Health check endpoint to debug production performance
import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = Date.now()
  
  try {
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nextauth_url: process.env.NEXTAUTH_URL || 'NOT SET',
      google_client_configured: !!process.env.GOOGLE_CLIENT_ID,
      response_time_ms: Date.now() - startTime
    }
    
    return NextResponse.json(healthCheck)
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error',
      response_time_ms: Date.now() - startTime 
    }, { status: 500 })
  }
}
