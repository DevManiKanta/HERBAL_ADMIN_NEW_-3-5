// middleware.js
import { NextResponse } from 'next/server';

/**
 * Middleware to:
 * 1) Redirect root '/' to '/dashboard'
 * 2) Protect certain routes (e.g. /dashboard/*) by checking for an access_token cookie
 *
 * Notes:
 * - Middleware runs on the edge; it can only read cookies/headers (not localStorage).
 * - Prefer server-set HttpOnly cookie for access_token so middleware can read it securely.
 */
export function middleware(request) {
  try {
    const { pathname, search } = request.nextUrl;
    console.log('🛡️ Middleware: Processing request for', pathname);

    // Bypass middleware for Next internals, static assets, API routes and assets with extensions
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.match(/\.[a-zA-Z0-9]+$/) // contains a file extension like .png .js .css
    ) {
      return NextResponse.next();
    }

    // 1) Redirect root '/' to '/dashboard' (keep existing behavior)
    if (pathname === '/') {
      console.log('🔄 Middleware: Redirecting / to /dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Paths that should be considered "public" (no auth needed)
    const PUBLIC_PATHS = [
      '/auth', // sign-in / sign-up pages (will allow nested /auth/*)
      '/auth/sign-in',
      '/auth/sign-up',
      '/auth/reset-pass',
      '/about',
      '/privacy'
    ];

    // If request is for a public path, allow
    if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
      return NextResponse.next();
    }

    // 2) Protect these path prefixes (adjust as needed)
    const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/account', '/app'];

    const isProtected = PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
    );

    if (!isProtected) {
      // not a protected route; allow
      return NextResponse.next();
    }

    // Read cookie named 'access_token' (works in Next.js middleware)
    const tokenCookie = request.cookies.get('access_token');
    const token = tokenCookie?.value ?? null;

    if (!token) {
      // Not authenticated — redirect to sign-in, preserve original path in redirectTo
      const signInUrl = new URL('/auth/sign-in', request.url);
      signInUrl.searchParams.set('redirectTo', pathname + search);
      console.log('🔒 Middleware: No token found — redirecting to sign-in with redirectTo=', signInUrl.toString());
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/account/:path*', '/app/:path*']
};
