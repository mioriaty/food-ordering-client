import Link from 'next/link';
import React from 'react';

import LoginForm from '@/app/(auth)/sign-in/_components/login-form';

const LoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Sign In</h1>
      <LoginForm />
      <Link href="/sign-up" className="text-blue-700 mt-4 block text-center">
        Don't have an account? Register now
      </Link>
    </div>
  );
};

export default LoginPage;
