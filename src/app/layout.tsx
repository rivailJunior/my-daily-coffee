import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Toaster } from '@/components/ui/toaster';

// Using Inter as a close alternative to Google Sans
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'My Daily Coffee',
  description: 'Your personal coffee brewing assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${roboto.className} dark:bg-coffee-navy bg-white transition-colors duration-300 overflow-y-auto`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
          storageKey='coffee-theme'
        >
          <QueryProvider>
            <AuthProvider>
              <div className='relative z-10'>
                <Header />
                <main className='flex-1 z-50'>{children}</main>
                <div className='fixed bottom-4 right-4 z-50'>
                  <ThemeSwitcher />
                </div>
                <Toaster />
              </div>
              <Footer />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
