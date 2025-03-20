'use client';

import { useRouter } from '@/i18n/navigation';
import { useLogoutMutation } from '@/infrastructure/queries/useAuth';
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/libs/utils/local-authentication';
import { useAuthStore } from '@/stores/auth.store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function LogoutPageContent() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<typeof mutateAsync | null>(null);
  const searchParams = useSearchParams();
  const setRole = useAuthStore((state) => state.setRole);
  const disconnectSocket = useAuthStore((state) => state.disconnectSocket);
  const refreshTokenFromUrl = searchParams.get('refreshToken');
  const accessTokenFromUrl = searchParams.get('accessToken');

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
        router.push('/login');
      });
    } else {
      router.push('/');
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole, disconnectSocket]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Logging out...
          </h1>
        </div>
      </div>
    </main>
  );
}
