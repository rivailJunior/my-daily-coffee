'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from './navbar';

export function ProtectedNavbar() {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Only render Navbar for authenticated users
  return isAuthenticated ? <Navbar /> : null;
}
