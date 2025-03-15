'use client';

import { decodeToken } from '@/libs/utils/decode-token';
import { initSocketInstance } from '@/libs/utils/init-socket';
import { getAccessTokenFromLocalStorage } from '@/libs/utils/local-authentication';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect, useRef } from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setRole = useAuthStore((state) => state.setRole);
  const setSocket = useAuthStore((state) => state.setSocket);
  const count = useRef(0);

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const decodedRole = decodeToken(accessToken).role;
        setRole(decodedRole);
        setSocket(initSocketInstance(accessToken));
      }
      count.current++;
    }
  }, [setRole, setSocket]);

  return <>{children}</>;
};
