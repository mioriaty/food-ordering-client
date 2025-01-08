import { TanstackProvider } from '@/libs/components/tanstack-provider';
import { ThemeProvider } from '@/libs/components/theme-provider';
import { Toaster } from '@/libs/components/ui/toaster';
import { cn } from '@/libs/utils/string';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});
export const metadata: Metadata = {
  title: 'Duongggggg',
  description: 'The best restaurant in the world'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <TanstackProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
