import { Suspense } from 'react';

import { RefreshTokenContent } from '@/app/(public)/(auth)/refresh-token/refresh-token-content';

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshTokenContent />
    </Suspense>
  );
}
