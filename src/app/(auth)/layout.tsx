import React, { PropsWithChildren } from 'react';

interface LayoutProps extends PropsWithChildren {}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <div className="min-w-[400px] border border-gray-400 border-solid px-9 py-8 rounded-xl">{children}</div>
    </main>
  );
};

export default AuthLayout;
