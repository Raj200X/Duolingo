import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('chamelo_session');
  const pathname = request.nextUrl.pathname;
  
  const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/register';
                     
  // If the user is NOT logged in and trying to access a protected route (anything other than auth pages)
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If the user IS logged in and trying to access the landing or auth pages, send them to their dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/learn', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|coming-soon|.*\\..*).*)'],
};
