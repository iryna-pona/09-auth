import { NextRequest, NextResponse } from 'next/server';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const res = NextResponse.next();

  try {
    let sessionData;
    try {
      sessionData = await checkServerSession();
    } catch (err) {
      console.error('checkServerSession failed', err);
    }

    const accessToken = sessionData?.data?.accessToken;

    if (accessToken && isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (!accessToken && isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return res;
  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};



