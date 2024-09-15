import React from 'react';

import { Header } from '@/app/(marketing)/_components/header';

type PageProps = object;

const Page: React.FC<PageProps> = () => {
  return (
    <main>
      <Header />
    </main>
  );
};

export default Page;
