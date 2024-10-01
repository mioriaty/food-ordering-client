import React, { PropsWithChildren } from 'react';

import { Header } from '@/shared/components/header/header';

interface LayoutProps extends PropsWithChildren {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="container">{children}</main>
    </div>
  );
};

export default Layout;
