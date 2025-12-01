import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/shared/lib/cn';
import { SITE_CONFIG } from '@/shared/config/site';
import { ReactQueryProvider } from '@/shared/tanstack-query/react-query-provider';
import { Toaster } from '@/shared/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import ScreenGuard from '@/shared/components/screen-guard';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
        <NuqsAdapter>
          <ReactQueryProvider>
            <ScreenGuard>
              <main>{children}</main>
            </ScreenGuard>
            <Toaster position="top-right" closeButton richColors />
          </ReactQueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
