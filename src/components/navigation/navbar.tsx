"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Grinders", href: "/grinders" },
  { name: "Recipes", href: "/recipes" },
  { name: "Methods", href: "/manual-brewing-methods" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-coffee-navy border-t border-coffee-gray/20 dark:border-coffee-navy-dark px-2 py-1">
      <div className="container mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-2 rounded-md transition-colors",
                isActive
                  ? "text-coffee-coral"
                  : "text-coffee-navy dark:text-coffee-gray hover:text-coffee-coral dark:hover:text-coffee-coral"
              )}
            >
              {item.name === "Home" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 mb-1">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              )}
              {item.name === "Grinders" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 mb-1">
                  <path d="M5 11h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"></path>
                  <path d="M19 11V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"></path>
                  <path d="M12 19v-8"></path>
                  <path d="M8 3v4"></path>
                  <path d="M16 3v4"></path>
                </svg>
              )}
              {item.name === "Recipes" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 mb-1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                  <path d="M10 9H8"></path>
                </svg>
              )}
              {item.name === "Methods" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 mb-1">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                  <line x1="6" x2="6" y1="2" y2="4"></line>
                  <line x1="10" x2="10" y1="2" y2="4"></line>
                  <line x1="14" x2="14" y1="2" y2="4"></line>
                </svg>
              )}
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
