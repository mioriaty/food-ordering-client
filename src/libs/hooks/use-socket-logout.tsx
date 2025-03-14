'use client';

import { useLogoutMutation } from '@/infrastructure/queries/useAuth';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token'];

export const useListenLogoutSocket = ({ socket }: { socket: Socket | undefined }) => {
  const pathName = usePathname();
  const router = useRouter();
  const { mutateAsync, isPending } = useLogoutMutation();

  useEffect(() => {
    if (!socket) return;
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return;

    const onLogout = async () => {
      if (isPending) return;

      try {
        await mutateAsync();
        // setRole(undefined);
        // disconnectSocket();
        router.push('/');
      } catch (error) {
        const _error = error as Error;
        handleErrorApi({ error: _error });
      }
    };

    socket.on('logout', onLogout);

    return () => {
      socket.off('logout', onLogout);
    };
  }, [socket, pathName, mutateAsync, isPending, router]);

  return null;
};
