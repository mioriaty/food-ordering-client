'use client';

import { checkAndRefreshToken } from '@/libs/utils/local-authentication';
import { usePathname } from 'next/navigation';
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

// TODO: Trường hợp đang dùng thì access token hết hạn
export const RefreshToken = () => {
  const pathName = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return;
    let interval: NodeJS.Timeout | undefined = undefined;
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s, thì 1s ra sẽ check 1 lần
    const TIMEOUT_TIME = 1000;
    checkAndRefreshToken();

    interval = setInterval(() => {
      checkAndRefreshToken({
        onError() {
          clearInterval(interval);
        }
      });
    }, TIMEOUT_TIME);

    return () => {
      clearInterval(interval);
    };
  }, [pathName]);

  return null;
};
