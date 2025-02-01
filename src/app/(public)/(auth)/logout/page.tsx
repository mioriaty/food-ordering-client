'use client';

import { useLogoutMutation } from '@/infrastructure/queries/useAuth';
import { getRefreshTokenFromLocalStorage } from '@/libs/utils/local-authentication';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<typeof mutateAsync | null>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get('refreshToken');

  useEffect(() => {
    // Kiểm tra nếu ref.current đã có giá trị thì return để tránh gọi logout nhiều lần
    if (ref.current || refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) return;

    ref.current = mutateAsync;

    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);

      router.push('/login');
    });
  }, [mutateAsync, router, refreshTokenFromUrl]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Logout page
          </h1>
        </div>
      </div>
    </main>
  );
}
