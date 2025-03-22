import { Metadata } from 'next';
import { Suspense } from 'react';

import { LogoutPageContent } from './logout-page-content';

export const metadata: Metadata = {
  title: 'Logout Redirect',
  description: 'Logout Redirect',
  robots: {
    index: false
  }
};

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutPageContent />
    </Suspense>
  );
}
