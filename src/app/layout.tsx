import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { ConditionalAuthStatus } from '@/components/auth/conditional-auth-status';
import { ProtectedNavbar } from '@/components/navigation/protected-navbar';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
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
        className={`${roboto.className} min-h-screen bg-amber-50 dark:bg-coffee-900 transition-colors duration-300`}
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
              {/* Background pattern - light */}
              <div className='fixed inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23f59e0b%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-100 dark:opacity-100' />

              {/* Background pattern - dark */}
              <div className='fixed inset-0  dark:bg-[#1D3241] dark:opacity-100' />
              <div className='fixed inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23fef3c7%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-1 dark:opacity-70' />

              <div className='relative z-10 min-h-screen flex flex-col'>
                <header className='fixed top-0 right-0 p-4 z-50 flex items-center gap-4'>
                  <ConditionalAuthStatus />
                  <ThemeSwitcher />
                </header>
                <main className='flex-1 pt-16 pb-20'>{children}</main>
                <ProtectedNavbar />
              </div>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
