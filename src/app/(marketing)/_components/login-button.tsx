'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/shared/components/ui/button';

const LoginButton: React.FC = () => {
  const router = useRouter();

  const redirectToSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <Button variant="outline" onClick={redirectToSignIn}>
      Sign in
    </Button>
  );
};

export default LoginButton;
