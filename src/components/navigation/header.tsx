'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Coffee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AuthStatus } from '@/components/auth/auth-status';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Grinders', href: '/grinders' },
  { name: 'Drippers', href: '/manual-brewing-methods' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md transition-all duration-300 border-b',
        isScrolled ? 'py-2' : 'py-4',
        'border-border'
      )}
    >
      <div className='container mx-auto px-4 flex justify-between items-center'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-2'>
          <Coffee className='h-6 w-6 text-primary' />
          <span className='text-xl font-bold text-foreground'>
            MyDailyCoffee
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center space-x-8'>
          {isAuthenticated && (
            <>
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      isActive
                        ? 'text-primary'
                        : 'text-foreground/80 hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Button
                asChild
                variant='ghost'
                className='text-foreground/80 hover:text-foreground hover:bg-transparent'
              >
                <Link href='/brewing-assistant'>Brew Assistant</Link>
              </Button>
              <div className='h-6 w-px bg-border' />
            </>
          )}
          {!isLoginPage && <AuthStatus />}
        </nav>

        {/* Mobile menu button */}
        <button
          type='button'
          className='md:hidden p-2 rounded-md text-foreground/80 hover:text-foreground focus:outline-none hover:bg-accent/50'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className='h-6 w-6' />
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-background border-t border-border'>
          <div className='px-4 py-2 space-y-2 pb-4'>
            {isAuthenticated && (
              <>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 rounded-md text-base font-medium',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className='pt-2 border-t border-gray-200'>
                  <Link
                    href='/brewing-assistant'
                    className='block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:bg-accent/50 hover:text-foreground'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Brew Assistant
                  </Link>
                </div>
              </>
            )}
            {!isLoginPage && (
              <div className='py-2 border-t border-border mt-2'>
                <AuthStatus />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
