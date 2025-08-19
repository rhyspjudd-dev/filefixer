import { NextRequest, NextResponse } from 'next/server';
import { isUserPro } from '@/lib/proStorage';

export const runtime = 'nodejs'; // Ensure this runs in Node.js runtime

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const isPro = await isUserPro(email);
    
    return NextResponse.json({ isPro });
  } catch (error) {
    console.error('Error checking pro status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
