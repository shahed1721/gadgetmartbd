import { NextResponse } from 'next/server';

export function middleware(request) {
  // ইউজারের ব্রাউজারে 'admin_auth' কুকি আছে কি না চেক করা
  const isAuthenticated = request.cookies.get('admin_auth');

  // যদি ইউজার /admin লিংকে যায় এবং লগিন করা না থাকে
  if (request.nextUrl.pathname.startsWith('/admin') && !isAuthenticated) {
    // তাকে জোর করে /login পেজে পাঠিয়ে দেওয়া হবে
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// এই মিডলওয়্যারটি শুধু /admin এবং তার ভেতরের পেজগুলোতে কাজ করবে
export const config = {
  matcher: '/admin/:path*',
};