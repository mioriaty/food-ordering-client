'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { ListenLogoutSocket } from '@/libs/components/listen-logout-socket';
import { RefreshToken } from '@/libs/components/refresh-token';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
      // refetchOnMount: false
    }
  }
});

export function TanstackProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RefreshToken />
        <ListenLogoutSocket />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
}
