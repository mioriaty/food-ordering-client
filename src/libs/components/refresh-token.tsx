'use client';

import { checkAndRefreshToken } from '@/libs/utils/local-authentication';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Những page không check refresh token
const UNAUTHENTICATED_PATHS = [
  '/login',
  '/logout',
  '/refresh-token'
  // '/register',
  // '/forgot-password',
  // '/reset-password'
];

// WHY: Trường hợp đang dùng thì access token hết hạn
export const RefreshToken = () => {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return;
    let interval: NodeJS.Timeout | undefined = undefined;
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s, thì 1s ra sẽ check 1 lần
    const TIMEOUT_TIME = 1000;
    checkAndRefreshToken({
      onError() {
        clearInterval(interval);
        router.push('/login');
      }
    });

    interval = setInterval(() => {
      checkAndRefreshToken({
        onError() {
          clearInterval(interval);
          router.push('/login');
        }
      });
    }, TIMEOUT_TIME);

    return () => {
      clearInterval(interval);
    };
  }, [pathName, router]);

  return null;
};
