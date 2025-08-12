import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyCognitoToken } from './lib/verifyCognitoToken';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public access only to /login
  const isPublicPath = pathname === '/login';

  const token = req.cookies.get('cognito_token');

  const user = token ? await verifyCognitoToken(token.value) : null;

  if (!user) {
    // Not logged in
    if (!isPublicPath) {
      // Redirect any page except /login to /login
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next(); // allow /login
  }

  // Logged in user can access anything including /, /dashboard, /login, etc.
  // Optional: redirect logged-in user away from /login to dashboard
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], // middleware runs on all routes
};
