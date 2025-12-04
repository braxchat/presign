import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  
  // Clear shop cookie
  cookieStore.delete('shop');
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('shop');
  
  return response;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  
  // Clear shop cookie
  cookieStore.delete('shop');
  
  const response = NextResponse.redirect(
    `${process.env.APP_BASE_URL || '/'}/login`
  );
  response.cookies.delete('shop');
  
  return response;
}

