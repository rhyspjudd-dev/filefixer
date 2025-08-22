// Temporary debug endpoint to check OAuth configuration
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const debug = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
  }
  
  return NextResponse.json(debug)
}
