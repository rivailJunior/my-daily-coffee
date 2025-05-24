"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Coffee, Home, LifeBuoy } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Grinders', href: '/grinders' },
  { name: 'Brewing Assistant', href: '/brewing-assistant' },
  { name: 'Drippers', href: '/manual-brewing-methods' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-coffee-navy border-t border-coffee-gray/20 dark:border-coffee-navy-dark px-2 py-1'>
      <div className='container mx-auto flex justify-around items-center'>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center px-2 py-2 rounded-md transition-colors',
                isActive
                  ? 'text-coffee-coral'
                  : 'text-coffee-navy dark:text-coffee-gray hover:text-coffee-coral dark:hover:text-coffee-coral'
              )}
            >
              {item.name === 'Home' && <Home />}
              {item.name === 'Grinders' && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='size-5 mb-1'
                >
                  <path d='M5 11h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z'></path>
                  <path d='M19 11V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4'></path>
                  <path d='M12 19v-8'></path>
                  <path d='M8 3v4'></path>
                  <path d='M16 3v4'></path>
                </svg>
              )}
              {item.name === 'Brewing Assistant' && <Coffee />}
              {item.name === 'Drippers' && <LifeBuoy />}
              <span className='text-xs'>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
