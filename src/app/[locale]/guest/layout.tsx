import { defaultLocale } from '@/libs/constants/locale';

import Layout from '@/app/[locale]/(public)/layout';

export default function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Layout params={{ locale: defaultLocale }} modal={null}>
      {children}
    </Layout>
  );
}
