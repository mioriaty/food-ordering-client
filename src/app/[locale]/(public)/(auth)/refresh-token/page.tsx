import { Suspense } from 'react';

import { RefreshTokenContent } from './refresh-token-content';

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshTokenContent />
    </Suspense>
  );
}
