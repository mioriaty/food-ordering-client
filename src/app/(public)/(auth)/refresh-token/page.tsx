'use client';

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/libs/utils/local-authentication';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// WHY: Trường hợp lâu ngày không vào website thì access token hết hạn
export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get('refreshToken');
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess() {
          router.push(redirect ?? '/');
        }
      });
    }
  }, [refreshTokenFromUrl, router, redirect]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Refreshing token...
          </h1>
        </div>
      </div>
    </main>
  );
}
