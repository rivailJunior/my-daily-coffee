'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, Coffee, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { AuthStatus } from '@/components/auth/auth-status';
import { useAuth } from '@/providers/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleHideComponentPerPage } from '@/utils/handleHideComponentPerPage';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Recipes',
    items: [
      { name: 'All', href: '/brewing-assistant/recipes' },
      { name: 'Create IA', href: '/brewing-assistant' },
      { name: 'Create Manual', href: '/brewing-assistant/manual-recipe' },
    ],
  },
  {
    name: 'Gear',
    items: [
      { name: 'Grinders', href: '/grinders' },
      { name: 'Drippers', href: '/manual-brewing-methods' },
    ],
  },
];

export function HeaderComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isLoginPage = pathname === '/login';
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMenuButton = target.closest('button[aria-expanded]');

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !isMenuButton
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Use a small timeout to ensure the click event is captured properly
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside, {
          capture: true,
        });
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside, {
          capture: true,
        });
      };
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
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
          <span className='text-xl font-regular'>MyDailyCoffee</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center space-x-8'>
          {isAuthenticated && (
            <>
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item?.href || ''));

                return item.items ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className='flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none data-[state=open]:text-primary'>
                      {item.name}
                      <ChevronDown className='h-4 w-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-48'>
                      {item.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link
                            href={subItem.href}
                            className='w-full cursor-pointer'
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
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
            </>
          )}
          {!isLoginPage && <AuthStatus />}
        </nav>

        {/* Mobile menu button */}
        {!isLoginPage && (
          <button
            type='button'
            aria-expanded={isMenuOpen}
            className='md:hidden p-2 rounded-md text-foreground/80 hover:text-foreground focus:outline-none hover:bg-accent/50'
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <Menu className='h-6 w-6' />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className='md:hidden bg-background border-t border-border pt-2 mt-4'
        >
          <div className='px-4 space-y-2 pb-2 pt-2'>
            {isAuthenticated && (
              <>
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.items ? (
                      <div className='space-y-1'>
                        <button
                          type='button'
                          className='w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between hover:bg-accent/50'
                          onClick={() =>
                            setExpandedMenu(
                              expandedMenu === item.name ? null : item.name
                            )
                          }
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedMenu === item.name
                                ? 'transform rotate-180'
                                : ''
                            }`}
                          />
                        </button>
                        <div
                          className={`transition-all duration-200 overflow-hidden ${
                            expandedMenu === item.name ? 'max-h-96' : 'max-h-0'
                          }`}
                        >
                          <div className='ml-4 space-y-1 py-1'>
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={cn(
                                  'block px-3 py-2 rounded-md text-sm',
                                  pathname === subItem.href
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground'
                                )}
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setExpandedMenu(null);
                                }}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
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
                    )}
                  </div>
                ))}
                {!isLoginPage && <AuthStatus />}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const Header = () => {
  const pathname = usePathname();
  if (handleHideComponentPerPage(pathname)) {
    return null;
  }
  return (
    <header className='fixed top-0 right-0 p-4 z-50 flex items-center gap-4'>
      <HeaderComponent />
    </header>
  );
};