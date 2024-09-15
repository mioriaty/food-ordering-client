import Link from 'next/link';
import React from 'react';

import { RegisterForm } from '@/app/(auth)/sign-up/_components/register-form';

interface PageProps {}

const RegisterPage: React.FC<PageProps> = () => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Sign Up</h1>
      <RegisterForm />
      <Link href="/sign-in" className="text-blue-700 mt-2 block">
        Already have account? Login now
      </Link>
    </div>
  );
};

export default RegisterPage;
