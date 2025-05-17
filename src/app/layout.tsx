import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { AuthStatus } from '@/components/auth/auth-status'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Daily Coffee',
  description: 'Your personal coffee brewing assistant',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="coffee-theme"
        >
          <QueryProvider>
            <AuthProvider>
              <header className="fixed top-0 right-0 p-4 z-50 flex items-center gap-4">
                <AuthStatus />
                <ThemeSwitcher />
              </header>
              <main className="min-h-screen pt-16">
                {children}
              </main>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
