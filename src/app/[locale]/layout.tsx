import { routing } from '@/i18n/routing';
import { Toaster } from '@/libs/components/ui/toaster';
import { Locale, locales } from '@/libs/constants/locale';
import { cn } from '@/libs/utils/string';
import { TanstackProvider } from '@/providers/tanstack-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { baseOpenGraph } from '@/shared-metadata';
import { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Inter as FontSans } from 'next/font/google';
import { notFound } from 'next/navigation';
import NextjsTopLoader from 'nextjs-toploader';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      ...baseOpenGraph
    }
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextjsTopLoader height={2} showSpinner={false} color="hsl(var(--primary))" />
        <NextIntlClientProvider messages={messages}>
          <TanstackProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </TanstackProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
