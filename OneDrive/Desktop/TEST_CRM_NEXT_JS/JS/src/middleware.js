import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('🛡️ Middleware: Processing request for', request.nextUrl.pathname);
  
  // Only redirect root path to dashboard, don't interfere with auth routes
  if (request.nextUrl.pathname === '/') {
    console.log('🔄 Middleware: Redirecting / to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/'
};