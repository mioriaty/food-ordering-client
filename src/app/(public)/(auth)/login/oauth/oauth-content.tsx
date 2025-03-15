'use client';

import { useSetTokenToCookieMutation } from '@/infrastructure/queries/useAuth';
import { toast } from '@/libs/components/ui/use-toast';
import { decodeToken } from '@/libs/utils/decode-token';
import { initSocketInstance } from '@/libs/utils/init-socket';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const OAuthContent = () => {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const setRole = useAuthStore((state) => state.setRole);
  const setSocket = useAuthStore((state) => state.setSocket);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const message = searchParams.get('message');
  const ref = useRef(0);

  useEffect(() => {
    if (ref.current !== 0) return;

    if (accessToken && refreshToken) {
      mutateAsync({ accessToken, refreshToken })
        .then(() => {
          setRole(decodeToken(accessToken).role);
          setSocket(initSocketInstance(accessToken));
          router.push('/manage/dashboard');
        })
        .catch((e) => {
          toast({
            description: e?.message || 'Xác thực thất bại',
            variant: 'destructive'
          });
          router.push('/login');
        });
      ref.current++;
    } else {
      toast({
        description: message || 'Xác thực thất bại',
        variant: 'destructive'
      });
      router.push('/login');
    }
  }, [accessToken, refreshToken, setRole, setSocket, router, message, mutateAsync]);

  return null;
};
