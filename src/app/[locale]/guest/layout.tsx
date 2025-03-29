import { defaultLocale } from '@/libs/constants/locale';

import Layout from '@/app/[locale]/(public)/layout';

export default function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Create a Promise that resolves to the params object
  const paramsPromise = Promise.resolve({ locale: defaultLocale });

  return (
    <Layout params={paramsPromise} modal={null}>
      {children}
    </Layout>
  );
}
