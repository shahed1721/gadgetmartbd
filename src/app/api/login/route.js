import { NextResponse } from 'next/server';

export async function POST(request) {
  const { password } = await request.json();

  // .env ফাইলের বদলে সরাসরি পাসওয়ার্ড চেক করা হচ্ছে
  if (password === 'Ss66181015@') {
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('admin_auth', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });
    
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}