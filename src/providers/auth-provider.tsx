'use client'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type User = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  [key: string]: any; // Allow for additional Cognito user attributes
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

type AuthContextType = AuthState & {
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  initialAuthState?: Partial<AuthState>;
};

/**
 * Client-side authentication provider that wraps the application
 * and provides authentication state and user information to all child components.
 */
export function AuthProvider({
  children,
  initialAuthState = {},
}: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
    ...initialAuthState,
  });

  const refreshAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth');
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || 'Failed to authenticate');

      setAuthState({
        isAuthenticated: !!data.user,
        user: data.user || null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error:
          error instanceof Error ? error : new Error('Authentication failed'),
      });
    }
  };

  // Initial auth check on mount
  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication state and user information
 * @returns Authentication context with user info and auth state
 * @example
 * const { isAuthenticated, user, isLoading, refreshAuth } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
