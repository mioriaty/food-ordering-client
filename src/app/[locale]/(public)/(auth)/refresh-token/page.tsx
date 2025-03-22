import { Metadata } from 'next';
import { Suspense } from 'react';

import { RefreshTokenContent } from './refresh-token-content';

export const metadata: Metadata = {
  title: 'Refresh token redirect',
  description: 'Refresh token redirect',
  robots: {
    index: false
  }
};

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshTokenContent />
    </Suspense>
  );
}
