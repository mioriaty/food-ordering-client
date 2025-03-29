'use client';

import { useLogoutMutation } from '@/infrastructure/queries/useAuth';
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/libs/utils/local-authentication';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, memo, useEffect, useRef } from 'react';

function LogoutComponent() {
  const { mutateAsync } = useLogoutMutation();
  const ref = useRef<typeof mutateAsync | null>(null);
  const searchParams = useSearchParams();
  const setRole = useAuthStore((state) => state.setRole);
  const disconnectSocket = useAuthStore((state) => state.disconnectSocket);
  const refreshTokenFromUrl = searchParams.get('refreshToken');
  const accessTokenFromUrl = searchParams.get('accessToken');
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu ref.current đã có giá trị thì return để tránh gọi logout nhiều lần
    const currentRefreshToken = getRefreshTokenFromLocalStorage();
    const currentAccessToken = getAccessTokenFromLocalStorage();
    const matchAccessToken = accessTokenFromUrl && accessTokenFromUrl === currentAccessToken;
    const matchRefreshToken = refreshTokenFromUrl && refreshTokenFromUrl === currentRefreshToken;

    const shouldLogin = !ref.current && (matchRefreshToken || matchAccessToken);

    if (shouldLogin) {
      ref.current = mutateAsync;

      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setRole(undefined);
        disconnectSocket();
      });
    } else if (accessTokenFromUrl !== currentRefreshToken) {
      router.push('/');
    }
  }, [mutateAsync, refreshTokenFromUrl, accessTokenFromUrl, setRole, disconnectSocket, router]);

  return null;
}

const Logout = memo(() => {
  return (
    <Suspense>
      <LogoutComponent />
    </Suspense>
  );
});

Logout.displayName = 'Logout';

export default Logout;
