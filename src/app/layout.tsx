import { Toaster } from '@/libs/components/ui/toaster';
import { cn } from '@/libs/utils/string';
import { TanstackProvider } from '@/providers/tanstack-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter as FontSans } from 'next/font/google';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});
export const metadata: Metadata = {
  // eslint-disable-next-line quotes
  title: "Duong's restaurant",
  description: 'The best restaurant in the world'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
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
