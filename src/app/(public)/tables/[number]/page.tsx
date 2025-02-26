import { Suspense } from 'react';

import GuestLoginForm from '@/app/(public)/tables/[number]/guest-login-form';

export default function TableNumberPage() {
  return (
    <Suspense>
      <GuestLoginForm />
    </Suspense>
  );
}
