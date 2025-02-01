import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/manage'];
const unAuthPaths = ['/login'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request?.cookies?.get('accessToken')?.value;
  const refreshToken = request?.cookies?.get('refreshToken')?.value;

  // Chưa login thì chuyển hướng về trang login
  if (protectedPaths.some((path) => pathname.startsWith(path) && !refreshToken)) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Đã login thì chuyển hướng về trang chính
  if (unAuthPaths.some((path) => pathname.startsWith(path) && refreshToken)) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  // Đây là trường hợp accessToken hết hạn và refresh token còn hạn
  if (protectedPaths.some((path) => pathname.startsWith(path) && !accessToken && refreshToken)) {
    const url = new URL('/logout', request.url);
    url.searchParams.set('refreshToken', refreshToken ?? '');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Những routes được middleware này quản lý
export const config = {
  matcher: ['/manage/:path*', '/login']
};
