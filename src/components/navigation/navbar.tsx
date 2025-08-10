"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Blend, Coffee, Home, LifeBuoy } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Grinders', href: '/grinders' },
  { name: 'Drippers', href: '/manual-brewing-methods' },
  { name: 'Brew Assistant (IA)', href: '/brewing-assistant' },
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
              {item.name === 'Grinders' && <Blend />}
              {item.name === 'Brew Assistant (IA)' && <Coffee />}
              {item.name === 'Drippers' && <LifeBuoy />}
              <span className='text-xs'>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
