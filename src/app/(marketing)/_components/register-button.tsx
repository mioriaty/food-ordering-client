'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/shared/components/ui/button';

interface RegisterButtonProps {}

const RegisterButton: React.FC<RegisterButtonProps> = () => {
  const router = useRouter();

  const redirectToSignIn = () => {
    router.push('/sign-up');
  };

  return <Button onClick={redirectToSignIn}>Sign up</Button>;
};

export default RegisterButton;
