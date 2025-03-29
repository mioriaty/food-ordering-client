import { Role } from '@/libs/constants/type';
import { decodeToken } from '@/libs/utils/decode-token';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

const managePaths = ['/vi/manage', '/en/manage']; // for owner and employee
const guestPaths = ['/vi/guest', '/en/guest'];
const protectedPaths = [...managePaths, ...guestPaths];
const unAuthPaths = ['/vi/login', '/en/login'];
const ownerPaths = ['/vi/manage/accounts', '/en/manage/accounts'];
const loginPaths = ['/vi/login', '/en/login'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);

  const response = handleI18nRouting(request);

  response.headers.set('x-default-locale', routing.defaultLocale);

  const { pathname, searchParams } = request.nextUrl;

  const accessToken = request?.cookies?.get('accessToken')?.value;
  const refreshToken = request?.cookies?.get('refreshToken')?.value;
  const locale = request?.cookies?.get('NEXT_LOCALE')?.value ?? routing.defaultLocale;

  // 1. Chưa login thì không vào protected paths
  if (protectedPaths.some((path) => pathname.startsWith(path) && !refreshToken)) {
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set('clearTokens', 'true');
    // response.headers.set('x-middleware-rewrite', url.toString());
    // return response;
    return NextResponse.redirect(url);
  }

  // 2. Đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login thì sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      const accessToken = searchParams.get('accessToken');

      if (loginPaths.some((path) => pathname.startsWith(path)) && accessToken) {
        return response;
      }

      const url = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(url);
    }

    // 2.2 access token hết hạn
    if (protectedPaths.some((path) => pathname.startsWith(path) && !accessToken)) {
      const url = new URL(`/${locale}/refresh-token`, request.url);
      url.searchParams.set('refreshToken', refreshToken ?? '');
      url.searchParams.set('redirect', pathname);
      // response.headers.set('x-middleware-rewrite', url.toString());
      // return response;
      return NextResponse.redirect(url);
    }

    // 2.3 Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role;
    // Guest nhưng cố vào path của owner
    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path));
    // Không phải guest nhưng cố vào path của guest
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path));
    // Không phải Owner nhưng cố trình truy cập vào path của owner
    const isNotOwnerGoToOwnerPath = role !== Role.Owner && ownerPaths.some((path) => pathname.startsWith(path));

    if (isGuestGoToManagePath || isNotGuestGoToGuestPath || isNotOwnerGoToOwnerPath) {
      const url = new URL(`/${locale}`, request.url);
      // response.headers.set('x-middleware-rewrite', url.toString());
      // return response;
      return NextResponse.redirect(url);
    }

    return response;
  }

  return response;
}

// Những routes được middleware này quản lý
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};
