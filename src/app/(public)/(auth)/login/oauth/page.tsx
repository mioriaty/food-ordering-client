import { Suspense } from 'react';

import { OAuthContent } from '@/app/(public)/(auth)/login/oauth/oauth-content';

export default function OAuthPage() {
  return (
    <Suspense>
      <OAuthContent />
    </Suspense>
  );
}
