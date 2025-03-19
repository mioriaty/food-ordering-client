import { Suspense } from 'react';

import { OAuthContent } from './oauth-content';

export default function OAuthPage() {
  return (
    <Suspense>
      <OAuthContent />
    </Suspense>
  );
}
