import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/products/') && pathname !== '/products/all';
  
  // কুকি চেক: শুধুমাত্র 'true' থাকলেই পাস করবে, অন্যথায় নয়
  const cookieVal = request.cookies.get('isLoggedIn')?.value;
  const isLoggedIn = cookieVal === 'true';

  if (isProtectedRoute && !isLoggedIn) {
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('redirectUrl', pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:path*'],
};