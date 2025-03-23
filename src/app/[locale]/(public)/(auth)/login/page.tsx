import envConfig from '@/configs/env.config';
import { Locale } from '@/libs/constants/locale';
import { htmlToTextForDescription } from '@/libs/utils/html-to-text';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import LoginForm from './login-form';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Login' });
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}`;

  return {
    title: t('title'),
    description: htmlToTextForDescription(t('description')),
    alternates: {
      canonical: url
    }
  };
}

export default function Login({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
