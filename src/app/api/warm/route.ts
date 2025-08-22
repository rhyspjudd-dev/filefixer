// Function warming endpoint to prevent cold starts
import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = Date.now()
  
  // Simulate some work to warm up the function
  await new Promise(resolve => setTimeout(resolve, 10))
  
  return NextResponse.json({ 
    status: 'warmed',
    timestamp: new Date().toISOString(),
    warm_time_ms: Date.now() - startTime,
    message: 'Netlify function is now warm',
    platform: 'netlify'
  })
}

// Remove edge runtime for Netlify compatibility
// export const runtime = 'edge'
