import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { SupabaseProvider } from '@/lib/supabase/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LexiAI - Smart Legal Workspace',
  description: 'AI-powered legal assistant for modern law firms',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SupabaseProvider>
            {children}
            <Toaster />
            <SonnerToaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}