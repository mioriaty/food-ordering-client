import { Suspense } from 'react';

import { LogoutPageContent } from '@/app/(public)/(auth)/logout/logout-page-content';

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutPageContent />
    </Suspense>
  );
}
