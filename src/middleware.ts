import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/admin_dashboard', '/create_collection', '/edit_collection', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('crowdraise_auth')?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin_dashboard/:path*',
    '/create_collection/:path*',
    '/edit_collection/:path*',
    '/profile/:path*',
  ],
};
