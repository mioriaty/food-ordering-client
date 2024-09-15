import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/shared/components/theme-provider';

import './globals.css';

const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Next learning',
  description: 'The way Duong learn Next.js'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning>
      <body suppressContentEditableWarning className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
