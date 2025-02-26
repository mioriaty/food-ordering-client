import { Role } from '@/libs/constants/type';
import { decodeToken } from '@/libs/utils/decode-token';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const managePaths = ['/manage']; // for owner and employee
const guestPaths = ['/guest'];
const protectedPaths = [...managePaths, ...guestPaths];
const unAuthPaths = ['/login'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request?.cookies?.get('accessToken')?.value;
  const refreshToken = request?.cookies?.get('refreshToken')?.value;

  // 1. Chưa login thì không vào protected paths
  if (protectedPaths.some((path) => pathname.startsWith(path) && !refreshToken)) {
    const url = new URL('/login', request.url);
    url.searchParams.set('clearTokens', 'true');
    return NextResponse.redirect(url);
  }

  // 2. Đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login thì sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }

    // 2.2 access token hết hạn
    if (protectedPaths.some((path) => pathname.startsWith(path) && !accessToken)) {
      const url = new URL('/refresh-token', request.url);
      url.searchParams.set('refreshToken', refreshToken ?? '');
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // 2.3 Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role;
    // Guest nhưng cố vào path của owner
    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path));
    // Không phải guest nhưng cố vào path của guest
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path));

    if (isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Những routes được middleware này quản lý
export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login']
};
