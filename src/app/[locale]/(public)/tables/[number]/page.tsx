import { Suspense } from 'react';

import GuestLoginForm from './guest-login-form';

export default function TableNumberPage() {
  return (
    <Suspense>
      <GuestLoginForm />
    </Suspense>
  );
}
