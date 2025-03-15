import { useLogoutMutation } from '@/infrastructure/queries/useAuth';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { useAuthStore } from '@/stores/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token'];

export const ListenLogoutSocket = () => {
  const pathName = usePathname();
  const router = useRouter();
  // Tại sao cần lấy mutateAsync, isPending từ useLogoutMutation()
  // Để tránh thay đổi tham chiếu khi re-render
  const { mutateAsync, isPending } = useLogoutMutation();
  const setRole = useAuthStore((state) => state.setRole);
  const disconnectSocket = useAuthStore((state) => state.disconnectSocket);
  const socket = useAuthStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return;

    const onLogout = async () => {
      if (isPending) return;

      try {
        await mutateAsync();
        setRole(undefined);
        disconnectSocket();
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
  }, [socket, pathName, mutateAsync, isPending, router, setRole, disconnectSocket]);

  return null;
};
