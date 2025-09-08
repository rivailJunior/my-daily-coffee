'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, Coffee, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/providers/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleHideComponentPerPage } from '@/utils/handleHideComponentPerPage';

import { motion } from 'framer-motion';
import { handleSignOut } from '@/services/auth';
import { navigation } from '@/constants/navigation';

export function HeaderComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState(navigation);
  const pathname = usePathname();
  const { isAuthenticated, accessToken } = useAuth();
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

  const handleLogout = () => {
    try {
      handleSignOut(accessToken || '').then(() => {
        window.location.reload();
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      setMenuItems((prevMenuItems) => [
        ...prevMenuItems,
        {
          name: 'Account',
          items: [
            {
              name: 'Logout',
              href: '#',
              onClick: () => handleLogout(),
            },
          ],
        },
      ]);
    }
  }, [isAuthenticated]);

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-gray-50 dark:bg-coffee-navy-dark dark:border-coffee-navy-dark backdrop-blur-md transition-all duration-300 border-b',
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
              {menuItems.map((item) => {
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
                            // @ts-ignore
                            onClick={subItem?.onClick}
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
          {/* {!isLoginPage && <AuthStatus />} */}
        </nav>

        {/* Mobile menu button */}
        {!isLoginPage && (
          <button
            type='button'
            aria-expanded={isMenuOpen}
            className='md:hidden p-2 rounded-md text-foreground/80 hover:text-foreground focus:outline-none'
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
            >
              <Menu className='h-6 w-6' />
            </motion.div>
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className='md:hidden bg-gray-50 dark:bg-coffee-navy-dark pt-2 mt-4'
        >
          <div className='px-2 space-y-2 pb-2 pt-2'>
            {isAuthenticated && (
              <>
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.items ? (
                      <div className='space-y-1'>
                        <button
                          type='button'
                          className='w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between hover:bg-gray-200 hover:text-black'
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
                                    ? 'bg-gray-500 text-white'
                                    : 'text-foreground/80 '
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
                            ? 'bg-slate-500 text-white'
                            : 'text-foreground/80 hover:bg-gray-200 hover:text-foreground'
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
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