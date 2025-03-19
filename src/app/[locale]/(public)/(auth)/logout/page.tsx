import { Suspense } from 'react';

import { LogoutPageContent } from './logout-page-content';

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutPageContent />
    </Suspense>
  );
}
