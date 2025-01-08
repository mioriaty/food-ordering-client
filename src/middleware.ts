import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/manage'];
const unAuthPaths = ['/login'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = Boolean(request.cookies.get('accessToken')?.value);

  // Chưa login thì chuyển hướng về trang login
  if (protectedPaths.some((path) => pathname.startsWith(path) && !isAuth)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Đã login thì chuyển hướng về trang chính
  if (unAuthPaths.some((path) => pathname.startsWith(path) && isAuth)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Những routes được middleware này quản lý
export const config = {
  matcher: ['/manage/:path*', '/login']
};
