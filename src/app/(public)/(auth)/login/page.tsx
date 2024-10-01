import React from 'react';

import LoginForm from '@/app/(public)/(auth)/login/_components/login-form';

const LoginPage: React.FC = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="min-w-[400px] border border-gray-400 border-solid px-9 py-8 rounded-xl">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Login</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
