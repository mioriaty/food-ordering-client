'use client';

import { useAuthContext } from '@/contexts/auth-context';
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
  const { socket, setSocket, disconnectSocket } = useAuthContext();

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return;
    let interval: any = null;
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s, thì 1s ra sẽ check 1 lần
    const TIMEOUT_TIME = 1000;

    const onCheckRefreshToken = (forceToRefresh = false) => {
      checkAndRefreshToken({
        onError() {
          clearInterval(interval);
          disconnectSocket();
          router.push('/login');
        },
        forceToRefresh
      });
    };

    onCheckRefreshToken();

    interval = setInterval(onCheckRefreshToken, TIMEOUT_TIME);

    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log('connected', socket?.id);
    }

    function onDisconnect() {
      console.log('disconnected');
    }

    function onRefreshToken() {
      onCheckRefreshToken(true);
    }

    socket?.on('connect', onConnect);
    socket?.on('disconnect', onDisconnect);
    socket?.on('refresh-token', onRefreshToken);

    return () => {
      clearInterval(interval);
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('refresh-token', onRefreshToken);
    };
  }, [pathName, router, disconnectSocket, socket]);

  return null;
};
